import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/cms/auth";
import { AdminPanel } from "@/components/admin/AdminPanel";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Administration — OPUS CORP",
  robots: { index: false, follow: false },
};
export default async function AdminPage({
  params,
}: {
  params: Promise<{ view?: string[] }>;
}) {
  const { view = [] } = await params;
  const user = await currentUser();
  if (!user && view[0] !== "login") redirect("/admin/login");
  if (user && view[0] === "login") redirect("/admin");
  return <AdminPanel user={user} view={view} />;
}
