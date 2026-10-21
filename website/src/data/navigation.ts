export interface NavLink {
  label: string;
  href: string;
  description?: string;
  icon: string; // lucide icon key resolved in the nav component
  tag?: "ONE" | "ACE" | "Demo";
}

export interface NavGroup {
  label: string;
  href?: string;
  children?: NavLink[];
}

export const MAIN_NAV: NavGroup[] = [
  { label: "Perusahaan", href: "/company" },
  {
    label: "Produk",
    children: [
      { label: "Dua Produk B2B", href: "/products", description: "Perbandingan Terang Events & AI Candidate Interview", icon: "boxes" },
      { label: "Terang Events", href: "/products/events", description: "EventTech untuk penyelenggara acara & kompetisi", icon: "calendar" },
      { label: "AI Candidate Interview", href: "/products/interview", description: "HRTech wawancara terstruktur berbasis bukti", icon: "brain" },
      { label: "Demo Terang Events", href: "/demo/events", description: "Coba alur organizer & peserta", icon: "play", tag: "Demo" },
      { label: "Demo AI Interview", href: "/demo/interview", description: "Coba alur recruiter & kandidat", icon: "play", tag: "Demo" },
    ],
  },
  { label: "Strategy Lab", href: "/strategy-lab" },
  {
    label: "Strategi",
    children: [
      { label: "ONE Strategy", href: "/strategies/one", description: "PRO — One Product, Proven Growth", icon: "target", tag: "ONE" },
      { label: "ACE Strategy", href: "/strategies/ace", description: "KONTRA — Two Products, One Coordinated Engine", icon: "layers", tag: "ACE" },
      { label: "ONE vs ACE Simulator", href: "/compare", description: "Bandingkan dampak strategi dengan asumsi yang sama", icon: "scale" },
    ],
  },
  {
    label: "Analitik",
    children: [
      { label: "ACE Command Center", href: "/operations", description: "Kapasitas tim, anggaran, sprint & rekomendasi", icon: "gauge" },
      { label: "Portfolio Intelligence", href: "/portfolio", description: "KPI produk & matriks keputusan portofolio", icon: "chart" },
      { label: "Strategy Simulator", href: "/compare", description: "Simulasi finansial ONE vs ACE", icon: "scale" },
    ],
  },
  { label: "Referensi", href: "/references" },
];

export const APP_NAV: { group: string; links: NavLink[] }[] = [
  {
    group: "Product Experience",
    links: [
      { label: "Terang Events", href: "/demo/events", icon: "calendar", description: "Organizer & peserta" },
      { label: "AI Candidate Interview", href: "/demo/interview", icon: "brain", description: "Recruiter & kandidat" },
    ],
  },
  {
    group: "Strategi",
    links: [
      { label: "Strategy Lab", href: "/strategy-lab", icon: "compass" },
      { label: "ONE Strategy", href: "/strategies/one", icon: "target", tag: "ONE" },
      { label: "ACE Strategy", href: "/strategies/ace", icon: "layers", tag: "ACE" },
    ],
  },
  {
    group: "Operations & Analytics",
    links: [
      { label: "ACE Command Center", href: "/operations", icon: "gauge" },
      { label: "Portfolio Intelligence", href: "/portfolio", icon: "chart" },
      { label: "ONE vs ACE Simulator", href: "/compare", icon: "scale" },
    ],
  },
];

export const GUIDED_FLOW = [
  { href: "/", label: "Beranda" },
  { href: "/company", label: "Perusahaan" },
  { href: "/products", label: "Dua Produk" },
  { href: "/strategy-lab", label: "Dilema" },
  { href: "/strategies/one", label: "ONE" },
  { href: "/strategies/ace", label: "ACE" },
  { href: "/demo/interview", label: "Demo" },
  { href: "/operations", label: "Kapasitas" },
  { href: "/compare", label: "Perbandingan" },
];
