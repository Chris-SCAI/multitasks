"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Comment fonctionne l'analyse IA ?",
    answer:
      "Tu sélectionnes jusqu'à 20 tâches, l'IA les analyse via la matrice d'Eisenhower et te donne un ordre de priorité en moins de 10 secondes.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Oui. Tes données sont stockées localement sur ton appareil (IndexedDB). Le plan Pro ajoute la synchronisation cloud chiffrée via Supabase.",
  },
  {
    question: "Puis-je utiliser Multitasks sans payer ?",
    answer:
      "Absolument. Le plan gratuit inclut 5 domaines, des tâches illimitées et 5 analyses IA par mois. Pas de carte bancaire requise.",
  },
  {
    question: "Quelle est la différence entre les plans ?",
    answer:
      "Le plan Étudiant (2,99\u00a0\u20ac/mois) offre 30 analyses par mois et un calendrier complet. Le plan Pro (5,99\u00a0\u20ac/mois en annuel) ajoute la sync cloud, l'export et 100 analyses par mois. Le plan Équipe (9,99\u00a0\u20ac/user/mois en annuel) inclut des analyses illimitées et un support dédié.",
  },
  {
    question: "Y a-t-il une offre étudiante ?",
    answer:
      "Oui ! Le plan Étudiant à 2,99\u00a0\u20ac/mois (29\u00a0\u20ac/an) donne accès à toutes les fonctionnalités premium. Vérification par email .edu ou .ac.fr.",
  },
  {
    question: "Puis-je annuler à tout moment ?",
    answer:
      "Oui, en 2 clics depuis les paramètres. Garantie satisfait ou remboursé 30 jours.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="bg-[#0a0f1c] px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-screen-lg">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Questions fréquentes
          </h2>
          <p className="mx-auto max-w-3xl text-xl font-medium text-neutral-300 lg:text-2xl">
            Tout ce que tu dois savoir sur Multitasks.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-5">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-2xl border border-[#1E293B] bg-[#151D2E] px-8 py-4 transition-all duration-200 data-[state=open]:border-violet-500/30 data-[state=open]:bg-[#1C2640]"
            >
              <AccordionTrigger className="text-left text-xl font-bold text-neutral-100 hover:no-underline lg:text-2xl">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pt-3 text-lg text-neutral-300 lg:text-xl">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
