"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const subject = encodeURIComponent(String(data.get("subject") || "Contact Multitasks"));
    const body = encodeURIComponent(
      `De : ${data.get("email")}\n\n${data.get("message")}`,
    );
    window.location.href = `mailto:contact@multitasks.fr?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <main className="min-h-screen bg-[#0B1120] px-6 py-20 text-neutral-100 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-xl">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-neutral-400 transition-colors hover:text-white"
        >
          &larr; Retour
        </Link>

        <h1 className="mb-4 text-4xl font-bold text-white">Contact</h1>
        <p className="mb-10 text-lg text-neutral-400">
          Une question, un probleme ou une suggestion ? Ecrivez-nous.
        </p>

        <div className="mb-10 flex items-center gap-3 rounded-xl border border-[#1E293B] bg-[#151D2E] p-5">
          <Mail className="size-5 shrink-0 text-violet-400" />
          <a
            href="mailto:contact@multitasks.fr"
            className="text-violet-400 hover:text-violet-300"
          >
            contact@multitasks.fr
          </a>
        </div>

        {sent ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center">
            <p className="text-lg font-semibold text-emerald-400">
              Votre client email a ete ouvert avec le message pre-rempli.
            </p>
            <p className="mt-2 text-neutral-400">
              Si rien ne s&apos;est passe, envoyez directement un email a
              contact@multitasks.fr.
            </p>
          </div>
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
                rows={5}
                placeholder="Decrivez votre demande..."
                className="border-[#1E293B] bg-[#151D2E] text-white placeholder:text-neutral-500 focus:ring-violet-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl bg-violet-600 py-6 text-base font-semibold text-white hover:bg-violet-500"
            >
              <Send className="mr-2 size-4" />
              Envoyer
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
