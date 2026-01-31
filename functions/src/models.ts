export type CountryCode = string;

export interface SourceDoc {
  name: string;
  url: string;
  country: CountryCode;
  enabled: boolean;
  createdAt: FirebaseFirestore.FieldValue | FirebaseFirestore.Timestamp;
}

export interface ArticleDoc {
  url: string;
  title: string;
  sourceId: string;
  country: CountryCode;
  publishedAt: FirebaseFirestore.Timestamp;
  contentSnippet: string | null;
  createdAt: FirebaseFirestore.FieldValue | FirebaseFirestore.Timestamp;
}

export interface InsightDoc {
  summaryBullets: string[];
  tags: string[];
  importanceScore: number;
  reasoningShort: string;
  createdAt: FirebaseFirestore.FieldValue | FirebaseFirestore.Timestamp;
}

export interface FeedItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  country: CountryCode;
  tags: string[];
  importanceScore: number;
  summaryBullets: string[];
}

export interface PublicFeedDoc {
  feedType: "daily" | "breaking";
  country: CountryCode;
  date?: string;
  items: FeedItem[];
  updatedAt: FirebaseFirestore.FieldValue | FirebaseFirestore.Timestamp;
}

export interface UserDoc {
  email: string;
  plan: "free" | "pro";
  createdAt: FirebaseFirestore.FieldValue | FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.FieldValue | FirebaseFirestore.Timestamp;
}

export interface SubscriptionDoc {
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  status: string;
  currentPeriodEnd: FirebaseFirestore.Timestamp | FirebaseFirestore.FieldValue | null;
  isPro: boolean;
  updatedAt: FirebaseFirestore.FieldValue | FirebaseFirestore.Timestamp;
}
