"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFeedItem = void 0;
const buildFeedItem = (article, insight) => ({
    title: article.title,
    url: article.url,
    source: article.sourceName,
    publishedAt: article.publishedAt.toDate().toISOString(),
    country: article.country,
    tags: insight.tags,
    importanceScore: insight.importanceScore,
    summaryBullets: insight.summaryBullets,
});
exports.buildFeedItem = buildFeedItem;
