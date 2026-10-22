import type { Metadata } from "next";
import { InterviewOverviewPage } from "@/components/dashboard/interview-pages";

export const metadata: Metadata = { title: "AI Candidate Interview" };

export default function Page() {
  return <InterviewOverviewPage />;
}
