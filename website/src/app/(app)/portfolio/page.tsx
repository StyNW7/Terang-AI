import type { Metadata } from "next";
import { PortfolioDashboard } from "@/components/portfolio/portfolio-dashboard";

export const metadata: Metadata = { title: "Portfolio Intelligence" };

export default function PortfolioPage() {
  return <PortfolioDashboard />;
}
