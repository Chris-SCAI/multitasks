"use client";

import { useState } from "react";
import { Search, MoreHorizontal, Trash2 } from "lucide-react";
import { getMockUsers, type MockUser } from "@/lib/admin/mock-data";
import { PlanBadge } from "@/components/pricing/PlanBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdminUserManagement() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<MockUser[]>(getMockUsers);
  const [changePlanUser, setChangePlanUser] = useState<MockUser | null>(null);
  const [newPlan, setNewPlan] = useState<MockUser["plan"]>("free");
  const [deleteUser, setDeleteUser] = useState<MockUser | null>(null);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleChangePlan() {
    if (!changePlanUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === changePlanUser.id ? { ...u, plan: newPlan } : u
      )
    );
    setChangePlanUser(null);
  }

  function handleDelete() {
    if (!deleteUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
    setDeleteUser(null);
  }

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-400">
        <span className="size-1.5 rounded-full bg-amber-400" />
        Données de démonstration
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un utilisateur..."
          className="border-[#1E293B] bg-[#0B1120] pl-10 text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-violet-500/20"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#1E293B]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1E293B] bg-[#0B1120]">
              <th className="px-4 py-3 text-left font-semibold text-neutral-400">
                Nom
              </th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-400">
                Email
              </th>
              <th className="px-4 py-3 text-left font-semibold text-neutral-400">
                Plan
              </th>
              <th className="hidden px-4 py-3 text-left font-semibold text-neutral-400 sm:table-cell">
                Tâches
              </th>
              <th className="hidden px-4 py-3 text-left font-semibold text-neutral-400 md:table-cell">
                Dernière activité
              </th>
              <th className="px-4 py-3 text-right font-semibold text-neutral-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr
                key={user.id}
                className="border-b border-[#1E293B] transition-colors hover:bg-[#1C2640]"
              >
                <td className="px-4 py-3 font-medium text-white">
                  {user.name}
                </td>
                <td className="px-4 py-3 text-neutral-400">{user.email}</td>
                <td className="px-4 py-3">
                  <PlanBadge planId={user.plan} size="sm" />
                </td>
                <td className="hidden px-4 py-3 text-neutral-300 sm:table-cell">
                  {user.tasksCount}
                </td>
                <td className="hidden px-4 py-3 text-neutral-400 md:table-cell">
                  {user.lastActive}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-8 p-0 text-neutral-400 hover:bg-[#1C2640] hover:text-white"
                      onClick={() => {
                        setChangePlanUser(user);
                        setNewPlan(user.plan);
                      }}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-8 p-0 text-neutral-400 hover:bg-red-500/10 hover:text-red-400"
                      onClick={() => setDeleteUser(user)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-neutral-500"
                >
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog changer plan */}
      <Dialog
        open={!!changePlanUser}
        onOpenChange={() => setChangePlanUser(null)}
      >
        <DialogContent className="border-[#1E293B] bg-[#151D2E]">
          <DialogHeader>
            <DialogTitle className="text-white">Changer de plan</DialogTitle>
            <DialogDescription className="text-neutral-300">
              Modifier le plan de {changePlanUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <Select
            value={newPlan}
            onValueChange={(v) => setNewPlan(v as MockUser["plan"])}
          >
            <SelectTrigger className="w-full border-[#1E293B] bg-[#0B1120] text-white focus:ring-2 focus:ring-violet-500/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-[#1E293B] bg-[#151D2E]">
              <SelectItem value="free">Gratuit</SelectItem>
              <SelectItem value="etudiant">Étudiant</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="equipe">Équipe</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button
              variant="ghost"
              className="text-white hover:bg-[#1C2640]"
              onClick={() => setChangePlanUser(null)}
            >
              Annuler
            </Button>
            <Button
              className="bg-gradient-to-r from-violet-500 to-blue-500 text-white"
              onClick={handleChangePlan}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog supprimer */}
      <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <DialogContent className="border-[#1E293B] bg-[#151D2E]">
          <DialogHeader>
            <DialogTitle className="text-red-400">
              Supprimer l&apos;utilisateur
            </DialogTitle>
            <DialogDescription className="text-neutral-300">
              Êtes-vous sûr de vouloir supprimer {deleteUser?.name} ? Cette
              action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              className="text-white hover:bg-[#1C2640]"
              onClick={() => setDeleteUser(null)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
