import type { Metadata } from "next";
import { InterviewPortalPage } from "@/components/dashboard/interview-pages";

export const metadata: Metadata = { title: "Portal Kandidat · AI Interview" };

export default function Page() {
  return <InterviewPortalPage />;
}
