import type { Metadata } from "next";
import { EventsFinancePage } from "@/components/dashboard/events-pages";

export const metadata: Metadata = { title: "Keuangan · Terang Events" };

export default function Page() {
  return <EventsFinancePage />;
}
