import { getDictionary } from "@/lib/content-manager";
import DictionaryEditor from "@/components/admin/dictionary-editor";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const fr = await getDictionary("fr");
  const en = await getDictionary("en");

  return <DictionaryEditor frInitial={fr} enInitial={en} />;
}
