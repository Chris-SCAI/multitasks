"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Sparkles, Loader2 } from "lucide-react";
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
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect."
          : signInError.message);
        return;
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
        setError(otpError.message);
        return;
      }

      setMessage("Un lien de connexion a été envoyé à votre email.");
    } finally {
      setMagicLinkLoading(false);
    }
  }

  const isAnyLoading = loading || magicLinkLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1120] px-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex items-center gap-2.5">
            <Sparkles className="size-7 text-yellow-400" />
            <span className="text-4xl font-bold">
              <span className="text-white">Multi</span>
              <span className="text-violet-400">Tasks</span>
            </span>
          </div>
          <p className="text-lg font-semibold text-white">
            Connectez-vous à votre compte
          </p>
        </div>

        <div className="rounded-2xl border border-[#1E293B] bg-[#151D2E] p-8 shadow-lg">
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isAnyLoading}
                className="border-[#1E293B] bg-[#0B1120] text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-base font-semibold text-white">Mot de passe</Label>
                <button
                  type="button"
                  className="text-sm font-semibold text-violet-400 hover:text-violet-300"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isAnyLoading}
                className="border-[#1E293B] bg-[#0B1120] text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full bg-violet-600 text-lg font-semibold text-white hover:bg-violet-500"
              size="lg"
              disabled={isAnyLoading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <Separator className="flex-1 bg-[#1E293B]" />
            <span className="text-base font-semibold text-white">ou</span>
            <Separator className="flex-1 bg-[#1E293B]" />
          </div>

          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full text-lg font-semibold text-white hover:bg-[#1C2640] hover:text-white"
              size="lg"
              onClick={handleMagicLink}
              disabled={isAnyLoading}
            >
              {magicLinkLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Mail className="size-5" />
              )}
              Magic link
            </Button>
          </div>
        </div>

        <p className="text-center text-base font-semibold text-white">
          Pas de compte ?{" "}
          <Link
            href="/register"
            className="font-bold text-violet-400 hover:text-violet-300"
          >
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
