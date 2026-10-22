import type { Metadata } from "next";
import { EventsTemplatesPage } from "@/components/dashboard/events-pages";

export const metadata: Metadata = { title: "Template · Terang Events" };

export default function Page() {
  return <EventsTemplatesPage />;
}
