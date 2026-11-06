import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { db, dataDirectory } from "@/lib/cms/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  if (!/^[a-f0-9-]{36}\.(webp|mp4|webm)$/.test(filename))
    return new Response(null, { status: 404 });
  const media = db()
    .prepare("SELECT mime FROM media WHERE url=?")
    .get(`/media/${filename}`) as { mime: string } | undefined;
  if (!media) return new Response(null, { status: 404 });
  const file = path.join(dataDirectory(), "media", filename);
  const info = await stat(file).catch(() => null);
  if (!info) return new Response(null, { status: 404 });
  let start = 0,
    end = info.size - 1;
  const range = request.headers.get("range");
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2]))
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${info.size}` },
      });
    if (!match[1]) start = Math.max(0, info.size - Number(match[2]));
    else {
      start = Number(match[1]);
      end = match[2] ? Math.min(Number(match[2]), end) : end;
    }
    if (start > end || start >= info.size || start < 0)
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${info.size}` },
      });
  }
  const headers: Record<string, string> = {
    "Content-Type": media.mime,
    "Content-Length": String(end - start + 1),
    "Accept-Ranges": "bytes",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "public, max-age=31536000, immutable",
  };
  if (range) headers["Content-Range"] = `bytes ${start}-${end}/${info.size}`;
  return new Response(
    Readable.toWeb(createReadStream(file, { start, end })) as ReadableStream,
    { status: range ? 206 : 200, headers },
  );
}
