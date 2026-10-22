import type { Metadata } from "next";
import { InterviewResponsibleAiPage } from "@/components/dashboard/interview-pages";

export const metadata: Metadata = { title: "Responsible AI · AI Interview" };

export default function Page() {
  return <InterviewResponsibleAiPage />;
}
