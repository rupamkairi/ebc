import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      new URL("https://ebc-develop.s3.ap-south-1.amazonaws.com/**"),
    ],
  },
};

export default nextConfig;
