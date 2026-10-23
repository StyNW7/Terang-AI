export interface NavLink {
  label: string;
  href: string;
  description?: string;
  icon: string; // lucide icon key resolved in the nav component
  tag?: "ONE" | "ACE" | "Demo" | "Usulan";
}

export interface NavGroup {
  label: string;
  href?: string;
  children?: NavLink[];
}

/* ------------------------------------------------------------------
   Public site
------------------------------------------------------------------- */
export const MAIN_NAV: NavGroup[] = [
  { label: "Perusahaan", href: "/company" },
  {
    label: "Produk",
    children: [
      { label: "Dua Produk B2B", href: "/products", description: "Bandingkan kedua produk dalam satu halaman", icon: "boxes" },
      { label: "Terang Events", href: "/products/events", description: "EventTech untuk kompetisi & acara", icon: "calendar" },
      { label: "AI Candidate Interview", href: "/products/interview", description: "HRTech wawancara berbasis bukti", icon: "brain" },
    ],
  },
  { label: "Strategy Lab", href: "/strategy-lab" },
  {
    label: "Strategi",
    children: [
      { label: "ONE Strategy", href: "/strategies/one", description: "PRO — fokus pada satu produk", icon: "target", tag: "ONE" },
      { label: "ACE Strategy", href: "/strategies/ace", description: "KONTRA — dua produk, satu mesin", icon: "layers", tag: "ACE" },
      { label: "Simulator ONE vs ACE", href: "/dashboard/simulator", description: "Bandingkan dampak dengan asumsi sama", icon: "scale" },
    ],
  },
  { label: "Referensi", href: "/references" },
];

/* ------------------------------------------------------------------
   Dashboards — three separate workspaces
------------------------------------------------------------------- */
export type WorkspaceId = "admin" | "events" | "interview";

export interface Workspace {
  id: WorkspaceId;
  label: string;
  short: string;
  description: string;
  icon: string;
  base: string;
  /** Tailwind classes for the workspace badge. */
  accent: string;
  groups: { group: string; links: NavLink[] }[];
}

