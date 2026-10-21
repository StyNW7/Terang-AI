import type { Metadata } from "next";
import { StrategySimulator } from "@/components/compare/strategy-simulator";

export const metadata: Metadata = { title: "ONE vs ACE Simulator" };

export default function ComparePage() {
  return <StrategySimulator />;
}
