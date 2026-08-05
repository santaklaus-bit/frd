import { NextRequest, NextResponse } from "next/server";
import { getData, saveData } from "@/lib/content-manager";
import { Initiative } from "@/lib/db/models";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const LocalizedFieldSchema = z.object({
  fr: z.string(),
  en: z.string(),
});

const InitiativeSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  icon: z.string().min(1, "Icon is required"),
  title: LocalizedFieldSchema,
  description: LocalizedFieldSchema,
  category: LocalizedFieldSchema,
  image: z.string().optional().nullable(),
  link: z.string().url().optional().or(z.literal("")),
  order: z.number().optional().default(0),
});

// GET: Retrieve all initiatives
export async function GET() {
  try {
    const initiatives = await getData("initiatives");
    return NextResponse.json({ initiatives });
  } catch (error) {
    console.error("[GET /api/initiatives]", error);
    return NextResponse.json(
      { error: "Failed to fetch initiatives." },
      { status: 500 }
    );
  }
}

// POST: Create a new initiative
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = InitiativeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { data } = parsed;

    const existing = await Initiative.findOne({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json(
        { error: "An initiative with this slug already exists." },
        { status: 409 }
      );
    }

    // Determine highest order current
    const highest = await Initiative.findOne({ order: [["order", "DESC"]] });
    const nextOrder = highest ? highest.order + 1 : 0;

    await Initiative.create({
      slug: data.slug,
      icon: data.icon,
      titleFr: data.title.fr,
      titleEn: data.title.en,
      descriptionFr: data.description.fr,
      descriptionEn: data.description.en,
      categoryFr: data.category.fr,
      categoryEn: data.category.en,
      image: (data as any).image || null,
      link: data.link || null,
      order: nextOrder,
    });

    revalidatePath("/", "layout");

    return NextResponse.json(
      { success: true, initiative: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/initiatives]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// PUT: Update all initiatives (bulk save from admin)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Expected an array of initiatives." },
        { status: 400 }
      );
    }

    const parsedItems = body.map((item) => InitiativeSchema.safeParse(item));
    const errors = parsedItems
      .map((r, i) => (!r.success ? { index: i, errors: r.error.flatten() } : null))
      .filter(Boolean);

    if (errors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed on one or more items.", details: errors },
        { status: 400 }
      );
    }

    const initiatives = parsedItems.map((r) => (r as any).data);
    await saveData("initiatives", initiatives);

    revalidatePath("/", "layout");

    return NextResponse.json({ success: true, initiatives });
  } catch (error) {
    console.error("[PUT /api/initiatives]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
