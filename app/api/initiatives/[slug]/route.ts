import { NextRequest, NextResponse } from "next/server";
import { getData, saveData } from "@/lib/content-manager";

// DELETE: Remove an initiative by slug
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const initiatives = await getData("initiatives");
    const filtered = initiatives.filter((i: any) => i.slug !== slug);

    if (filtered.length === initiatives.length) {
      return NextResponse.json(
        { error: "Initiative not found." },
        { status: 404 }
      );
    }

    await saveData("initiatives", filtered);
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
    const initiatives = await getData("initiatives");
    const index = initiatives.findIndex((i: any) => i.slug === slug);

    if (index === -1) {
      return NextResponse.json(
        { error: "Initiative not found." },
        { status: 404 }
      );
    }

    initiatives[index] = { ...initiatives[index], ...body };
    await saveData("initiatives", initiatives);

    return NextResponse.json({ success: true, initiative: initiatives[index] });
  } catch (error) {
    console.error("[PUT /api/initiatives/[slug]]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
