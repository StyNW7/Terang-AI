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
          { label: "Ringkasan", href: "/dashboard/events", icon: "dashboard" },
          { label: "Daftar Event", href: "/dashboard/events/list", icon: "calendar" },
          { label: "Buat Event", href: "/dashboard/events/create", icon: "plus" },
          { label: "Template", href: "/dashboard/events/templates", icon: "sparkles", tag: "ACE" },
          { label: "Repeat Planner", href: "/dashboard/events/repeat", icon: "repeat", tag: "ACE" },
        ],
      },
      {
        group: "Operasional",
        links: [
          { label: "Peserta", href: "/dashboard/events/participants", icon: "users" },
          { label: "Penjurian", href: "/dashboard/events/judging", icon: "gavel" },
          { label: "Analitik", href: "/dashboard/events/analytics", icon: "barchart", tag: "ACE" },
          { label: "Keuangan", href: "/dashboard/events/finance", icon: "wallet" },
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
          { label: "Ringkasan", href: "/dashboard/interview", icon: "dashboard" },
          { label: "Lowongan", href: "/dashboard/interview/jobs", icon: "briefcase" },
          { label: "Interview Builder", href: "/dashboard/interview/builder", icon: "wand" },
          { label: "Kandidat", href: "/dashboard/interview/candidates", icon: "users" },
          { label: "Laporan Bukti", href: "/dashboard/interview/reports", icon: "filesearch" },
        ],
      },
      {
        group: "Tata Kelola",
        links: [{ label: "Responsible AI", href: "/dashboard/interview/responsible-ai", icon: "shieldcheck" }],
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
  { href: "/company", label: "Perusahaan" },
  { href: "/products", label: "Dua Produk" },
  { href: "/strategy-lab", label: "Dilema" },
  { href: "/strategies/one", label: "ONE" },
  { href: "/strategies/ace", label: "ACE" },
  { href: "/dashboard/simulator", label: "Simulasi" },
];
