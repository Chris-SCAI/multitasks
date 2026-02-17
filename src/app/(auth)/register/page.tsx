"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Check, User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/db/supabase-client";

const PASSWORD_RULES = [
  { label: "8 caractères minimum", test: (p: string) => p.length >= 8 },
  { label: "1 majuscule", test: (p: string) => /[A-Z]/.test(p) },
  { label: "1 chiffre", test: (p: string) => /\d/.test(p) },
  { label: "1 caractère spécial", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function isPasswordValid(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

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

    if (!isPasswordValid(password)) {
      setError("Le mot de passe ne respecte pas les critères de sécurité.");
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-md space-y-8"
    >
      {/* Logo with gradient text */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}
          className="mb-4 flex items-center gap-2.5"
        >
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/30">
            <Sparkles className="size-6 text-white" />
          </div>
          <span className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Multi</span>
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Tasks</span>
          </span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-semibold text-neutral-300"
        >
          Créez votre compte gratuitement
        </motion.p>
      </div>

      {/* Card with animated gradient border */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15, type: "spring", stiffness: 100 }}
        className="relative rounded-2xl"
      >
        {/* Animated gradient border */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-violet-500/50 via-blue-500/20 to-transparent" />

        {/* Card content */}
        <div className="relative overflow-hidden rounded-2xl bg-[#151D2E] p-6">
          {/* Internal glow effects */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-40 rounded-full bg-violet-600 opacity-[0.06] blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 size-32 rounded-full bg-blue-600 opacity-[0.04] blur-3xl" />

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              role="status"
              aria-live="polite"
              className="space-y-6 py-4 text-center"
            >
              <div className="relative mx-auto flex size-20 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl" />
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
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold text-white"
                >
                  Compte créé avec succès !
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-2 text-sm text-neutral-300"
                >
                  Un email de confirmation a été envoyé à{" "}
                  <strong className="text-violet-400">{email}</strong>.
                  <br />
                  Vérifiez votre boîte de réception pour activer votre compte.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/40"
                >
                  Retour à la connexion
                </Link>
              </motion.div>
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
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      placeholder="Votre nom"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      disabled={loading}
                      aria-required="true"
                      className="border-[#1E293B] bg-[#0B1120] pl-10 text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500/20"
                    />
                    <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-base font-semibold text-white">Email</Label>
                  <div className="relative">
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="vous@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      disabled={loading}
                      aria-required="true"
                      className="border-[#1E293B] bg-[#0B1120] pl-10 text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500/20"
                    />
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-base font-semibold text-white">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Min. 8 caractères"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      disabled={loading}
                      aria-required="true"
                      className="border-[#1E293B] bg-[#0B1120] pl-10 text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500/20"
                    />
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                  </div>
                  {/* Password strength indicators */}
                  {password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="grid grid-cols-2 gap-1.5 pt-1"
                    >
                      {PASSWORD_RULES.map((rule) => {
                        const passed = rule.test(password);
                        return (
                          <div
                            key={rule.label}
                            className={`flex items-center gap-1.5 text-xs transition-colors ${
                              passed ? "text-emerald-400" : "text-neutral-500"
                            }`}
                          >
                            <div
                              className={`flex size-3.5 items-center justify-center rounded-full transition-colors ${
                                passed
                                  ? "bg-emerald-500/20"
                                  : "bg-neutral-700/50"
                              }`}
                            >
                              {passed && <Check className="size-2.5" />}
                            </div>
                            {rule.label}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-base font-semibold text-white">
                    Confirmer le mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirmez votre mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      disabled={loading}
                      aria-required="true"
                      className="border-[#1E293B] bg-[#0B1120] pl-10 text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500/20"
                    />
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-blue-500 py-6 text-lg font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/40"
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
        </div>
      </motion.div>

      {!success && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-base font-semibold text-neutral-400"
        >
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="font-bold text-violet-400 transition-colors hover:text-violet-300"
          >
            Se connecter
          </Link>
        </motion.p>
      )}
    </motion.div>
  );
}
