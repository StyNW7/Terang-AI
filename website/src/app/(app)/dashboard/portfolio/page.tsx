import type { Metadata } from "next";
import { PortfolioDashboard } from "@/components/portfolio/portfolio-dashboard";

export const metadata: Metadata = { title: "Portofolio & Keputusan" };

export default function Page() {
  return <PortfolioDashboard />;
}
