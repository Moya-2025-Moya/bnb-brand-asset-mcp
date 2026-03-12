import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["bnb-brandclaw"],
  serverExternalPackages: ["shiki"],
};

export default nextConfig;
