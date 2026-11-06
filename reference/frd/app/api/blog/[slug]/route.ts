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
        title: { fr: post.titleFr, en: post.titleEn },
        date: post.date,
        description: { fr: post.descriptionFr, en: post.descriptionEn },
        thumbnail: post.thumbnail || "",
        content: { fr: post.contentFr, en: post.contentEn },
        readTime: { fr: post.readTimeFr, en: post.readTimeEn },
        wordCount: { fr: post.wordCountFr, en: post.wordCountEn },
        pdfUrl: { fr: post.pdfUrlFr, en: post.pdfUrlEn },
        audioUrl: { fr: post.audioUrlFr, en: post.audioUrlEn },
        imageCaption: { fr: post.imageCaptionFr, en: post.imageCaptionEn },
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

    const normalize = (field: any) => {
      if (typeof field === "string") {
        return { fr: field, en: field };
      }
      return {
        fr: field?.fr || "",
        en: field?.en || "",
      };
    };

    const title = normalize(body.title);
    const description = normalize(body.description);
    const content = normalize(body.content);
    const pdfUrl = normalize(body.pdfUrl);
    const audioUrl = normalize(body.audioUrl);
    const imageCaption = normalize(body.imageCaption);

    await post.update({
      titleFr: title.fr,
      titleEn: title.en,
      descriptionFr: description.fr,
      descriptionEn: description.en,
      date: body.date,
      thumbnail: body.thumbnail ?? "",
      contentFr: content.fr,
      contentEn: content.en,
      pdfUrlFr: pdfUrl.fr,
      pdfUrlEn: pdfUrl.en,
      audioUrlFr: audioUrl.fr,
      audioUrlEn: audioUrl.en,
      imageCaptionFr: imageCaption.fr,
      imageCaptionEn: imageCaption.en,
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
