import { NextRequest, NextResponse } from "next/server";
import { BlogPost } from "@/lib/db/models";

// GET: Retrieve a single blog post by slug
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const post = await BlogPost.findOne({ where: { slug } });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found." },
        { status: 404 }
      );
    }

    // Convert to format expected by frontend
    return NextResponse.json({
      post: {
        slug: post.slug,
        title: post.title,
        date: post.date,
        description: post.description || "",
        thumbnail: post.thumbnail || "",
        content: post.content,
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

    const post = await BlogPost.findOne({ where: { slug } });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found." },
        { status: 404 }
      );
    }

    await post.update({
      title: body.title,
      date: body.date,
      description: body.description ?? "",
      thumbnail: body.thumbnail ?? "",
      content: body.content,
    });

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

    const count = await BlogPost.destroy({ where: { slug } });

    if (count === 0) {
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
