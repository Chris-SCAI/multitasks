"use client";

import { motion } from "framer-motion";
import { Brain, Calendar, Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const proofs = [
  {
    icon: Brain,
    title: "Priorisation IA",
    description:
      "L'IA analyse tes tâches et les classe selon la matrice d'Eisenhower en 10 secondes.",
    gradient: "from-violet-500/20 to-violet-600/5",
    iconColor: "text-violet-400",
  },
  {
    icon: Calendar,
    title: "Calendrier intégré",
    description:
      "Visualise ta charge par jour, détecte les conflits de deadlines automatiquement.",
    gradient: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-400",
  },
  {
    icon: Layers,
    title: "Domaines de vie",
    description:
      "Sépare Pro, Perso, Urgent. Chaque domaine a sa couleur et son icône.",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-400",
  },
];

export function ProofSection() {
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {proofs.map((proof, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={
                isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="rounded-3xl border border-[#1E293B] bg-[#151D2E] p-9 transition-all duration-300 hover:border-[#2A3654] hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-1 lg:p-11"
            >
              <div className={`mb-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${proof.gradient} p-4`}>
                <proof.icon className={`size-9 ${proof.iconColor}`} />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-violet-400">
                {proof.title}
              </h3>
              <p className="text-lg font-medium leading-relaxed text-neutral-300">
                {proof.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
