"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/types";
import { SiteConfig } from "@/lib/config";

export default function RankingList({ products, config }: { products: Product[], config: SiteConfig }) {
  const [showAll, setShowAll] = useState(false);
  
  // キリよく30件
  const INITIAL_COUNT = 30;
  
  const visibleProducts = showAll ? products : products.slice(0, INITIAL_COUNT);
  const hasMore = products.length > INITIAL_COUNT;

  return (
    <div>
      {/* 
        全件2列グリッドで統一。
        個別の機械的なコメントを廃止し、シンプルで信頼感のあるリストへ。
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {visibleProducts.map((product, index) => (
          <div key={`${product.id}-${index}`} className="relative">
            <ProductCard product={product} config={config} />
          </div>
        ))}
      </div>

      {hasMore && !showAll && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="group relative inline-flex items-center justify-center px-10 py-4 font-black text-white transition-all duration-200 bg-gray-900 rounded-full hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1 focus:outline-none ring-offset-2 focus:ring-2 ring-gray-900"
          >
            <span>さらに選択肢を広げる ({products.length - INITIAL_COUNT}件)</span>
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
