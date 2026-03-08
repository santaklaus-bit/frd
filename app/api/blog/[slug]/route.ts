import { NextRequest, NextResponse } from "next/server";
import { deleteBlogPost, saveBlogPost } from "@/lib/content-manager";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const BLOG_PATH = path.join(process.cwd(), "blog/content");

// GET: Retrieve a single blog post by slug
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const filePath = path.join(BLOG_PATH, `${slug}.mdx`);

    let content: string;
    try {
      content = await fs.readFile(filePath, "utf-8");
    } catch {
      return NextResponse.json(
        { error: "Blog post not found." },
        { status: 404 }
      );
    }

    const { data: frontmatter, content: body } = matter(content);

    return NextResponse.json({
      post: {
        slug,
        ...frontmatter,
        content: body,
      },
    });
  } catch (error) {
    console.error("[GET /api/blog/[slug]]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// PUT: Update a blog post by slug
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    if (!body.title || !body.date || !body.content) {
      return NextResponse.json(
        { error: "title, date, and content are required." },
        { status: 400 }
      );
    }

    const frontmatter = {
      title: body.title,
      date: body.date,
      description: body.description ?? "",
      thumbnail: body.thumbnail ?? "",
    };

    await saveBlogPost(slug, frontmatter, body.content);

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("[PUT /api/blog/[slug]]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// DELETE: Remove a blog post
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    try {
      await deleteBlogPost(slug);
    } catch {
      return NextResponse.json(
        { error: "Blog post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/blog/[slug]]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
