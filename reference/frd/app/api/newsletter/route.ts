import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Subscriber } from "@/lib/db/models";

const NewsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = NewsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // Check for duplicates
    const existing = await Subscriber.findOne({
      where: { email: parsed.data.email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This email is already subscribed." },
        { status: 409 }
      );
    }

    await Subscriber.create({
      email: parsed.data.email.toLowerCase(),
      subscribedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, message: "Successfully subscribed!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/newsletter]", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const subscribers = await Subscriber.findAll({
      order: [["subscribedAt", "DESC"]],
    });
    
    return NextResponse.json({
      subscribers,
      count: subscribers.length,
    });
  } catch (error) {
    console.error("[GET /api/newsletter]", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers." },
      { status: 500 }
    );
  }
}
