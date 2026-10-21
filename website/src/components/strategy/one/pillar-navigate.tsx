"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Building2, CalendarClock, Clock, Globe, Heart, MessageCircle, Repeat2, Send, ThumbsUp, Users, Video, Wallet } from "lucide-react";
import { useScenarioStore } from "@/store/scenario-store";
import { Funnel } from "@/components/strategy/funnel";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { InfoTip } from "@/components/ui/tooltip";
import { SourceLabel } from "@/components/shared/source-label";
import { LogoMark } from "@/components/shared/brand";
import { formatIDR, formatIDRCompact, formatNumber, formatPercent } from "@/lib/formatters";
import { cn, safeDivide } from "@/lib/utils";

const PIPELINE = [
  { company: "PT Sinar Ritel Nusantara", industry: "Ritel", stage: "Pilot", size: "320 karyawan", value: 54_000_000 },
  { company: "PT Arunika Finansial", industry: "Fintech", stage: "Demo", size: "180 karyawan", value: 38_000_000 },
  { company: "CV Logistik Cakra Mandiri", industry: "Logistik", stage: "Paid", size: "450 karyawan", value: 96_000_000 },
  { company: "PT Kopi Nusa Raya", industry: "F&B", stage: "Lead", size: "260 karyawan", value: 30_000_000 },
  { company: "Talenta Prima Agency", industry: "Agensi rekrutmen", stage: "Pilot", size: "45 recruiter", value: 120_000_000 },
  { company: "PT Bahari Telekomunikasi", industry: "Telekomunikasi", stage: "Demo", size: "600 karyawan", value: 88_000_000 },
  { company: "Klinik Sehat Bersama Group", industry: "Kesehatan", stage: "Lead", size: "210 karyawan", value: 26_000_000 },
  { company: "PT Edukasi Cerdas", industry: "Pendidikan", stage: "Renewal", size: "140 karyawan", value: 42_000_000 },
];
const STAGES = ["Semua", "Lead", "Demo", "Pilot", "Paid", "Renewal"] as const;
const STAGE_TONE: Record<string, "neutral" | "brand" | "sky" | "one" | "success"> = {
  Lead: "neutral",
  Demo: "sky",
  Pilot: "brand",
  Paid: "one",
  Renewal: "success",
};

