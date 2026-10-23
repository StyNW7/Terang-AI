import { L, type Txt } from "@/lib/i18n-core";

export interface NavLink {
  label: Txt;
  href: string;
  description?: Txt;
  icon: string; // lucide icon key resolved in the nav component
  tag?: "ONE" | "ACE" | "Demo" | "Usulan";
}

export interface NavGroup {
  label: Txt;
  href?: string;
  children?: NavLink[];
}

/* ------------------------------------------------------------------
   Public site
------------------------------------------------------------------- */
export const MAIN_NAV: NavGroup[] = [
  { label: L("Perusahaan", "Company"), href: "/company" },
  {
    label: L("Produk", "Products"),
    children: [
      { label: L("Dua Produk B2B", "Two B2B Products"), href: "/products", description: L("Bandingkan kedua produk dalam satu halaman", "Compare both products on one page"), icon: "boxes" },
      { label: "Terang Events", href: "/products/events", description: L("EventTech untuk kompetisi & acara", "EventTech for competitions & events"), icon: "calendar" },
      { label: "AI Candidate Interview", href: "/products/interview", description: L("HRTech wawancara berbasis bukti", "Evidence-based interviewing HRTech"), icon: "brain" },
    ],
  },
  { label: "Strategy Lab", href: "/strategy-lab" },
  {
    label: L("Strategi", "Strategy"),
    children: [
      { label: "ONE Strategy", href: "/strategies/one", description: L("PRO — fokus pada satu produk", "PRO — focus on one product"), icon: "target", tag: "ONE" },
      { label: "ACE Strategy", href: "/strategies/ace", description: L("KONTRA — dua produk, satu mesin", "CONTRA — two products, one engine"), icon: "layers", tag: "ACE" },
      { label: L("Simulator ONE vs ACE", "ONE vs ACE Simulator"), href: "/dashboard/simulator", description: L("Bandingkan dampak dengan asumsi sama", "Compare impact under the same assumptions"), icon: "scale" },
    ],
  },
  { label: L("Referensi", "References"), href: "/references" },
];

/* ------------------------------------------------------------------
   Dashboards — three separate workspaces
------------------------------------------------------------------- */
export type WorkspaceId = "admin" | "events" | "interview";

export interface Workspace {
  id: WorkspaceId;
  label: string;
  short: string;
  description: Txt;
  icon: string;
  base: string;
  /** Tailwind classes for the workspace badge. */
  accent: string;
  groups: { group: Txt; links: NavLink[] }[];
}