export const WORKSPACES: Workspace[] = [
  {
    id: "admin",
    label: "Super Admin",
    short: "Super Admin",
    description: "Kendali portofolio & simulasi ONE vs ACE",
    icon: "shield",
    base: "/dashboard",
    accent: "bg-[linear-gradient(135deg,#1f4f84,#0b1d36)] text-white",
    groups: [
      {
        group: "Kendali",
        links: [
          { label: "Ringkasan", href: "/dashboard", icon: "dashboard", description: "Gambaran seluruh portofolio" },
          { label: "Kontrol Strategi", href: "/dashboard/strategy", icon: "sliders", description: "Atur mode ONE / ACE" },
        ],
      },
      {
        group: "Simulasi & Analitik",
        links: [
          { label: "Simulator ONE vs ACE", href: "/dashboard/simulator", icon: "scale", description: "Dampak finansial 12 bulan" },
          { label: "Kapasitas Tim", href: "/dashboard/operations", icon: "gauge", description: "Tim, anggaran & sprint", tag: "ACE" },
          { label: "Portofolio", href: "/dashboard/portfolio", icon: "chart", description: "KPI & decision gate" },
        ],
      },
    ],
  },
  {
    id: "events",
    label: "Terang Events",
    short: "Terang Events",
    description: "Kelola kompetisi, acara & penjurian",
    icon: "calendar",
    base: "/dashboard/events",
    accent: "bg-events-gradient text-white",
    groups: [
      {
        group: "Kelola",
        links: [
          { label: "Ringkasan", href: "/dashboard/events", icon: "dashboard", description: "KPI event, tenggat & progres" },
          { label: "Daftar Event", href: "/dashboard/events/list", icon: "calendar", description: "Cari, edit & duplikasi event" },
          { label: "Buat Event", href: "/dashboard/events/create", icon: "plus", description: "Wizard 6 langkah membuat event baru" },
          { label: "Template", href: "/dashboard/events/templates", icon: "sparkles", tag: "ACE", description: "Smart Event Templates siap pakai" },
          { label: "Repeat Planner", href: "/dashboard/events/repeat", icon: "repeat", tag: "ACE", description: "Ulangi event lama untuk edisi baru" },
        ],
      },
      {
        group: "Operasional",
        links: [
          { label: "Peserta", href: "/dashboard/events/participants", icon: "users", description: "Verifikasi pendaftar & status bayar" },
          { label: "Penjurian", href: "/dashboard/events/judging", icon: "gavel", description: "Nilai submisi dengan rubrik & lihat peringkat juri" },
          { label: "Analitik", href: "/dashboard/events/analytics", icon: "barchart", tag: "ACE", description: "Funnel registrasi & sumber konversi" },
          { label: "Keuangan", href: "/dashboard/events/finance", icon: "wallet", description: "Transaksi, refund & dana diterima" },
        ],
      },
      {
        group: "Pratinjau",
        links: [{ label: "Portal Peserta", href: "/dashboard/events/portal", icon: "ticket", description: "Lihat dari sisi peserta" }],
      },
    ],
  },
  {
    id: "interview",
    label: "AI Candidate Interview",
    short: "AI Interview",
    description: "Rekrutmen terstruktur berbasis bukti",
    icon: "brain",
    base: "/dashboard/interview",
    accent: "bg-one-gradient text-white",
    groups: [
      {
        group: "Rekrutmen",
        links: [
          { label: "Ringkasan", href: "/dashboard/interview", icon: "dashboard", description: "Lowongan, tinjauan tertunda & audit" },
          { label: "Lowongan", href: "/dashboard/interview/jobs", icon: "briefcase", description: "Posisi & bobot kompetensi" },
          { label: "Interview Builder", href: "/dashboard/interview/builder", icon: "wand", description: "Susun & publikasikan pertanyaan wawancara" },
          { label: "Kandidat", href: "/dashboard/interview/candidates", icon: "users", description: "Undang & pantau kandidat" },
          { label: "Laporan Bukti", href: "/dashboard/interview/reports", icon: "filesearch", description: "Nilai rubrik + kutipan jawaban kandidat" },
        ],
      },
      {
        group: "Tata Kelola",
        links: [{ label: "Responsible AI", href: "/dashboard/interview/responsible-ai", icon: "shieldcheck", description: "Tinjauan manusia, privasi & audit trail" }],
      },
      {
        group: "Pratinjau",
        links: [{ label: "Portal Kandidat", href: "/dashboard/interview/portal", icon: "user", description: "Lihat dari sisi kandidat" }],
      },
    ],
  },
];

export function workspaceFor(pathname: string): Workspace {
  if (pathname.startsWith("/dashboard/events")) return WORKSPACES[1];
  if (pathname.startsWith("/dashboard/interview")) return WORKSPACES[2];
  return WORKSPACES[0];
}

export function activeLink(pathname: string, ws: Workspace): NavLink | undefined {
  const links = ws.groups.flatMap((g) => g.links);
  // Longest matching href wins so "/dashboard/events" doesn't shadow "/dashboard/events/list".
  return links
    .filter((l) => pathname === l.href || (l.href !== ws.base && pathname.startsWith(`${l.href}/`)))
    .sort((a, b) => b.href.length - a.href.length)[0];
}

export const GUIDED_FLOW = [
  { href: "/company", label: "Perusahaan", title: "Kenali Terang AI", description: "Profil, perjalanan bisnis & positioning", icon: "compass" },
  { href: "/products", label: "Dua Produk", title: "Dua produk B2B", description: "Terang Events & AI Candidate Interview", icon: "boxes" },
  { href: "/strategy-lab", label: "Dilema", title: "Dilema strategis", description: "Tiga tantangan & pertanyaan kunci", icon: "scale" },
  { href: "/strategies/one", label: "ONE", title: "ONE Strategy", description: "Fokus penuh pada satu produk", icon: "target" },
  { href: "/strategies/ace", label: "ACE", title: "ACE Strategy", description: "Dua produk, satu mesin koordinasi", icon: "layers" },
  { href: "/dashboard/simulator", label: "Simulasi", title: "Simulator ONE vs ACE", description: "Uji dampak finansial dengan asumsi sama", icon: "chart" },
];

/** Index of the guided-flow step a page belongs to (product sub-pages count as "Dua Produk"). */
export function guidedStepFor(pathname: string): number {
  if (pathname.startsWith("/products")) return 1;
  return GUIDED_FLOW.findIndex((s) => s.href === pathname);
}
