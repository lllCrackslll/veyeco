import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const uiFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});


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
    <html lang="fr" className={`${displayFont.variable} ${uiFont.variable}`}>
      <body className="font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
