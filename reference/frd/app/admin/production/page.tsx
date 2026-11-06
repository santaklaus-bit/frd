import { getData } from "@/lib/content-manager";
import ProjectsList from "@/components/admin/projects-list";

export const dynamic = "force-dynamic";

export default async function ProductionAdminPage() {
  const production = await getData("production");

  return <ProjectsList initialData={production} />;
}
