"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Bell, CalendarDays, Eye } from "lucide-react";

interface CalendarTask {
  name: string;
  time: string;
  color: string;
  bg?: string;
}

interface CalendarDay {
  day: string;
  date: number;
  isToday?: boolean;
  tasks: CalendarTask[];
}

function CalendarMockup() {
  const days: CalendarDay[] = [
    { day: "LUN", date: 10, tasks: [{ name: "Call cli...", time: "10h", color: "text-neutral-300" }] },
    { day: "MAR", date: 11, tasks: [] },
    {
      day: "MER",
      date: 12,
      isToday: true,
      tasks: [
        { name: "Livrabl...", time: "14h", color: "text-violet-400", bg: "bg-violet-500/20 border-violet-500/30" },
        { name: "Reunio...", time: "16h", color: "text-neutral-300" },
      ],
    },
    { day: "JEU", date: 13, tasks: [{ name: "Factura...", time: "09h", color: "text-neutral-300" }] },
    {
      day: "VEN",
      date: 14,
      tasks: [{ name: "Deadin...", time: "17h", color: "text-red-400", bg: "bg-red-500/20 border-red-500/30" }],
    },
  ];

  return (
    <div className="w-full max-w-xl rounded-3xl border border-[#1E293B] bg-[#151D2E] p-7 shadow-2xl shadow-violet-500/5 lg:p-9">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="size-6 text-neutral-400" />
          <span className="text-lg font-semibold text-white">Semaine 24</span>
        </div>
        <span className="rounded-full bg-amber-500/20 px-4 py-1.5 text-sm font-semibold text-amber-400">
          2 risques
        </span>
      </div>

      {/* Week grid */}
      <div className="mb-6 grid grid-cols-5 gap-2">
        {days.map((d) => (
          <div key={d.day} className="text-center">
            <div className="mb-2 text-sm font-semibold text-neutral-500">{d.day}</div>
            <div
              className={`mx-auto mb-3 flex size-11 items-center justify-center rounded-full text-base font-semibold ${
                d.isToday
                  ? "bg-violet-600 text-white"
                  : "text-neutral-400"
              }`}
            >
              {d.date}
            </div>
            <div className="space-y-2">
              {d.tasks.map((task, i) => (
                <div
                  key={i}
                  className={`rounded-lg border px-2.5 py-2 text-xs leading-tight ${
                    task.bg || "border-[#1E293B] bg-[#0B1120]"
                  } ${task.color}`}
                >
                  <div className="truncate font-medium">{task.name}</div>
                  <div className="text-neutral-500">{task.time}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Risk warning */}
      <div className="flex items-center gap-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
        <AlertTriangle className="size-6 shrink-0 text-amber-400" />
        <div>
          <p className="text-base font-semibold text-amber-300">2 deadlines à risque</p>
          <p className="text-sm text-neutral-500">Mercredi + Vendredi</p>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: AlertTriangle,
    title: "Détecte les conflits",
    description: "2 deadlines le même jour ? Tu le sais à l'avance.",
  },
  {
    icon: Bell,
    title: "Rappels intelligents",
    description: "Un rappel au bon moment, pas 10 notifications.",
  },
  {
    icon: Eye,
    title: "Vue semaine / mois",
    description: "Visualise ta charge et anticipe les pics.",
  },
];

export function DemoSection() {
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
      className="px-6 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-screen-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2"
        >
          {/* Left: Calendar mockup */}
          <div className="flex justify-center lg:justify-start">
            <CalendarMockup />
          </div>

          {/* Right: Content */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#1E293B] bg-[#151D2E] px-5 py-2">
              <CalendarDays className="size-5 text-violet-400" />
              <span className="text-base font-bold tracking-wide text-white">CALENDRIER</span>
            </div>

            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Tu vois les risques
              <br />
              <span className="text-violet-400">avant qu&apos;ils arrivent.</span>
            </h2>
            <p className="mb-10 text-xl font-bold text-neutral-300 lg:text-2xl">
              Deadlines, relances, échéances : tout sur un calendrier visuel. Plus de surprises.
            </p>

            <div className="space-y-7">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-5">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                    <feature.icon className="size-7 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                    <p className="text-lg text-neutral-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
