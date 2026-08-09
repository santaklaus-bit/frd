/**
 * Client-side Google Analytics 4 (gtag.js) helpers.
 *
 * The measurement ID must be set in `.env` :
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX  ← placeholder, ignored
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-1A2B3C4D5E  ← real ID, tracking enabled
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";

/**
 * A measurement ID is usable only if it matches the GA4 format and is not the
 * documentation placeholder shipped in `.env.example`.
 */
export function isValidMeasurementId(id: string | undefined | null): boolean {
  if (!id) return false;
  const value = id.trim();
  if (!/^G-[A-Z0-9]{6,}$/i.test(value)) return false;
  // Reject placeholders like G-XXXXXXXXXX
  if (/^G-X+$/i.test(value)) return false;
  return true;
}

export const isGaEnabled = isValidMeasurementId(GA_MEASUREMENT_ID);

type GtagFn = (...args: any[]) => void;

function gtag(): GtagFn | null {
  if (typeof window === "undefined") return null;
  const fn = (window as any).gtag;
  return typeof fn === "function" ? fn : null;
}

/** Send a page_view — needed because App Router navigations don't reload gtag.js. */
export function pageview(url: string, title?: string) {
  if (!isGaEnabled) return;
  const g = gtag();
  if (!g) return;
  g("event", "page_view", {
    page_path: url,
    page_location: window.location.href,
    page_title: title ?? document.title,
    send_to: GA_MEASUREMENT_ID,
  });
}

/** Send an arbitrary GA4 event. */
export function event(name: string, params: Record<string, any> = {}) {
  if (!isGaEnabled) return;
  const g = gtag();
  if (!g) return;
  g("event", name, { ...params, send_to: GA_MEASUREMENT_ID });
}

/** GA4 recommended event for a document/asset download. */
export function trackFileDownload(params: {
  fileName: string;
  fileUrl: string;
  fileExtension?: string;
  context?: string;
}) {
  const extension =
    params.fileExtension ||
    (params.fileName.includes(".") ? params.fileName.split(".").pop() : "") ||
    "";

  event("file_download", {
    file_name: params.fileName,
    file_extension: extension.toLowerCase(),
    link_url: params.fileUrl,
    content_type: params.context || "document",
  });
}
