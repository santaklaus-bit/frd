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
  const authorName = formData.get("authorName") as string;
  const readTime = formData.get("readTime") as string;
  const imageCaption = formData.get("imageCaption") as string || "";
  
  const thumbnailData = formData.get("thumbnail");
  let thumbnailUrl = formData.get("currentThumbnail") as string || "";

  if (thumbnailData instanceof File && thumbnailData.size > 0) {
    const bytes = await thumbnailData.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${thumbnailData.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);
    thumbnailUrl = `/uploads/${filename}`;
  } else if (typeof thumbnailData === "string" && thumbnailData.startsWith("/")) {
    thumbnailUrl = thumbnailData;
  }

  const authorPhotoData = formData.get("authorPhoto");
  let authorPhotoUrl = formData.get("currentAuthorPhoto") as string || "";

  if (authorPhotoData instanceof File && authorPhotoData.size > 0) {
    const bytes = await authorPhotoData.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `author-${Date.now()}-${authorPhotoData.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);
    authorPhotoUrl = `/uploads/${filename}`;
  } else if (typeof authorPhotoData === "string" && authorPhotoData.startsWith("/")) {
    authorPhotoUrl = authorPhotoData;
  }

  const frontmatter = {
    title,
    date,
    description,
    thumbnail: thumbnailUrl || "",
    authorName: authorName || "",
    authorPhoto: authorPhotoUrl || "",
    imageCaption,
  };

  await saveBlogPost(slug, frontmatter, content, readTime);
  revalidatePath("/admin/blog");
  revalidatePath("/[lang]/blog", "layout");
}

export async function deleteBlogPost(slug: string) {
  await removeBlogPost(slug);
  revalidatePath("/admin/blog");
  revalidatePath("/[lang]/blog", "layout");
}
