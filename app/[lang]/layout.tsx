import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
import { ThemeProvider } from "@/components/theme-provider";

import { siteConfig } from "@/lib/site";
import { metadataKeywords } from "./metadata";
import { SiteNav } from "@/components/site-nav";
import Footer from "@/components/footer";
import { SocialShare } from "@/components/social-share";
import { getDictionary } from "@/lib/get-dictionary";
import JsonLd from "@/components/json-ld";
import "@/app/globals.css";

export const viewport: Viewport = {
  themeColor: "black",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: dict.seo.home.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: dict.seo.home.description,
    keywords: metadataKeywords,
    authors: [{ name: "Farid DANKO", url: siteConfig.url }],
    creator: "Farid DANKO",
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        fr: "/fr",
      },
    },
    openGraph: {
      type: "website",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      url: siteConfig.url,
      title: dict.seo.home.title,
      description: dict.seo.home.description,
      siteName: siteConfig.name,
      images: [
        {
          url: "/farid-portrait.png", // Fallback for social preview
          width: 1200,
          height: 630,
          alt: "Farid DANKO",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.seo.home.title,
      description: dict.seo.home.description,
      creator: "@FaridDanko",
      images: ["/farid-portrait.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");

  return (
    <html
      lang={lang}
      className={`${inter.variable} ${cormorant.variable} antialiased font-sans`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <JsonLd lang={lang} dict={dict} />
          <SiteNav lang={lang as "en" | "fr"} />
          {children}
          <SocialShare lang={lang} />
          <Footer lang={lang} dict={dict} />
        </ThemeProvider>
      </body>
    </html>
  );
}
