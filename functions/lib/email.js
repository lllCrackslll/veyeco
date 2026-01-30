"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWeeklyEmail = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const firebase_functions_1 = require("firebase-functions");
const firestore_1 = require("firebase-admin/firestore");
const config_1 = require("./config");
const utils_1 = require("./utils");
const db = (0, firestore_1.getFirestore)();
const sendEmail = async (payload) => {
    if (!config_1.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY manquante.");
    }
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${config_1.RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: config_1.RESEND_FROM,
            to: [payload.to],
            subject: payload.subject,
            html: payload.html,
        }),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Email error ${response.status}: ${text}`);
    }
};
const buildWeeklyEmailHtml = (items) => {
    const list = items
        .map((item) => `<li><a href="${item.url}">${item.title}</a><ul>${item.bullets
        .map((b) => `<li>${b}</li>`)
        .join("")}</ul></li>`)
        .join("");
    return `
    <h2>Votre résumé hebdo Veyeco</h2>
    <p>Top signaux de la semaine :</p>
    <ul>${list}</ul>
  `;
};
exports.sendWeeklyEmail = (0, scheduler_1.onSchedule)("every monday 09:00", async () => {
    const usersSnapshot = await db.collection("users").where("plan", "==", "free").get();
    if (usersSnapshot.empty) {
        return;
    }
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, idx) => {
        const d = new Date(today);
        d.setUTCDate(today.getUTCDate() - idx);
        return (0, utils_1.asDateStringUTC)(d);
    });
    for (const userDoc of usersSnapshot.docs) {
        const user = userDoc.data();
        if (!user.email || !user.countries?.length) {
            continue;
        }
        const feedRefs = [];
        for (const country of user.countries) {
            for (const day of days) {
                feedRefs.push(db.collection("public_feeds").doc(`daily_${day}_${country}`));
            }
        }
        const feedSnaps = await db.getAll(...feedRefs);
        const items = feedSnaps
            .filter((snap) => snap.exists)
            .flatMap((snap) => snap.data()?.items || [])
            .slice(0, 10)
            .map((item) => ({
            title: item.title,
            url: item.url,
            bullets: item.summaryBullets || [],
        }));
        if (!items.length) {
            continue;
        }
        try {
            await sendEmail({
                to: user.email,
                subject: "Veyeco — Résumé hebdo",
                html: buildWeeklyEmailHtml(items),
            });
            await db.collection("users").doc(userDoc.id).set({
                updatedAt: (0, utils_1.serverTimestamp)(),
            }, { merge: true });
        }
        catch (error) {
            firebase_functions_1.logger.error("Email error", error);
        }
    }
});
