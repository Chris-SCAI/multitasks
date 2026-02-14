"use client";

import { X, Download } from "lucide-react";

interface InstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export function InstallPrompt({ onInstall, onDismiss }: InstallPromptProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe animate-in slide-in-from-bottom duration-300">
      <div className="mx-auto max-w-md rounded-2xl border border-[#1E293B] bg-gradient-to-br from-violet-500 to-blue-500 p-1 shadow-2xl">
        <div className="rounded-xl bg-[#151D2E] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <Download className="h-5 w-5 text-violet-400" />
                <h3 className="font-semibold text-white">
                  Installer Multitasks
                </h3>
              </div>
              <p className="text-base text-neutral-300">
                Accédez à vos tâches instantanément, même hors ligne
              </p>
            </div>
            <button
              onClick={onDismiss}
              className="rounded-lg p-1 text-neutral-400 transition-colors hover:bg-[#1C2640] hover:text-white"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={onInstall}
            className="mt-4 w-full rounded-lg bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
          >
            Installer l'application
          </button>
        </div>
      </div>
    </div>
  );
}
