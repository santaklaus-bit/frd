import { getData } from "@/lib/content-manager";
import InitiativesManager from "@/components/admin/initiatives-manager";

export const dynamic = "force-dynamic";

export default async function ExpertiseAdminPage() {
  const expertise = await getData("expertise");

  return <InitiativesManager initialData={expertise} />;
}
