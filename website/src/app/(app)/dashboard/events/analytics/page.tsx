import type { Metadata } from "next";
import { EventsAnalyticsPage } from "@/components/dashboard/events-pages";

export const metadata: Metadata = { title: "Analitik · Terang Events" };

export default function Page() {
  return <EventsAnalyticsPage />;
}
