/** @type {import('next').NextConfig} */
const nextConfig = {
  httpAgentOptions: {
    keepAlive: false,
  },
  env: {
    VERCEL_UNDICI: 1,
  },
};

export default nextConfig;
