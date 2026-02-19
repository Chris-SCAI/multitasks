"use client";

import { useState } from "react";
import { Crown, Trash2, Plus } from "lucide-react";
import { useAdminStore } from "@/stores/admin-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AdminVIPManager() {
  const { vipEmails, addVIPEmail, removeVIPEmail } = useAdminStore();
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!EMAIL_REGEX.test(email)) {
      setError("Adresse email invalide.");
      return;
    }

    if (vipEmails.some((v) => v.email === email.toLowerCase())) {
      setError("Cet email est déjà VIP.");
      return;
    }

    addVIPEmail(email, note || undefined);
    setEmail("");
    setNote("");
  }

  return (
    <div className="space-y-6">
      {/* VIP Card */}
      <div className="relative rounded-2xl">
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-amber-500/30 via-amber-500/10 to-transparent" />
        <div className="relative overflow-hidden rounded-2xl bg-[#151D2E] p-6 md:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 size-40 rounded-full bg-amber-500 opacity-[0.04] blur-3xl" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30">
                <Crown className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Comptes VIP
                </h3>
                <p className="text-sm text-neutral-400">
                  Les comptes VIP reçoivent automatiquement le plan Pro
                  gratuitement.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-400">
              {vipEmails.length} actif{vipEmails.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Formulaire ajout */}
          <form onSubmit={handleAdd} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-neutral-300">
                  Email
                </Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vip@example.com"
                  className="border-[#1E293B] bg-[#0B1120] text-white placeholder:text-neutral-500 focus:border-amber-500 focus:ring-amber-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-neutral-300">
                  Note (optionnel)
                </Label>
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Raison du VIP..."
                  className="border-[#1E293B] bg-[#0B1120] text-white placeholder:text-neutral-500 focus:border-amber-500 focus:ring-amber-500/20"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/40"
                >
                  <Plus className="size-4" />
                  Ajouter
                </Button>
              </div>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </form>
        </div>
      </div>

      {/* Tableau VIP */}
      {vipEmails.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-[#1E293B]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0B1120]">
                <th className="px-4 py-3 text-left font-semibold text-neutral-400">
                  Email
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-neutral-400 sm:table-cell">
                  Note
                </th>
                <th className="hidden px-4 py-3 text-left font-semibold text-neutral-400 md:table-cell">
                  Date d&apos;ajout
                </th>
                <th className="px-4 py-3 text-right font-semibold text-neutral-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {vipEmails.map((vip) => (
                <tr
                  key={vip.email}
                  className="border-b border-[#1E293B] transition-colors hover:bg-[#1C2640]"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {vip.email}
                  </td>
                  <td className="hidden px-4 py-3 text-neutral-400 sm:table-cell">
                    {vip.note || "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-neutral-400 md:table-cell">
                    {new Date(vip.addedAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-8 p-0 text-neutral-400 hover:bg-red-500/10 hover:text-red-400"
                      onClick={() => removeVIPEmail(vip.email)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {vipEmails.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#1E293B] p-8 text-center">
          <Crown className="mx-auto size-8 text-neutral-600" />
          <p className="mt-2 text-neutral-500">
            Aucun compte VIP pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}
