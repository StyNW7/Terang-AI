"use client";

import { useMemo, useState } from "react";
import { motion, LayoutGroup } from "motion/react";
import { ArrowRight, Brain, CalendarDays, Lock, Minus, Plus, Rocket } from "lucide-react";
import { toast } from "sonner";
import type { FeatureStatus, ProductKey } from "@/types/common";
import { useOperationsStore } from "@/store/operations-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoTip } from "@/components/ui/tooltip";
import { SourceLabel } from "@/components/shared/source-label";
import { cn } from "@/lib/utils";

interface BacklogItem {
  id: string;
  product: ProductKey;
  name: string;
  reach: number; // 1..10
  impact: number; // 1..3
  confidence: number; // 0..1
  effort: number; // 1..5
  status: FeatureStatus;
  demo?: string;
}

const INITIAL: BacklogItem[] = [
  { id: "e1", product: "events", name: "Smart Event Templates", reach: 8, impact: 3, confidence: 0.8, effort: 3, status: "simulated", demo: "/dashboard/events" },
  { id: "e2", product: "events", name: "Repeat Event Planner", reach: 7, impact: 2, confidence: 0.8, effort: 2, status: "simulated", demo: "/dashboard/events" },
  { id: "e3", product: "events", name: "Organizer Growth Insights", reach: 6, impact: 2, confidence: 0.7, effort: 3, status: "proposed" },
  { id: "e4", product: "events", name: "AI Event Assistant", reach: 6, impact: 2, confidence: 0.5, effort: 5, status: "later" },
  { id: "i1", product: "interview", name: "Role-Based Interview Builder", reach: 7, impact: 3, confidence: 0.7, effort: 4, status: "simulated", demo: "/dashboard/interview" },
  { id: "i2", product: "interview", name: "Evidence-Linked Assessment", reach: 7, impact: 3, confidence: 0.6, effort: 5, status: "simulated", demo: "/dashboard/interview" },
  { id: "i3", product: "interview", name: "Recruiter Review Dashboard", reach: 6, impact: 2, confidence: 0.8, effort: 3, status: "proposed" },
  { id: "i4", product: "interview", name: "Responsible AI Controls", reach: 7, impact: 3, confidence: 0.9, effort: 3, status: "proposed" },
];

const EXISTING = {
  events: ["Registrasi & pembayaran", "Submisi & penjurian", "Analitik event dasar"],
  interview: ["Simulasi wawancara AI (Professor Terra)", "Umpan balik wawancara B2C"],
};

const STATUS_META: Record<FeatureStatus, { label: string; tone: "success" | "brand" | "sky" | "neutral" | "warning" }> = {
  existing: { label: "Existing", tone: "success" },
  proposed: { label: "Proposed", tone: "brand" },
  "in-development": { label: "In development", tone: "sky" },
  simulated: { label: "Simulated demo", tone: "neutral" },
  later: { label: "Later priority", tone: "warning" },
};

const score = (i: BacklogItem) => (i.reach * i.impact * i.confidence) / i.effort;

function Stepper({ value, onChange, min, max, label }: { value: number; onChange: (v: number) => void; min: number; max: number; label: string }) {
  return (
    <span className="inline-flex items-center rounded-lg bg-card ring-1 ring-line" aria-label={label}>
      <button type="button" className="grid h-6 w-6 place-items-center text-muted hover:text-ink" onClick={() => onChange(Math.max(min, value - 1))} aria-label={`Kurangi ${label}`}>
        <Minus className="h-3 w-3" />
      </button>
      <span className="tabular w-5 text-center text-xs font-semibold text-ink">{value}</span>
      <button type="button" className="grid h-6 w-6 place-items-center text-muted hover:text-ink" onClick={() => onChange(Math.min(max, value + 1))} aria-label={`Tambah ${label}`}>
        <Plus className="h-3 w-3" />
      </button>
    </span>
  );
}

