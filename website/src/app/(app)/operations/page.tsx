import type { Metadata } from "next";
import { CommandCenter } from "@/components/operations/command-center";

export const metadata: Metadata = { title: "ACE Command Center" };

export default function OperationsPage() {
  return <CommandCenter />;
}
