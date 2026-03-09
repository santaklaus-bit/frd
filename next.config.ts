import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  transpilePackages: ["geist"],
  serverExternalPackages: ["sequelize", "mysql2"],
};

export default withMDX(nextConfig);
