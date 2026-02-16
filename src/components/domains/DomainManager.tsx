"use client";

import { useState } from "react";
import type { Domain, CreateDomainInput, UpdateDomainInput } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Plus, Folder } from "lucide-react";
import { useSubscriptionStore } from "@/stores/subscription-store";

interface DomainManagerProps {
  domains: Domain[];
  onCreateDomain: (input: CreateDomainInput) => Promise<Domain>;
  onUpdateDomain: (id: string, input: UpdateDomainInput) => Promise<void>;
  onDeleteDomain: (id: string) => Promise<void>;
}

export function DomainManager({
  domains,
  onCreateDomain,
  onUpdateDomain,
  onDeleteDomain,
}: DomainManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [icon, setIcon] = useState("folder");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

  const planConfig = useSubscriptionStore((s) => s.getPlanConfig());
  const maxDomains = planConfig.limits.domains ?? Infinity;
  const canAdd = domains.length < maxDomains;

  async function handleCreate() {
    if (!name.trim()) return;
    await onCreateDomain({ name: name.trim(), color, icon });
    setName("");
    setColor("#3B82F6");
    setIcon("folder");
    setIsOpen(false);
  }

  async function handleDelete(id: string) {
    await onDeleteDomain(id);
    setDeleteConfirmId(null);
  }

  function startEdit(domain: Domain) {
    setEditId(domain.id);
    setEditName(domain.name);
    setEditColor(domain.color);
  }

  async function handleUpdate() {
    if (!editId || !editName.trim()) return;
    await onUpdateDomain(editId, { name: editName.trim(), color: editColor });
    setEditId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Domaines</h3>
        <span className="text-neutral-300 text-base">
          {domains.length}/{maxDomains === Infinity ? "∞" : maxDomains} domaines ({planConfig.name.toLowerCase()})
        </span>
      </div>

      <div className="space-y-2">
        {domains.map((domain) => (
          <div
            key={domain.id}
            className="group/card relative rounded-xl"
          >
            {/* Gradient border tinted with domain color */}
            <div
              className="absolute -inset-px rounded-xl opacity-30 transition-opacity duration-300 group-hover/card:opacity-60"
              style={{
                background: `linear-gradient(to bottom, ${domain.color}40, transparent)`,
              }}
            />
            <div
              className="relative flex items-center gap-4 rounded-xl bg-[#151D2E] p-4 transition-all duration-200 group-hover/card:shadow-md"
              style={{ backgroundColor: `${domain.color}08` }}
            >
              {/* Color dot with glow */}
              <span
                className="size-7 shrink-0 rounded-lg"
                style={{
                  backgroundColor: domain.color,
                  boxShadow: `0 0 16px ${domain.color}40`,
                }}
              />

              {editId === domain.id ? (
                <div className="flex flex-1 items-center gap-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-8 text-lg border-[#1E293B] bg-[#0B1120] text-white focus:border-violet-500"
                  />
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="h-7 w-8 cursor-pointer rounded border-0"
                  />
                  <Button size="xs" onClick={handleUpdate}>
                    OK
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => setEditId(null)}
                  >
                    Annuler
                  </Button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className="flex-1 text-left text-lg font-medium text-white transition-colors hover:text-violet-300"
                    onClick={() => startEdit(domain)}
                  >
                    {domain.name}
                  </button>

                  {domains.length > 1 && (
                    <>
                      {deleteConfirmId === domain.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            size="xs"
                            variant="destructive"
                            onClick={() => handleDelete(domain.id)}
                          >
                            Confirmer
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => setDeleteConfirmId(null)}
                          >
                            Annuler
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          aria-label="Supprimer le domaine"
                          onClick={() => setDeleteConfirmId(domain.id)}
                          className="opacity-0 transition-opacity group-hover/card:opacity-100"
                        >
                          <Trash2 className="size-4 text-neutral-300" />
                        </Button>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="group relative w-full overflow-hidden border-dashed border-[#1E293B] transition-all hover:border-violet-500/50 hover:bg-violet-500/5 hover:text-violet-400"
            disabled={!canAdd}
          >
            <Plus className="size-5 transition-transform group-hover:rotate-90" />
            Ajouter un domaine
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau domaine</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain-name">Nom</Label>
              <Input
                id="domain-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Sport, Famille..."
                maxLength={50}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain-color">Couleur</Label>
              <div className="flex items-center gap-3">
                <input
                  id="domain-color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border-0"
                />
                <span className="text-neutral-300 text-base">{color}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain-icon">Icône</Label>
              <div className="flex items-center gap-2">
                <Folder className="text-neutral-300 size-5" />
                <Input
                  id="domain-icon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="folder"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreate} disabled={!name.trim()}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
