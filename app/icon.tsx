import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

export const sizes = [
  { rel: "icon", sizes: "32x32" },
  { rel: "apple-touch-icon", sizes: "180x180" },
];

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default async function Icon() {
  let fontData: Buffer | null = null;
  try {
    fontData = await readFile(
      join(process.cwd(), "public/fonts/ClashDisplay-Semibold.ttf"),
    );
  } catch {
    // fallback sans font custom
  }

  return new ImageResponse(
    <div
      style={{
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <span
        style={{
          fontFamily: fontData ? "Clash Display" : "Georgia, serif",
          fontSize: "28px",
          fontWeight: 700,
          color: "black",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        FARID DANKO
      </span>
    </div>,
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: "Clash Display",
              data: fontData,
              style: "normal",
              weight: 700,
            },
          ]
        : [],
    },
  );
}
