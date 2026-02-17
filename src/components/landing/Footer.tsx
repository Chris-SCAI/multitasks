import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#1E293B] bg-[#080c17] px-6 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-screen-2xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-3">
              <Sparkles className="size-6 text-yellow-400" />
              <span className="text-2xl font-bold">
                <span className="text-white">Multi</span>
                <span className="text-violet-400">Tasks</span>
              </span>
            </div>
            <p className="mt-2 text-base text-neutral-500">
              Fait en France
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-base">
            <Link
              href="/legal/cgu"
              className="text-neutral-500 transition-colors hover:text-neutral-300"
            >
              CGU
            </Link>
            <Link
              href="/legal/privacy"
              className="text-neutral-500 transition-colors hover:text-neutral-300"
            >
              Confidentialité
            </Link>
            <Link
              href="/contact"
              className="text-neutral-500 transition-colors hover:text-neutral-300"
            >
              Contact
            </Link>
            <Link
              href="/guide"
              className="text-neutral-500 transition-colors hover:text-neutral-300"
            >
              Guide
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-[#1E293B] pt-10 text-center text-base text-neutral-600">
          <p>&copy; 2026 Multitasks. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
