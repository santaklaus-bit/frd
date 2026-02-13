"use server";

import { revalidatePath } from "next/cache";
import { saveBlogPost, deleteBlogPost as removeBlogPost } from "@/lib/content-manager";

export async function createOrUpdateBlogPost(formData: FormData) {
  const slug = formData.get("slug") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const thumbnail = formData.get("thumbnail") as string;
  const content = formData.get("content") as string;

  const frontmatter = {
    title,
    date,
    description,
    thumbnail,
  };

  await saveBlogPost(slug, frontmatter, content);
  revalidatePath("/admin/blog");
  revalidatePath("/[lang]/blog", "layout");
}

export async function deleteBlogPost(slug: string) {
  await removeBlogPost(slug);
  revalidatePath("/admin/blog");
  revalidatePath("/[lang]/blog", "layout");
}
