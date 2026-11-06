import { getData } from "@/lib/content-manager";
import ExpertiseList from "@/components/admin/expertise-list";

export const dynamic = "force-dynamic";

export default async function InitiativesAdminPage() {
  const initiatives = await getData("initiatives");

  return <ExpertiseList initialData={initiatives} />;
}
