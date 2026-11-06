import { getData } from "@/lib/content-manager";
import ProjectsList from "@/components/admin/projects-list";

export const dynamic = "force-dynamic";

export default async function ProjectsAdminPage() {
  const projects = await getData("projects");

  return <ProjectsList initialData={projects} />;
}
