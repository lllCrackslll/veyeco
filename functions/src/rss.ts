import Parser from "rss-parser";

export interface ParsedFeedItem {
  title: string;
  link: string;
  pubDate: Date;
  contentSnippet: string | null;
}

const parser = new Parser({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; VeyecoBot/1.0; +https://veyeco.ai)",
  },
  timeout: 15000,
});

export const parseRss = async (url: string): Promise<ParsedFeedItem[]> => {
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
