import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";
import { RESEND_API_KEY, RESEND_FROM } from "./config";
import { asDateStringUTC, serverTimestamp } from "./utils";
import { UserDoc } from "./models";

const db = getFirestore();

const sendEmail = async (payload: {
  to: string;
  subject: string;
  html: string;
}) => {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY manquante.");
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
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

const buildWeeklyEmailHtml = (items: { title: string; url: string; bullets: string[] }[]) => {
  const list = items
    .map(
      (item) =>
        `<li><a href="${item.url}">${item.title}</a><ul>${item.bullets
          .map((b) => `<li>${b}</li>`)
          .join("")}</ul></li>`
    )
    .join("");
  return `
    <h2>Votre résumé hebdo Veyeco</h2>
    <p>Top signaux de la semaine :</p>
    <ul>${list}</ul>
  `;
};

export const sendWeeklyEmail = onSchedule("every monday 09:00", async () => {
  const usersSnapshot = await db.collection("users").where("plan", "==", "free").get();
  if (usersSnapshot.empty) {
    return;
  }

  const today = new Date();
  const days = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - idx);
    return asDateStringUTC(d);
  });

  for (const userDoc of usersSnapshot.docs) {
    const user = userDoc.data() as UserDoc;
    if (!user.email || !user.countries?.length) {
      continue;
    }

    const feedRefs: FirebaseFirestore.DocumentReference[] = [];
    for (const country of user.countries) {
      for (const day of days) {
        feedRefs.push(db.collection("public_feeds").doc(`daily_${day}_${country}`));
      }
    }
    const feedSnaps = await db.getAll(...feedRefs);
    const items = feedSnaps
      .filter((snap) => snap.exists)
      .flatMap((snap) => (snap.data()?.items as any[]) || [])
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
      await db.collection("users").doc(userDoc.id).set(
        {
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      logger.error("Email error", error);
    }
  }
});
