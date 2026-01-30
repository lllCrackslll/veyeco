import { onRequest, type Request } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import Stripe from "stripe";
import {
  APP_URL,
  STRIPE_PRICE_ID_MONTHLY,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
} from "./config";
import { serverTimestamp } from "./utils";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const getHeaderValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }
  return value || "";
};

const requireAuth = async (req: Request) => {
  const header = getHeaderValue(req.headers.authorization);
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    throw new Error("Token manquant.");
  }
  const decoded = await getAuth().verifyIdToken(token);
  return decoded.uid;
};

const allowCors = (res: { set: (k: string, v: string) => void }) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
};

export const createCheckoutSession = onRequest(async (req, res) => {
  allowCors(res);
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  try {
    if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_ID_MONTHLY || !APP_URL) {
      res.status(500).json({ error: "Stripe non configuré." });
      return;
    }
    const uid = await requireAuth(req);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: STRIPE_PRICE_ID_MONTHLY, quantity: 1 }],
      success_url: `${APP_URL}/app?checkout=success`,
      cancel_url: `${APP_URL}/app?checkout=cancel`,
      metadata: { uid },
      client_reference_id: uid,
    });
    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
});

const updateSubscriptionForUid = async (uid: string, payload: {
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  status: string;
  currentPeriodEnd: number | null;
  isPro: boolean;
}) => {
  const db = getFirestore();
  const subRef = db.collection("subscriptions").doc(uid);
  await subRef.set(
    {
      stripeCustomerId: payload.stripeCustomerId,
      stripeSubscriptionId: payload.stripeSubscriptionId,
      status: payload.status,
      currentPeriodEnd: payload.currentPeriodEnd
        ? Timestamp.fromMillis(payload.currentPeriodEnd * 1000)
        : null,
      isPro: payload.isPro,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  await db.collection("users").doc(uid).set(
    {
      plan: payload.isPro ? "pro" : "free",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

const findUidByCustomerId = async (customerId: string) => {
  const db = getFirestore();
  const snapshot = await db
    .collection("subscriptions")
    .where("stripeCustomerId", "==", customerId)
    .limit(1)
    .get();
  const doc = snapshot.docs[0];
  return doc ? doc.id : null;
};

export const stripeWebhook = onRequest(async (req, res) => {
  if (!STRIPE_WEBHOOK_SECRET || !STRIPE_SECRET_KEY) {
    res.status(500).send("Stripe non configuré.");
    return;
  }
  const sig = req.headers["stripe-signature"] as string | undefined;
  if (!sig) {
    res.status(400).send("Signature manquante.");
    return;
  }

  let event: Stripe.Event;
  try {
    const rawBody = (req as { rawBody: Buffer }).rawBody;
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    res.status(400).send(`Webhook invalide: ${(error as Error).message}`);
    return;
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const uid = session.metadata?.uid;
      if (uid) {
        const subscriptionId = session.subscription ? String(session.subscription) : null;
        let status = session.status || "active";
        let currentPeriodEnd: number | null = null;
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          status = subscription.status;
          currentPeriodEnd = subscription.current_period_end || null;
        }
        await updateSubscriptionForUid(uid, {
          stripeCustomerId: String(session.customer || ""),
          stripeSubscriptionId: subscriptionId,
          status,
          currentPeriodEnd,
          isPro: status === "active" || status === "trialing",
        });
      }
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = String(subscription.customer);
      const uid = await findUidByCustomerId(customerId);
      if (uid) {
        const isPro = subscription.status === "active" || subscription.status === "trialing";
        await updateSubscriptionForUid(uid, {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end || null,
          isPro,
        });
      }
    }
    res.status(200).json({ received: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
