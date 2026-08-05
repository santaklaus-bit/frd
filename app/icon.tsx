import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default async function Icon() {
  const fontData = await readFile(
    join(process.cwd(), "public/fonts/ClashDisplay-Semibold.ttf"),
  );

  return new ImageResponse(
    <div
      style={{
        fontSize: 18,
        background: "black",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        borderRadius: "4px",
        fontFamily: "Clash Display",
        fontWeight: "bold",
      }}
    >
      FD
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Clash Display",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
