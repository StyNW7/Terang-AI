import { Suspense } from "react";
import type { Metadata } from "next";
import { EventsRepeatPage } from "@/components/dashboard/events-pages";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";

export const metadata: Metadata = { title: "Repeat Planner · Terang Events" };

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <EventsRepeatPage />
    </Suspense>
  );
}
