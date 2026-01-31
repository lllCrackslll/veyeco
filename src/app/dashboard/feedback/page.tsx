"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { Card } from "@/components/Card";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/app/providers";

export default function FeedbackPage() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      setError("Connecte-toi pour envoyer un avis.");
      return;
    }
    setIsSending(true);
    setError(null);
    addDoc(collection(db, "feedbacks"), {
      uid: user.uid,
      email: email || user.email || "",
      message,
      createdAt: serverTimestamp(),
      page: "dashboard",
    })
      .then(() => {
        setIsSent(true);
        setMessage("");
        setEmail("");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-3xl mx-auto px-6 py-10 w-full">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au dashboard
        </Link>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-white font-display">
              Vos idées comptent
            </h1>
            <p className="text-gray-400 mt-2">
              Dites-nous ce que vous aimez, ce qui manque, ou ce que vous voulez voir
              évoluer.
            </p>
          </div>

          <Card>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm text-gray-300">Email (optionnel)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="w-full mt-2 px-4 py-3 input-dark rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300">Votre message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Proposer une fonctionnalité, signaler un bug, donner un avis..."
                  className="w-full mt-2 px-4 py-3 input-dark rounded-lg min-h-[160px]"
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="btn-primary inline-flex items-center gap-2"
                  disabled={!message.trim() || isSending}
                >
                  <Send className="w-4 h-4" />
                  {isSending ? "Envoi..." : "Envoyer"}
                </button>
                {isSent && (
                  <p className="text-sm text-green-400">Merci, votre avis a été envoyé.</p>
                )}
              </div>
            </form>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </Card>
        </div>
      </main>
    </div>
  );
}
