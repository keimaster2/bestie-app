"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Product, SiteConfig } from "@/lib/types";

export default function RankingList({ 
  products, 
  config, 
  isSearchMode = false 
}: { 
  products: Product[], 
  config: SiteConfig,
  isSearchMode?: boolean
}) {
  const [showAll, setShowAll] = useState(false);
  
  useEffect(() => {
    // console.log(`RankingList products:`, products.map(p => p.rank));
  }, [products]);
  
  // 検索時は多めに表示 (50件)、ランキング時は30位まで
  const INITIAL_COUNT = isSearchMode ? 50 : 30;
  
  const visibleProducts = showAll ? products : products.slice(0, INITIAL_COUNT);
  const hasMore = products.length > INITIAL_COUNT;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {visibleProducts.map((product, index) => (
          <div key={`rank-${product.rank || index}-${product.id}`} className="relative">
            <ProductCard product={product} config={config} />
          </div>
        ))}
      </div>

      {hasMore && !showAll && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="group relative inline-flex items-center justify-center px-10 py-4 font-black text-white transition-all duration-200 bg-gray-900 rounded-full hover:bg-gray-800 hover:shadow-lg hover:-translate-y-1 focus:outline-none ring-offset-2 focus:ring-2 ring-gray-900 shadow-md"
          >
            <span>さらに結果を表示する ({products.length - INITIAL_COUNT}件)</span>
            <svg 
              className="w-5 h-5 ml-2 -mr-1 transition-transform duration-200 group-hover:translate-y-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
