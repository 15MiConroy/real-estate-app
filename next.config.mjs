/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.rdcpix.com",
      },
      {
        protocol: "https",
        hostname: "*.simplyrets.com",
      },
    ],
  },
};

export default nextConfig;
