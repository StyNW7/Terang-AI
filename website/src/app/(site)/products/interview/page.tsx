import type { Metadata } from "next";
import { ProductDetail } from "@/components/company/product-detail";

export const metadata: Metadata = { title: "AI Candidate Interview" };

export default function InterviewProductPage() {
  return <ProductDetail product="interview" />;
}
