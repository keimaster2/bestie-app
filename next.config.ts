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
  // 物理ファイル（src/app/about, favorites, product）を用意したため、
  // エッジランタイムでの挙動を安定させるためリライトを最小限にします
  async rewrites() {
    return [];
  },
};

export default nextConfig;
