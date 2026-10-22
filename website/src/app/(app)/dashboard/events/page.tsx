import type { Metadata } from "next";
import { EventsOverviewPage } from "@/components/dashboard/events-pages";

export const metadata: Metadata = { title: "Terang Events" };

export default function Page() {
  return <EventsOverviewPage />;
}
