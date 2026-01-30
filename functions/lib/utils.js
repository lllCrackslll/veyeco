"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunk = exports.parseBody = exports.toIsoString = exports.toTimestamp = exports.endOfDayUTC = exports.startOfDayUTC = exports.asDateStringUTC = exports.hashUrl = exports.serverTimestamp = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const firestore_1 = require("firebase-admin/firestore");
const serverTimestamp = () => firestore_1.FieldValue.serverTimestamp();
exports.serverTimestamp = serverTimestamp;
const hashUrl = (url) => node_crypto_1.default.createHash("sha256").update(url).digest("hex");
exports.hashUrl = hashUrl;
const asDateStringUTC = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
exports.asDateStringUTC = asDateStringUTC;
const startOfDayUTC = (date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
exports.startOfDayUTC = startOfDayUTC;
const endOfDayUTC = (date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1));
exports.endOfDayUTC = endOfDayUTC;
const toTimestamp = (date) => firestore_1.Timestamp.fromDate(date);
exports.toTimestamp = toTimestamp;
const toIsoString = (timestamp) => timestamp.toDate().toISOString();
exports.toIsoString = toIsoString;
const parseBody = (body) => {
    if (!body) {
        throw new Error("Corps de requête manquant.");
    }
    if (typeof body === "string") {
        return JSON.parse(body);
    }
    return body;
};
exports.parseBody = parseBody;
const chunk = (items, size) => {
    const result = [];
    for (let i = 0; i < items.length; i += size) {
        result.push(items.slice(i, i + size));
    }
    return result;
};
exports.chunk = chunk;
