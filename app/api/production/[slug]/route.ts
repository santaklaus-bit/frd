import { NextRequest, NextResponse } from "next/server";
import { getData, saveData } from "@/lib/content-manager";

// DELETE: Remove a production item by slug
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const production = await getData("production");
    const filtered = production.filter((p: any) => p.slug !== slug);

    if (filtered.length === production.length) {
      return NextResponse.json(
        { error: "Production item not found." },
        { status: 404 }
      );
    }

    await saveData("production", filtered);
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
    const production = await getData("production");
    const index = production.findIndex((p: any) => p.slug === slug);

    if (index === -1) {
      return NextResponse.json(
        { error: "Production item not found." },
        { status: 404 }
      );
    }

    production[index] = { ...production[index], ...body };
    await saveData("production", production);

    return NextResponse.json({ success: true, item: production[index] });
  } catch (error) {
    console.error("[PUT /api/production/[slug]]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
