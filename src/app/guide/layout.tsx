import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guide d'utilisation",
  description:
    "Apprenez à utiliser Multitasks : gestion des tâches, analyse IA, calendrier, domaines, rappels, plans et installation mobile.",
  openGraph: {
    title: "Guide d'utilisation | Multitasks",
    description:
      "Apprenez à utiliser Multitasks : gestion des tâches, analyse IA, calendrier, domaines, rappels, plans et installation mobile.",
  },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
