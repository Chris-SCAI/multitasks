"use client";

import { motion } from "framer-motion";
import { Layers, ListTodo, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    icon: Layers,
    number: 1,
    title: "Crée tes domaines",
    description: "Sépare Pro, Perso, Urgent. Chaque domaine a sa couleur.",
  },
  {
    icon: ListTodo,
    number: 2,
    title: "Ajoute tes tâches avec deadlines",
    description: "Titre, description, deadline, durée estimée. C'est tout.",
  },
  {
    icon: Sparkles,
    number: 3,
    title: "L'IA priorise en 10 secondes",
    description:
      "Sélectionne jusqu'à 20 tâches. L'IA les classe selon Eisenhower.",
  },
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
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Comment ça marche ?
          </h2>
          <p className="mx-auto max-w-3xl text-xl font-medium text-neutral-300 lg:text-2xl">
            3 étapes simples pour reprendre le contrôle de tes tâches.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={
                isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center"
            >
              <div className="mb-8 inline-flex items-center justify-center">
                <div className="relative">
                  <div className="flex size-28 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-600/20 transition-all duration-300 hover:shadow-xl hover:shadow-violet-600/30 hover:scale-105">
                    <step.icon className="size-14 text-white" />
                  </div>
                  <div className="absolute -right-2 -top-2 flex size-11 items-center justify-center rounded-full bg-[#151D2E] text-lg font-bold text-violet-400 shadow-md ring-2 ring-[#1E293B]">
                    {step.number}
                  </div>
                </div>
              </div>

              <h3 className="mb-4 text-2xl font-bold text-white lg:text-3xl">
                {step.title}
              </h3>
              <p className="text-lg text-neutral-300 lg:text-xl">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
