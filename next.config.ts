import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  transpilePackages: ["geist"],
  serverExternalPackages: ["sequelize", "mysql2", "sqlite3"],
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // Protect media assets from easy hotlinking
        source: "/:path(logo\\.png|farid-portrait\\.png|farid-signature\\.png)",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        // Protect font files
        source: "/_next/static/media/:path*",
        headers: [
          { key: "Cache-Control", value: "private, max-age=0" },
          { key: "Access-Control-Allow-Origin", value: "https://monsieurdanko.com" },
        ],
      },
    ];
  },
};

export default withMDX(nextConfig);
