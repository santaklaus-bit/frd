import { getData } from "@/lib/content-manager";
import ExpertiseList from "@/components/admin/expertise-list";

export const dynamic = "force-dynamic";

export default async function ExpertiseAdminPage() {
  const expertise = await getData("expertise");

  return <ExpertiseList initialData={expertise} />;
}
