"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { BadgeCheck, Building2, CalendarClock, Clock, FlaskConical, Globe, Heart, MessageCircle, Repeat2, Send, Stethoscope, ThumbsUp, Users, Video, Wallet } from "lucide-react";
import { useScenarioStore } from "@/store/scenario-store";
import { Funnel } from "@/components/strategy/funnel";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { InfoTip } from "@/components/ui/tooltip";
import { SourceLabel } from "@/components/shared/source-label";
import { LogoMark } from "@/components/shared/brand";
import { Segmented } from "@/components/ui/tabs";
import { ONE_GROWTH_INITIATIVES, PRICING_TIERS, type PricingTier } from "@/data/proposal";
import { formatIDR, formatIDRCompact, formatNumber, formatPercent } from "@/lib/formatters";
import { cn, safeDivide } from "@/lib/utils";
import { L, useI18n, type Bilingual } from "@/lib/i18n";

const PIPELINE: { company: string; industry: Bilingual; stage: string; size: Bilingual; value: number }[] = [
  { company: "PT Sinar Ritel Nusantara", industry: L("Ritel", "Retail"), stage: "Pilot", size: L("320 karyawan", "320 employees"), value: 54_000_000 },
  { company: "PT Arunika Finansial", industry: L("Fintech", "Fintech"), stage: "Demo", size: L("180 karyawan", "180 employees"), value: 38_000_000 },
  { company: "CV Logistik Cakra Mandiri", industry: L("Logistik", "Logistics"), stage: "Paid", size: L("450 karyawan", "450 employees"), value: 96_000_000 },
  { company: "PT Kopi Nusa Raya", industry: L("F&B", "F&B"), stage: "Lead", size: L("260 karyawan", "260 employees"), value: 30_000_000 },
  { company: "Talenta Prima Agency", industry: L("Agensi rekrutmen", "Recruitment agency"), stage: "Pilot", size: L("45 _recruiter_", "45 recruiters"), value: 120_000_000 },
  { company: "PT Bahari Telekomunikasi", industry: L("Telekomunikasi", "Telecommunications"), stage: "Demo", size: L("600 karyawan", "600 employees"), value: 88_000_000 },
  { company: "Klinik Sehat Bersama Group", industry: L("Kesehatan", "Healthcare"), stage: "Lead", size: L("210 karyawan", "210 employees"), value: 26_000_000 },
  { company: "PT Edukasi Cerdas", industry: L("Pendidikan", "Education"), stage: "Renewal", size: L("140 karyawan", "140 employees"), value: 42_000_000 },
];
const STAGES = ["all", "Lead", "Demo", "Pilot", "Paid", "Renewal"] as const;
const STAGE_TONE: Record<string, "neutral" | "brand" | "sky" | "one" | "success"> = {
  Lead: "neutral",
  Demo: "sky",
  Pilot: "brand",
  Paid: "one",
  Renewal: "success",
};

