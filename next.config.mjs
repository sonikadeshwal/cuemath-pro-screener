/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare needs this for the Edge Runtime
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
