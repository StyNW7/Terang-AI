import type { Metadata } from "next";
import { EventsDemo } from "@/components/events/events-demo";

export const metadata: Metadata = { title: "Demo Terang Events" };

export default function EventsDemoPage() {
  return <EventsDemo />;
}
