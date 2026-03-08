import { NextRequest, NextResponse } from "next/server";
import { getDictionary, saveDictionary } from "@/lib/content-manager";

// GET: Retrieve dictionary for a language
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  try {
    const { lang } = await params;

    if (lang !== "fr" && lang !== "en") {
      return NextResponse.json(
        { error: "Invalid language. Supported: fr, en." },
        { status: 400 }
      );
    }

    const dict = await getDictionary(lang as "fr" | "en");
    return NextResponse.json({ dictionary: dict, lang });
  } catch (error) {
    console.error("[GET /api/content/[lang]]", error);
    return NextResponse.json(
      { error: "Failed to fetch dictionary." },
      { status: 500 }
    );
  }
}

// PUT: Update dictionary for a language
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  try {
    const { lang } = await params;

    if (lang !== "fr" && lang !== "en") {
      return NextResponse.json(
        { error: "Invalid language. Supported: fr, en." },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid dictionary format." },
        { status: 400 }
      );
    }

    await saveDictionary(lang as "fr" | "en", body);

    return NextResponse.json({ success: true, lang });
  } catch (error) {
    console.error("[PUT /api/content/[lang]]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
