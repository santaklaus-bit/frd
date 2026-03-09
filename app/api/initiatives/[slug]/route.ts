import { NextRequest, NextResponse } from "next/server";
import { Initiative } from "@/lib/db/models";

// DELETE: Remove an initiative by slug
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const count = await Initiative.destroy({ where: { slug } });

    if (count === 0) {
      return NextResponse.json(
        { error: "Initiative not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/initiatives/[slug]]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// PUT: Update a single initiative by slug
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    
    const initiative = await Initiative.findOne({ where: { slug } });

    if (!initiative) {
      return NextResponse.json(
        { error: "Initiative not found." },
        { status: 404 }
      );
    }

    // Map frontend structure to DB structure if provided
    const updateData: any = {};
    if (body.title) {
      if (body.title.fr) updateData.titleFr = body.title.fr;
      if (body.title.en) updateData.titleEn = body.title.en;
    }
    if (body.description) {
      if (body.description.fr) updateData.descriptionFr = body.description.fr;
      if (body.description.en) updateData.descriptionEn = body.description.en;
    }
    if (body.category) {
      if (body.category.fr) updateData.categoryFr = body.category.fr;
      if (body.category.en) updateData.categoryEn = body.category.en;
    }
    if (body.icon) updateData.icon = body.icon;
    if (body.link !== undefined) updateData.link = body.link;
    if (body.order !== undefined) updateData.order = body.order;

    await initiative.update(updateData);

    return NextResponse.json({ success: true, initiative: body });
  } catch (error) {
    console.error("[PUT /api/initiatives/[slug]]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

