import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Collectam - Révolutionnez la gestion des déchets en Afrique",
  description: "Plateforme IA + IoT + Blockchain pour optimiser la collecte des déchets, promouvoir le recyclage et engager les communautés en Afrique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
