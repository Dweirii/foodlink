/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}



// next.config.mjs
import withPWA from "next-pwa";

const baseConfig = {
  reactStrictMode: true,
  // optional perf nicety:
  experimental: { optimizePackageImports: ["lucide-react"] },
};

export default withPWA({
  dest: "public",                 // emit sw.js and workbox assets to /public
  disable: process.env.NODE_ENV === "development", // keep SW off in dev
  register: false,                // we'll register manually in a client component
  skipWaiting: true,              // new SW takes control faster after refresh
})(baseConfig);
