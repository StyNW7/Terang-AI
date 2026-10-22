import type { Metadata } from "next";
import { StrategyControlPage } from "@/components/dashboard/admin-pages";

export const metadata: Metadata = { title: "Kontrol Strategi" };

export default function Page() {
  return <StrategyControlPage />;
}
