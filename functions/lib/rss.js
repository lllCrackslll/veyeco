"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRss = void 0;
const rss_parser_1 = __importDefault(require("rss-parser"));
const parser = new rss_parser_1.default({
    headers: {
        "User-Agent": "Mozilla/5.0 (compatible; VeyecoBot/1.0; +https://veyeco.ai)",
    },
    timeout: 15000,
});
const parseRss = async (url) => {
    const feed = await parser.parseURL(url);
    return (feed.items || [])
        .filter((item) => item.link && item.title)
        .map((item) => ({
        title: item.title || "",
        link: item.link || "",
        pubDate: new Date(item.isoDate || item.pubDate || Date.now()),
        contentSnippet: item.contentSnippet || null,
    }));
};
exports.parseRss = parseRss;
