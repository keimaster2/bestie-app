"use client";

import SearchBar from "./SearchBar";
import type { SiteConfig, CategoryConfig } from "@/lib/types";
import { usePathname } from "next/navigation";
import { getBrandPath } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useRef } from "react";

type HeaderProps = {
  mall?: string;
  query?: string;
  genreId?: string;
  isSearchMode?: boolean;
  config: SiteConfig;
  minimal?: boolean;
};

export default function Header({ mall, query, genreId, isSearchMode, config, minimal = false }: HeaderProps) {
  const pathname = usePathname() || "";
  const pathSegments = pathname.split('/').filter(Boolean);
  const brands = ["bestie", "beauty", "gadget", "gourmet", "outdoor", "game", "fashion", "interior", "pet", "baby"];
  const brandFromPath = brands.find(b => pathSegments.includes(b)) || "bestie";
  const isTopPage = pathSegments.length === 0 || (pathSegments.length === 1 && brands.includes(pathSegments[0]));
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);

  const currentMall = mall || "rakuten";

  // ハイドレーション後のスクロール処理
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      scrollRef.current.scrollTo({
        left: activeRef.current.offsetLeft - (scrollRef.current.offsetWidth / 2) + (activeRef.current.offsetWidth / 2),
        behavior: 'smooth'
      });
    }
  }, [genreId]);

  const getMallTabClass = (targetMall: string) => {
    const isActive = currentMall === targetMall;
    const baseClass = "px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all border";
    if (isActive) {
      const activeColors = targetMall === "yahoo" ? "text-blue-600" : "text-red-600";
      return `${baseClass} bg-white border-gray-300 shadow-inner ${activeColors} z-10`;
    }
    return `${baseClass} border-transparent text-gray-500 hover:text-gray-700`;
  };

  // 🛡️ ハイドレーションエラー修正：window.location ではなく props を使用してURLを生成
  const getMallUrl = (targetMall: string) => {
    const params = new URLSearchParams();
    params.set("mall", targetMall);
    if (genreId && genreId !== "all") {
      params.set("genre", genreId);
    }
    if (query) {
      params.set("q", query);
    }
    const search = params.toString();
    return search ? `?${search}` : "";
  };

  const categories: CategoryConfig[] = (currentMall === "yahoo" ? config.yahooCategories : config.rakutenCategories) || [];
  const homeUrl = getBrandPath(brandFromPath, "/");
  const favUrl = getBrandPath(brandFromPath, "/favorites");

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex flex-col w-full sm:w-auto">
          <div className="flex items-center gap-4 justify-between">
            <Link 
              href={homeUrl} 
              className="flex items-center gap-2 hover:opacity-80 transition group"
            >
              <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">🎁</span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-none" style={{ color: config.themeColor.primary }}>
                  {config.brandName}
                </h1>
                {isTopPage && (
                  <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-1">
                    Best Item Selection
                  </p>
                )}
              </div>
            </Link>
          </div>
        </div>
        
        {!minimal && (
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex-1 sm:w-64">
              <SearchBar />
            </div>
            <Link 
              href={favUrl}
              className="flex flex-col items-center text-gray-400 hover:text-red-500 transition text-xs font-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              お気に入り
            </Link>
          </div>
        )}
      </div>
      
      {!minimal && (
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-4xl mx-auto px-4 py-2 text-center sm:text-left border-b border-gray-50">
             <p className="text-[10px] sm:text-xs text-gray-500 font-medium leading-tight">
               {config.tagline}
             </p>
          </div>

          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-center py-2 sm:py-4 border-b border-gray-100 mb-1">
              <div className="inline-flex bg-gray-100 rounded-full p-0.5 sm:p-1">
                <a 
                  href={getMallUrl("rakuten")}
                  className={getMallTabClass("rakuten")}
                >
                  楽天市場
                </a>
                <a 
                  href={getMallUrl("yahoo")}
                  className={getMallTabClass("yahoo")}
                >
                  Yahoo!ショッピング
                </a>
                <span className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-gray-300 cursor-not-allowed border-transparent" title="準備中">
                  Amazon
                </span>
              </div>
            </div>

            {!isSearchMode && categories.length > 0 && (
              <div ref={scrollRef} className="flex overflow-x-auto no-scrollbar gap-1 py-2 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
                {categories.map((g) => (
                  <a
                    key={g.id}
                    ref={genreId === g.id ? activeRef : null}
                    href={`?mall=${currentMall}&genre=${g.id}`}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap
                      ${
                        genreId === g.id
                          ? "text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    style={genreId === g.id ? { backgroundColor: 'var(--brand-primary)' } : {}}
                  >
                    {g.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
