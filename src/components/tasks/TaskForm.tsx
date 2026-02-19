"use client";

import { useState } from "react";
import type { Task, CreateTaskInput, Domain, TaskPriority } from "@/types";
import type { RecurrenceFrequency } from "@/types/task";
import { RECURRENCE_LABELS } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DomainSelector } from "@/components/domains/DomainSelector";
import {
  ListPlus,
  Pencil,
  Type,
  AlignLeft,
  CalendarDays,
  Clock,
  Plus,
  Check,
  Loader2,
  Flag,
  FolderOpen,
  Repeat,
} from "lucide-react";

const PRIORITY_DOT_COLORS: Record<TaskPriority, string> = {
  low: "bg-neutral-400",
  medium: "bg-blue-400",
  high: "bg-orange-400",
  urgent: "bg-red-400",
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
  urgent: "Urgente",
};

/* Styles explicites dark — ne dépendent PAS du dark: prefix */
const fieldClasses =
  "border-[#1E293B] bg-[#0B1120] text-white placeholder:text-neutral-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

interface TaskFormProps {
  mode: "create" | "edit";
  task?: Task;
  domains: Domain[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreateTaskInput) => Promise<void>;
}

export function TaskForm({
  mode,
  task,
  domains,
  open,
  onOpenChange,
  onSubmit,
}: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? "medium"
  );
  const [domainId, setDomainId] = useState(
    task?.domainId ?? domains[0]?.id ?? ""
  );
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    task?.estimatedMinutes?.toString() ?? ""
  );
  const [recurrence, setRecurrence] = useState<RecurrenceFrequency | "none">(
    task?.recurrenceRule?.frequency ?? "none"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !domainId) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        domainId,
        dueDate: dueDate || null,
        estimatedMinutes: estimatedMinutes
          ? parseInt(estimatedMinutes, 10)
          : null,
        recurrenceRule: recurrence && recurrence !== "none" ? { frequency: recurrence } : null,
      });
      if (mode === "create") {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate("");
        setEstimatedMinutes("");
        setRecurrence("none");
      }
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isCreate = mode === "create";
  const HeaderIcon = isCreate ? ListPlus : Pencil;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden border-[#1E293B] bg-[#151D2E] p-0 text-white">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 pt-6 pb-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/25">
            <HeaderIcon className="size-6 text-white" />
          </div>
          <DialogHeader className="flex-1 gap-0 space-y-0 text-left">
            <DialogTitle asChild>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {isCreate ? "Nouvelle tâche" : "Modifier la tâche"}
              </h2>
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-400">
              {isCreate
                ? "Décrivez ce que vous devez accomplir"
                : "Mettez à jour les détails de cette tâche"}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Séparateur header */}
        <div className="mx-6 h-px bg-gradient-to-r from-violet-500/20 via-[#1E293B] to-blue-500/20" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pt-5 pb-6">
          <div className="space-y-5">
            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="task-title" className="text-sm font-bold text-neutral-300">
                Titre de la tâche
              </Label>
              <div className="relative">
                <Type className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                <Input
                  id="task-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Que devez-vous faire ?"
                  maxLength={200}
                  required
                  className={`pl-10 ${fieldClasses}`}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="task-description" className="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-300">
                <AlignLeft className="size-3.5" />
                Description
              </Label>
              <Textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ajoutez des notes ou détails..."
                maxLength={2000}
                rows={3}
                className={fieldClasses}
              />
            </div>

            {/* Priorité + Domaine */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-300">
                  <Flag className="size-3.5" />
                  Priorité
                </Label>
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as TaskPriority)}
                >
                  <SelectTrigger className={`w-full ${fieldClasses}`}>
                    <SelectValue>
                      <span className="flex items-center gap-2">
                        <span className={`size-2 shrink-0 rounded-full ${PRIORITY_DOT_COLORS[priority]}`} />
                        <span className={priority === "urgent" ? "text-red-400" : ""}>
                          {PRIORITY_LABELS[priority]}
                        </span>
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="border-[#1E293B] bg-[#151D2E] text-white">
                    <SelectItem value="low">
                      <span className="flex items-center gap-2">
                        <span className="size-2 shrink-0 rounded-full bg-neutral-400" />
                        Basse
                      </span>
                    </SelectItem>
                    <SelectItem value="medium">
                      <span className="flex items-center gap-2">
                        <span className="size-2 shrink-0 rounded-full bg-blue-400" />
                        Moyenne
                      </span>
                    </SelectItem>
                    <SelectItem value="high">
                      <span className="flex items-center gap-2">
                        <span className="size-2 shrink-0 rounded-full bg-orange-400" />
                        Haute
                      </span>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <span className="flex items-center gap-2 text-red-400">
                        <span className="size-2 shrink-0 rounded-full bg-red-400" />
                        Urgente
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-300">
                  <FolderOpen className="size-3.5" />
                  Domaine
                </Label>
                <DomainSelector
                  domains={domains}
                  value={domainId}
                  onChange={setDomainId}
                  triggerClassName={fieldClasses}
                />
              </div>
            </div>

            {/* Échéance + Durée */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="task-due-date" className="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-300">
                  <CalendarDays className="size-3.5" />
                  Échéance
                </Label>
                <Input
                  id="task-due-date"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={fieldClasses}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-estimated" className="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-300">
                  <Clock className="size-3.5" />
                  Durée (min)
                </Label>
                <Input
                  id="task-estimated"
                  type="number"
                  min={0}
                  max={480}
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(e.target.value)}
                  placeholder="30"
                  className={fieldClasses}
                />
              </div>
            </div>

            {/* Récurrence */}
            <div className="space-y-2">
              <Label className="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-300">
                <Repeat className="size-3.5" />
                Récurrence
              </Label>
              <Select
                value={recurrence}
                onValueChange={(v) => setRecurrence(v as RecurrenceFrequency | "none")}
              >
                <SelectTrigger className={`w-full ${fieldClasses}`}>
                  <SelectValue placeholder="Aucune récurrence" />
                </SelectTrigger>
                <SelectContent className="border-[#1E293B] bg-[#151D2E] text-white">
                  <SelectItem value="none">
                    Aucune récurrence
                  </SelectItem>
                  {(Object.entries(RECURRENCE_LABELS) as [RecurrenceFrequency, string][]).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        <span className="flex items-center gap-2">
                          <Repeat className="size-3.5 text-violet-400" />
                          {label}
                        </span>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#1E293B] pt-5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-neutral-400 hover:bg-white/5 hover:text-white"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !domainId || isSubmitting}
              className="group relative overflow-hidden bg-gradient-to-r from-violet-500 to-blue-500 px-6 font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/40 disabled:opacity-50 disabled:shadow-none"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {isCreate ? "Ajout..." : "Modification..."}
                  </>
                ) : (
                  <>
                    {isCreate ? <Plus className="size-4" /> : <Check className="size-4" />}
                    {isCreate ? "Ajouter la tâche" : "Enregistrer"}
                  </>
                )}
              </span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
