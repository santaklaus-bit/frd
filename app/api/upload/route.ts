import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename. The extension must match the actual content:
    // a wrong one makes the file be served with the wrong Content-Type.
    const mimeExtensions: Record<string, string> = {
      "application/pdf": ".pdf",
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/gif": ".gif",
      "image/svg+xml": ".svg",
      "video/mp4": ".mp4",
      "video/webm": ".webm",
    };

    const safeName = (file.name || "upload").replace(/[^a-zA-Z0-9.-]/g, "_");
    const expected = mimeExtensions[file.type] || "";
    const hasExpectedExt = expected && safeName.toLowerCase().endsWith(expected);
    // PDFs are the common case: the browser sends application/pdf even when the
    // caller supplied a name with no extension or a misleading one.
    const finalName = !expected || hasExpectedExt
      ? safeName
      : `${safeName.replace(/\.[a-zA-Z0-9]+$/, "")}${expected}`;

    const filename = `${Date.now()}-${finalName}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");

    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    const url = `/api/uploads/${filename}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
