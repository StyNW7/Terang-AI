import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { T } from "@/lib/i18n";

export function PrototypeBanner() {
  return (
    <div className="relative z-[51] bg-navy-deep text-white">
      <div className="mx-auto flex h-8 max-w-7xl items-center justify-center gap-2 px-4 text-center text-xs sm:px-6">
        <FlaskConical className="hidden h-3.5 w-3.5 shrink-0 text-sky sm:block" />
        <span className="truncate text-white/80">
          <span className="sm:hidden">
            <T id="Prototipe konsep BCDC 2026" en="BCDC 2026 concept prototype" />
          </span>
          <span className="hidden sm:inline">
            <T
              id="Prototipe konsep interaktif untuk BCDC 2026 · angka & data simulasi bersifat ilustratif"
              en="Interactive concept prototype for BCDC 2026 · simulated figures & data are illustrative"
            />
          </span>
        </span>
        <Link href="/references" className="hidden shrink-0 font-medium text-sky underline-offset-2 hover:underline md:inline">
          <T id="Sumber & asumsi" en="Sources & assumptions" />
        </Link>
      </div>
    </div>
  );
}
