import type { Metadata } from "next";
import { EventsListPage } from "@/components/dashboard/events-pages";

export const metadata: Metadata = { title: "Daftar Event · Terang Events" };

export default function Page() {
  return <EventsListPage />;
}
