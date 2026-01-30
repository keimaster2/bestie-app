import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
  },
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
        source: '/about',
        destination: '/default/about',
      },
      {
        source: '/favorites',
        destination: '/default/favorites',
      },
      {
        source: '/product/:id*',
        destination: '/default/product/:id*',
      },
    ];
  },
};

export default nextConfig;
