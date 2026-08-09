import { getData } from "@/lib/content-manager";
import ExpertiseForm from "@/components/admin/expertise-form";

export const dynamic = "force-dynamic";

export default async function CreateExpertisePage() {
  const allExpertises = await getData("expertise");
  return <ExpertiseForm allExpertises={allExpertises} />;
}
