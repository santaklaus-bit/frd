"use server";

import { revalidatePath } from "next/cache";
import { saveBlogPost, deleteBlogPost as removeBlogPost } from "@/lib/content-manager";
import fs from "fs/promises";
import path from "path";

export async function createOrUpdateBlogPost(formData: FormData) {
  const slug = formData.get("slug") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const content = formData.get("content") as string;
  
  const thumbnailFile = formData.get("thumbnail");
  let thumbnailUrl = formData.get("currentThumbnail") as string;

  if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
    const bytes = await thumbnailFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${thumbnailFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");

    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    thumbnailUrl = `/uploads/${filename}`;
  }

  const frontmatter = {
    title,
    date,
    description,
    thumbnail: thumbnailUrl || "",
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
