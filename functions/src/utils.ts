import crypto from "node:crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

export const serverTimestamp = () => FieldValue.serverTimestamp();

export const hashUrl = (url: string) =>
  crypto.createHash("sha256").update(url).digest("hex");

export const asDateStringUTC = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const startOfDayUTC = (date: Date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

export const endOfDayUTC = (date: Date) =>
  new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1)
  );

export const toTimestamp = (date: Date) => Timestamp.fromDate(date);

export const toIsoString = (timestamp: Timestamp) =>
  timestamp.toDate().toISOString();

export const parseBody = <T>(body: unknown): T => {
  if (!body) {
    throw new Error("Corps de requête manquant.");
  }
  if (typeof body === "string") {
    return JSON.parse(body) as T;
  }
  return body as T;
};

export const chunk = <T>(items: T[], size: number) => {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
};
