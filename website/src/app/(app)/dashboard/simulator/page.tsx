import type { Metadata } from "next";
import { StrategySimulator } from "@/components/compare/strategy-simulator";
import { FinancialProjection } from "@/components/strategy/proposal-targets";

export const metadata: Metadata = { title: "Simulator ONE vs ACE" };

export default function Page() {
  return (
    <div className="space-y-6">
      <StrategySimulator />
      <FinancialProjection />
    </div>
  );
}
