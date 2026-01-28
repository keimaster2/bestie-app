import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'thumbnail.image.rakuten.co.jp' },
      { protocol: 'https', hostname: 'item-shopping.c.yimg.jp' },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
