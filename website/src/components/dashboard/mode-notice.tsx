"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useStrategyMode } from "@/hooks/use-strategy-mode";
import { Callout } from "@/components/ui/misc";
import { L, useI18n, type Bilingual } from "@/lib/i18n";

type Product = "events" | "interview";

const COPY: Record<Product, Record<"one" | "ace", { tone: "warning" | "info"; title: Bilingual; text: Bilingual }>> = {
  events: {
    one: {
      tone: "warning",
      title: L("Mode ONE — Terang Events hanya _maintenance_", "ONE mode — Terang Events on maintenance only"),
      text: L(
        "Fitur yang sudah ada tetap berjalan. Fitur berlabel ACE (_template_, _repeat planner_, _growth insights_) tidak dikembangkan.",
        "Existing features keep running. Features labelled ACE (templates, repeat planner, growth insights) are not developed.",
      ),
    },
    ace: {
      tone: "info",
      title: L("Mode ACE — dikembangkan selektif", "ACE mode — developed selectively"),
      text: L(
        "Fitur berlabel ACE adalah usulan Agile Feature Development dengan batas 1 inisiatif besar sekaligus.",
        "Features labelled ACE are Agile Feature Development proposals, limited to 1 major initiative at a time.",
      ),
    },
  },
  interview: {
    one: {
      tone: "info",
      title: L("Mode ONE — produk prioritas", "ONE mode — priority product"),
      text: L(
        "Seluruh kapasitas pengembangan diarahkan ke AI Interview: _builder_, laporan bukti, dan kontrol Responsible AI.",
        "All development capacity goes to AI Interview: the builder, evidence reports and Responsible AI controls.",
      ),
    },
    ace: {
      tone: "info",
      title: L("Mode ACE — bagian dari portofolio", "ACE mode — part of the portfolio"),
      text: L("_Workflow_ HR esensial dibangun selektif, berdampingan dengan Terang Events.", "Essential HR workflows are built selectively, alongside Terang Events."),
    },
  },
};

/** Shows how the strategy chosen in the Super Admin dashboard affects this product. */
export function ModeNotice({ product, className }: { product: Product; className?: string }) {
  const { mode } = useStrategyMode();
  const { t, tx } = useI18n();
  if (mode === "overview") return null;
  const c = COPY[product][mode];
  return (
    <Callout tone={c.tone} title={tx(c.title)} className={className}>
      {tx(c.text)}{" "}
      <Link href="/dashboard/strategy" className="inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline">
        {t("Ubah mode", "Change mode")} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </Callout>
  );
}

/** Small banner for ACE-only proposals when ONE mode is active. */
export function AceOnlyNotice({ feature, className }: { feature: string; className?: string }) {
  const { mode } = useStrategyMode();
  const { t } = useI18n();
  if (mode !== "one") return null;
  return (
    <Callout tone="warning" title={t(`${feature} tidak dikembangkan dalam ONE Strategy`, `${feature} is not developed under the ONE Strategy`)} className={className}>
      {t("Ini usulan ACE. Anda tetap dapat mencobanya untuk perbandingan.", "This is an ACE proposal. You can still try it for comparison.")}{" "}
      <Link href="/dashboard/strategy" className="font-semibold underline-offset-2 hover:underline">
        {t("Ubah mode", "Change mode")}
      </Link>
    </Callout>
  );
}
