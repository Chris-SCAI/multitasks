"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const tasks = [
  {
    title: "Relancer devis client A",
    deadline: "Aujourd'hui",
    badge: "Urgent",
    badgeClass: "bg-red-500/20 text-red-400 border border-red-500/30",
  },
  {
    title: "Préparer réunion équipe",
    deadline: "Demain 10h",
    badge: "Urgent",
    badgeClass: "bg-red-500/20 text-red-400 border border-red-500/30",
  },
  {
    title: "Livrer présentation client Q4",
    deadline: "Vendredi",
    badge: "Important",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  },
  {
    title: "Facturation / trésorerie",
    deadline: "Cette semaine",
    badge: "Important",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  },
  {
    title: "Recrutement / onboarding",
    deadline: "",
    badge: "À planifier",
    badgeClass: "bg-transparent text-emerald-300 border border-emerald-400/40",
  },
];

export function TaskDemoSection() {
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
          {/* Header */}
          <div className="mb-12 text-center">
            <p className="mb-5 text-base font-bold uppercase tracking-widest text-violet-400">
              Exemple de tâches
            </p>
            <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Ta journée,{" "}
              <span className="text-violet-400">priorisée par l&apos;IA</span>
            </h2>
          </div>

          {/* Card mockup */}
          <div className="mx-auto max-w-2xl">
            <div className="rounded-3xl border border-[#1E293B] bg-[#151D2E] p-6 shadow-2xl shadow-violet-500/5 lg:p-8">
              {/* Card header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="size-3 rounded-full bg-red-500" />
                    <div className="size-3 rounded-full bg-yellow-500" />
                    <div className="size-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm font-semibold text-neutral-400">
                    Domaine : Clients
                  </span>
                </div>
              </div>

              {/* Task list */}
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      isVisible
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: -20 }
                    }
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between rounded-xl border border-[#1E293B] bg-[#0B1120] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-4 rounded border-2 border-neutral-600" />
                      <span className="text-sm font-medium text-neutral-200 sm:text-base">
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {task.deadline && (
                        <span className="hidden text-xs text-neutral-500 sm:inline">
                          {task.deadline}
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${task.badgeClass}`}
                      >
                        {task.badge}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="mb-4 text-sm text-neutral-400">
                  ✨ Clique &quot;Analyser&quot; → l&apos;IA te sort l&apos;ordre + une
                  durée estimée.
                </p>
                <button className="rounded-full border border-violet-500/50 bg-gradient-to-r from-violet-600/10 to-violet-500/10 px-6 py-2.5 text-sm font-semibold text-violet-400 transition-all duration-300 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/20">
                  ▷ Lancer une analyse IA (démo)
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
