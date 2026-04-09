import { ImageResponse } from "next/og";
// Temporarily disabled to debug build crash
// import { docs, meta } from "@/.source";
// import { loader } from "fumadocs-core/source";
// import { createMDXSource } from "fumadocs-mdx";
import { getAuthor, isValidAuthor, type AuthorKey } from "@/lib/authors";

export const runtime = "nodejs";
export const alt = "Blog Post";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/*
const blogSource = loader({
  baseUrl: "/blog",
  source: createMDXSource(docs, meta),
});
*/

const getAssetData = async (authorAvatar?: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const assetUrls = {
      clashDisplay: `${baseUrl}/fonts/ClashDisplay-Semibold.ttf`,
      cabinetGrotesk: `${baseUrl}/fonts/CabinetGrotesk-Medium.ttf`,
      logo: `${baseUrl}/magicui-logo.png`,
      ...(authorAvatar && { authorAvatar: `${baseUrl}${authorAvatar}` }),
    };

    const fetchPromises = [
      fetch(assetUrls.clashDisplay),
      fetch(assetUrls.cabinetGrotesk),
      fetch(assetUrls.logo),
    ];

    if (assetUrls.authorAvatar) {
      fetchPromises.push(fetch(assetUrls.authorAvatar));
    }

    const responses = await Promise.all(fetchPromises);
    const [clashDisplayRes, cabinetGroteskRes, logoRes, authorAvatarRes] =
      responses;

    if (!clashDisplayRes.ok || !cabinetGroteskRes.ok || !logoRes.ok) {
      return null;
    }

    const assetPromises = [
      clashDisplayRes.arrayBuffer(),
      cabinetGroteskRes.arrayBuffer(),
      logoRes.arrayBuffer(),
    ];

    if (authorAvatarRes && authorAvatarRes.ok) {
      assetPromises.push(authorAvatarRes.arrayBuffer());
    }

    const assetBuffers = await Promise.all(assetPromises);
    const [clashDisplay, cabinetGrotesk, logoImage, authorAvatarImage] =
      assetBuffers;

    const logoBase64 = `data:image/png;base64,${Buffer.from(logoImage).toString(
      "base64"
    )}`;

    let authorAvatarBase64: string | undefined;
    if (authorAvatarImage) {
      authorAvatarBase64 = `data:image/png;base64,${Buffer.from(
        authorAvatarImage
      ).toString("base64")}`;
    }

    return {
      clashDisplay,
      cabinetGrotesk,
      logoBase64,
      authorAvatarBase64,
    };
  } catch (error) {
    console.error("Error loading assets:", error);
    return null;
  }
};

const styles = {
  wrapper: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: "40px",
  },
  container: {
    display: "flex",
    height: "100%",
    width: "100%",
    border: "4px solid black",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "60px",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  logo: {
    marginBottom: "20px",
    alignSelf: "flex-start",
  },
  title: {
    fontSize: "40px",
    fontWeight: 700,
    color: "black",
    lineHeight: 1.2,
    marginBottom: "10px",
    letterSpacing: "0.5px",
  },
  summary: {
    fontSize: "25px",
    fontWeight: 500,
    color: "#4A4A4A",
    lineHeight: 1.5,
    letterSpacing: "0.5px",
  },
  metaContainer: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
    alignItems: "center",
  },
  metaBase: {
    fontSize: "19px",
    fontWeight: 500,
    lineHeight: 1.4,
    padding: "4px 0px",
  },
  authorMeta: {
    color: "black",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  authorAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "2px solid black",
  },
  dateMeta: {
    color: "black",
  },
  dotSeparator: {
    fontSize: "19px",
    color: "black",
    fontWeight: 500,
  },
} as const;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return new ImageResponse(
    (
      <div style={{ fontSize: 40, color: 'black', background: 'white', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Blog Post: {slug}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
