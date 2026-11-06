import { publicContent } from "@/lib/cms/content";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";
import { siteUrl } from "@/lib/site-url";

/** Plan du site (LIV.SEO.10) — domaine lu dans NEXT_PUBLIC_SITE_URL. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { events, articles, team } = await publicContent();
  const pages = [
    "",
    "/a-propos",
    "/equipe",
    "/evenements",
    "/blog",
    "/reserver",
    "/mentions-legales",
  ];
  return [
    ...pages.map((p) => ({
      url: `${siteUrl}${p}/`,
      priority: p === "" ? 1 : 0.7,
    })),
    ...events.map((e) => ({
      url: `${siteUrl}/evenements/${e.slug}/`,
      priority: 0.6,
    })),
    ...team.map((m) => ({
      url: `${siteUrl}/equipe/${m.slug}/`,
      priority: 0.6,
    })),
    ...articles.map((a) => ({
      url: `${siteUrl}/blog/${a.slug}/`,
      priority: 0.5,
    })),
  ];
}