export function OnePillarNavigate() {
  const { t, tx } = useI18n();
  const assumptions = useScenarioStore((s) => s.assumptions);
  const update = useScenarioStore((s) => s.update);
  const [rates, setRates] = useState({ leadRate: 0.04, demoRate: 0.35, pilotRate: 0.45 });
  const [stageFilter, setStageFilter] = useState<(typeof STAGES)[number]>("all");

  // ROI estimator (customer side)
  const [interviews, setInterviews] = useState(120);
  const [minutesSaved, setMinutesSaved] = useState(25);
  const [convertMoney, setConvertMoney] = useState(false);
  const [hourlyCost, setHourlyCost] = useState(75_000);
  const [tierId, setTierId] = useState<PricingTier["id"]>("growth");
  const tier = PRICING_TIERS.find((p) => p.id === tierId) ?? PRICING_TIERS[1];

  const funnel = useMemo(() => {
    const pilots = assumptions.shared.salesCapacityPilots;
    const conversion = Math.min(1, assumptions.interview.pilotConversion + assumptions.one.conversionUpliftPp);
    const demos = safeDivide(pilots, rates.pilotRate);
    const leads = safeDivide(demos, rates.demoRate);
    const awareness = safeDivide(leads, rates.leadRate);
    const paid = Math.round(pilots * conversion);
    const renewal = Math.round(paid * assumptions.interview.renewalRate);
    return [
      { label: "Awareness", value: Math.round(awareness) },
      { label: "Qualified Lead", value: Math.round(leads) },
      { label: "Demo", value: Math.round(demos) },
      { label: "Pilot", value: Math.round(pilots) },
      { label: t("Pelanggan berbayar", "Paid Customer"), value: paid },
      { label: "Renewal", value: renewal },
    ];
  }, [assumptions, rates, t]);

  const hoursSaved = (interviews * minutesSaved) / 60;
  const moneyEquivalent = hoursSaved * hourlyCost;
  const toolCost = tier.monthly;

  const pipeline = PIPELINE.filter((p) => stageFilter === "all" || p.stage === stageFilter);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Persona */}
        <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-one-ink">{tx("_Persona_ target pelanggan", "Target customer persona")}</p>
            <SourceLabel type="illustrative-assumption" compact />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-one-gradient font-display text-xl font-semibold text-white">SH</span>
            <div>
              <p className="text-lg font-semibold text-ink">{t("Sinta Hapsari (fiktif)", "Sinta Hapsari (fictional)")}</p>
              <p className="text-sm text-muted-strong">{t("HR Lead · perusahaan ritel 300+ karyawan", "HR Lead · retail company with 300+ employees")}</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{t("Tujuan", "Goals")}</p>
              <ul className="mt-1.5 space-y-1 text-[13px] text-ink">
                <li>• {t("Rekrut 40+ staf toko per kuartal", "Hire 40+ store staff per quarter")}</li>
                <li>• {t("Standar wawancara konsisten", "Consistent interview standards")}</li>
                <li>• {t("Laporan yang dapat dipertanggungjawabkan", "Accountable, defensible reports")}</li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{t("Hambatan", "Barriers")}</p>
              <ul className="mt-1.5 space-y-1 text-[13px] text-ink">
                <li>• {t("Tim HR hanya 3 orang", "An HR team of only 3")}</li>
                <li>• {tx("_Screening_ memakan 60% waktu", "Screening takes 60% of their time")}</li>
                <li>• {t("Khawatir soal privasi & keadilan AI", "Concerned about AI privacy & fairness")}</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 rounded-xl bg-one-soft p-3 text-[13px] text-one-ink">
            <strong>{t("Kriteria membeli:", "Buying criteria:")}</strong>{" "}
            {t(
              "bukti penghematan waktu, kontrol manusia, kepatuhan data, harga yang dapat diprediksi.",
              "proof of time saved, human control, data compliance, predictable pricing.",
            )}
          </p>
        </div>

        {/* Campaign concepts */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-line bg-card p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{tx("Konsep posting B2B (_mockup_)", "B2B post concept (mockup)")}</p>
            <div className="mt-3 rounded-2xl border border-line p-4">
              <div className="flex items-center gap-2">
                <LogoMark size={32} />
                <div>
                  <p className="text-sm font-semibold text-ink">Terang AI for Business</p>
                  <p className="flex items-center gap-1 text-[11px] text-muted">
                    {t("Promosi", "Promoted")} · <Globe className="h-3 w-3" />
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-ink">
                {tx(
                  "Tim HR Anda menghabiskan berjam-jam untuk _screening_? Coba wawancara terstruktur dengan laporan berbasis bukti — keputusan tetap di tangan _recruiter_.",
                  "Is your HR team spending hours on screening? Try structured interviews with evidence-based reports — the decision stays with your recruiters.",
                )}{" "}
                <strong>{tx("Daftar _pilot_ 30 hari →", "Join the 30-day pilot →")}</strong>
              </p>
              <div className="mt-3 rounded-xl bg-one-gradient p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/75">Hire Smarter with Terang</p>
                <p className="font-display text-lg font-semibold">{tx("Dari skor generik ke _insight_ berbasis bukti.", "From generic scores to evidence-based insight.")}</p>
              </div>
              <div className="mt-3 flex justify-between text-[11px] font-semibold text-muted">
                <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> {t("Suka", "Like")}</span>
                <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {t("Komentar", "Comment")}</span>
                <span className="flex items-center gap-1"><Repeat2 className="h-3.5 w-3.5" /> {t("Bagikan", "Repost")}</span>
                <span className="flex items-center gap-1"><Send className="h-3.5 w-3.5" /> {t("Kirim", "Send")}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col rounded-3xl bg-navy-gradient p-5 text-white shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky">{tx("Seri _webinar_", "Webinar series")}</p>
            <p className="mt-2 font-display text-2xl font-semibold leading-tight">HR Efficiency Clinic</p>
            <p className="mt-2 text-sm text-white/75">
              {t(
                "Sesi 60 menit untuk HR Lead: membangun rubrik wawancara, mengurangi bias, dan menghitung waktu screening.",
                "A 60-minute session for HR Leads: building interview rubrics, reducing bias and measuring screening time.",
              )}
            </p>
            <div className="mt-4 space-y-2 text-[13px]">
              <p className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-sky" /> {t("Kamis bulanan · 15.00 WIB", "Monthly on Thursdays · 3 pm WIB")}</p>
              <p className="flex items-center gap-2"><Video className="h-4 w-4 text-sky" /> {tx("_Online_ · _live demo_ produk", "Online · live product demo")}</p>
              <p className="flex items-center gap-2"><Users className="h-4 w-4 text-sky" /> {t("Target 80 HR per sesi", "Target: 80 HR professionals per session")}</p>
            </div>
            <div className="mt-auto pt-5">
              <Heart className="h-5 w-5 text-sky" />
              <p className="mt-1 text-xs text-white/70">
                {tx(
                  "Peserta yang memenuhi kriteria ditawari demo _enterprise_ & _pilot_ terbatas.",
                  "Qualified attendees are offered an enterprise demo & a limited pilot.",
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Acquisition initiatives */}
      <div>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-one-ink">{t("Tiga inisiatif akuisisi", "Three acquisition initiatives")}</p>
            <h3 className="text-xl font-semibold text-ink">{t("Dari masalah HR ke bukti yang terverifikasi", "From HR pain points to verified proof")}</h3>
          </div>
          <SourceLabel type="strategic-proposal" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {ONE_GROWTH_INITIATIVES.map((item, i) => {
            const Icon = [Stethoscope, FlaskConical, BadgeCheck][i];
            return (
              <div key={item.name} className="relative rounded-2xl border border-line bg-card p-5 shadow-soft">
                <span className="absolute right-5 top-5 tabular text-xs font-semibold text-muted">0{i + 1}</span>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-one-soft text-one-ink">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 font-semibold text-ink">{item.name}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-strong">{tx(item.description)}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted">
          {t(
            "Kanal: LinkedIn, webinar & komunitas HR, kemitraan B2B, dan demo langsung. Target pasar: perusahaan dengan rekrutmen entry-level berulang (customer service, sales, operasional) & penyedia jasa rekrutmen.",
            "Channels: LinkedIn, HR webinars & communities, B2B partnerships and direct demos. Target market: companies with repeated entry-level hiring (customer service, sales, operations) & recruitment providers.",
          )}
        </p>
      </div>

      {/* Funnel */}
      <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-one-ink">Pilot-to-Paid Growth Engine</p>
            <h3 className="text-xl font-semibold text-ink">Awareness → Lead → Demo → Pilot → Paid → Renewal</h3>
            <p className="mt-1 text-sm text-muted-strong">
              {tx(
                "_Pilot_, konversi & _renewal_ terhubung ke asumsi simulator (satu sumber data). Ubah di sini dan simulator ikut berubah.",
                "Pilots, conversion & renewal are linked to the simulator's assumptions (a single source of truth). Change them here and the simulator updates too.",
              )}
            </p>
          </div>
          <SourceLabel type="illustrative-assumption" />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-5">
            <Slider label="Awareness → Qualified Lead" value={rates.leadRate * 100} min={1} max={10} step={0.5} onChange={(v) => setRates((r) => ({ ...r, leadRate: v / 100 }))} display={formatPercent(rates.leadRate, 1)} color="#2251c9" />
            <Slider label="Lead → Demo" value={rates.demoRate * 100} min={10} max={70} onChange={(v) => setRates((r) => ({ ...r, demoRate: v / 100 }))} display={formatPercent(rates.demoRate)} color="#2251c9" />
            <Slider label="Demo → Pilot" value={rates.pilotRate * 100} min={15} max={80} onChange={(v) => setRates((r) => ({ ...r, pilotRate: v / 100 }))} display={formatPercent(rates.pilotRate)} color="#2251c9" />
            <div className="rounded-2xl bg-one-soft/60 p-4 ring-1 ring-current/15">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-one-ink">{t("Asumsi simulator bersama", "Shared simulator assumptions")}</p>
              <div className="space-y-4">
                <Slider
                  label={tx("Kapasitas _pilot_ (fokus penuh)", "Pilot capacity (full focus)")}
                  value={assumptions.shared.salesCapacityPilots}
                  min={10}
                  max={80}
                  onChange={(v) => update("shared", "salesCapacityPilots", v)}
                  display={`${assumptions.shared.salesCapacityPilots} ${t("_pilot_", "pilots")}`}
                  color="#2251c9"
                />
                <Slider
                  label={tx("Konversi _pilot_ → berbayar (dasar)", "Pilot → paid conversion (base)")}
                  value={Math.round(assumptions.interview.pilotConversion * 100)}
                  min={5}
                  max={80}
                  onChange={(v) => update("interview", "pilotConversion", v / 100)}
                  display={formatPercent(assumptions.interview.pilotConversion)}
                  color="#2251c9"
                  hint={t(
                    `+ _uplift_ fokus ONE ${formatPercent(assumptions.one.conversionUpliftPp)} (asumsi eksplisit)`,
                    `+ ONE focus uplift of ${formatPercent(assumptions.one.conversionUpliftPp)} (explicit assumption)`,
                  )}
                />
                <Slider
                  label={tx("_Renewal_ perusahaan", "Company renewals")}
                  value={Math.round(assumptions.interview.renewalRate * 100)}
                  min={20}
                  max={100}
                  onChange={(v) => update("interview", "renewalRate", v / 100)}
                  display={formatPercent(assumptions.interview.renewalRate)}
                  color="#2251c9"
                />
              </div>
            </div>
          </div>
          <div>
            <Funnel stages={funnel} color="linear-gradient(90deg,#4a90e2,#2251c9)" />
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { k: t("Pelanggan berbayar", "Paying customers"), v: formatNumber(funnel[4].value) },
                { k: tx("Biaya akuisisi _pilot_", "Pilot acquisition cost"), v: formatIDRCompact(assumptions.shared.salesCapacityPilots * assumptions.interview.cacPerPilot) },
                { k: t("CAC / pelanggan", "CAC / customer"), v: formatIDRCompact(safeDivide(assumptions.shared.salesCapacityPilots * assumptions.interview.cacPerPilot, funnel[4].value)) },
              ].map((m, i) => (
                <div key={i} className="rounded-xl bg-surface p-3 ring-1 ring-line">
                  <p className="text-[11px] text-muted">{m.k}</p>
                  <p className="tabular font-display text-lg font-semibold text-ink">{m.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-ink">{tx("Contoh _lead pipeline_", "Example lead pipeline")}</h3>
          <div className="flex flex-wrap gap-1.5">
            {STAGES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStageFilter(s)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 transition",
                  stageFilter === s ? "bg-one text-white ring-one" : "bg-card text-muted-strong ring-line hover:ring-one/40",
                )}
              >
                {s === "all" ? t("Semua", "All") : s}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs text-muted">
                <th className="py-2 font-semibold">{t("Perusahaan (fiktif)", "Company (fictional)")}</th>
                <th className="py-2 font-semibold">{t("Industri", "Industry")}</th>
                <th className="py-2 font-semibold">{t("Ukuran", "Size")}</th>
                <th className="py-2 font-semibold">{t("Tahap", "Stage")}</th>
                <th className="py-2 text-right font-semibold">{t("Nilai potensial / thn", "Potential value / yr")}</th>
              </tr>
            </thead>
            <tbody>
              {pipeline.map((p) => (
                <motion.tr layout key={p.company} className="border-b border-line/70 last:border-0">
                  <td className="py-2.5 font-semibold text-ink">
                    <span className="flex items-center gap-2"><Building2 className="h-4 w-4 text-muted" /> {p.company}</span>
                  </td>
                  <td className="py-2.5 text-muted-strong">{t(p.industry)}</td>
                  <td className="py-2.5 text-muted-strong">{tx(p.size)}</td>
                  <td className="py-2.5"><Badge tone={STAGE_TONE[p.stage]}>{p.stage}</Badge></td>
                  <td className="tabular py-2.5 text-right font-semibold text-ink">{formatIDRCompact(p.value)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {pipeline.length === 0 && <p className="py-6 text-center text-sm text-muted">{tx("Tidak ada _lead_ pada tahap ini.", "No leads at this stage.")}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ROI */}
        <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-ink">{tx("Estimator ROI _pilot_", "Pilot ROI estimator")}</h3>
              <p className="text-sm text-muted-strong">{t("Waktu administrasi yang dihemat dipisahkan dari nilai uang.", "Admin time saved is kept separate from monetary value.")}</p>
            </div>
            <InfoTip align="right">
              {t(
                "Penghematan waktu ≠ penghematan uang. Nilai rupiah hanya ditampilkan bila Anda mengaktifkan konversi dengan asumsi biaya per jam HR yang eksplisit.",
                "Time saved ≠ money saved. A rupiah value is shown only if you enable the conversion with an explicit HR hourly-cost assumption.",
              )}
            </InfoTip>
          </div>
          <div className="mt-5 space-y-4">
            <Slider label={tx("_Interview_ per bulan", "Interviews per month")} value={interviews} min={20} max={500} step={10} onChange={setInterviews} display={formatNumber(interviews)} color="#2251c9" />
            <Slider label={tx("Menit admin dihemat / _interview_", "Admin minutes saved / interview")} value={minutesSaved} min={5} max={60} onChange={setMinutesSaved} display={`${minutesSaved} ${t("menit", "min")}`} color="#2251c9" />
            <div>
              <p className="mb-2 text-sm font-medium text-ink">{t("Paket langganan (usulan)", "Subscription plan (proposed)")}</p>
              <Segmented size="sm" value={tierId} onChange={setTierId} items={PRICING_TIERS.map((p) => ({ id: p.id, label: p.name }))} />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-one-soft p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-one-ink"><Clock className="h-3.5 w-3.5" /> {t("Waktu dihemat / bulan", "Time saved / month")}</p>
              <p className="tabular font-display text-2xl font-semibold text-ink">
                {formatNumber(hoursSaved)} {t("jam", "hrs")}
              </p>
              <p className="text-[11px] text-muted">≈ {formatNumber(hoursSaved / 8)} {t("hari kerja HR", "HR working days")}</p>
            </div>
            <div className="rounded-2xl bg-surface p-4 ring-1 ring-line">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-strong"><Wallet className="h-3.5 w-3.5" /> {t("Biaya layanan / bulan", "Service cost / month")}</p>
              <p className="tabular font-display text-2xl font-semibold text-ink">{formatIDRCompact(toolCost)}</p>
              <p className="text-[11px] text-muted">
                {tier.name} · ≈ {formatIDR(safeDivide(tier.monthly, interviews))} / interview
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-dashed border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-ink">{t("Konversi waktu ke rupiah (opsional)", "Convert time to rupiah (optional)")}</p>
              <Switch checked={convertMoney} onChange={setConvertMoney} label={t("Konversi waktu ke rupiah", "Convert time to rupiah")} />
            </div>
            {convertMoney && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                <Slider className="mt-4" label={t("Asumsi biaya HR per jam", "Assumed HR cost per hour")} value={hourlyCost} min={30_000} max={250_000} step={5_000} onChange={setHourlyCost} display={formatIDR(hourlyCost)} color="#2251c9" />
                <p className="mt-3 text-sm text-ink">
                  {t("Nilai waktu setara:", "Equivalent time value:")} <strong className="tabular">{formatIDRCompact(moneyEquivalent)}</strong> / {t("bulan", "month")} →{" "}
                  <strong className={moneyEquivalent >= toolCost ? "text-success-ink" : "text-danger-ink"}>
                    {moneyEquivalent >= toolCost ? t("melebihi biaya layanan", "exceeds the service cost") : t("di bawah biaya layanan", "below the service cost")}
                  </strong>
                  . {t("Ini estimasi nilai kapasitas, bukan penghematan kas aktual.", "This estimates capacity value, not actual cash savings.")}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-ink">{t("Paket harga usulan", "Proposed pricing plans")}</h3>
              <p className="text-sm text-muted-strong">
                {tx(
                  "Asumsi pemodelan proposal, bukan harga resmi Terang AI. Paket yang sama dipakai di ONE dan ACE agar perbandingan adil.",
                  "Proposal modelling assumptions, not Terang AI's official prices. The same plans are used in ONE and ACE for a fair comparison.",
                )}
              </p>
            </div>
            <SourceLabel type="proposal-projection" compact />
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-dashed border-line p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-one-soft text-one-ink">
              <FlaskConical className="h-4 w-4" />
            </span>
            <p className="text-[13px] leading-snug text-muted-strong">
              <strong className="text-ink">{t("Mulai dari Terang Pilot Challenge.", "Start with the Terang Pilot Challenge.")}</strong>{" "}
              {tx("_Pilot_ terbatas membuktikan nilai sebelum perusahaan memilih paket berlangganan.", "A limited pilot proves value before the company picks a subscription plan.")}
            </p>
          </div>
          <div className="mt-3 space-y-3">
            {PRICING_TIERS.map((p) => {
              const active = p.id === tierId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setTierId(p.id)}
                  aria-pressed={active}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-2xl p-4 text-left ring-1 transition",
                    active ? "bg-one-gradient text-white ring-transparent shadow-card" : "bg-surface ring-line hover:ring-one/40",
                  )}
                >
                  <span>
                    <span className="block font-semibold">{p.name}</span>
                    <span className={cn("block text-xs", active ? "text-white/80" : "text-muted-strong")}>{tx(p.fit)}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="tabular block font-display text-lg font-semibold">{formatIDRCompact(p.monthly)}</span>
                    <span className={cn("block text-[11px]", active ? "text-white/80" : "text-muted")}>/ {t("bulan", "month")}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-muted">
            {t("Pilih paket untuk melihat biaya layanannya di estimator ROI.", "Pick a plan to see its service cost in the ROI estimator.")}
          </p>
        </div>
      </div>
    </div>
  );
}
