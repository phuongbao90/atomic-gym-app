import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

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

export default withNextIntl(nextConfig);
