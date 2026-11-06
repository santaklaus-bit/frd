/**
 * Helpers to find downloadable documents (PDF) inside content.
 *
 * The admin uploads PDFs through the Editor.js image/attaches tools, so they end
 * up as blocks pointing at `/api/uploads/<file>.pdf`. Front-end pages use these
 * helpers to expose the files as real downloads.
 */

export interface DocumentLink {
  url: string;
  name: string;
  caption?: string;
}

export function isPdfUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.split("?")[0].toLowerCase().endsWith(".pdf");
}

export function documentNameFromUrl(url: string): string {
  const path = url.split("?")[0];
  let raw = path.split("/").pop() || "document.pdf";
  try {
    raw = decodeURIComponent(raw);
  } catch {
    // keep raw as-is when it isn't valid percent-encoding
  }
  // Uploads are stored as `<timestamp>-<original name>`
  return raw.replace(/^\d{10,}-/, "") || raw;
}

/**
 * Walk an Editor.js document (JSON string) and return every PDF it embeds.
 */
export function extractPdfLinks(content: string | null | undefined): DocumentLink[] {
  if (!content || !content.trim().startsWith("{")) return [];

  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    return [];
  }

  if (!parsed?.blocks || !Array.isArray(parsed.blocks)) return [];

  const found: DocumentLink[] = [];
  const seen = new Set<string>();

  for (const block of parsed.blocks) {
    const data = block?.data;
    if (!data) continue;

    const candidates = [
      data.file?.url,
      data.url,
      typeof data.file === "string" ? data.file : null,
    ];

    for (const candidate of candidates) {
      if (!isPdfUrl(candidate) || seen.has(candidate)) continue;
      seen.add(candidate);
      found.push({
        url: candidate,
        name: data.file?.name || documentNameFromUrl(candidate),
        caption: data.caption || undefined,
      });
    }
  }

  return found;
}
