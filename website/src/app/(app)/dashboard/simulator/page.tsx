import type { Metadata } from "next";
import { StrategySimulator } from "@/components/compare/strategy-simulator";

export const metadata: Metadata = { title: "Simulator ONE vs ACE" };

export default function Page() {
  return <StrategySimulator />;
}
