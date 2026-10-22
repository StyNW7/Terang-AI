"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useStrategyMode } from "@/hooks/use-strategy-mode";
import { Callout } from "@/components/ui/misc";

type Product = "events" | "interview";

const COPY: Record<Product, Record<"one" | "ace", { tone: "warning" | "info"; title: string; text: string }>> = {
  events: {
    one: {
      tone: "warning",
      title: "Mode ONE — Terang Events maintenance-only",
      text: "Fitur existing tetap berjalan. Fitur berlabel ACE (template, repeat planner, growth insights) tidak dikembangkan.",
    },
    ace: {
      tone: "info",
      title: "Mode ACE — dikembangkan selektif",
      text: "Fitur berlabel ACE adalah usulan Agile Feature Development dengan batas 1 inisiatif besar sekaligus.",
    },
  },
  interview: {
    one: {
      tone: "info",
      title: "Mode ONE — produk prioritas",
      text: "Seluruh kapasitas pengembangan diarahkan ke AI Interview: builder, laporan bukti, dan kontrol Responsible AI.",
    },
    ace: {
      tone: "info",
      title: "Mode ACE — bagian dari portofolio",
      text: "Workflow HR esensial dibangun selektif, berdampingan dengan Terang Events.",
    },
  },
};

/** Shows how the strategy chosen in the Super Admin dashboard affects this product. */
export function ModeNotice({ product, className }: { product: Product; className?: string }) {
  const { mode } = useStrategyMode();
  if (mode === "overview") return null;
  const c = COPY[product][mode];
  return (
    <Callout tone={c.tone} title={c.title} className={className}>
      {c.text}{" "}
      <Link href="/dashboard/strategy" className="inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline">
        Ubah mode <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </Callout>
  );
}

/** Small banner for ACE-only proposals when ONE mode is active. */
export function AceOnlyNotice({ feature, className }: { feature: string; className?: string }) {
  const { mode } = useStrategyMode();
  if (mode !== "one") return null;
  return (
    <Callout tone="warning" title={`${feature} tidak dikembangkan dalam ONE Strategy`} className={className}>
      Ini usulan ACE. Anda tetap dapat mencobanya untuk perbandingan.{" "}
      <Link href="/dashboard/strategy" className="font-semibold underline-offset-2 hover:underline">
        Ubah mode
      </Link>
    </Callout>
  );
}
