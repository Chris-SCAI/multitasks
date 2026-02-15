"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const personas = [
  {
    emoji: "💼",
    title: "Indépendant / Consultant / Solopreneur",
    description:
      "Clients, livrables, relances, admin : l'IA te dit quoi faire maintenant pour livrer à l'heure.",
    gradient: "from-blue-500/20 to-blue-600/5",
    borderColor: "hover:border-blue-500/30",
  },
  {
    emoji: "🧠",
    title: "Cadre / Chef de projet / Manager",
    description:
      "Réunions, projets, équipe : tu sépares par domaines et tu exécutes sans te perdre dans le bruit.",
    gradient: "from-violet-500/20 to-violet-600/5",
    borderColor: "hover:border-violet-500/30",
  },
  {
    emoji: "🎓",
    title: "Étudiant (bonus)",
    description:
      "Partiels, projets, job : tu gardes le contrôle sans stress.",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    borderColor: "hover:border-emerald-500/30",
  },
];

export function PersonasSection() {
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
      className="border-t border-[#1E293B]/50 px-6 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-screen-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Conçu pour ceux qui ont trop de responsabilités
              <br className="hidden md:block" />
              <span className="text-violet-400"> pour improviser</span>
            </h2>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            {personas.map((persona, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`rounded-3xl border border-[#1E293B] bg-[#151D2E] p-8 transition-all duration-300 ${persona.borderColor} hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-1`}
              >
                <div
                  className={`mb-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${persona.gradient} p-4`}
                >
                  <span className="text-4xl">{persona.emoji}</span>
                </div>
                <h3 className="mb-4 text-xl font-bold text-white">
                  {persona.title}
                </h3>
                <p className="text-base leading-relaxed text-neutral-300">
                  {persona.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
