"use client";

import Link from "next/link";
import { getBrandPath } from "@/lib/utils";
import type { SiteConfig } from "@/lib/types";
import { useState, useEffect } from "react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  brand: string;
  config: SiteConfig;
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ brand, config, items }: BreadcrumbsProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 🛡️ 本番環境のサブドメイン運用時は絶対URLを考慮
  const isLocal = mounted && typeof window !== "undefined" && window.location.hostname.includes("localhost");
  const rootHref = isLocal ? getBrandPath(brand, "/") : `https://${config.domain}`;

  // アイテムが空の場合は何も表示しない
  if (!items || items.length === 0) {
    return null;
  }

  // ブランドのトップページを起点にする
  const allItems: BreadcrumbItem[] = [
    { label: config.brandName, href: rootHref },
    ...items.map(item => {
      // モール名が含まれる場合は正式名称に変換
      let label = item.label;
      if (label.toLowerCase() === "rakuten") label = "楽天市場";
      if (label.toLowerCase() === "yahoo") label = "Yahoo!ショッピング";
      return { ...item, label };
    }),
  ];

  // Google用構造化データ (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href ? { "item": item.href.startsWith('http') ? item.href : `https://${config.domain}${item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto px-4 py-3 text-left">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex items-center space-x-2 text-[10px] sm:text-xs text-gray-400 overflow-x-auto no-scrollbar whitespace-nowrap">
        {allItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2 text-gray-300">/</span>}
            {item.href && index < allItems.length - 1 ? (
              isLocal ? (
                <Link
                  href={item.href}
                  className="hover:text-indigo-600 transition-colors"
                  prefetch={false}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  href={item.href.startsWith('http') ? item.href : `https://${config.domain}${item.href}`}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {item.label}
                </a>
              )
            ) : (
              <span className="font-medium text-gray-600 truncate max-w-[150px] sm:max-w-xs">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
