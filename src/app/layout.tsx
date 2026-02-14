import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { PWAProvider } from "@/components/pwa/PWAProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#2563EB",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://multitasks.fr"),
  title: {
    default: "Multitasks - Gestion de tâches avec priorisation IA",
    template: "%s | Multitasks",
  },
  description:
    "Organise tes tâches par domaines et laisse l'IA les prioriser avec la matrice d'Eisenhower. Gratuit pour commencer.",
  keywords: [
    "gestion de tâches",
    "productivité",
    "IA",
    "matrice Eisenhower",
    "todo list",
    "priorisation",
  ],
  authors: [{ name: "Multitasks" }],
  creator: "Multitasks",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Multitasks",
  },
  icons: {
    apple: "/icons/icon-192x192.svg",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://multitasks.fr",
    siteName: "Multitasks",
    title: "Multitasks - Gestion de tâches avec priorisation IA",
    description:
      "Organise tes tâches par domaines et laisse l'IA les prioriser. 2 analyses gratuites.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Multitasks - Priorisation IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Multitasks - Gestion de tâches avec priorisation IA",
    description: "Organise tes tâches par domaines et laisse l'IA les prioriser.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preload" href="https://cdn.jsdelivr.net/npm/cal-sans@1.0.1/fonts/webfonts/CalSans-SemiBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/cal-sans@1.0.1/css/cal-sans.css" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-neutral-50 text-neutral-900 dark:bg-[#0B1120] dark:text-neutral-100`}
      >
        <ThemeProvider>
          <PWAProvider>{children}</PWAProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
