"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feed = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-admin/firestore");
const utils_1 = require("./utils");
const allowCors = (res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
};
exports.feed = (0, https_1.onRequest)(async (req, res) => {
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
    const date = (0, utils_1.asDateStringUTC)(new Date());
    const dailyId = `daily_${date}_${country}`;
    const db = (0, firestore_1.getFirestore)();
    const dailyRef = db.collection("public_feeds").doc(dailyId);
    const [dailySnap] = await db.getAll(dailyRef);
    const daily = dailySnap.exists ? dailySnap.data() : null;
    res.status(200).json({
        daily,
    });
});
