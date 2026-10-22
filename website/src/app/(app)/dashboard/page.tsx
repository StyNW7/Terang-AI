import type { Metadata } from "next";
import { AdminOverviewPage } from "@/components/dashboard/admin-pages";

export const metadata: Metadata = { title: "Super Admin" };

export default function Page() {
  return <AdminOverviewPage />;
}
