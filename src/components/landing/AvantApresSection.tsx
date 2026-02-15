"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const avantItems = [
  "Journées hachées, urgences partout",
  "Priorités floues → tu choisis au feeling",
  "Deadlines/relances qui te reviennent dessus",
  "Notes et rappels dispersés",
];

const apresItems = [
  { text: "1 prochaine action", bold: true, suffix: " claire, priorisée" },
  { text: "Deadlines visibles + rappels", bold: false, suffix: " → tu anticipes" },
  { text: "Tout centralisé par domaines", bold: false, suffix: " (clients / équipe / ops)" },
  { text: "L'IA trie", bold: true, suffix: ", toi tu exécutes" },
];

export function AvantApresSection() {
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
      className="border-t border-[#1E293B]/50 bg-[#0a0f1c] px-6 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-screen-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          {/* Title */}
          <h2 className="mb-14 text-center text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            De la paralysie à l&apos;action en quelques secondes
          </h2>

          {/* Columns */}
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            {/* AVANT */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl border-2 border-red-500/30 bg-[#151D2E] p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="text-3xl">😩</span>
                <h3 className="text-2xl font-bold text-red-400">AVANT</h3>
              </div>
              <ul className="space-y-4">
                {avantItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-2 size-2.5 shrink-0 rounded-full bg-red-500" />
                    <span className="text-lg text-neutral-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* APRÈS */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-3xl border-2 border-emerald-500/30 bg-[#151D2E] p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="text-3xl">✨</span>
                <h3 className="text-2xl font-bold text-emerald-400">APRÈS</h3>
              </div>
              <ul className="space-y-4">
                {apresItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="mt-1 size-5 shrink-0 text-emerald-400"
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
                    <span className="text-lg text-neutral-300">
                      {item.bold ? (
                        <strong className="text-white">{item.text}</strong>
                      ) : (
                        item.text
                      )}
                      {item.suffix}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Transition CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mx-auto mt-14 max-w-3xl text-center"
          >
            <p className="text-xl font-bold text-white md:text-2xl">
              Tu n&apos;as pas besoin d&apos;une liste.
            </p>
            <p className="mt-2 text-xl font-bold text-violet-400 md:text-2xl">
              Tu as besoin d&apos;une priorité.
            </p>
            <p className="mt-4 text-lg text-neutral-300">
              MultiTasks trie par domaines et te sort{" "}
              <strong className="text-white">quoi faire maintenant</strong> — en
              10 secondes.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
