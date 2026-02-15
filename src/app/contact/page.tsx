"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send, Loader2, MessageSquare, Check } from "lucide-react";

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
    <motion.main
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative min-h-screen bg-[#0B1120] px-6 py-20 text-neutral-100 sm:px-8 lg:px-12"
    >
      {/* Glow mesh background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-20 -translate-x-1/2">
          <div className="h-[400px] w-[600px] rounded-full bg-violet-600/5 blur-[120px]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-xl">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-neutral-400 transition-colors hover:text-white"
        >
          &larr; Retour
        </Link>

        {/* Header avec icon gradient */}
        <div className="mb-10 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/25">
            <MessageSquare className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Contact</h1>
            <p className="mt-1 text-lg text-neutral-400">
              Une question, un problème ou une suggestion ? Écrivez-nous.
            </p>
          </div>
        </div>

        {/* Card email avec gradient border */}
        <div className="mb-10 rounded-xl bg-gradient-to-r from-violet-500/50 to-blue-500/50 p-[1px]">
          <div className="flex items-center gap-3 rounded-xl bg-[#151D2E] p-5">
            <Mail className="size-5 shrink-0 text-violet-400" />
            <a
              href="mailto:contact@multitasks.fr"
              className="text-violet-400 hover:text-violet-300"
            >
              contact@multitasks.fr
            </a>
          </div>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            role="status"
            aria-live="polite"
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center"
          >
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-500/20 shadow-lg shadow-emerald-500/20">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
              >
                <Check className="size-8 text-emerald-400" />
              </motion.div>
            </div>
            <p className="text-lg font-semibold text-emerald-400">
              Votre client email a été ouvert avec le message pré-rempli.
            </p>
            <p className="mt-2 text-neutral-400">
              Si rien ne s&apos;est passé, envoyez directement un email à
              contact@multitasks.fr.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="mb-2 block text-sm text-neutral-300">
                Votre email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                aria-required="true"
                placeholder="vous@exemple.com"
                className="border-[#1E293B] bg-[#151D2E] text-white placeholder:text-neutral-500 focus:ring-violet-500"
              />
            </div>

            <div>
              <Label htmlFor="subject" className="mb-2 block text-sm text-neutral-300">
                Sujet
              </Label>
              <Input
                id="subject"
                name="subject"
                required
                aria-required="true"
                placeholder="Question sur..."
                className="border-[#1E293B] bg-[#151D2E] text-white placeholder:text-neutral-500 focus:ring-violet-500"
              />
            </div>

            <div>
              <Label htmlFor="message" className="mb-2 block text-sm text-neutral-300">
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                required
                aria-required="true"
                rows={5}
                placeholder="Décrivez votre demande..."
                className="border-[#1E293B] bg-[#151D2E] text-white placeholder:text-neutral-500 focus:ring-violet-500"
              />
            </div>

            <Button
              type="submit"
              disabled={sending}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 py-6 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30"
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
        )}
      </div>
    </motion.main>
  );
}
