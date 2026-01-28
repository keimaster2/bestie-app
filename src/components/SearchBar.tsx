"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getBrandPath } from "@/lib/utils";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname() || "";
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 現在のブランドパスを特定（URLの1段目を見る）
    const pathSegments = pathname.split('/');
    const brands = ["bestie", "beauty", "gadget"];
    const brandFromPath = brands.find(b => pathSegments.includes(b)) || "bestie";

    // 現在のモール情報を維持
    const currentMall = searchParams.get("mall") || "rakuten";

    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword);
    if (currentMall) params.set("mall", currentMall);
    
    // ブランドを維持したパスへ遷移
    const targetPath = getBrandPath(brandFromPath, "/");
    router.push(`${targetPath}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto sm:mx-0">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="キーワードで探す..."
        className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-full text-sm transition-all outline-none"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
    </form>
  );
}
