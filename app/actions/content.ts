"use server";

import { revalidatePath } from "next/cache";
import { saveDictionary, saveData, getData } from "@/lib/content-manager";

export async function updateDictionary(lang: "en" | "fr", data: any) {
  await saveDictionary(lang, data);
  revalidatePath("/", "layout");
}

export async function updateData(filename: string, data: any) {
  await saveData(filename, data);
  revalidatePath("/", "layout");
}

export async function saveSingleItem(type: "expertise" | "projects", item: any, originalSlug?: string) {
  const items = await getData(type);
  if (originalSlug) {
    const idx = items.findIndex((i: any) => i.slug === originalSlug);
    if (idx !== -1) items[idx] = item;
    else items.push(item);
  } else {
    items.unshift(item);
  }
  await saveData(type, items);
  revalidatePath("/", "layout");
}

export async function deleteItem(type: "expertise" | "projects", slug: string) {
  const items = await getData(type);
  const newItems = items.filter((i: any) => i.slug !== slug);
  await saveData(type, newItems);
  revalidatePath("/", "layout");
}
