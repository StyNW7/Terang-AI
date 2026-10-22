import type { Metadata } from "next";
import { InterviewJobsPage } from "@/components/dashboard/interview-pages";

export const metadata: Metadata = { title: "Lowongan · AI Interview" };

export default function Page() {
  return <InterviewJobsPage />;
}
