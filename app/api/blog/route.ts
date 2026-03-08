import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, saveBlogPost } from "@/lib/content-manager";
import { z } from "zod";

const BlogPostSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional().default(""),
  thumbnail: z.string().optional().default(""),
  content: z.string().min(1, "Content is required"),
});

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

    const { slug, title, date, description, thumbnail, content } = parsed.data;

    const frontmatter = {
      title,
      date,
      description,
      thumbnail,
    };

    await saveBlogPost(slug, frontmatter, content);

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
