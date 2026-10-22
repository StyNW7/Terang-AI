import { Suspense } from "react";
import type { Metadata } from "next";
import { InterviewBuilderPage } from "@/components/dashboard/interview-pages";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";

export const metadata: Metadata = { title: "Interview Builder · AI Interview" };

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <InterviewBuilderPage />
    </Suspense>
  );
}
