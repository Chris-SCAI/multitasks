"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1120] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex items-center gap-2.5">
            <Sparkles className="size-7 text-yellow-400" />
            <span className="text-4xl font-bold">
              <span className="text-white">Multi</span>
              <span className="text-violet-400">Tasks</span>
            </span>
          </div>
          <p className="text-lg font-semibold text-white">
            Créez votre compte gratuitement
          </p>
        </div>

        <div className="rounded-2xl border border-[#1E293B] bg-[#151D2E] p-6 shadow-lg">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold text-white">Nom</Label>
              <Input
                id="name"
                type="text"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="border-[#1E293B] bg-[#0B1120] text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email" className="text-base font-semibold text-white">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="vous@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="border-[#1E293B] bg-[#0B1120] text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password" className="text-base font-semibold text-white">Mot de passe</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="Min. 8 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="border-[#1E293B] bg-[#0B1120] text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-base font-semibold text-white">
                Confirmer le mot de passe
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirmez votre mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="border-[#1E293B] bg-[#0B1120] text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500/20"
              />
            </div>

            <Button type="submit" className="w-full rounded-full bg-violet-600 text-lg font-semibold text-white hover:bg-violet-500" size="lg">
              Créer mon compte
            </Button>
          </form>
        </div>

        <p className="text-center text-base font-semibold text-white">
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="font-bold text-violet-400 hover:text-violet-300"
          >
            Se connecter
          </Link>
        </p>

        <p className="text-center text-sm font-semibold text-neutral-400">
          En mode local, pas d&apos;authentification requise.
        </p>
      </div>
    </div>
  );
}
