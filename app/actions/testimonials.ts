"use server";

import { saveTestimonial as saveToDb, deleteTestimonial as deleteFromDb, getTestimonials } from "@/lib/content-manager";
import { revalidatePath } from "next/cache";

export async function saveTestimonial(
  id: number | undefined,
  data: {
    name: { fr: string; en: string };
    role: { fr: string; en: string };
    content: { fr: string; en: string };
    image?: string;
    certified?: boolean;
    rating?: number;
    order?: number;
  }
) {
  try {
    await saveToDb(id, data);
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error saving testimonial:", error);
    throw error;
  }
}

export async function deleteTestimonial(id: number) {
  try {
    await deleteFromDb(id);
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    throw error;
  }
}

export async function fetchTestimonials() {
  try {
    const testimonials = await getTestimonials();
    return testimonials;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}
