import type { Metadata } from "next";
import { ProductDetail } from "@/components/company/product-detail";

export const metadata: Metadata = { title: "Terang Events" };

export default function EventsProductPage() {
  return <ProductDetail product="events" />;
}