export const WORKSPACES: Workspace[] = [
  {
    id: "admin",
    label: "Super Admin",
    short: "Super Admin",
    description: L("Kendali portofolio & simulasi ONE vs ACE", "Portfolio control & ONE vs ACE simulation"),
    icon: "shield",
    base: "/dashboard",
    accent: "bg-[linear-gradient(135deg,#1f4f84,#0b1d36)] text-white",
    groups: [
      {
        group: L("Kendali", "Control"),
        links: [
          { label: L("Ringkasan", "Overview"), href: "/dashboard", icon: "dashboard", description: L("Gambaran seluruh portofolio", "A view of the whole portfolio") },
          { label: L("Kontrol Strategi", "Strategy Control"), href: "/dashboard/strategy", icon: "sliders", description: L("Atur mode ONE / ACE", "Set the ONE / ACE mode") },
        ],
      },
      {
        group: L("Simulasi & Analitik", "Simulation & Analytics"),
        links: [
          { label: L("Simulator ONE vs ACE", "ONE vs ACE Simulator"), href: "/dashboard/simulator", icon: "scale", description: L("Dampak finansial 12 bulan", "12-month financial impact") },
          { label: L("Kapasitas Tim", "Team Capacity"), href: "/dashboard/operations", icon: "gauge", description: L("Tim, anggaran & _sprint_", "Team, budget & sprints"), tag: "ACE" },
          { label: L("Portofolio", "Portfolio"), href: "/dashboard/portfolio", icon: "chart", description: L("KPI & _decision gate_", "KPIs & decision gate") },
        ],
      },
    ],
  },
  {
    id: "events",
    label: "Terang Events",
    short: "Terang Events",
    description: L("Kelola kompetisi, acara & penjurian", "Manage competitions, events & judging"),
    icon: "calendar",
    base: "/dashboard/events",
    accent: "bg-events-gradient text-white",
    groups: [
      {
        group: L("Kelola", "Manage"),
        links: [
          { label: L("Ringkasan", "Overview"), href: "/dashboard/events", icon: "dashboard", description: L("KPI _event_, tenggat & progres", "Event KPIs, deadlines & progress") },
          { label: L("Daftar Event", "Event List"), href: "/dashboard/events/list", icon: "calendar", description: L("Cari, edit & duplikasi _event_", "Search, edit & duplicate events") },
          { label: L("Buat Event", "Create Event"), href: "/dashboard/events/create", icon: "plus", description: L("_Wizard_ 6 langkah membuat _event_ baru", "6-step wizard to create a new event") },
          { label: "Template", href: "/dashboard/events/templates", icon: "sparkles", tag: "ACE", description: L("Smart Event Templates siap pakai", "Ready-to-use Smart Event Templates") },
          { label: "Repeat Planner", href: "/dashboard/events/repeat", icon: "repeat", tag: "ACE", description: L("Ulangi _event_ lama untuk edisi baru", "Reuse a past event for a new edition") },
        ],
      },
      {
        group: L("Operasional", "Operations"),
        links: [
          { label: L("Peserta", "Participants"), href: "/dashboard/events/participants", icon: "users", description: L("Verifikasi pendaftar & status bayar", "Verify registrants & payment status") },
          { label: L("Penjurian", "Judging"), href: "/dashboard/events/judging", icon: "gavel", description: L("Nilai submisi dengan rubrik & lihat peringkat juri", "Score submissions with rubrics & see the judges' ranking") },
          { label: L("Analitik", "Analytics"), href: "/dashboard/events/analytics", icon: "barchart", tag: "ACE", description: L("_Funnel_ registrasi & sumber konversi", "Registration funnel & conversion sources") },
          { label: L("Keuangan", "Finance"), href: "/dashboard/events/finance", icon: "wallet", description: L("Transaksi, _refund_ & dana diterima", "Transactions, refunds & funds received") },
        ],
      },
      {
        group: L("Pratinjau", "Preview"),
        links: [{ label: L("Portal Peserta", "Participant Portal"), href: "/dashboard/events/portal", icon: "ticket", description: L("Lihat dari sisi peserta", "See it from the participant's side") }],
      },
    ],
  },
  {
    id: "interview",
    label: "AI Candidate Interview",
    short: "AI Interview",
    description: L("Rekrutmen terstruktur berbasis bukti", "Structured, evidence-based hiring"),
    icon: "brain",
    base: "/dashboard/interview",
    accent: "bg-one-gradient text-white",
    groups: [
      {
        group: L("Rekrutmen", "Recruitment"),
        links: [
          { label: L("Ringkasan", "Overview"), href: "/dashboard/interview", icon: "dashboard", description: L("Lowongan, tinjauan tertunda & audit", "Vacancies, pending reviews & audit") },
          { label: L("Lowongan", "Vacancies"), href: "/dashboard/interview/jobs", icon: "briefcase", description: L("Posisi & bobot kompetensi", "Roles & competency weights") },
          { label: "Interview Builder", href: "/dashboard/interview/builder", icon: "wand", description: L("Susun & publikasikan pertanyaan wawancara", "Compose & publish interview questions") },
          { label: L("Kandidat", "Candidates"), href: "/dashboard/interview/candidates", icon: "users", description: L("Undang & pantau kandidat", "Invite & track candidates") },
          { label: L("Laporan Bukti", "Evidence Reports"), href: "/dashboard/interview/reports", icon: "filesearch", description: L("Nilai rubrik + kutipan jawaban kandidat", "Rubric scores + quotes from candidate answers") },
        ],
      },
      {
        group: L("Tata Kelola", "Governance"),
        links: [{ label: "Responsible AI", href: "/dashboard/interview/responsible-ai", icon: "shieldcheck", description: L("Tinjauan manusia, privasi & _audit trail_", "Human review, privacy & audit trail") }],
      },
      {
        group: L("Pratinjau", "Preview"),
        links: [{ label: L("Portal Kandidat", "Candidate Portal"), href: "/dashboard/interview/portal", icon: "user", description: L("Lihat dari sisi kandidat", "See it from the candidate's side") }],
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

export const GUIDED_FLOW: { href: string; label: Txt; title: Txt; description: Txt; icon: string }[] = [
  { href: "/company", label: L("Perusahaan", "Company"), title: L("Kenali Terang AI", "Meet Terang AI"), description: L("Profil, perjalanan bisnis & _positioning_", "Profile, business journey & positioning"), icon: "compass" },
  { href: "/products", label: L("Dua Produk", "Two Products"), title: L("Dua produk B2B", "Two B2B products"), description: "Terang Events & AI Candidate Interview", icon: "boxes" },
  { href: "/strategy-lab", label: L("Dilema", "Dilemma"), title: L("Dilema strategis", "The strategic dilemma"), description: L("Tiga tantangan & pertanyaan kunci", "Three challenges & the key question"), icon: "scale" },
  { href: "/strategies/one", label: "ONE", title: "ONE Strategy", description: L("Fokus penuh pada satu produk", "Full focus on one product"), icon: "target" },
  { href: "/strategies/ace", label: "ACE", title: "ACE Strategy", description: L("Dua produk, satu mesin koordinasi", "Two products, one coordination engine"), icon: "layers" },
  { href: "/dashboard/simulator", label: L("Simulasi", "Simulation"), title: L("Simulator ONE vs ACE", "ONE vs ACE Simulator"), description: L("Uji dampak finansial dengan asumsi sama", "Test the financial impact on the same assumptions"), icon: "chart" },
];

/** Index of the guided-flow step a page belongs to (product sub-pages count as "Dua Produk"). */
export function guidedStepFor(pathname: string): number {
  if (pathname.startsWith("/products")) return 1;
  return GUIDED_FLOW.findIndex((s) => s.href === pathname);
}
