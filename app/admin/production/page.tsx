import { getData } from "@/lib/content-manager";
import ProductionManager from "@/components/admin/production-manager";

export const dynamic = "force-dynamic";

export default async function ProductionAdminPage() {
  const production = await getData("production");

  return <ProductionManager initialData={production} />;
}
