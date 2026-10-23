"use client";

import { Check, EyeOff, History, KeyRound, Lock, ShieldCheck, Trash2, UserCheck, X } from "lucide-react";
import { toast } from "sonner";
import { useInterviewStore } from "@/store/interview-store";
import { Select, Switch } from "@/components/ui/form";
import { Callout } from "@/components/ui/misc";
import { formatDateTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { L, useI18n, type Bilingual } from "@/lib/i18n";

const ROLES: Bilingual[] = [L("HR Admin", "HR Admin"), L("_Recruiter_", "Recruiter"), L("_Hiring Manager_", "Hiring Manager"), L("Kandidat", "Candidate")];
const PERMISSIONS: { label: Bilingual; allowed: boolean[] }[] = [
  { label: L("Membuat & mengedit lowongan", "Create & edit vacancies"), allowed: [true, true, false, false] },
  { label: L("Melihat laporan bukti", "View evidence reports"), allowed: [true, true, true, false] },
  { label: L("_Override_ level & menulis catatan", "Override levels & write notes"), allowed: [true, true, false, false] },
  { label: L("Mengubah retensi data", "Change data retention"), allowed: [true, false, false, false] },
  { label: L("Mengekspor transkrip", "Export transcripts"), allowed: [true, false, false, false] },
  { label: L("Melihat jawaban sendiri & menarik persetujuan", "View own answers & withdraw consent"), allowed: [false, false, false, true] },
];

export function ResponsibleAi() {
  const { t, tx } = useI18n();
  const audit = useInterviewStore((s) => s.audit);
  const retention = useInterviewStore((s) => s.retentionDays);
  const setRetention = useInterviewStore((s) => s.setRetention);
  const requireHuman = useInterviewStore((s) => s.requireHumanReview);
  const setRequireHuman = useInterviewStore((s) => s.setRequireHumanReview);
  const mask = useInterviewStore((s) => s.maskIdentity);
  const setMask = useInterviewStore((s) => s.setMaskIdentity);

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-success-soft text-success">
              <UserCheck className="h-5 w-5" />
            </span>
            <Switch
              checked={requireHuman}
              label={t("Wajib tinjauan manusia", "Mandatory human review")}
              onChange={(v) => {
                if (!v) {
                  setRequireHuman(true);
                  toast.error(t("Tidak dapat dinonaktifkan", "Cannot be disabled"), {
                    description: t("Tinjauan manusia adalah kebijakan wajib (_hard gate_) dalam prototipe ini.", "Human review is a mandatory policy (hard gate) in this prototype."),
                  });
                  return;
                }
                setRequireHuman(v);
              }}
            />
          </div>
          <p className="mt-3 font-semibold text-ink">{t("Wajib tinjauan manusia", "Mandatory human review")}</p>
          <p className="mt-1 text-sm text-muted-strong">{tx("Setiap laporan harus ditinjau _recruiter_ sebelum digunakan dalam keputusan.", "Every report must be reviewed by a recruiter before it is used in a decision.")}</p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-one-soft text-one-ink">
              <EyeOff className="h-5 w-5" />
            </span>
            <Switch
              checked={mask}
              onChange={(v) => {
                setMask(v);
                toast.success(v ? t("Identitas kandidat disamarkan.", "Candidate identities masked.") : t("Identitas kandidat ditampilkan.", "Candidate identities shown."));
              }}
              label={t("Samarkan identitas", "Mask identities")}
            />
          </div>
          <p className="mt-3 font-semibold text-ink">{t("Samarkan identitas kandidat", "Mask candidate identities")}</p>
          <p className="mt-1 text-sm text-muted-strong">{tx("Mengurangi bias saat meninjau bukti — nama & _email_ diganti ID anonim.", "Reduces bias when reviewing evidence — names & emails are replaced with anonymous IDs.")}</p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-warning-soft text-warning-ink">
            <Trash2 className="h-5 w-5" />
          </span>
          <p className="mt-3 font-semibold text-ink">{t("Retensi data (simulasi)", "Data retention (simulated)")}</p>
          <Select
            className="mt-2"
            value={retention}
            onChange={(e) => {
              setRetention(Number(e.target.value));
              toast.success(t(`Retensi diubah ke ${e.target.value} hari.`, `Retention changed to ${e.target.value} days.`));
            }}
            aria-label={t("Periode retensi", "Retention period")}
          >
            {[30, 90, 180].map((d) => (
              <option key={d} value={d}>
                {t(`${d} hari setelah keputusan`, `${d} days after the decision`)}
              </option>
            ))}
          </Select>
          <p className="mt-2 text-xs text-muted">{t("Rekaman & transkrip dihapus otomatis setelah periode ini (simulasi).", "Recordings & transcripts are deleted automatically after this period (simulated).")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-soft">
          <div className="flex items-center gap-2 border-b border-line px-5 py-4">
            <KeyRound className="h-4 w-4 text-one-ink" />
            <p className="font-semibold text-ink">{t("Kontrol akses berbasis peran", "Role-based access control")}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-surface text-xs text-muted">
                <tr>
                  <th className="px-4 py-2.5 text-left font-semibold">{t("Izin", "Permission")}</th>
                  {ROLES.map((r) => (
                    <th key={r.id} className="px-3 py-2.5 text-center font-semibold">
                      {tx(r)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {PERMISSIONS.map((p) => (
                  <tr key={p.label.id}>
                    <td className="px-4 py-2.5 text-ink">{tx(p.label)}</td>
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
            <History className="h-4 w-4 text-one-ink" /> {tx("_Audit trail_", "Audit trail")}
          </p>
          <ul className="scrollbar-thin mt-3 max-h-[320px] space-y-2 overflow-y-auto pr-1">
            {audit.map((a) => (
              <li key={a.id} className="rounded-xl bg-surface p-3 text-sm ring-1 ring-line">
                <p className="font-semibold text-ink">{tx(a.action)}</p>
                <p className="text-xs text-muted">
                  {t(a.actor)} · {t(a.target)} · {formatDateTime(a.at)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Callout tone="info" icon={<Lock className="h-[18px] w-[18px]" />} title={t("Pemberitahuan privasi kandidat (contoh)", "Candidate privacy notice (sample)")}>
          {tx(
            `Jawaban Anda diproses untuk membantu _recruiter_ meninjau kesesuaian dengan kompetensi jabatan. Tidak ada analisis wajah, suara, emosi, atau kepribadian. Anda dapat meminta akses atau penghapusan data. Data disimpan ${retention} hari setelah keputusan.`,
            `Your answers are processed to help recruiters review how well they match the role's competencies. There is no analysis of faces, voice, emotion or personality. You can request access to or deletion of your data. Data is kept for ${retention} days after the decision.`,
          )}
        </Callout>
        <Callout tone="success" icon={<ShieldCheck className="h-[18px] w-[18px]" />} title={t("Yang tidak dilakukan sistem", "What the system does not do")}>
          {t(
            "Tidak ada inferensi kepribadian dari wajah, deteksi emosi, prediksi kompetensi tanpa dasar, maupun keputusan terima/tolak otomatis.",
            "No personality inference from faces, no emotion detection, no ungrounded competency prediction and no automatic accept/reject decisions.",
          )}
        </Callout>
      </div>
    </div>
  );
}
