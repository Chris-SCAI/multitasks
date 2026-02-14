"use client";

import { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_TEXTS = [
  "Analyse de l'urgence...",
  "Estimation des durees...",
  "Classification Eisenhower...",
  "Priorisation en cours...",
];

export function AILoadingAnimation() {
  const [textIndex, setTextIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const textTimer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
    }, 2500);
    return () => clearInterval(textTimer);
  }, []);

  useEffect(() => {
    const secTimer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(secTimer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mb-8 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/25"
      >
        <Brain className="size-10 text-white" />
      </motion.div>

      <div className="mb-6 h-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={textIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center text-lg font-medium text-white"
          >
            {LOADING_TEXTS[textIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mb-4 h-1.5 w-64 overflow-hidden rounded-full bg-[#1E293B]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "50%" }}
        />
      </div>

      <p className="text-sm text-neutral-400">
        {seconds}s
      </p>
    </div>
  );
}
