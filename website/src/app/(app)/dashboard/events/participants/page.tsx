import type { Metadata } from "next";
import { EventsParticipantsPage } from "@/components/dashboard/events-pages";

export const metadata: Metadata = { title: "Peserta · Terang Events" };

export default function Page() {
  return <EventsParticipantsPage />;
}
