import type { Metadata, Viewport } from "next";
import { Poppins, DM_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { siteUrl } from "@/lib/site-url";

// Polices de la charte OPUS (« Opus Logo To-dos.ai ») : Poppins (Light pour les libellés espacés) + DM Sans.
// Harabara, police du titre « Colors », n'est pas diffusable en webfont : Poppins SemiBold la remplace pour les titres.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dmsans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // LIV.SEO.02–09 : description conservée pour Google et les aperçus de partage (invisible sur le site).
  title: site.name, // onglet : « OPUS CORP » seul (demande client) ; les pages internes gardent « Page — OPUS CORP »
  description: site.seoDescription,
  openGraph: {
    title: site.name,
    description: site.seoDescription,
    type: "website",
    locale: "fr_FR",
    // LIV.SEO.05/08 : image de partage = src/app/opengraph-image.png et twitter-image.png (planche « Colors », 1200×630).
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.seoDescription,
  },
};

export const viewport: Viewport = { themeColor: "#192137" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${poppins.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
