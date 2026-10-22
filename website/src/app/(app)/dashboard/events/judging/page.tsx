import type { Metadata } from "next";
import { EventsJudgingPage } from "@/components/dashboard/events-pages";

export const metadata: Metadata = { title: "Penjurian · Terang Events" };

export default function Page() {
  return <EventsJudgingPage />;
}
