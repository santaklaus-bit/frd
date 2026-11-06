import { NextRequest, NextResponse } from "next/server";
import { getData, saveData } from "@/lib/content-manager";
import { Production } from "@/lib/db/models";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const LocalizedFieldSchema = z.object({
  fr: z.string(),
  en: z.string(),
});

const ProductionItemSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  icon: z.string().min(1, "Icon is required"),
  title: LocalizedFieldSchema,
  description: LocalizedFieldSchema,
  category: LocalizedFieldSchema,
  details: LocalizedFieldSchema,
  href: z.string().min(1, "Href is required"),
  image: z.string().optional().nullable(),
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

    revalidatePath("/", "layout");

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
    
    const { data } = parsed;

    const existing = await Production.findOne({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A production item with this slug already exists." },
        { status: 409 }
      );
    }

    const highest = await Production.findOne({ order: [["order", "DESC"]] });
    const nextOrder = highest ? highest.order + 1 : 0;

    await Production.create({
      slug: data.slug,
      icon: data.icon,
      titleFr: data.title.fr,
      titleEn: data.title.en,
      descriptionFr: data.description.fr,
      descriptionEn: data.description.en,
      categoryFr: data.category.fr,
      categoryEn: data.category.en,
      detailsFr: data.details.fr,
      detailsEn: data.details.en,
      href: data.href,
      image: (data as any).image || null,
      order: nextOrder,
    });

    revalidatePath("/", "layout");

    return NextResponse.json(
      { success: true, item: data },
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
