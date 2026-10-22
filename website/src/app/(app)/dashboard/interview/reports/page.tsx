import { Suspense } from "react";
import type { Metadata } from "next";
import { InterviewReportsPage } from "@/components/dashboard/interview-pages";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";

export const metadata: Metadata = { title: "Laporan · AI Interview" };

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <InterviewReportsPage />
    </Suspense>
  );
}
