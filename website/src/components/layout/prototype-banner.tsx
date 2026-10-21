import Link from "next/link";
import { FlaskConical } from "lucide-react";

export function PrototypeBanner() {
  return (
    <div className="relative z-[51] bg-navy text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1.5 text-center text-[11.5px] font-medium sm:px-6">
        <FlaskConical className="hidden h-3.5 w-3.5 shrink-0 text-sky sm:block" />
        <span className="text-white/85">
          Prototype konsep akademik tidak resmi untuk BCDC 2026 — bukan situs resmi Terang AI. Semua data simulasi bersifat ilustratif.
        </span>
        <Link href="/references" className="hidden shrink-0 font-semibold text-sky underline-offset-2 hover:underline md:inline">
          Pelajari sumber
        </Link>
      </div>
    </div>
  );
}