export function AcePillarAgile() {
  const [items, setItems] = useState(INITIAL);
  const [committed, setCommitted] = useState<string[]>(["e1", "i1"]);
  const tasks = useOperationsStore((s) => s.tasks);

  const toggleCommit = (item: BacklogItem) => {
    if (committed.includes(item.id)) {
      setCommitted((c) => c.filter((x) => x !== item.id));
      toast.info(`${item.name} dikembalikan ke backlog.`);
      return;
    }
    if (item.status === "later") {
      toast.warning(`${item.name} berstatus later priority — tidak masuk sprint awal.`);
      return;
    }
    const sameProduct = committed.filter((id) => items.find((x) => x.id === id)?.product === item.product);
    if (sameProduct.length >= 1) {
      toast.error("Batas WIP tercapai", {
        description: "ACE membatasi 1 inisiatif besar per produk. Selesaikan atau kembalikan inisiatif aktif terlebih dahulu.",
      });
      return;
    }
    setCommitted((c) => [...c, item.id]);
    toast.success(`${item.name} masuk sprint aktif.`);
  };

  const update = (id: string, patch: Partial<BacklogItem>) => setItems((list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const columns = useMemo(
    () =>
      (["events", "interview"] as const).map((p) => ({
        product: p,
        list: items.filter((i) => i.product === p).sort((a, b) => score(b) - score(a)),
      })),
    [items],
  );

  const sprintCounts = (["backlog", "planned", "in-progress", "review", "done"] as const).map((c) => ({ c, n: tasks.filter((t) => t.column === c).length }));

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ace-ink">Flagship Program</p>
          <h3 className="text-2xl font-semibold text-ink">ACE Dual-Product Innovation Sprint</h3>
          <p className="mt-1 max-w-2xl text-sm text-muted-strong">
            Dua backlog diurutkan dengan skor prioritas. Masukkan inisiatif ke sprint — sistem menegakkan batas WIP 1 inisiatif besar per produk
            dengan kapasitas QA & support wajib.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <InfoTip align="right" label="Skor prioritas">
            Skor = Reach × Impact × Confidence ÷ Effort. Ubah Impact dan Effort untuk melihat urutan backlog berubah.
          </InfoTip>
          <SourceLabel type="strategic-proposal" compact />
        </div>
      </div>

      <LayoutGroup>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {columns.map(({ product, list }) => {
            const isEvents = product === "events";
            const active = committed.filter((id) => items.find((x) => x.id === id)?.product === product).length;
            return (
              <div key={product} className="rounded-3xl border border-line bg-card p-5 shadow-soft">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={cn("grid h-10 w-10 place-items-center rounded-xl", isEvents ? "bg-sky-soft text-sky-ink" : "bg-one-soft text-one-ink")}>
                      {isEvents ? <CalendarDays className="h-5 w-5" /> : <Brain className="h-5 w-5" />}
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{isEvents ? "Terang Events" : "AI Candidate Interview"}</p>
                      <p className="text-xs text-muted">Backlog prioritas</p>
                    </div>
                  </div>
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", active >= 1 ? "bg-warning-soft text-warning-ink" : "bg-success-soft text-success-ink")}>
                    WIP {active}/1
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {EXISTING[product].map((e) => (
                    <Badge key={e} tone="success">
                      Existing · {e}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 space-y-2">
                  {list.map((item, rank) => {
                    const isCommitted = committed.includes(item.id);
                    const status: FeatureStatus = isCommitted ? "in-development" : item.status;
                    return (
                      <motion.div
                        layout
                        key={item.id}
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        className={cn(
                          "rounded-2xl border p-3.5 transition",
                          isCommitted ? "border-ace/40 bg-ace-soft/60" : "border-line bg-surface",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <span className="tabular grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-card text-xs font-semibold text-muted-strong ring-1 ring-line">
                              {rank + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-ink">{item.name}</p>
                              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                <Badge tone={STATUS_META[status].tone}>{STATUS_META[status].label}</Badge>
                                {item.demo && (
                                  <a href={item.demo} className="text-[11px] font-semibold text-brand-ink hover:underline">
                                    Lihat demo →
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="tabular font-display text-xl font-semibold text-ink">{score(item).toFixed(1)}</p>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">skor</p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-strong">
                            <span>Reach {item.reach}</span>
                            <span className="flex items-center gap-1">Impact <Stepper value={item.impact} min={1} max={3} onChange={(v) => update(item.id, { impact: v })} label="impact" /></span>
                            <span>Conf. {Math.round(item.confidence * 100)}%</span>
                            <span className="flex items-center gap-1">Effort <Stepper value={item.effort} min={1} max={5} onChange={(v) => update(item.id, { effort: v })} label="effort" /></span>
                          </div>
                          <Button size="sm" variant={isCommitted ? "secondary" : "soft"} onClick={() => toggleCommit(item)}>
                            {isCommitted ? "Kembalikan" : item.status === "later" ? (<><Lock className="h-3.5 w-3.5" /> Later</>) : (<><Rocket className="h-3.5 w-3.5" /> Masuk sprint</>)}
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </LayoutGroup>

      <div className="flex flex-col gap-5 rounded-3xl bg-navy-gradient p-6 text-white shadow-lift md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky">Sprint view · ACE Command Center</p>
          <p className="mt-1 text-xl font-semibold">Sprint board bersama dua produk</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {sprintCounts.map(({ c, n }) => (
              <span key={c} className="rounded-xl bg-white/10 px-3 py-2 text-center ring-1 ring-white/15">
                <span className="tabular block font-display text-lg font-semibold">{n}</span>
                <span className="text-[11px] capitalize text-white/70">{c.replace("-", " ")}</span>
              </span>
            ))}
          </div>
        </div>
        <Button href="/dashboard/operations" variant="light">
          Buka sprint board <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
