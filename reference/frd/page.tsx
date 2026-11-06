import { getData } from "@/lib/content-manager";
import ExpertiseForm from "@/components/admin/expertise-form";

export const dynamic = "force-dynamic";

export default async function EditExpertisePage({ params }: { params: { slug: string } }) {
  const allExpertise = await getData("expertise");
  const expertise = allExpertise.find((item: any) => item.slug === params.slug);

  if (!expertise) {
    return <div className="p-8">Expertise non trouvée.</div>;
  }

  return <ExpertiseForm initialData={expertise} />;
}
