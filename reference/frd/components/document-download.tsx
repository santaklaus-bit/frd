"use client";

import { Button } from "@/components/ui/button";
import { Download, Eye, FileText } from "lucide-react";
import { trackFileDownload } from "@/lib/gtag";

interface DocumentDownloadProps {
  /** URL of the document (usually `/api/uploads/<file>`) */
  url: string;
  /** Label shown above the buttons */
  title?: string;
  lang: string;
  /** Sent to GA4 to tell blog documents apart from expertise documents */
  context?: string;
  /** `card` = bordered block, `bar` = compact inline row under an embedded viewer */
  variant?: "card" | "bar";
  className?: string;
}

/** `?download=1` makes our uploads route answer with Content-Disposition: attachment. */
function toDownloadUrl(url: string): string {
  if (!url.startsWith("/api/uploads/")) return url;
  return url.includes("?") ? `${url}&download=1` : `${url}?download=1`;
}

function fileNameFromUrl(url: string): string {
  try {
    const path = url.split("?")[0];
    const raw = decodeURIComponent(path.split("/").pop() || "document");
    // Uploads are stored as `<timestamp>-<original name>`
    return raw.replace(/^\d{10,}-/, "") || raw;
  } catch {
    return "document";
  }
}

export function DocumentDownload({
  url,
  title,
  lang,
  context = "document",
  variant = "card",
  className = "",
}: DocumentDownloadProps) {
  const isFr = lang === "fr";
  const fileName = fileNameFromUrl(url);
  const downloadUrl = toDownloadUrl(url);

  const onDownload = () => {
    trackFileDownload({ fileName, fileUrl: url, context });
  };

  const onPreview = () => {
    trackFileDownload({ fileName, fileUrl: url, context: `${context}_preview` });
  };

  const previewButton = (
    <Button
      asChild
      variant="outline"
      className={
        variant === "bar"
          ? "rounded-full h-10 px-5 text-[10px] font-bold uppercase tracking-widest"
          : "w-full rounded-2xl h-12 font-bold uppercase tracking-widest text-[10px]"
      }
    >
      <a href={url} target="_blank" rel="noopener noreferrer" onClick={onPreview} className="flex items-center justify-center gap-2">
        <Eye className="w-3.5 h-3.5" />
        {isFr ? "Prévisualiser" : "Preview"}
      </a>
    </Button>
  );

  const downloadButton = (
    <Button
      asChild
      className={
        variant === "bar"
          ? "rounded-full h-10 px-5 bg-foreground text-background text-[10px] font-bold uppercase tracking-widest hover:opacity-90"
          : "w-full rounded-2xl h-12 bg-foreground text-background font-bold uppercase tracking-widest text-[10px] shadow-lg hover:opacity-90"
      }
    >
      <a
        href={downloadUrl}
        download={fileName}
        onClick={onDownload}
        className="flex items-center justify-center gap-2"
      >
        <Download className="w-3.5 h-3.5" />
        {isFr ? "Télécharger" : "Download"}
      </a>
    </Button>
  );

  if (variant === "bar") {
    return (
      <div
        className={`not-prose flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl border border-border/40 bg-card/60 ${className}`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-500 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider truncate">
              {title || fileName}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {isFr ? "Document PDF" : "PDF document"}
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {previewButton}
          {downloadButton}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`not-prose p-6 rounded-3xl border border-border/40 bg-card shadow-lg space-y-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
          <FileText className="w-5 h-5" />
        </div>
        <p className="text-sm font-bold uppercase tracking-wider">
          {title || "Document"}
        </p>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {isFr
          ? "Consultez ou téléchargez le document joint à cette page."
          : "View or download the document attached to this page."}
      </p>
      <div className="flex flex-col gap-3">
        {previewButton}
        {downloadButton}
      </div>
    </div>
  );
}
