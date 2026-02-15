"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const pillars = [
  {
    number: 1,
    numberColor: "bg-emerald-500",
    emoji: "🟢",
    title: "Domaines",
    description:
      "Sépare tes responsabilités : clients / équipe / ops / perso.",
    badges: [
      { emoji: "📊", label: "Clients" },
      { emoji: "👥", label: "Équipe" },
      { emoji: "⚙️", label: "Ops" },
      { emoji: "🏠", label: "Perso" },
    ],
  },
  {
    number: 2,
    numberColor: "bg-orange-500",
    emoji: "🟠",
    title: "Deadlines",
    description:
      "Ajoute dates et rappels (2 clics). Le calendrier te montre les risques avant qu'ils arrivent.",
    footer: "📅 Vue calendrier intégrée",
  },
  {
    number: 3,
    numberColor: "bg-blue-500",
    emoji: "🔵",
    title: "IA → Exécution",
    description: "Tu lances une analyse, tu appliques, tu avances.",
    footer: "✨ Prochaine action : 1 tâche",
  },
];

const checklistItems = [
  { emoji: "📁", text: "Crée 3 domaines" },
  { emoji: "✏️", text: "Ajoute 25 tâches" },
  { emoji: "📅", text: "Mets 5 deadlines" },
  { emoji: "🤖", text: "Lance 1 analyse IA" },
];

export function HowItWorksSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="border-t border-[#1E293B]/50 bg-[#0a0f1c] px-6 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-screen-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              3 piliers pour reprendre le contrôle de ton temps
            </h2>
          </div>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="rounded-3xl border border-[#1E293B] bg-[#151D2E] p-8 transition-all duration-300 hover:border-[#2A3654] hover:shadow-lg hover:shadow-violet-500/5"
              >
                {/* Number circle */}
                <div className="mb-6 flex items-center gap-4">
                  <div
                    className={`flex size-12 items-center justify-center rounded-full ${pillar.numberColor} text-xl font-bold text-white`}
                  >
                    {pillar.number}
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {pillar.title}
                  </h3>
                </div>

                <p className="mb-6 text-lg text-neutral-300">
                  {pillar.description}
                </p>

                {/* Badges for pillar 1 */}
                {pillar.badges && (
                  <div className="flex flex-wrap gap-2">
                    {pillar.badges.map((badge, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-[#1E293B] bg-[#0B1120] px-3 py-1.5 text-sm text-neutral-300"
                      >
                        {badge.emoji} {badge.label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer for pillars 2 & 3 */}
                {pillar.footer && (
                  <p className="mt-2 text-sm font-semibold text-violet-400">
                    {pillar.footer}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Checklist démarrage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mx-auto mt-12 max-w-3xl rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-600/10 to-blue-600/10 p-8"
          >
            <h3 className="mb-6 text-center text-xl font-bold text-white">
              ⏱ Checklist démarrage (2 minutes)
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {checklistItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl border border-[#1E293B] bg-[#0B1120]/80 px-4 py-3"
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-base font-medium text-neutral-200">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
