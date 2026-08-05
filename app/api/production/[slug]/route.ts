import { NextRequest, NextResponse } from "next/server";
import { Production } from "@/lib/db/models";

// DELETE: Remove a production item by slug
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const count = await Production.destroy({ where: { slug } });

    if (count === 0) {
      return NextResponse.json(
        { error: "Production item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/production/[slug]]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// PUT: Update a single production item by slug
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    
    const production = await Production.findOne({ where: { slug } });

    if (!production) {
      return NextResponse.json(
        { error: "Production item not found." },
        { status: 404 }
      );
    }

    // Map frontend JSON structure to DB fields
    const updateData: any = {};
    if (body.title) {
      if (body.title.fr) updateData.titleFr = body.title.fr;
      if (body.title.en) updateData.titleEn = body.title.en;
    }
    if (body.description) {
      if (body.description.fr) updateData.descriptionFr = body.description.fr;
      if (body.description.en) updateData.descriptionEn = body.description.en;
    }
    if (body.details) {
      if (body.details.fr) updateData.detailsFr = body.details.fr;
      if (body.details.en) updateData.detailsEn = body.details.en;
    }
    if (body.icon) updateData.icon = body.icon;
    if (body.href) updateData.href = body.href;
    if (body.order !== undefined) updateData.order = body.order;

    await production.update(updateData);

    return NextResponse.json({ success: true, item: body });
  } catch (error) {
    console.error("[PUT /api/production/[slug]]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

