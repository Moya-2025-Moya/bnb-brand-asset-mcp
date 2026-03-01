import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["bnb-dev-suite"],
  serverExternalPackages: ["shiki"],
};

export default nextConfig;
