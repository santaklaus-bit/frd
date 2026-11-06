import { ImageResponse } from "next/og";
import { getBlogPostByAnySlug } from "@/lib/content-manager";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";
export const alt = "Blog Post";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const getAssetData = async (thumbnailUrl?: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;

    const [clashDisplayRes, cabinetGroteskRes] = await Promise.all([
      fetch(`${baseUrl}/fonts/ClashDisplay-Semibold.ttf`),
      fetch(`${baseUrl}/fonts/CabinetGrotesk-Medium.ttf`),
    ]);

    const [clashDisplay, cabinetGrotesk] = await Promise.all([
      clashDisplayRes.ok ? clashDisplayRes.arrayBuffer() : null,
      cabinetGroteskRes.ok ? cabinetGroteskRes.arrayBuffer() : null,
    ]);

    let thumbnailBase64: string | undefined;
    if (thumbnailUrl) {
      try {
        const res = await fetch(thumbnailUrl);
        if (res.ok) {
          const buf = await res.arrayBuffer();
          const contentType = res.headers.get("content-type") || "image/jpeg";
          thumbnailBase64 = `data:${contentType};base64,${Buffer.from(buf).toString("base64")}`;
        }
      } catch {
        // thumbnail facultatif, on ignore l'erreur
      }
    }

    return { clashDisplay, cabinetGrotesk, thumbnailBase64 };
  } catch (error) {
    console.error("Error loading OG assets:", error);
    return { clashDisplay: null, cabinetGrotesk: null, thumbnailBase64: undefined };
  }
};

export default async function Image({ params }: { params: Promise<{ slug: string; lang?: string }> }) {
  const { slug, lang = "fr" } = await params;

  // Récupération des données de l'article
  const page = await getBlogPostByAnySlug(slug).catch(() => null);

  const title = page
    ? (page.title[lang as "fr" | "en"] || page.title.fr || page.title.en || "Article")
    : "Article";
  const description = page
    ? (page.description[lang as "fr" | "en"] || page.description.fr || page.description.en || "")
    : "";
  const authorName = (page as any)?.authorName || "Farid DANKO";
  const date = page ? new Date(page.date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

  // URL absolue du thumbnail
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
  let thumbnailUrl: string | undefined;
  if (page?.thumbnail) {
    thumbnailUrl = page.thumbnail.startsWith("http")
      ? page.thumbnail
      : `${baseUrl}${page.thumbnail.startsWith("/") ? "" : "/"}${page.thumbnail}`;
  }

  const { clashDisplay, cabinetGrotesk, thumbnailBase64 } = await getAssetData(thumbnailUrl);

  const fonts: any[] = [];
  if (clashDisplay) fonts.push({ name: "Clash Display", data: clashDisplay, weight: 700, style: "normal" });
  if (cabinetGrotesk) fonts.push({ name: "Cabinet Grotesk", data: cabinetGrotesk, weight: 500, style: "normal" });

  const fontFamily = fonts.length > 0 ? "Clash Display" : "system-ui";

  // Tronquer le titre si trop long
  const truncatedTitle = title.length > 80 ? title.slice(0, 77) + "..." : title;
  const truncatedDesc = description.length > 120 ? description.slice(0, 117) + "..." : description;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#0a0a0a",
          fontFamily,
        }}
      >
        {/* Colonne gauche : texte */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px",
            borderRight: thumbnailBase64 ? "1px solid #222" : "none",
          }}
        >
          {/* En-tête : site name */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#888",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              monsieurdanko.com
            </div>
          </div>

          {/* Corps : titre + description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div
              style={{
                fontSize: thumbnailBase64 ? "36px" : "48px",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              {truncatedTitle}
            </div>
            {truncatedDesc && (
              <div
                style={{
                  fontSize: "20px",
                  color: "#999",
                  lineHeight: 1.5,
                  fontWeight: 400,
                }}
              >
                {truncatedDesc}
              </div>
            )}
          </div>

          {/* Pied : auteur + date */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {authorName.charAt(0)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ fontSize: "15px", color: "#fff", fontWeight: 600 }}>{authorName}</div>
              {date && <div style={{ fontSize: "13px", color: "#666" }}>{date}</div>}
            </div>
          </div>
        </div>

        {/* Colonne droite : thumbnail (si disponible) */}
        {thumbnailBase64 && (
          <div
            style={{
              width: "420px",
              display: "flex",
              overflow: "hidden",
            }}
          >
            <img
              src={thumbnailBase64}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        )}
      </div>
    ),
    {
      ...size,
      fonts,
    }
  );
}
