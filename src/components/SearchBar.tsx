"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 現在のモール情報を維持する
    const currentMall = searchParams.get("mall") || "rakuten";
    const currentGenre = searchParams.get("genre") || ""; // ジャンルも一応維持（検索APIには渡さないがUI維持のため）

    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword);
    if (currentMall) params.set("mall", currentMall);
    // 検索時はジャンル絞り込みを解除するか、維持するか。今回はシンプルにキーワード優先でジャンルは外すことが多いが、
    // UIの一貫性のためにパラメータとしては持っておく（バックエンドで無視すればよい）
    
    router.push(`/?${params.toString()}`);
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
