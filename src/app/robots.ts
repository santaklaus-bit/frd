import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/admin", "/contact.php"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
