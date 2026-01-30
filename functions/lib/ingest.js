"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingestFeeds = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const firebase_functions_1 = require("firebase-functions");
const firestore_1 = require("firebase-admin/firestore");
const config_1 = require("./config");
const feeds_1 = require("./feeds");
const llm_1 = require("./llm");
const rss_1 = require("./rss");
const utils_1 = require("./utils");
const db = (0, firestore_1.getFirestore)();
const getEnabledSources = async () => {
    const snapshot = await db.collection("sources").where("enabled", "==", true).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
const ensureArticle = async (payload) => {
    const articleId = (0, utils_1.hashUrl)(payload.url);
    const ref = db.collection("articles").doc(articleId);
    try {
        await ref.create({
            url: payload.url,
            title: payload.title,
            sourceId: payload.sourceId,
            country: payload.country,
            publishedAt: (0, utils_1.toTimestamp)(payload.publishedAt),
            contentSnippet: payload.contentSnippet,
            createdAt: (0, utils_1.serverTimestamp)(),
        });
        return { created: true, articleId };
    }
    catch (error) {
        const message = error.message || "";
        if (message.includes("ALREADY_EXISTS")) {
            return { created: false, articleId };
        }
        throw error;
    }
};
const ensureInsight = async (articleId, payload) => {
    const ref = db.collection("insights").doc(articleId);
    const snapshot = await ref.get();
    if (snapshot.exists) {
        return false;
    }
    const insight = await (0, llm_1.generateInsight)(payload);
    await ref.set({
        summaryBullets: insight.summaryBullets,
        tags: insight.tags,
        importanceScore: insight.importanceScore,
        reasoningShort: insight.reasoningShort,
        createdAt: (0, utils_1.serverTimestamp)(),
    });
    return true;
};
const rebuildFeedsForCountry = async (country, sourceMap) => {
    const now = new Date();
    const dateId = (0, utils_1.asDateStringUTC)(now);
    const dayStart = (0, utils_1.startOfDayUTC)(now);
    const dayEnd = (0, utils_1.endOfDayUTC)(now);
    const breakingStart = new Date(now.getTime() - config_1.DEFAULT_FEED_LOOKBACK_HOURS * 60 * 60 * 1000);
    const dailySnapshot = await db
        .collection("articles")
        .where("country", "==", country)
        .where("publishedAt", ">=", firestore_1.Timestamp.fromDate(dayStart))
        .where("publishedAt", "<", firestore_1.Timestamp.fromDate(dayEnd))
        .orderBy("publishedAt", "desc")
        .limit(80)
        .get();
    const breakingSnapshot = await db
        .collection("articles")
        .where("country", "==", country)
        .where("publishedAt", ">=", firestore_1.Timestamp.fromDate(breakingStart))
        .orderBy("publishedAt", "desc")
        .limit(60)
        .get();
    const collectItems = async (snapshot) => {
        if (snapshot.empty)
            return [];
        const articleDocs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        const insightRefs = articleDocs.map((article) => db.collection("insights").doc(article.id));
        const insightSnaps = [];
        for (const batch of (0, utils_1.chunk)(insightRefs, 50)) {
            const results = await db.getAll(...batch);
            insightSnaps.push(...results);
        }
        const insightMap = new Map(insightSnaps
            .filter((snap) => snap.exists)
            .map((snap) => [snap.id, snap.data()]));
        return articleDocs
            .map((article) => {
            const insight = insightMap.get(article.id);
            if (!insight)
                return null;
            return (0, feeds_1.buildFeedItem)({
                title: article.title,
                url: article.url,
                sourceName: sourceMap.get(article.sourceId) || article.sourceId,
                publishedAt: article.publishedAt,
                country: article.country,
            }, insight);
        })
            .filter(Boolean);
    };
    const dailyItems = await collectItems(dailySnapshot);
    const breakingItems = await collectItems(breakingSnapshot);
    const sortByImportance = (items) => items.sort((a, b) => {
        if (b.importanceScore !== a.importanceScore) {
            return b.importanceScore - a.importanceScore;
        }
        return b.publishedAt.localeCompare(a.publishedAt);
    });
    const dailySorted = sortByImportance(dailyItems).slice(0, config_1.DEFAULT_DAILY_ITEMS);
    const breakingSorted = sortByImportance(breakingItems).slice(0, config_1.DEFAULT_BREAKING_ITEMS);
    await db.collection("public_feeds").doc(`daily_${dateId}_${country}`).set({
        feedType: "daily",
        country,
        date: dateId,
        items: dailySorted,
        updatedAt: (0, utils_1.serverTimestamp)(),
    }, { merge: true });
    await db.collection("public_feeds").doc(`breaking_latest_${country}`).set({
        feedType: "breaking",
        country,
        items: breakingSorted,
        updatedAt: (0, utils_1.serverTimestamp)(),
    }, { merge: true });
};
exports.ingestFeeds = (0, scheduler_1.onSchedule)("every 30 minutes", async () => {
    firebase_functions_1.logger.info("Ingestion démarrée");
    const sources = await getEnabledSources();
    firebase_functions_1.logger.info(`Sources actives: ${sources.length}`);
    if (!sources.length) {
        firebase_functions_1.logger.warn("Aucune source active. Rien à ingérer.");
        return;
    }
    const sourceMap = new Map(sources.map((source) => [source.id, source.name]));
    const updatedCountries = new Set();
    let createdArticles = 0;
    let createdInsights = 0;
    for (const source of sources) {
        try {
            const items = await (0, rss_1.parseRss)(source.url);
            firebase_functions_1.logger.info(`RSS ${source.id} (${source.url}) items=${items.length}`);
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
                    }
                    catch (error) {
                        firebase_functions_1.logger.error("LLM error", error);
                    }
                }
            }
        }
        catch (error) {
            firebase_functions_1.logger.error("RSS error", error);
        }
    }
    for (const country of updatedCountries) {
        await rebuildFeedsForCountry(country, sourceMap);
    }
    firebase_functions_1.logger.info(`Ingestion terminée. articles=${createdArticles} insights=${createdInsights} pays=${updatedCountries.size}`);
});
