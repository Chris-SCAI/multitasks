import dynamic from "next/dynamic";
import { HeroSection } from "@/components/landing/HeroSection";

const TaskDemoSection = dynamic(() => import("@/components/landing/TaskDemoSection").then(mod => mod.TaskDemoSection));
const AvantApresSection = dynamic(() => import("@/components/landing/AvantApresSection").then(mod => mod.AvantApresSection));
const FeaturesSection = dynamic(() => import("@/components/landing/ProofSection").then(mod => mod.FeaturesSection));
const AIShowcaseSection = dynamic(() => import("@/components/landing/AIShowcaseSection").then(mod => mod.AIShowcaseSection));
const HowItWorksSection = dynamic(() => import("@/components/landing/HowItWorksSection").then(mod => mod.HowItWorksSection));
const PersonasSection = dynamic(() => import("@/components/landing/PersonasSection").then(mod => mod.PersonasSection));
const PricingSection = dynamic(() => import("@/components/landing/PricingSection").then(mod => mod.PricingSection));
const FAQSection = dynamic(() => import("@/components/landing/FAQSection").then(mod => mod.FAQSection));
const FinalCTASection = dynamic(() => import("@/components/landing/FinalCTASection").then(mod => mod.FinalCTASection));
const Footer = dynamic(() => import("@/components/landing/Footer").then(mod => mod.Footer));

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-neutral-100">
      <HeroSection />
      <TaskDemoSection />
      <AvantApresSection />
      <FeaturesSection />
      <AIShowcaseSection />
      <HowItWorksSection />
      <PersonasSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Multitasks",
            applicationCategory: "ProductivityApplication",
            operatingSystem: "Web",
            availableOnDevice: "Desktop, Mobile",
            inLanguage: "fr",
            author: {
              "@type": "Organization",
              name: "Multitasks",
              url: "https://multitasks.fr",
            },
            offers: [
              { "@type": "Offer", price: "0", priceCurrency: "EUR", name: "Gratuit" },
              { "@type": "Offer", price: "5.90", priceCurrency: "EUR", name: "IA Quotidienne" },
              { "@type": "Offer", price: "12.90", priceCurrency: "EUR", name: "Pro Sync" },
            ],
            description:
              "Gestion de tâches avec priorisation IA via la matrice d'Eisenhower. Organise tes tâches par domaines et laisse l'IA les prioriser.",
            url: "https://multitasks.fr",
            image: "https://multitasks.fr/opengraph-image",
          }),
        }}
      />
    </div>
  );
}
