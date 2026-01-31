import { onRequest } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { asDateStringUTC } from "./utils";

const allowCors = (res: { set: (k: string, v: string) => void }) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
};

export const feed = onRequest(async (req, res) => {
  allowCors(res);
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  if (req.method !== "GET") {
    res.status(405).json({ error: "Méthode non autorisée." });
    return;
  }

  const countryRaw = String(req.query.country || "FR");
  const country = countryRaw.toUpperCase();
  const date = asDateStringUTC(new Date());
  const dailyId = `daily_${date}_${country}`;
  const db = getFirestore();
  const dailyRef = db.collection("public_feeds").doc(dailyId);

  const [dailySnap] = await db.getAll(dailyRef);
  const daily = dailySnap.exists ? dailySnap.data() : null;

  res.status(200).json({
    daily,
  });
});
