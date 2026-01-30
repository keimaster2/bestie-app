"use client";

import Link from "next/link";
import type { SiteConfig } from "@/lib/types";
import { getBrandPath } from "@/lib/utils";

type FooterProps = {
  brand: string;
  config: SiteConfig;
};

export default function Footer({ brand, config }: FooterProps) {
  const aboutUrl = getBrandPath(brand, "/about");

  return (
    <footer className="bg-white border-t border-gray-100 pt-4 pb-24 text-left">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl">🎁</span>
          <span className="text-xl font-black tracking-tight text-gray-900">Bestie</span>
        </div>
        <p className="text-[10px] text-gray-400 leading-relaxed">
          <Link href={aboutUrl} className="hover:text-gray-600 underline underline-offset-2 decoration-gray-200 mr-4">
            当サイトについて（免責事項）
          </Link>
          このサイトはアフィリエイト広告（Amazonアソシエイト含む）を掲載しています。<br />
          &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Bestie - BEST ITEM SELECTION.
        </p>
      </div>
    </footer>
  );
}
