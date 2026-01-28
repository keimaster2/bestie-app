import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'thumbnail.image.rakuten.co.jp' },
      { protocol: 'https', hostname: 'item-shopping.c.yimg.jp' },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/bestie",
      },
      {
        source: "/about",
        destination: "/bestie/about",
      },
      {
        source: "/favorites",
        destination: "/bestie/favorites",
      },
      {
        source: "/product/:id",
        destination: "/bestie/product/:id",
      },
    ];
  },
};

export default nextConfig;
