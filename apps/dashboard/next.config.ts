import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@reclaim/api-contracts"],
};

export default nextConfig;
