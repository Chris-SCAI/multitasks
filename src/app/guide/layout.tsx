import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guide d'utilisation",
  description:
    "Maîtrisez Multitasks de A à Z : création de tâches, domaines, priorisation IA avec la matrice d'Eisenhower, calendrier, rappels, synchronisation cloud et installation mobile.",
  openGraph: {
    title: "Guide d'utilisation | Multitasks",
    description:
      "Maîtrisez Multitasks de A à Z : création de tâches, domaines, priorisation IA avec la matrice d'Eisenhower, calendrier, rappels, synchronisation cloud et installation mobile.",
  },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
