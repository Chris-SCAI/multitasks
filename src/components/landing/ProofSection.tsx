"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    emoji: "🔮",
    title: "Décide quoi faire maintenant",
    description:
      "L'IA priorise (Eisenhower + durée) et tu sais exactement par quoi commencer.",
    gradient: "from-violet-500/20 to-violet-600/5",
  },
  {
    emoji: "📚",
    title: "Chaque domaine à sa place",
    description:
      "Clients, équipe, opérations, perso… ajoute autant de domaines que tu veux.",
    gradient: "from-blue-500/20 to-blue-600/5",
  },
  {
    emoji: "📅",
    title: "Deadlines sous contrôle",
    description:
      "Calendrier + rappels. Tu ne subis plus les \"surprises\".",
    gradient: "from-orange-500/20 to-orange-600/5",
  },
  {
    emoji: "📱",
    title: "Toujours accessible",
    description:
      "PWA installable, fonctionne offline. (Les analyses IA nécessitent une connexion.)",
    gradient: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    emoji: "🛡️",
    title: "Privacy-first",
    description:
      "Tes données restent stockées localement et chiffrées. (Lors d'une analyse, seules les tâches nécessaires sont traitées.)",
    gradient: "from-pink-500/20 to-pink-600/5",
  },
];

export function FeaturesSection() {
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
      id="features"
      className="border-t border-[#1E293B]/50 px-6 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Fonctionnalités{" "}
            <span className="text-neutral-400">(bénéfices, pas blabla)</span>
          </h2>
        </div>

        {/* Grid: 3 on top, 2 below centered */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.slice(0, 3).map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={
                isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="rounded-3xl border border-[#1E293B] bg-[#151D2E] p-9 transition-all duration-300 hover:border-[#2A3654] hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-1 lg:p-11"
            >
              <div
                className={`mb-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} p-4`}
              >
                <span className="text-4xl">{feature.emoji}</span>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-violet-400">
                {feature.title}
              </h3>
              <p className="text-lg font-medium leading-relaxed text-neutral-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:mx-auto lg:max-w-4xl">
          {features.slice(3).map((feature, index) => (
            <motion.div
              key={index + 3}
              initial={{ opacity: 0, y: 20 }}
              animate={
                isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5, delay: (index + 3) * 0.15 }}
              className="rounded-3xl border border-[#1E293B] bg-[#151D2E] p-9 transition-all duration-300 hover:border-[#2A3654] hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-1 lg:p-11"
            >
              <div
                className={`mb-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} p-4`}
              >
                <span className="text-4xl">{feature.emoji}</span>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-violet-400">
                {feature.title}
              </h3>
              <p className="text-lg font-medium leading-relaxed text-neutral-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Keep backward compatibility
export { FeaturesSection as ProofSection };
