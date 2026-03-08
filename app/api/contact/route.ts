import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";

const DATA_PATH = path.join(process.cwd(), "lib/data");

const ContactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  requestType: z.string().min(1, "Request type is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactMessage = {
  id: string;
  fullName: string;
  email: string;
  requestType: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};

async function ensureDataDir() {
  await fs.mkdir(DATA_PATH, { recursive: true });
}

async function getMessages(): Promise<ContactMessage[]> {
  try {
    const filePath = path.join(DATA_PATH, "contact-messages.json");
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function saveMessages(messages: ContactMessage[]): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_PATH, "contact-messages.json");
  await fs.writeFile(filePath, JSON.stringify(messages, null, 2), "utf-8");
}

// POST: Submit a contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const messages = await getMessages();
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      ...parsed.data,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    messages.unshift(newMessage);
    await saveMessages(messages);

    return NextResponse.json(
      { success: true, message: "Message submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/contact]", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

// GET: Retrieve all messages (admin only — protected by middleware)
export async function GET() {
  try {
    const messages = await getMessages();
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("[GET /api/contact]", error);
    return NextResponse.json(
      { error: "Failed to fetch messages." },
      { status: 500 }
    );
  }
}
