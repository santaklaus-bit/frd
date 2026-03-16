import { getData } from "@/lib/content-manager";
import ProductionManager from "@/components/admin/production-manager";

export const dynamic = "force-dynamic";

export default async function ProjectsAdminPage() {
  const projects = await getData("projects");

  return <ProductionManager initialData={projects} />;
}
