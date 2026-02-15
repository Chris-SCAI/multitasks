"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/db/supabase-client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError("Supabase n'est pas configuré.");
      return;
    }

    if (!name || !email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message === "User already registered"
          ? "Un compte existe déjà avec cet email."
          : "Une erreur est survenue. Veuillez réessayer.");
        return;
      }

      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-screen items-center justify-center bg-[#0B1120] px-4"
    >
      {/* Glow mesh background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[500px] w-[600px] rounded-full bg-violet-600/5 blur-[120px]" />
        </div>
      </div>

      <div className="relative w-full max-w-md space-y-8">
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

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="relative overflow-hidden rounded-2xl border border-[#1E293B] bg-[#151D2E] p-6 shadow-2xl shadow-violet-500/5"
        >
          {/* Internal glow */}
          <div className="pointer-events-none absolute -right-16 -top-16 size-32 rounded-full bg-violet-600 opacity-[0.04] blur-3xl" />

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              role="status"
              aria-live="polite"
              className="space-y-4 text-center"
            >
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/20 shadow-lg shadow-emerald-500/20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                >
                  <Check className="size-8 text-emerald-400" />
                </motion.div>
              </div>
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                <p className="text-base font-semibold text-green-400">
                  Compte créé avec succès !
                </p>
                <p className="mt-2 text-sm text-green-400/80">
                  Un email de confirmation a été envoyé à <strong>{email}</strong>.
                  Vérifiez votre boîte de réception pour activer votre compte.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-block text-sm font-semibold text-violet-400 hover:text-violet-300"
              >
                Retour à la connexion
              </Link>
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div id="register-error" role="alert" aria-live="assertive" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4" aria-describedby={error ? "register-error" : undefined}>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold text-white">Nom</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    disabled={loading}
                    aria-required="true"
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
                    disabled={loading}
                    aria-required="true"
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
                    disabled={loading}
                    aria-required="true"
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
                    disabled={loading}
                    aria-required="true"
                    className="border-[#1E293B] bg-[#0B1120] text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500/20"
                  />
                </div>

                <Button
                  type="submit"
                  className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-blue-500 text-lg font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30"
                  size="lg"
                  disabled={loading}
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Création...
                      </>
                    ) : (
                      "Créer mon compte"
                    )}
                  </span>
                </Button>
              </form>
            </>
          )}
        </motion.div>

        {!success && (
          <p className="text-center text-base font-semibold text-white">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-bold text-violet-400 hover:text-violet-300"
            >
              Se connecter
            </Link>
          </p>
        )}
      </div>
    </motion.div>
  );
}
