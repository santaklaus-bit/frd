import { getData } from "@/lib/content-manager";
import InitiativesManager from "@/components/admin/initiatives-manager";

export default async function InitiativesAdminPage() {
  const initiatives = await getData("initiatives");

  return <InitiativesManager initialData={initiatives} />;
}
