import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, saveBlogPost } from "@/lib/content-manager";
import { z } from "zod";

const LocalizedField = z.union([
  z.string(),
  z.object({
    fr: z.string().optional().default(""),
    en: z.string().optional().default(""),
  })
]);

const BlogPostSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: LocalizedField,
  date: z.string().min(1, "Date is required"),
  description: LocalizedField.optional(),
  thumbnail: z.string().optional().default(""),
  content: LocalizedField,
  pdfUrl: LocalizedField.optional(),
  audioUrl: LocalizedField.optional(),
  imageCaption: LocalizedField.optional(),
});

const normalize = (field: any) => {
  if (typeof field === "string") {
    return { fr: field, en: field };
  }
  return {
    fr: field?.fr || "",
    en: field?.en || "",
  };
};

// GET: Retrieve all blog posts
export async function GET() {
  try {
    const posts = await getBlogPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("[GET /api/blog]", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts." },
      { status: 500 }
    );
  }
}

// POST: Create or update a blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = BlogPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { slug, title, date, description, thumbnail, content, pdfUrl, audioUrl, imageCaption } = parsed.data;

    const frontmatter = {
      title: normalize(title),
      date,
      description: normalize(description),
      thumbnail,
      pdfUrl: normalize(pdfUrl),
      audioUrl: normalize(audioUrl),
      imageCaption: normalize(imageCaption),
      authorName: "Farid DANKO",
      authorPhoto: "/farid-portrait.webp",
    };

    await saveBlogPost(slug, frontmatter, normalize(content));

    return NextResponse.json(
      { success: true, slug },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/blog]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
