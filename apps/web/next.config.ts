import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {},
  images: {
    domains: ["cdn.dummyjson.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  trailingSlash: true,
  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
