import type { Metadata } from "next";
import { InterviewDemo } from "@/components/interview/interview-demo";

export const metadata: Metadata = { title: "Demo AI Candidate Interview" };

export default function InterviewDemoPage() {
  return <InterviewDemo />;
}
