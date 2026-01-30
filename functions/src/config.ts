export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
export const STRIPE_PRICE_ID_MONTHLY = process.env.STRIPE_PRICE_ID_MONTHLY || "";
export const LLM_PROVIDER = process.env.LLM_PROVIDER || "";
export const LLM_API_KEY = process.env.LLM_API_KEY || "";
export const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
export const RESEND_FROM = process.env.RESEND_FROM || "no-reply@veyeco.ai";
export const APP_URL = process.env.APP_URL || "";

export const DEFAULT_DAILY_ITEMS = 8;
export const DEFAULT_BREAKING_ITEMS = 10;
export const DEFAULT_FEED_LOOKBACK_HOURS = 24;
export const DEFAULT_DAILY_LOOKBACK_DAYS = 1;
