"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold">Une erreur est survenue</h1>
        <p className="text-sm text-gray-400">
          {error.message || "Erreur inconnue"}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-md bg-sky-500 text-white"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
