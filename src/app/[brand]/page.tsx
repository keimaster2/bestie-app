import type { Metadata } from "next";
import { fetchRakutenRanking, searchRakutenItems, convertRakutenToProduct } from "@/lib/rakuten";
import { fetchYahooRanking, searchYahooItems, convertYahooToProduct } from "@/lib/yahoo";
import { Product } from "@/lib/types";
import { getSiteConfig } from "@/lib/config";
import { headers } from "next/headers";
import RankingList from "@/components/RankingList";
import Header from "@/components/Header";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getBrandPath } from "@/lib/utils";

// SEO用の動的メタデータ生成
export async function generateMetadata(
  props: { 
    params: Promise<{ brand: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const sParams = await props.searchParams;
  const headerList = await headers();
  const host = headerList.get("host") || "";
  // パスに含まれるブランド名、またはホスト名から設定を取得
  const config = getSiteConfig(params.brand !== "bestie" ? params.brand : host);

  const genreId = (sParams.genre as string) || config.categories[0].id;
  const query = (sParams.q as string) || "";
  const mall = (sParams.mall as string) || "rakuten";
  
  const genre = config.categories.find(g => g.id === genreId) || config.categories[0];
  const mallName = mall === "yahoo" ? "Yahoo!ショッピング" : "楽天市場";

  if (query) {
    return {
      title: `「${query}」の検索結果・売れ筋比較`,
      description: `${mallName}での「${query}」の検索結果です。リアルタイムで今売れている人気商品を比較して、ベストな選択をサポートします。`,
    };
  }

  return {
    title: `${genre.name}人気ランキング - ${mallName}売れ筋比較`,
    description: `${mallName}の${genre.name}カテゴリで「今まさに売れている」人気商品をリアルタイムでお届け。選び疲れをゼロにする最強の比較メディアです。`,
  };
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function Home({
  params: paramsPromise,
  searchParams,
}: {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await paramsPromise;
  const sParams = await searchParams;
  const headerList = await headers();
  const host = headerList.get("host") || "";
  
  // パスに含まれるブランド名、またはホスト名から設定を取得
  const config = getSiteConfig(params.brand !== "bestie" ? params.brand : host);

  const genreId = (sParams.genre as string) || config.categories[0].id;
  const mall = (sParams.mall as string) || "rakuten";
  const query = (sParams.q as string) || "";
  
  const isSearchMode = !!query;
  const currentGenre = config.categories.find(g => g.id === genreId) || config.categories[0];

  let products: Product[] = [];
  let otherProducts: Product[] = [];

  // データの取得（マッチングのために両方取得を試みる）
  if (isSearchMode) {
    if (mall === "yahoo") {
      const rawData = await searchYahooItems(query);
      products = convertYahooToProduct(rawData, false);
      
      const rawRakuten = await searchRakutenItems(query);
      otherProducts = convertRakutenToProduct(rawRakuten, false);
    } else {
      const rawData = await searchRakutenItems(query);
      products = convertRakutenToProduct(rawData, false);

      const rawYahoo = await searchYahooItems(query);
      otherProducts = convertYahooToProduct(rawYahoo, false);
    }
  } else {
    // ランキングモードでも両方取得（カテゴリIDが両方ある場合のみ）
    if (mall === "yahoo") {
      const rawData = await fetchYahooRanking(currentGenre.yahooId, currentGenre.minPrice);
      products = convertYahooToProduct(rawData, true);

      if (currentGenre.rakutenId) {
        const rawRakuten = await fetchRakutenRanking(currentGenre.rakutenId);
        otherProducts = convertRakutenToProduct(rawRakuten, true);
      }
    } else {
      const rawData = await fetchRakutenRanking(currentGenre.rakutenId);
      products = convertRakutenToProduct(rawData, true);

      if (currentGenre.yahooId) {
        const rawYahoo = await fetchYahooRanking(currentGenre.yahooId, currentGenre.minPrice);
        otherProducts = convertYahooToProduct(rawYahoo, true);
      }
    }
  }

  // マッチングロジック：ノイズを徹底的に消して突合
  const cleanTitle = (t: string) => {
    return t
      .replace(/[【】\[\]\(\)\s]/g, "") // 記号と空白を削除
      .replace(/送料無料|ポイント\d+倍|公式|国内正規品|あす楽/g, "") // 共通ノイズワードを削除
      .substring(0, 8); // 先頭8文字で判定（短くして一致率を上げる）
  };
  
  products = products.map(p => {
    const pClean = cleanTitle(p.title);
    const matchedOther = otherProducts.find(op => {
      const opClean = cleanTitle(op.title);
      return opClean === pClean && pClean.length > 3;
    });

    // 自分のモールURLと、見つかった場合は相手のモールURLもセット
    return { 
      ...p, 
      isWRank: !!matchedOther,
      rakutenUrl: mall === "rakuten" ? p.url : matchedOther?.url,
      yahooUrl: mall === "yahoo" ? p.url : matchedOther?.url,
    };
  });

  // ランキングモードの場合、強制的に順位順にソート
  if (!isSearchMode) {
    products.sort((a, b) => (a.rank || 999) - (b.rank || 999));
  }

  const mallName = mall === "yahoo" ? "Yahoo!" : mall === "amazon" ? "Amazon" : "Rakuten";
  const mallFullName = mall === "yahoo" ? "Yahoo!ショッピング" : mall === "amazon" ? "Amazon" : "楽天市場";

  return (
    <div 
      className="min-h-screen pb-20 font-sans transition-colors duration-500 text-gray-800" 
      style={{ 
        backgroundColor: config.theme.background,
        "--brand-primary": config.themeColor.primary,
        "--brand-accent": config.themeColor.accent,
      } as React.CSSProperties}
    >
      <Header 
        mall={mall} 
        query={query} 
        genreId={genreId} 
        isSearchMode={isSearchMode} 
        config={config}
      />

      <Breadcrumbs 
        brand={params.brand}
        config={config}
        items={[
          ...(isSearchMode 
            ? [{ label: `「${query}」の検索結果` }]
            : (genreId !== config.categories[0].id 
                ? [{ label: currentGenre.name }] 
                : []))
        ]}
      />

      <main className="max-w-4xl mx-auto px-4 py-4">
        {/* EEAT Experience枠 */}
        {!isSearchMode && (
          <div className="mb-8 p-4 bg-white rounded-2xl border border-indigo-50 shadow-sm flex items-start gap-3">
            <span className="text-2xl mt-1">💡</span>
            <div>
              <h3 className="font-bold text-sm text-indigo-900 mb-1">{config.brandName}のセレクト理由</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {config.eeat.expertComment}
              </p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold">
              {isSearchMode ? `「${query}」の検索結果` : `${currentGenre.name}人気ランキング`}
            </h2>
            <span className={`text-xs font-bold px-2 py-0.5 rounded border 
              ${mall === "yahoo" ? "bg-white text-blue-600 border-blue-600" : 
                mall === "amazon" ? "bg-white text-orange-500 border-orange-500" :
                "bg-white text-red-600 border-red-600"}`}>
              {mallName}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {isSearchMode 
              ? `${products.length}件の商品が見つかりました` 
              : `${mallFullName}で「今まさに売れている」人気商品`}
          </p>
        </div>

        {products.length > 0 ? (
          <RankingList products={products} config={config} />
        ) : (
          <div className="text-center py-20 text-gray-400">
            データが取得できませんでした。
            <br />
            API設定を確認してください。
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-100 pt-12 pb-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🎁</span>
            <span className="text-xl font-black tracking-tight text-gray-900" style={{ color: config.themeColor.primary }}>{config.brandName}</span>
          </div>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            <Link href={getBrandPath(params.brand, "/about")} className="hover:text-gray-600 underline underline-offset-2 decoration-gray-200 mr-4">当サイトについて（免責事項）</Link>
            このサイトはアフィリエイト広告（Amazonアソシエイト含む）を掲載しています。<br />
            &copy; {new Date().getFullYear()} {config.brandName} - BEST ITEM SELECTION.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-2 bg-gray-50 rounded text-[8px] text-gray-400 font-mono inline-block">
              [DEBUG] Last Update: {new Date().toLocaleString('ja-JP')}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
