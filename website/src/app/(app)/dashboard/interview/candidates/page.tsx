import type { Metadata } from "next";
import { InterviewCandidatesPage } from "@/components/dashboard/interview-pages";

export const metadata: Metadata = { title: "Kandidat · AI Interview" };

export default function Page() {
  return <InterviewCandidatesPage />;
}
