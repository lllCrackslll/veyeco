import { Timestamp } from "firebase-admin/firestore";
import { FeedItem, InsightDoc } from "./models";

export const buildFeedItem = (
  article: {
    title: string;
    url: string;
    sourceName: string;
    publishedAt: Timestamp;
    country: string;
  },
  insight: InsightDoc
): FeedItem => ({
  title: article.title,
  url: article.url,
  source: article.sourceName,
  publishedAt: article.publishedAt.toDate().toISOString(),
  country: article.country,
  tags: insight.tags,
  importanceScore: insight.importanceScore,
  summaryBullets: insight.summaryBullets,
});
