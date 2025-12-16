/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  async rewrites() {
    return [
      { source: "/_/api/:path*", destination: "/proxy/:path*" },
      { source: "/_api/:path*", destination: "/proxy/:path*" },
    ];
  },
};
 
export default nextConfig;
