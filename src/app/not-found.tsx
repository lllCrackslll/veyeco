export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-3xl font-semibold">Page introuvable</h1>
        <p className="text-sm text-gray-400">
          La page demandée n’existe pas.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-sky-500 text-white"
        >
          Retour à l’accueil
        </a>
      </div>
    </div>
  );
}
