import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Security: prevent directory traversal
    const sanitized = path.basename(filename);
    const filePath = path.join(process.cwd(), "public", "uploads", sanitized);

    if (!fs.existsSync(filePath)) {
      // Return a transparent 1x1 pixel image instead of a text error to prevent Next.js Image component from crashing
      const transparentPixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuPnAAAAAElFTkSuQmCC", "base64");
      return new NextResponse(transparentPixel, { 
        status: 404,
        headers: { "Content-Type": "image/png", "Cache-Control": "no-cache, no-store" }
      });
    }

    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(sanitized).toLowerCase();

    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".mp4": "video/mp4",
      ".webm": "video/webm",
      ".pdf": "application/pdf",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("File serve error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
