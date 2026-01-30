import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Veyeco — Veille économique intelligente",
  description: "Brief quotidien + breaking alerts — Budget, fiscalité, banques centrales, macro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="font-sans">{children}</body>
    </html>
  );
}
