"use client";

import { Check, EyeOff, History, KeyRound, Lock, ShieldCheck, Trash2, UserCheck, X } from "lucide-react";
import { toast } from "sonner";
import { useInterviewStore } from "@/store/interview-store";
import { Select, Switch } from "@/components/ui/form";
import { Callout } from "@/components/ui/misc";
import { formatDateTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const ROLES = ["HR Admin", "Recruiter", "Hiring Manager", "Kandidat"] as const;
const PERMISSIONS: { label: string; allowed: boolean[] }[] = [
  { label: "Membuat & mengedit lowongan", allowed: [true, true, false, false] },
  { label: "Melihat laporan bukti", allowed: [true, true, true, false] },
  { label: "Override level & menulis catatan", allowed: [true, true, false, false] },
  { label: "Mengubah retensi data", allowed: [true, false, false, false] },
  { label: "Mengekspor transkrip", allowed: [true, false, false, false] },
  { label: "Melihat jawaban sendiri & menarik persetujuan", allowed: [false, false, false, true] },
];

export function ResponsibleAi() {
  const audit = useInterviewStore((s) => s.audit);
  const retention = useInterviewStore((s) => s.retentionDays);
  const setRetention = useInterviewStore((s) => s.setRetention);
  const requireHuman = useInterviewStore((s) => s.requireHumanReview);
  const setRequireHuman = useInterviewStore((s) => s.setRequireHumanReview);
  const mask = useInterviewStore((s) => s.maskIdentity);
  const setMask = useInterviewStore((s) => s.setMaskIdentity);

  return (
    <div className="space-y-6">

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-success-soft text-success">
              <UserCheck className="h-5 w-5" />
            </span>
            <Switch
              checked={requireHuman}
              label="Wajib tinjauan manusia"
              onChange={(v) => {
                if (!v) {
                  setRequireHuman(true);
                  toast.error("Tidak dapat dinonaktifkan", { description: "Tinjauan manusia adalah kebijakan wajib (hard gate) dalam prototype ini." });
                  return;
                }
                setRequireHuman(v);
              }}
            />
          </div>
          <p className="mt-3 font-semibold text-ink">Wajib tinjauan manusia</p>
          <p className="mt-1 text-sm text-muted-strong">Setiap laporan harus ditinjau recruiter sebelum digunakan dalam keputusan.</p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-one-soft text-one-ink">
              <EyeOff className="h-5 w-5" />
            </span>
            <Switch checked={mask} onChange={(v) => { setMask(v); toast.success(v ? "Identitas kandidat disamarkan." : "Identitas kandidat ditampilkan."); }} label="Samarkan identitas" />
          </div>
          <p className="mt-3 font-semibold text-ink">Samarkan identitas kandidat</p>
          <p className="mt-1 text-sm text-muted-strong">Mengurangi bias saat meninjau bukti — nama & email diganti ID anonim.</p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-warning-soft text-warning-ink">
            <Trash2 className="h-5 w-5" />
          </span>
          <p className="mt-3 font-semibold text-ink">Retensi data (simulasi)</p>
          <Select
            className="mt-2"
            value={retention}
            onChange={(e) => {
              setRetention(Number(e.target.value));
              toast.success(`Retensi diubah ke ${e.target.value} hari.`);
            }}
            aria-label="Periode retensi"
          >
            {[30, 90, 180].map((d) => (
              <option key={d} value={d}>
                {d} hari setelah keputusan
              </option>
            ))}
          </Select>
          <p className="mt-2 text-xs text-muted">Rekaman & transkrip dihapus otomatis setelah periode ini (simulasi).</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-soft">
          <div className="flex items-center gap-2 border-b border-line px-5 py-4">
            <KeyRound className="h-4 w-4 text-one-ink" />
            <p className="font-semibold text-ink">Kontrol akses berbasis peran</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-surface text-xs text-muted">
                <tr>
                  <th className="px-4 py-2.5 text-left font-semibold">Izin</th>
                  {ROLES.map((r) => (
                    <th key={r} className="px-3 py-2.5 text-center font-semibold">
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {PERMISSIONS.map((p) => (
                  <tr key={p.label}>
                    <td className="px-4 py-2.5 text-ink">{p.label}</td>
                    {p.allowed.map((a, i) => (
                      <td key={i} className="px-3 py-2.5 text-center">
                        <span className={cn("inline-grid h-6 w-6 place-items-center rounded-full", a ? "bg-success-soft text-success" : "bg-neutral-soft text-muted")}>
                          {a ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <History className="h-4 w-4 text-one-ink" /> Audit trail
          </p>
          <ul className="scrollbar-thin mt-3 max-h-[320px] space-y-2 overflow-y-auto pr-1">
            {audit.map((a) => (
              <li key={a.id} className="rounded-xl bg-surface p-3 text-sm ring-1 ring-line">
                <p className="font-semibold text-ink">{a.action}</p>
                <p className="text-xs text-muted">
                  {a.actor} · {a.target} · {formatDateTime(a.at)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Callout tone="info" icon={<Lock className="h-[18px] w-[18px]" />} title="Pemberitahuan privasi kandidat (contoh)">
          Jawaban Anda diproses untuk membantu recruiter meninjau kesesuaian dengan kompetensi jabatan. Tidak ada analisis wajah, suara, emosi,
          atau kepribadian. Anda dapat meminta akses atau penghapusan data. Data disimpan {retention} hari setelah keputusan.
        </Callout>
        <Callout tone="success" icon={<ShieldCheck className="h-[18px] w-[18px]" />} title="Yang tidak dilakukan sistem">
          Tidak ada inferensi kepribadian dari wajah, deteksi emosi, prediksi kompetensi tanpa dasar, maupun keputusan terima/tolak otomatis.
        </Callout>
      </div>
    </div>
  );
}
