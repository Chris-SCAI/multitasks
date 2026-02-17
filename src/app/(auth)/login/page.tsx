"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Sparkles, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/db/supabase-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const supabase = createClient();
    if (!supabase) {
      setError("Supabase n'est pas configuré.");
      return;
    }

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect."
          : "Une erreur de connexion est survenue. Veuillez réessayer.");
        return;
      }

      // Sync immédiate pour que le Header affiche le nom dès le premier rendu
      if (data.user) {
        const name =
          data.user.user_metadata?.display_name ??
          data.user.user_metadata?.full_name ??
          data.user.user_metadata?.name;
        if (name) localStorage.setItem("displayName", name);
        if (data.user.email) localStorage.setItem("multitasks-user-email", data.user.email);
      }

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink() {
    setError(null);
    setMessage(null);

    const supabase = createClient();
    if (!supabase) {
      setError("Supabase n'est pas configuré.");
      return;
    }

    if (!email) {
      setError("Veuillez saisir votre email pour recevoir le magic link.");
      return;
    }

    setMagicLinkLoading(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (otpError) {
        setError(otpError.message.startsWith("For security purposes")
          ? "Veuillez patienter 60 secondes avant de renvoyer un lien."
          : "Impossible d'envoyer le magic link. Veuillez réessayer.");
        return;
      }

      setMessage("Un lien de connexion a été envoyé à votre email.");
    } finally {
      setMagicLinkLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError(null);
    setMessage(null);

    const supabase = createClient();
    if (!supabase) {
      setError("Supabase n'est pas configuré.");
      return;
    }

    if (!email) {
      setError("Veuillez saisir votre email pour réinitialiser votre mot de passe.");
      return;
    }

    setResetLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings`,
      });

      if (resetError) {
        setError(resetError.message.startsWith("For security purposes")
          ? "Veuillez patienter avant de renvoyer un email."
          : "Impossible d'envoyer l'email de réinitialisation.");
        return;
      }

      setMessage("Un email de réinitialisation a été envoyé. Vérifiez votre boîte de réception.");
    } finally {
      setResetLoading(false);
    }
  }

  const isAnyLoading = loading || magicLinkLoading || resetLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-lg space-y-8"
    >
      {/* Logo with gradient text */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}
          className="mb-4 flex items-center gap-2.5"
        >
          <Sparkles className="size-10 text-yellow-400" />
          <span className="text-4xl font-bold">
            <span className="text-white">Multi</span>
            <span className="text-violet-400">Tasks</span>
          </span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-semibold text-neutral-300"
        >
          Connectez-vous à votre compte
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
        <div className="relative overflow-hidden rounded-2xl bg-[#151D2E] p-8">
          {/* Internal glow effects */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-40 rounded-full bg-violet-600 opacity-[0.06] blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 size-32 rounded-full bg-blue-600 opacity-[0.04] blur-3xl" />

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div id="login-error" role="alert" aria-live="assertive" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                key="message"
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div role="status" aria-live="polite" className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
                  {message}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4" aria-describedby={error ? "login-error" : undefined}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold text-white">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={isAnyLoading}
                  aria-required="true"
                  className="border-[#1E293B] bg-[#0B1120] pl-10 text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500/20"
                />
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-base font-semibold text-white">Mot de passe</Label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isAnyLoading}
                  className="text-sm font-semibold text-violet-400 hover:text-violet-300 disabled:opacity-50"
                >
                  {resetLoading ? "Envoi..." : "Mot de passe oublié ?"}
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={isAnyLoading}
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
              disabled={isAnyLoading}
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </span>
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <Separator className="flex-1 bg-[#1E293B]" />
            <span className="text-base font-semibold text-neutral-400">ou</span>
            <Separator className="flex-1 bg-[#1E293B]" />
          </div>

          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full border border-[#1E293B] text-lg font-semibold text-white transition-all hover:border-violet-500/30 hover:bg-violet-500/5 hover:text-white"
              size="lg"
              onClick={handleMagicLink}
              disabled={isAnyLoading}
            >
              {magicLinkLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Mail className="size-5 text-violet-400" />
              )}
              Magic link
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-base font-semibold text-neutral-400"
      >
        Pas de compte ?{" "}
        <Link
          href="/register"
          className="font-bold text-violet-400 transition-colors hover:text-violet-300"
        >
          S&apos;inscrire
        </Link>
      </motion.p>
    </motion.div>
  );
}
