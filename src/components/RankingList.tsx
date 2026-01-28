"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/types";
import { SiteConfig } from "@/lib/config";

export default function RankingList({ products, config }: { products: Product[], config: SiteConfig }) {
  const [showAll, setShowAll] = useState(false);
  
  // 初期表示数（TOP10）
  const INITIAL_COUNT = 10;
  
  // 表示する商品リスト
  const visibleProducts = showAll ? products : products.slice(0, INITIAL_COUNT);
  const hasMore = products.length > INITIAL_COUNT;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleProducts.map((product, index) => (
          <ProductCard key={`${product.id}-${index}`} product={product} config={config} />
        ))}
      </div>

      {hasMore && !showAll && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-gray-900 rounded-full hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none ring-offset-2 focus:ring-2 ring-gray-900"
          >
            <span>もっと見る ({products.length - INITIAL_COUNT}件)</span>
            <svg 
              className="w-5 h-5 ml-2 -mr-1 transition-transform duration-200 group-hover:translate-y-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
