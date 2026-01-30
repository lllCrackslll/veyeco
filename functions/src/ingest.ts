import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import {
  DEFAULT_BREAKING_ITEMS,
  DEFAULT_DAILY_ITEMS,
  DEFAULT_FEED_LOOKBACK_HOURS,
} from "./config";
import { buildFeedItem } from "./feeds";
import { generateInsight } from "./llm";
import { ArticleDoc, InsightDoc, SourceDoc } from "./models";
import { parseRss } from "./rss";
import {
  asDateStringUTC,
  chunk,
  endOfDayUTC,
  hashUrl,
  serverTimestamp,
  startOfDayUTC,
  toTimestamp,
} from "./utils";

const db = getFirestore();

const getEnabledSources = async () => {
  const snapshot = await db.collection("sources").where("enabled", "==", true).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as SourceDoc) }));
};

const ensureArticle = async (payload: {
  url: string;
  title: string;
  sourceId: string;
  country: string;
  publishedAt: Date;
  contentSnippet: string | null;
}) => {
  const articleId = hashUrl(payload.url);
  const ref = db.collection("articles").doc(articleId);
  try {
    await ref.create({
      url: payload.url,
      title: payload.title,
      sourceId: payload.sourceId,
      country: payload.country,
      publishedAt: toTimestamp(payload.publishedAt),
      contentSnippet: payload.contentSnippet,
      createdAt: serverTimestamp(),
    } satisfies ArticleDoc);
    return { created: true, articleId };
  } catch (error) {
    const message = (error as Error).message || "";
    if (message.includes("ALREADY_EXISTS")) {
      return { created: false, articleId };
    }
    throw error;
  }
};

const ensureInsight = async (articleId: string, payload: {
  title: string;
  url: string;
  contentSnippet: string | null;
}) => {
  const ref = db.collection("insights").doc(articleId);
  const snapshot = await ref.get();
  if (snapshot.exists) {
    return false;
  }
  const insight = await generateInsight(payload);
  await ref.set({
    summaryBullets: insight.summaryBullets,
    tags: insight.tags,
    importanceScore: insight.importanceScore,
    reasoningShort: insight.reasoningShort,
    createdAt: serverTimestamp(),
  } satisfies InsightDoc);
  return true;
};

const rebuildFeedsForCountry = async (
  country: string,
  sourceMap: Map<string, string>
) => {
  const now = new Date();
  const dateId = asDateStringUTC(now);
  const dayStart = startOfDayUTC(now);
  const dayEnd = endOfDayUTC(now);
  const breakingStart = new Date(now.getTime() - DEFAULT_FEED_LOOKBACK_HOURS * 60 * 60 * 1000);

  const dailySnapshot = await db
    .collection("articles")
    .where("country", "==", country)
    .where("publishedAt", ">=", Timestamp.fromDate(dayStart))
    .where("publishedAt", "<", Timestamp.fromDate(dayEnd))
    .orderBy("publishedAt", "desc")
    .limit(80)
    .get();

  const breakingSnapshot = await db
    .collection("articles")
    .where("country", "==", country)
    .where("publishedAt", ">=", Timestamp.fromDate(breakingStart))
    .orderBy("publishedAt", "desc")
    .limit(60)
    .get();

  const collectItems = async (snapshot: FirebaseFirestore.QuerySnapshot) => {
    if (snapshot.empty) return [];
    const articleDocs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as ArticleDoc),
    }));
    const insightRefs = articleDocs.map((article) =>
      db.collection("insights").doc(article.id)
    );
    const insightSnaps: FirebaseFirestore.DocumentSnapshot[] = [];
    for (const batch of chunk(insightRefs, 50)) {
      const results = await db.getAll(...batch);
      insightSnaps.push(...results);
    }
    const insightMap = new Map(
      insightSnaps
        .filter((snap) => snap.exists)
        .map((snap) => [snap.id, snap.data() as InsightDoc])
    );

    return articleDocs
      .map((article) => {
        const insight = insightMap.get(article.id);
        if (!insight) return null;
        return buildFeedItem(
          {
            title: article.title,
            url: article.url,
            sourceName: sourceMap.get(article.sourceId) || article.sourceId,
            publishedAt: article.publishedAt,
            country: article.country,
          },
          insight
        );
      })
      .filter(Boolean) as ReturnType<typeof buildFeedItem>[];
  };

  const dailyItems = await collectItems(dailySnapshot);
  const breakingItems = await collectItems(breakingSnapshot);

  const sortByImportance = (items: ReturnType<typeof buildFeedItem>[]) =>
    items.sort((a, b) => {
      if (b.importanceScore !== a.importanceScore) {
        return b.importanceScore - a.importanceScore;
      }
      return b.publishedAt.localeCompare(a.publishedAt);
    });

  const dailySorted = sortByImportance(dailyItems).slice(0, DEFAULT_DAILY_ITEMS);
  const breakingSorted = sortByImportance(breakingItems).slice(0, DEFAULT_BREAKING_ITEMS);

  await db.collection("public_feeds").doc(`daily_${dateId}_${country}`).set(
    {
      feedType: "daily",
      country,
      date: dateId,
      items: dailySorted,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  await db.collection("public_feeds").doc(`breaking_latest_${country}`).set(
    {
      feedType: "breaking",
      country,
      items: breakingSorted,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const ingestFeeds = onSchedule("every 30 minutes", async () => {
  logger.info("Ingestion démarrée");
  const sources = await getEnabledSources();
  logger.info(`Sources actives: ${sources.length}`);
  if (!sources.length) {
    logger.warn("Aucune source active. Rien à ingérer.");
    return;
  }
  const sourceMap = new Map(sources.map((source) => [source.id, source.name]));
  const updatedCountries = new Set<string>();
  let createdArticles = 0;
  let createdInsights = 0;

  for (const source of sources) {
    try {
      const items = await parseRss(source.url);
      logger.info(`RSS ${source.id} (${source.url}) items=${items.length}`);
      for (const item of items) {
        const { created, articleId } = await ensureArticle({
          url: item.link,
          title: item.title,
          sourceId: source.id,
          country: source.country,
          publishedAt: item.pubDate,
          contentSnippet: item.contentSnippet,
        });
        if (created) {
          createdArticles += 1;
          updatedCountries.add(source.country);
          try {
            await ensureInsight(articleId, {
              title: item.title,
              url: item.link,
              contentSnippet: item.contentSnippet,
            });
            createdInsights += 1;
          } catch (error) {
            logger.error("LLM error", error);
          }
        }
      }
    } catch (error) {
      logger.error("RSS error", error);
    }
  }

  for (const country of updatedCountries) {
    await rebuildFeedsForCountry(country, sourceMap);
  }

  logger.info(
    `Ingestion terminée. articles=${createdArticles} insights=${createdInsights} pays=${updatedCountries.size}`
  );
});
