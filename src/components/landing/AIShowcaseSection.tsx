"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const checkmarks = [
  "Suggestions de priorité claires",
  "Estimation de durée",
  "Prochaine action prête",
];

export function AIShowcaseSection() {
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
          className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2"
        >
          {/* Left: Content */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2">
              <span className="text-sm font-bold text-violet-300">◎</span>
              <span className="text-sm font-bold tracking-wide text-violet-300">
                Intelligence Artificielle
              </span>
            </div>

            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              1 analyse IA = jusqu&apos;à{" "}
              <span className="text-violet-400">20 tâches priorisées</span>
            </h2>

            <p className="mb-8 text-xl font-medium text-neutral-300 lg:text-2xl">
              Sélectionne tes tâches, lance l&apos;analyse, et obtiens un plan
              d&apos;action clair en 10 secondes.
            </p>

            {/* Checkmarks */}
            <div className="mb-8 space-y-4">
              {checkmarks.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500/20">
                    <svg
                      className="size-4 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-neutral-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Note Pro */}
            <div className="rounded-xl border border-[#1E293B] bg-[#0B1120] px-5 py-4">
              <p className="text-sm text-neutral-400">
                <span className="font-semibold text-violet-400">Pro</span> :
                jusqu&apos;à 3 analyses/jour pour garder une qualité stable et
                éviter les abus.
              </p>
            </div>
          </div>

          {/* Right: AI Result Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              isVisible
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.95 }
            }
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-md rounded-3xl border border-[#1E293B] bg-[#151D2E] p-7 shadow-2xl shadow-violet-500/10 lg:p-8">
              {/* Card header */}
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600">
                  <svg
                    className="size-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-violet-400">
                    Analyse Eisenhower
                  </p>
                  <p className="text-xs text-neutral-500">
                    Préparer la présentation client
                  </p>
                </div>
              </div>

              {/* Result rows */}
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-[#1E293B] bg-[#0B1120] px-4 py-3">
                  <span className="text-sm text-neutral-400">Quadrant</span>
                  <span className="text-sm font-semibold text-red-400">
                    🔥 Faire maintenant
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#1E293B] bg-[#0B1120] px-4 py-3">
                  <span className="text-sm text-neutral-400">Priorité</span>
                  <span className="text-sm font-semibold text-amber-400">
                    Haute
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#1E293B] bg-[#0B1120] px-4 py-3">
                  <span className="text-sm text-neutral-400">Durée</span>
                  <span className="text-sm font-semibold text-neutral-200">
                    ~45 min
                  </span>
                </div>
              </div>

              {/* CTA */}
              <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/25">
                ✓ Appliquer les suggestions
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
