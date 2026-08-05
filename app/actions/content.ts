"use server";

import { revalidatePath } from "next/cache";
import { saveDictionary, saveData } from "@/lib/content-manager";

export async function updateDictionary(lang: "en" | "fr", data: any) {
  await saveDictionary(lang, data);
  revalidatePath("/", "layout");
}

export async function updateData(filename: string, data: any) {
  await saveData(filename, data);
  revalidatePath("/", "layout");
}
