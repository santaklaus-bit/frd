import type { Metadata } from "next";
import { publicContent } from "@/lib/cms/content";
import { ContentProvider } from "@/components/cms/ContentProvider";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileCta } from "@/components/layout/MobileCta";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { CustomCursor } from "@/components/ui/CustomCursor";
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { site } = await publicContent();
  return {
    title: site.name,
    description: site.seoDescription,
    openGraph: {
      title: site.name,
      description: site.seoDescription,
      type: "website",
      locale: "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description: site.seoDescription,
    },
  };
}
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await publicContent();
  return (
    <ContentProvider content={content}>
      <SmoothScroll>
        <ScrollProgress />
        <CustomCursor />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <MobileCta />
      </SmoothScroll>
    </ContentProvider>
  );
}
