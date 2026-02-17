import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe Multitasks pour vos questions, suggestions ou demandes de support.",
  alternates: {
    canonical: "https://multitasks.fr/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
