"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send, Loader2, MessageSquare, Check, ArrowLeft } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const subject = encodeURIComponent(String(data.get("subject") || "Contact Multitasks"));
    const body = encodeURIComponent(
      `De : ${data.get("email")}\n\n${data.get("message")}`,
    );
    window.location.href = `mailto:contact@multitasks.fr?subject=${subject}&body=${body}`;
    setSent(true);
    setSending(false);
  }

  return (
    <div className="relative min-h-screen bg-[#0B1120] px-6 py-20 text-neutral-100 sm:px-8 lg:px-12">
      {/* Multiple animated background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 20, -15, 0], y: [0, -15, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-20 -translate-x-1/2"
        >
          <div className="h-[400px] w-[600px] rounded-full bg-violet-600/8 blur-[120px]" />
        </motion.div>
        <motion.div
          animate={{ x: [0, -25, 15, 0], y: [0, 10, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute -right-20 top-1/2"
        >
          <div className="h-[300px] w-[300px] rounded-full bg-blue-600/8 blur-[100px]" />
        </motion.div>
      </div>

      {/* Grid dot pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto max-w-xl">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-neutral-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Retour
          </Link>
        </motion.div>

        {/* Header avec icon gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-center gap-4"
        >
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/30">
            <MessageSquare className="size-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Contact</h1>
            <p className="mt-1 text-lg text-neutral-400">
              Une question, un problème ou une suggestion ? Écrivez-nous.
            </p>
          </div>
        </motion.div>

        {/* Card email avec gradient border (technique PricingTable Pro) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative mb-10 rounded-xl"
        >
          <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-violet-500/50 to-blue-500/50" />
          <div className="relative flex items-center gap-3 rounded-xl bg-[#151D2E] p-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-violet-500/10">
              <Mail className="size-5 text-violet-400" />
            </div>
            <a
              href="mailto:contact@multitasks.fr"
              className="text-lg font-medium text-violet-400 transition-colors hover:text-violet-300"
            >
              contact@multitasks.fr
            </a>
          </div>
        </motion.div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            role="status"
            aria-live="polite"
            className="relative rounded-2xl"
          >
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-emerald-500/40 to-teal-500/20" />
            <div className="relative overflow-hidden rounded-2xl bg-[#151D2E] p-10 text-center">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-40 w-40 rounded-full bg-emerald-500/10 blur-[80px]" />
              </div>
              <div className="relative">
                <div className="mx-auto mb-6 flex size-20 items-center justify-center">
                  <div className="absolute size-20 rounded-full bg-emerald-500/20 blur-xl" />
                  <div className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 shadow-lg shadow-emerald-500/20">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                    >
                      <Check className="size-10 text-emerald-400" />
                    </motion.div>
                  </div>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold text-emerald-400"
                >
                  Client email ouvert !
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-2 text-neutral-400"
                >
                  Si rien ne s&apos;est passé, envoyez directement un email à{" "}
                  <strong className="text-violet-400">contact@multitasks.fr</strong>.
                </motion.p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative rounded-2xl"
          >
            {/* Gradient border on form card */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-violet-500/30 via-blue-500/10 to-transparent" />

            <div className="relative overflow-hidden rounded-2xl bg-[#151D2E] p-8">
              {/* Inner glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 size-40 rounded-full bg-violet-600 opacity-[0.05] blur-3xl" />

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-300">
                    Votre email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      aria-required="true"
                      placeholder="vous@exemple.com"
                      className="border-[#1E293B] bg-[#0B1120] pl-10 text-white placeholder:text-neutral-500 focus:ring-violet-500"
                    />
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="mb-2 block text-sm font-medium text-neutral-300">
                    Sujet
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    aria-required="true"
                    placeholder="Question sur..."
                    className="border-[#1E293B] bg-[#0B1120] text-white placeholder:text-neutral-500 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="mb-2 block text-sm font-medium text-neutral-300">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    aria-required="true"
                    rows={5}
                    placeholder="Décrivez votre demande..."
                    className="border-[#1E293B] bg-[#0B1120] text-white placeholder:text-neutral-500 focus:ring-violet-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sending}
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 py-6 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/40"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative flex items-center justify-center gap-2">
                    {sending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Envoyer
                      </>
                    )}
                  </span>
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
