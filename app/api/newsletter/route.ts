import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";

const DATA_PATH = path.join(process.cwd(), "lib/data");

const NewsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type Subscriber = {
  id: string;
  email: string;
  subscribedAt: string;
};

async function ensureDataDir() {
  await fs.mkdir(DATA_PATH, { recursive: true });
}

async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const filePath = path.join(DATA_PATH, "newsletter-subscribers.json");
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function saveSubscribers(subscribers: Subscriber[]): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_PATH, "newsletter-subscribers.json");
  await fs.writeFile(filePath, JSON.stringify(subscribers, null, 2), "utf-8");
}

// POST: Subscribe to newsletter
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

    const subscribers = await getSubscribers();

    // Check for duplicates
    const alreadySubscribed = subscribers.some(
      (s) => s.email.toLowerCase() === parsed.data.email.toLowerCase()
    );

    if (alreadySubscribed) {
      return NextResponse.json(
        { error: "This email is already subscribed." },
        { status: 409 }
      );
    }

    const newSubscriber: Subscriber = {
      id: Date.now().toString(),
      email: parsed.data.email,
      subscribedAt: new Date().toISOString(),
    };

    subscribers.push(newSubscriber);
    await saveSubscribers(subscribers);

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

// GET: Retrieve all subscribers (admin only — protected by middleware)
export async function GET() {
  try {
    const subscribers = await getSubscribers();
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
