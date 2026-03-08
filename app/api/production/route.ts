import { NextRequest, NextResponse } from "next/server";
import { getData, saveData } from "@/lib/content-manager";
import { z } from "zod";

const LocalizedFieldSchema = z.object({
  fr: z.string(),
  en: z.string(),
});

const ProductionItemSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  icon: z.string().min(1, "Icon is required"),
  title: LocalizedFieldSchema,
  description: LocalizedFieldSchema,
  details: LocalizedFieldSchema,
  href: z.string().min(1, "Href is required"),
  videoUrl: z.string().url().optional().or(z.literal("")),
  order: z.number().optional().default(0),
});

// GET: Retrieve all production items
export async function GET() {
  try {
    const production = await getData("production");
    return NextResponse.json({ production });
  } catch (error) {
    console.error("[GET /api/production]", error);
    return NextResponse.json(
      { error: "Failed to fetch production items." },
      { status: 500 }
    );
  }
}

// PUT: Bulk update all production items (from admin)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Expected an array of production items." },
        { status: 400 }
      );
    }

    const parsedItems = body.map((item) => ProductionItemSchema.safeParse(item));
    const errors = parsedItems
      .map((r, i) => (!r.success ? { index: i, errors: r.error.flatten() } : null))
      .filter(Boolean);

    if (errors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed on one or more items.", details: errors },
        { status: 400 }
      );
    }

    const production = parsedItems.map((r) => (r as any).data);
    await saveData("production", production);

    return NextResponse.json({ success: true, production });
  } catch (error) {
    console.error("[PUT /api/production]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// POST: Add a new production item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = ProductionItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const production = await getData("production");
    const slugExists = production.some((p: any) => p.slug === parsed.data.slug);

    if (slugExists) {
      return NextResponse.json(
        { error: "A production item with this slug already exists." },
        { status: 409 }
      );
    }

    production.push(parsed.data);
    await saveData("production", production);

    return NextResponse.json(
      { success: true, item: parsed.data },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/production]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
