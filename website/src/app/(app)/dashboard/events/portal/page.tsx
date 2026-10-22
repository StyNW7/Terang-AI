import type { Metadata } from "next";
import { EventsPortalPage } from "@/components/dashboard/events-pages";

export const metadata: Metadata = { title: "Portal Peserta · Terang Events" };

export default function Page() {
  return <EventsPortalPage />;
}
