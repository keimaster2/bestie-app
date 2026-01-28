"use client";

import { useEffect, useState } from "react";
import FavoriteButton from "@/components/FavoriteButton";
import ProductImage from "@/components/ProductImage";
import { Product } from "@/lib/types";

export default function ProductDetailClient({ 
  id, 
  initialData 
}: { 
  id: string; 
  initialData: any 
}) {
  const [product, setProduct] = useState<Product>(initialData);

  useEffect(() => {
    // sessionStorageから直前のクリックデータを復元を試みる
    try {
      const saved = sessionStorage.getItem(`product-detail-${id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProduct(prev => ({
          ...prev,
          ...parsed,
          image: parsed.image || prev.image,
        }));
      }
    } catch (e) {
      console.error("Failed to load from session", e);
    }
  }, [id]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
        {/* 画像エリア */}
        <div className="bg-gray-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 relative">
          <ProductImage src={product.image} alt={product.title} />
          <div className="absolute top-4 right-4">
              <FavoriteButton 
                product={product} 
              />
          </div>
        </div>

        {/* 情報エリア */}
        <div className="p-6 md:p-8 flex flex-col">
          <div className="mb-4">
            <span className={`inline-block text-xs font-bold px-2 py-1 rounded border mb-2
              ${product.mall === "Yahoo" ? "bg-white text-blue-600 border-blue-600" : "bg-white text-red-600 border-red-600"}`}>
              {product.mall}
            </span>
            <div className="text-sm text-gray-500 mb-1">{product.shopName}</div>
            <h1 className="text-xl md:text-2xl font-bold leading-snug mb-4">{product.title}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400 text-lg">
                {"★".repeat(Math.floor(product.rating))}
                <span className="text-gray-300">{"★".repeat(5 - Math.floor(product.rating))}</span>
              </div>
              <span className="font-bold text-gray-700 text-lg">{product.rating}</span>
              <span className="text-gray-400 text-sm">({product.reviewCount.toLocaleString()}件のレビュー)</span>
            </div>

            <div className="text-3xl font-bold text-red-600 font-mono mb-6">
              ¥{product.price.toLocaleString()}
            </div>

            <a 
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full text-center py-4 rounded-xl font-bold text-white shadow-md transition-all hover:shadow-lg transform hover:-translate-y-0.5
                ${product.mall === "Yahoo" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}`}
            >
              {product.mall === "Yahoo" ? "Yahoo!ショッピングで購入" : "楽天市場で購入"}
            </a>
          </div>

          <div className="mt-auto border-t border-gray-100 pt-6">
            <h3 className="font-bold text-gray-900 mb-2">商品説明</h3>
            <p className="text-sm text-gray-600 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
              {product.description || "商品説明はありません。"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
