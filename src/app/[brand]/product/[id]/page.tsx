"use client";

export const runtime = 'edge';

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import FavoriteButton from "@/components/FavoriteButton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Product } from "@/lib/types";
import { getSiteConfig } from "@/lib/config";
import { useFavorites } from "@/context/FavoritesContext";
import { getBrandPath } from "@/lib/utils";

export default function ProductDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ brand: string; id: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = use(paramsPromise);
  const { setBrand } = useFavorites();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState<string>("/placeholder.svg");

  const config = getSiteConfig(params.brand);

  useEffect(() => {
    if (!params.brand) return;
    setBrand(params.brand);

    const fromParams: any = {};
    searchParams.forEach((value, key) => {
      fromParams[key] = value;
    });

    if (fromParams.title) {
      const initialProduct = {
        id: params.id, 
        title: fromParams.title,
        price: parseInt(fromParams.price || "0"),
        image: fromParams.image,
        mall: fromParams.mall,
        shopName: fromParams.shop,
        url: fromParams.url,
        rating: parseFloat(fromParams.rating || "0"),
        reviewCount: parseInt(fromParams.review || "0"),
        rakutenUrl: fromParams.rakutenUrl,
        yahooUrl: fromParams.yahooUrl,
      };
      setProduct(initialProduct as Product);
      setImgSrc(fromParams.image || "/placeholder.svg");
      setLoading(false);
    }

    const cached = sessionStorage.getItem(`product-detail-${params.id}`);
    if (cached) {
      const data = JSON.parse(cached);
      setProduct((prev) => ({ ...prev, ...data, id: params.id }));
      setImgSrc(data.image || "/placeholder.svg");
      setLoading(false);
    } else if (!fromParams.title) {
      setLoading(false);
    }
  }, [searchParams, params.brand, params.id, setBrand]);

  const bgColor = config.theme.background;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-colors duration-500" style={{ backgroundColor: bgColor }}>
        <div className="text-gray-400 animate-pulse">読み込み中...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 transition-colors duration-500" style={{ backgroundColor: bgColor }}>
        <p>商品が見つかりませんでした。</p>
        <Link href={getBrandPath(params.brand, "/")} className="text-blue-600 underline">トップへ戻る</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 font-sans transition-colors duration-500 text-gray-800"
      style={{ 
        backgroundColor: bgColor,
        "--brand-primary": config.themeColor.primary,
        "--brand-accent": config.themeColor.accent,
      } as React.CSSProperties}
    >
      <Header config={config} minimal={true} />

      <Breadcrumbs 
        brand={params.brand}
        config={config}
        items={[
          { label: product.mall, href: `${getBrandPath(params.brand, "/")}?mall=${product.mall.toLowerCase()}` },
          { label: product.title }
        ]}
      />

      <main className="max-w-2xl mx-auto p-4">
        {/* 商品画像 */}
        <div className="bg-white flex items-center justify-center mb-8 py-12 rounded-2xl shadow-sm relative aspect-square overflow-hidden border border-gray-100">
          <Image 
            src={imgSrc} 
            alt={product.title}
            fill
            className="object-contain p-8"
            onError={() => setImgSrc("/placeholder.svg")}
          />
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{product.shopName}</span>
            {product.rating > 0 && (
              <>
                <span>•</span>
                <span className="text-yellow-500 font-bold">★ {product.rating}</span>
                <span>({(product.reviewCount || 0).toLocaleString()})</span>
              </>
            )}
          </div>

          <h1 className="text-xl font-bold leading-relaxed text-gray-900" style={{ color: 'var(--brand-primary)' }}>
            {product.title}
          </h1>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-red-600 font-mono">
              ¥{(product.price || 0).toLocaleString()}
            </span>
            <span className="text-xs text-gray-400">税込</span>
          </div>
        </div>

        {/* 購入ボタン */}
        <div className="space-y-4 mb-12">
            <a 
              href={
                product.mall === "Rakuten"
                  ? `https://af.moshimo.com/af/c/click?a_id=5355389&p_id=54&pc_id=54&pl_id=616&url=${encodeURIComponent(product.rakutenUrl || product.url)}`
                  : `https://af.moshimo.com/af/c/click?a_id=5355394&p_id=1225&pc_id=1925&pl_id=18502&url=${encodeURIComponent(product.yahooUrl || product.url)}`
              }
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full py-4 rounded-xl text-center font-bold text-lg text-white shadow-lg transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: product.mall === "Yahoo" ? "#2563eb" : "#dc2626" }}
            >
              {product.mall === "Yahoo" ? "Yahoo!で見る" : "楽天市場で見る"}
            </a>
        </div>

        <div className="prose prose-sm text-gray-600 mt-8 pb-20">
          <h3 className="text-lg font-bold text-gray-900 mb-2">商品詳細</h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {product.description || "詳細情報は各ストアページでご確認ください。"}
          </p>
        </div>
      </main>

      <Footer brand={params.brand} config={config} />
    </div>
  );
}
