import { getData } from "@/lib/content-manager";
import ProjectsForm from "@/components/admin/projects-form";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allProjects = await getData("projects");
  const project = allProjects.find((item: any) => item.slug === slug);

  if (!project) {
    return <div className="p-8">Projet non trouvé.</div>;
  }

  return <ProjectsForm initialData={project} />;
}
