import { NextResponse } from "next/server";
import { z } from "zod";
import { ContactMessage } from "@/lib/db/models";

const contactSchema = z.object({
  fullName: z.string()
    .min(2, "Minimum 2 characters")
    .max(100, "Maximum 100 characters")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Name contains invalid characters"),
  email: z.string()
    .email("Invalid email format")
    .max(254, "Email is too long"),
  requestType: z.enum(["general", "collaboration", "media"], {
    errorMap: () => ({ message: "Invalid request type" }),
  }),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must not exceed 5000 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    const message = await ContactMessage.create({
      fullName: validatedData.fullName,
      email: validatedData.email,
      requestType: validatedData.requestType,
      message: validatedData.message,
      isRead: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
        id: message.id,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path[0]?.toString() || "unknown",
        message: err.message,
        code: err.code,
      }));

      return NextResponse.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          message: "Invalid data submitted",
          errors: formattedErrors,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          code: "PARSE_ERROR",
          message: "Invalid JSON format",
          details: "The request body is not valid JSON",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    console.error("[API Contact] POST Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        code: "SERVER_ERROR",
        message: "An error occurred while processing your message",
        details: "Our team has been notified. Please try again later.",
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === "development" && { debug: errorMessage }),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const messages = await ContactMessage.findAll({
      order: [["createdAt", "DESC"]],
    });

    return NextResponse.json({
      success: true,
      data: messages,
      count: messages.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API Contact] GET Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        code: "DATABASE_ERROR",
        message: "Failed to retrieve messages",
        details: "Could not fetch contact messages from database",
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === "development" && { debug: errorMessage }),
      },
      { status: 500 }
    );
  }
}
