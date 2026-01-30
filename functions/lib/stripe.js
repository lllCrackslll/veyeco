"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = exports.createCheckoutSession = void 0;
const https_1 = require("firebase-functions/v2/https");
const auth_1 = require("firebase-admin/auth");
const firestore_1 = require("firebase-admin/firestore");
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("./config");
const utils_1 = require("./utils");
const stripe = new stripe_1.default(config_1.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
});
const getHeaderValue = (value) => {
    if (Array.isArray(value)) {
        return value[0] || "";
    }
    return value || "";
};
const requireAuth = async (req) => {
    const header = getHeaderValue(req.headers.authorization);
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) {
        throw new Error("Token manquant.");
    }
    const decoded = await (0, auth_1.getAuth)().verifyIdToken(token);
    return decoded.uid;
};
const allowCors = (res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
};
exports.createCheckoutSession = (0, https_1.onRequest)(async (req, res) => {
    allowCors(res);
    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }
    try {
        if (!config_1.STRIPE_SECRET_KEY || !config_1.STRIPE_PRICE_ID_MONTHLY || !config_1.APP_URL) {
            res.status(500).json({ error: "Stripe non configuré." });
            return;
        }
        const uid = await requireAuth(req);
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [{ price: config_1.STRIPE_PRICE_ID_MONTHLY, quantity: 1 }],
            success_url: `${config_1.APP_URL}/app?checkout=success`,
            cancel_url: `${config_1.APP_URL}/app?checkout=cancel`,
            metadata: { uid },
            client_reference_id: uid,
        });
        res.status(200).json({ id: session.id, url: session.url });
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
});
const updateSubscriptionForUid = async (uid, payload) => {
    const db = (0, firestore_1.getFirestore)();
    const subRef = db.collection("subscriptions").doc(uid);
    await subRef.set({
        stripeCustomerId: payload.stripeCustomerId,
        stripeSubscriptionId: payload.stripeSubscriptionId,
        status: payload.status,
        currentPeriodEnd: payload.currentPeriodEnd
            ? firestore_1.Timestamp.fromMillis(payload.currentPeriodEnd * 1000)
            : null,
        isPro: payload.isPro,
        updatedAt: (0, utils_1.serverTimestamp)(),
    }, { merge: true });
    await db.collection("users").doc(uid).set({
        plan: payload.isPro ? "pro" : "free",
        updatedAt: (0, utils_1.serverTimestamp)(),
    }, { merge: true });
};
const findUidByCustomerId = async (customerId) => {
    const db = (0, firestore_1.getFirestore)();
    const snapshot = await db
        .collection("subscriptions")
        .where("stripeCustomerId", "==", customerId)
        .limit(1)
        .get();
    const doc = snapshot.docs[0];
    return doc ? doc.id : null;
};
exports.stripeWebhook = (0, https_1.onRequest)(async (req, res) => {
    if (!config_1.STRIPE_WEBHOOK_SECRET || !config_1.STRIPE_SECRET_KEY) {
        res.status(500).send("Stripe non configuré.");
        return;
    }
    const sig = req.headers["stripe-signature"];
    if (!sig) {
        res.status(400).send("Signature manquante.");
        return;
    }
    let event;
    try {
        const rawBody = req.rawBody;
        event = stripe.webhooks.constructEvent(rawBody, sig, config_1.STRIPE_WEBHOOK_SECRET);
    }
    catch (error) {
        res.status(400).send(`Webhook invalide: ${error.message}`);
        return;
    }
    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const uid = session.metadata?.uid;
            if (uid) {
                const subscriptionId = session.subscription ? String(session.subscription) : null;
                let status = session.status || "active";
                let currentPeriodEnd = null;
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
        if (event.type === "customer.subscription.updated" ||
            event.type === "customer.subscription.deleted") {
            const subscription = event.data.object;
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