export function OnePillarNavigate() {
  const assumptions = useScenarioStore((s) => s.assumptions);
  const update = useScenarioStore((s) => s.update);
  const [rates, setRates] = useState({ leadRate: 0.04, demoRate: 0.35, pilotRate: 0.45 });
  const [stageFilter, setStageFilter] = useState<(typeof STAGES)[number]>("Semua");

  // ROI estimator (customer side)
  const [interviews, setInterviews] = useState(120);
  const [minutesSaved, setMinutesSaved] = useState(25);
  const [convertMoney, setConvertMoney] = useState(false);
  const [hourlyCost, setHourlyCost] = useState(75_000);
  const [pricePerInterview, setPricePerInterview] = useState(assumptions.interview.netRevenuePerInterview);

  // Pricing explorer
  const [volume, setVolume] = useState(120);

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
      { label: "Paid Customer", value: paid },
      { label: "Renewal", value: renewal },
    ];
  }, [assumptions, rates]);

  const hoursSaved = (interviews * minutesSaved) / 60;
  const moneyEquivalent = hoursSaved * hourlyCost;
  const toolCost = interviews * pricePerInterview;

  const tiers = [
    { name: "Pilot Terbatas", desc: "1 bulan · s.d. 60 interview · onboarding", cost: () => 4_500_000, note: "Biaya tetap untuk validasi" },
    { name: "Paket per Interview", desc: "Bayar sesuai pemakaian", cost: (v: number) => v * 75_000, note: "Rp 75.000 / interview" },
    { name: "Langganan Perusahaan", desc: "Hingga 300 interview / bulan", cost: (v: number) => (v <= 300 ? 9_500_000 : 9_500_000 + (v - 300) * 45_000), note: "Rp 9,5 jt / bulan" },
  ];
  const tierCosts = tiers.map((t) => ({ ...t, value: t.name === "Pilot Terbatas" && volume > 60 ? Infinity : t.cost(volume) }));
  const best = tierCosts.reduce((a, b) => (b.value < a.value ? b : a));

  const pipeline = PIPELINE.filter((p) => stageFilter === "Semua" || p.stage === stageFilter);

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Persona */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-one">Target customer persona</p>
            <SourceLabel type="illustrative-assumption" compact />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-one-gradient font-display text-xl font-extrabold text-white">SH</span>
            <div>
              <p className="text-lg font-bold text-ink">Sinta Hapsari (fiktif)</p>
              <p className="text-sm text-muted-strong">HR Lead · perusahaan ritel 300+ karyawan</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Tujuan</p>
              <ul className="mt-1.5 space-y-1 text-[13px] text-ink">
                <li>• Rekrut 40+ staf toko per kuartal</li>
                <li>• Standar wawancara konsisten</li>
                <li>• Laporan yang dapat dipertanggungjawabkan</li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Hambatan</p>
              <ul className="mt-1.5 space-y-1 text-[13px] text-ink">
                <li>• Tim HR hanya 3 orang</li>
                <li>• Screening memakan 60% waktu</li>
                <li>• Khawatir soal privasi & keadilan AI</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 rounded-xl bg-one-soft p-3 text-[13px] text-one">
            <strong>Kriteria membeli:</strong> bukti penghematan waktu, kontrol manusia, kepatuhan data, harga yang dapat diprediksi.
          </p>
        </div>

        {/* Campaign concepts */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-line bg-white p-5 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Konsep posting B2B (mockup)</p>
            <div className="mt-3 rounded-2xl border border-line p-4">
              <div className="flex items-center gap-2">
                <LogoMark size={32} />
                <div>
                  <p className="text-sm font-bold text-ink">Terang AI for Business</p>
                  <p className="flex items-center gap-1 text-[11px] text-muted">
                    Promosi · <Globe className="h-3 w-3" />
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-ink">
                Tim HR Anda menghabiskan berjam-jam untuk screening? Coba wawancara terstruktur dengan laporan berbasis bukti — keputusan
                tetap di tangan recruiter. <strong>Daftar pilot 30 hari →</strong>
              </p>
              <div className="mt-3 rounded-xl bg-one-gradient p-4 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/75">Hire Smarter with Terang</p>
                <p className="font-display text-lg font-extrabold">Dari skor generik ke insight berbasis bukti.</p>
              </div>
              <div className="mt-3 flex justify-between text-[11px] font-semibold text-muted">
                <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> Suka</span>
                <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> Komentar</span>
                <span className="flex items-center gap-1"><Repeat2 className="h-3.5 w-3.5" /> Bagikan</span>
                <span className="flex items-center gap-1"><Send className="h-3.5 w-3.5" /> Kirim</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col rounded-3xl bg-navy-gradient p-5 text-white shadow-card">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky">Webinar series</p>
            <p className="mt-2 font-display text-2xl font-extrabold leading-tight">HR Efficiency Clinic</p>
            <p className="mt-2 text-sm text-white/75">Sesi 60 menit untuk HR Lead: membangun rubrik wawancara, mengurangi bias, dan menghitung waktu screening.</p>
            <div className="mt-4 space-y-2 text-[13px]">
              <p className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-sky" /> Kamis bulanan · 15.00 WIB</p>
              <p className="flex items-center gap-2"><Video className="h-4 w-4 text-sky" /> Online · live demo produk</p>
              <p className="flex items-center gap-2"><Users className="h-4 w-4 text-sky" /> Target 80 HR per sesi</p>
            </div>
            <div className="mt-auto pt-5">
              <Heart className="h-5 w-5 text-sky" />
              <p className="mt-1 text-xs text-white/70">Peserta yang memenuhi kriteria ditawari demo enterprise & pilot terbatas.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Funnel */}
      <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-one">Pilot-to-Paid Growth Engine</p>
            <h3 className="text-xl font-extrabold text-ink">Awareness → Lead → Demo → Pilot → Paid → Renewal</h3>
            <p className="mt-1 text-sm text-muted-strong">
              Pilot, konversi & renewal terhubung ke asumsi simulator (satu sumber data). Ubah di sini dan halaman Compare ikut berubah.
            </p>
          </div>
          <SourceLabel type="illustrative-assumption" />
        </div>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-5">
            <Slider label="Awareness → Qualified Lead" value={rates.leadRate * 100} min={1} max={10} step={0.5} onChange={(v) => setRates((r) => ({ ...r, leadRate: v / 100 }))} display={formatPercent(rates.leadRate, 1)} color="#2251c9" />
            <Slider label="Lead → Demo" value={rates.demoRate * 100} min={10} max={70} onChange={(v) => setRates((r) => ({ ...r, demoRate: v / 100 }))} display={formatPercent(rates.demoRate)} color="#2251c9" />
            <Slider label="Demo → Pilot" value={rates.pilotRate * 100} min={15} max={80} onChange={(v) => setRates((r) => ({ ...r, pilotRate: v / 100 }))} display={formatPercent(rates.pilotRate)} color="#2251c9" />
            <div className="rounded-2xl bg-one-soft/60 p-4 ring-1 ring-[#cddaf8]">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-one">Asumsi simulator bersama</p>
              <div className="space-y-4">
                <Slider label="Kapasitas pilot (fokus penuh)" value={assumptions.shared.salesCapacityPilots} min={10} max={80} onChange={(v) => update("shared", "salesCapacityPilots", v)} display={`${assumptions.shared.salesCapacityPilots} pilot`} color="#2251c9" />
                <Slider label="Konversi pilot → berbayar (dasar)" value={Math.round(assumptions.interview.pilotConversion * 100)} min={5} max={80} onChange={(v) => update("interview", "pilotConversion", v / 100)} display={formatPercent(assumptions.interview.pilotConversion)} color="#2251c9" hint={`+ uplift fokus ONE ${formatPercent(assumptions.one.conversionUpliftPp)} (asumsi eksplisit)`} />
                <Slider label="Renewal perusahaan" value={Math.round(assumptions.interview.renewalRate * 100)} min={20} max={100} onChange={(v) => update("interview", "renewalRate", v / 100)} display={formatPercent(assumptions.interview.renewalRate)} color="#2251c9" />
              </div>
            </div>
          </div>
          <div>
            <Funnel stages={funnel} color="linear-gradient(90deg,#4a90e2,#2251c9)" />
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { k: "Pelanggan berbayar", v: formatNumber(funnel[4].value) },
                { k: "Biaya akuisisi pilot", v: formatIDRCompact(assumptions.shared.salesCapacityPilots * assumptions.interview.cacPerPilot) },
                { k: "CAC / pelanggan", v: formatIDRCompact(safeDivide(assumptions.shared.salesCapacityPilots * assumptions.interview.cacPerPilot, funnel[4].value)) },
              ].map((m) => (
                <div key={m.k} className="rounded-xl bg-surface p-3 ring-1 ring-line">
                  <p className="text-[11px] text-muted">{m.k}</p>
                  <p className="tabular font-display text-lg font-extrabold text-ink">{m.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-ink">Contoh lead pipeline</h3>
          <div className="flex flex-wrap gap-1.5">
            {STAGES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStageFilter(s)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 transition",
                  stageFilter === s ? "bg-one text-white ring-one" : "bg-white text-muted-strong ring-line hover:ring-one/40",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs text-muted">
                <th className="py-2 font-semibold">Perusahaan (fiktif)</th>
                <th className="py-2 font-semibold">Industri</th>
                <th className="py-2 font-semibold">Ukuran</th>
                <th className="py-2 font-semibold">Tahap</th>
                <th className="py-2 text-right font-semibold">Nilai potensial / thn</th>
              </tr>
            </thead>
            <tbody>
              {pipeline.map((p) => (
                <motion.tr layout key={p.company} className="border-b border-line/70 last:border-0">
                  <td className="py-2.5 font-semibold text-ink">
                    <span className="flex items-center gap-2"><Building2 className="h-4 w-4 text-muted" /> {p.company}</span>
                  </td>
                  <td className="py-2.5 text-muted-strong">{p.industry}</td>
                  <td className="py-2.5 text-muted-strong">{p.size}</td>
                  <td className="py-2.5"><Badge tone={STAGE_TONE[p.stage]}>{p.stage}</Badge></td>
                  <td className="tabular py-2.5 text-right font-semibold text-ink">{formatIDRCompact(p.value)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {pipeline.length === 0 && <p className="py-6 text-center text-sm text-muted">Tidak ada lead pada tahap ini.</p>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ROI */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-ink">Pilot ROI estimator</h3>
              <p className="text-sm text-muted-strong">Waktu administrasi yang dihemat dipisahkan dari nilai uang.</p>
            </div>
            <InfoTip align="right">
              Penghematan waktu ≠ penghematan uang. Nilai rupiah hanya ditampilkan bila Anda mengaktifkan konversi dengan asumsi biaya per jam
              HR yang eksplisit.
            </InfoTip>
          </div>
          <div className="mt-5 space-y-4">
            <Slider label="Interview per bulan" value={interviews} min={20} max={500} step={10} onChange={setInterviews} display={formatNumber(interviews)} color="#2251c9" />
            <Slider label="Menit admin dihemat / interview" value={minutesSaved} min={5} max={60} onChange={setMinutesSaved} display={`${minutesSaved} menit`} color="#2251c9" />
            <Slider label="Harga per interview (ilustratif)" value={pricePerInterview} min={20_000} max={150_000} step={5_000} onChange={setPricePerInterview} display={formatIDR(pricePerInterview)} color="#2251c9" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-one-soft p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-one"><Clock className="h-3.5 w-3.5" /> Waktu dihemat / bulan</p>
              <p className="tabular font-display text-2xl font-extrabold text-ink">{formatNumber(hoursSaved)} jam</p>
              <p className="text-[11px] text-muted">≈ {formatNumber(hoursSaved / 8)} hari kerja HR</p>
            </div>
            <div className="rounded-2xl bg-surface p-4 ring-1 ring-line">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-strong"><Wallet className="h-3.5 w-3.5" /> Biaya layanan / bulan</p>
              <p className="tabular font-display text-2xl font-extrabold text-ink">{formatIDRCompact(toolCost)}</p>
              <p className="text-[11px] text-muted">{formatNumber(interviews)} × {formatIDR(pricePerInterview)}</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-dashed border-line p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-ink">Konversi waktu ke rupiah (opsional)</p>
              <Switch checked={convertMoney} onChange={setConvertMoney} label="Konversi waktu ke rupiah" />
            </div>
            {convertMoney && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                <Slider className="mt-4" label="Asumsi biaya HR per jam" value={hourlyCost} min={30_000} max={250_000} step={5_000} onChange={setHourlyCost} display={formatIDR(hourlyCost)} color="#2251c9" />
                <p className="mt-3 text-sm text-ink">
                  Nilai waktu setara: <strong className="tabular">{formatIDRCompact(moneyEquivalent)}</strong> / bulan →{" "}
                  <strong className={moneyEquivalent >= toolCost ? "text-[#0b7a5a]" : "text-danger-ink"}>
                    {moneyEquivalent >= toolCost ? "melebihi" : "di bawah"} biaya layanan
                  </strong>
                  . Ini estimasi nilai kapasitas, bukan penghematan kas aktual.
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-ink">Eksplorasi model harga</h3>
              <p className="text-sm text-muted-strong">Bukan harga resmi Terang AI — format usulan untuk diuji saat pilot.</p>
            </div>
            <SourceLabel type="illustrative-assumption" compact />
          </div>
          <Slider className="mt-5" label="Volume interview per bulan" value={volume} min={20} max={600} step={10} onChange={setVolume} display={formatNumber(volume)} color="#2251c9" />
          <div className="mt-5 space-y-3">
            {tierCosts.map((t) => {
              const isBest = t.name === best.name;
              const available = Number.isFinite(t.value);
              return (
                <motion.div
                  layout
                  key={t.name}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-2xl p-4 ring-1 transition",
                    isBest ? "bg-one-gradient text-white ring-transparent shadow-card" : "bg-surface ring-line",
                    !available && "opacity-60",
                  )}
                >
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className={cn("text-xs", isBest ? "text-white/80" : "text-muted-strong")}>{t.desc} · {t.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="tabular font-display text-lg font-extrabold">{available ? formatIDRCompact(t.value) : "—"}</p>
                    <p className={cn("text-[11px]", isBest ? "text-white/80" : "text-muted")}>
                      {available ? `${formatIDR(t.value / volume)} / interview` : "melebihi kuota pilot"}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-muted">Opsi tersorot = biaya per interview terendah pada volume yang dipilih.</p>
        </div>
      </div>
    </div>
  );
}
