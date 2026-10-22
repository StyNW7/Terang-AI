import type { Metadata } from "next";
import { CommandCenter } from "@/components/operations/command-center";

export const metadata: Metadata = { title: "Kapasitas & Operasional" };

export default function Page() {
  return <CommandCenter />;
}
