import { Suspense } from "react";
import type { Metadata } from "next";
import { EventsCreatePage } from "@/components/dashboard/events-pages";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";

export const metadata: Metadata = { title: "Buat Event · Terang Events" };

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <EventsCreatePage />
    </Suspense>
  );
}
