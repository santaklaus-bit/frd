"use server";

import { revalidatePath } from "next/cache";
import { saveBlogPost, deleteBlogPost as removeBlogPost } from "@/lib/content-manager";
import fs from "fs/promises";
import path from "path";

export async function createOrUpdateBlogPost(formData: FormData) {
  const slug = formData.get("slug") as string;
  const titleFr = formData.get("titleFr") as string;
  const titleEn = formData.get("titleEn") as string;
  const descriptionFr = formData.get("descriptionFr") as string;
  const descriptionEn = formData.get("descriptionEn") as string;
  const date = formData.get("date") as string;
  const contentFr = formData.get("contentFr") as string;
  const contentEn = formData.get("contentEn") as string;
  const authorName = formData.get("authorName") as string;
  const readTimeFr = formData.get("readTimeFr") as string;
  const readTimeEn = formData.get("readTimeEn") as string;
  const imageCaptionFr = formData.get("imageCaptionFr") as string || "";
  const imageCaptionEn = formData.get("imageCaptionEn") as string || "";
  const pdfUrlFr = formData.get("pdfUrlFr") as string || "";
  const pdfUrlEn = formData.get("pdfUrlEn") as string || "";
  const audioUrlFr = formData.get("audioUrlFr") as string || "";
  const audioUrlEn = formData.get("audioUrlEn") as string || "";
  
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
    title: { fr: titleFr, en: titleEn },
    description: { fr: descriptionFr, en: descriptionEn },
    date,
    thumbnail: thumbnailUrl || "",
    authorName: authorName || "",
    authorPhoto: authorPhotoUrl || "",
    imageCaption: { fr: imageCaptionFr, en: imageCaptionEn },
    pdfUrl: { fr: pdfUrlFr, en: pdfUrlEn },
    audioUrl: { fr: audioUrlFr, en: audioUrlEn },
  };

  const content = { fr: contentFr, en: contentEn };
  const readTime = { fr: readTimeFr, en: readTimeEn };

  await saveBlogPost(slug, frontmatter, content, readTime);
  revalidatePath("/admin/blog");
  revalidatePath("/[lang]/blog", "layout");
}

export async function deleteBlogPost(slug: string) {
  await removeBlogPost(slug);
  revalidatePath("/admin/blog");
  revalidatePath("/[lang]/blog", "layout");
}
