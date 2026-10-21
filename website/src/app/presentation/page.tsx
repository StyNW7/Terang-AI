import type { Metadata } from "next";
import { PresentationMode } from "@/components/presentation/presentation-mode";

export const metadata: Metadata = { title: "Mode Presentasi" };

export default function PresentationPage() {
  return <PresentationMode />;
}
