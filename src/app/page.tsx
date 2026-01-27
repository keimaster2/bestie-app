export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // 追加：動的レンダリングを強制

import Image from "next/image";
import Link from "next/link"; // 追加
import { fetchRakutenRanking, searchRakutenItems, RakutenItem } from "@/lib/rakuten";
import { fetchYahooRanking, searchYahooItems, YahooItem } from "@/lib/yahoo";
import { GENRES } from "@/lib/genres";
import { amazonProducts } from "@/data/products"; // 追加
import SearchBar from "@/components/SearchBar";
import RankingList from "@/components/RankingList";

// 内部で使用する統一フォーマット
// (Component側でも使うので、本来は types.ts に出すべきですが、簡易的にここでexportしてComponent側でimportも可。
// ただし今回はComponent側に再定義してしまったので、ここのexportは不要だが、型合わせのため確認)
export type Product = {
  id: string;
  rank?: number;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  mall: "Amazon" | "Rakuten" | "Yahoo";
  shopName: string;
  url: string;
};

// 楽天データを統一フォーマットに変換
function convertRakutenToProduct(items: RakutenItem[], isRanking: boolean): Product[] {
  return items
    .filter(item => {
      // 品質フィルター: レビュー0件の商品は除外（広告や予約品の可能性が高いため）
      // ただし、ランキングモード以外（検索時）は許容するか？ いや、検索でも0件は怪しいので除外
      return item.Item.reviewCount > 0;
    })
    .map((item, index) => {
      const i = item.Item;
    // 画像URLの高画質化：末尾のサイズ指定(?_ex=...)を削除してオリジナルサイズを取得
    // または ?_ex=600x600 のように明示的に大きくする
    // (ドメイン置換はリンク切れリスクがあるため避ける)
    let imageUrl = i.mediumImageUrls.length > 0 ? i.mediumImageUrls[0].imageUrl : "/placeholder.svg";
    if (imageUrl.includes("?_ex=")) {
      imageUrl = imageUrl.replace(/\?_ex=.*$/, "?_ex=600x600");
    }

    return {
      // 楽天の商品IDをURL用のIDとして使う
      id: `rakuten-${i.itemCode}`,
      rank: isRanking ? i.rank : undefined,
      title: i.itemName,
      price: parseInt(i.itemPrice),
      rating: parseFloat(i.reviewAverage),
      reviewCount: i.reviewCount,
      image: i.mediumImageUrls.length > 0 ? i.mediumImageUrls[0].imageUrl : "/placeholder.svg",
      mall: "Rakuten",
      shopName: i.shopName,
      url: i.itemUrl,
    };
  });
}

// Yahooデータを統一フォーマットに変換
function convertYahooToProduct(items: YahooItem[], isRanking: boolean): Product[] {
  return items
    .filter(item => {
      // 品質フィルター: レビュー0件の商品は除外
      return (item.review?.count || 0) > 0;
    })
    .map((item, index) => {
      // Yahooの画像はいくつかサイズがあるがmediumを使う
    return {
      id: `yahoo-${item.code}`,
      rank: isRanking ? index + 1 : undefined, // Yahooは配列順が順位
      title: item.name,
      price: item.price,
      rating: item.review?.rate || 0,
      reviewCount: item.review?.count || 0,
      image: item.image?.medium || "/placeholder.svg",
      mall: "Yahoo",
      shopName: item.store?.name || "Yahoo!ショッピング",
      url: item.url,
    };
  });
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const genreId = (params.genre as string) || "all";
  const mall = (params.mall as string) || "rakuten"; // デフォルトは楽天
  const query = (params.q as string) || "";
  
  const isSearchMode = !!query;
  const currentGenre = GENRES.find(g => g.id === genreId) || GENRES[0];

  let products: Product[] = [];

  // 検索モードの場合
  if (isSearchMode) {
    if (mall === "yahoo") {
      const rawData = await searchYahooItems(query);
      products = convertYahooToProduct(rawData, false);
    // } else if (mall === "amazon") {
    //    // Amazon検索（準備中）
    //    products = amazonProducts.filter(p => 
    //      p.title.toLowerCase().includes(query.toLowerCase())
    //    ) as Product[];
    } else {
      const rawData = await searchRakutenItems(query);
      products = convertRakutenToProduct(rawData, false);
    }
  } 
  // ランキングモードの場合
  else {
    if (mall === "yahoo") {
      const rawData = await fetchYahooRanking(currentGenre.yahooId);
      products = convertYahooToProduct(rawData, true);
    // } else if (mall === "amazon") {
    //   // Amazonランキング（準備中）
    //   products = amazonProducts as Product[];
    } else {
      // デフォルトは楽天
      const rawData = await fetchRakutenRanking(currentGenre.rakutenId);
      products = convertRakutenToProduct(rawData, true);
    }
  }

  // ランキングモードの場合、強制的に順位順にソート（APIによって順番が違う場合があるため）
  if (!isSearchMode) {
    products.sort((a, b) => (a.rank || 999) - (b.rank || 999));
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-20 font-sans">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-col w-full sm:w-auto">
            <div className="flex items-center gap-4 justify-between">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition group">
                <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">🎁</span>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 leading-none">
                    Bestie
                  </h1>
                  <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 tracking-wider">
                    BEST ITEM SELECTION
                  </p>
                </div>
              </Link>
              
              {/* モバイル用お気に入りリンク */}
              <a href="/favorites" className="sm:hidden text-gray-400 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex-1 sm:w-64">
              <SearchBar />
            </div>
            {/* PC用お気に入りリンク */}
            <a href="/favorites" className="hidden sm:flex flex-col items-center text-gray-400 hover:text-red-500 transition text-xs font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              Favorites
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-100 bg-white">
          {/* コンセプトメッセージ（スマホでは非表示） */}
          <div className="hidden sm:block max-w-4xl mx-auto px-4 py-2 text-center sm:text-left border-b border-gray-50">
             <p className="text-xs text-gray-500 font-medium">
               選び疲れをゼロに。今売れている<span className="text-gray-900 font-bold">「間違いのない商品」</span>を厳選しました。
             </p>
          </div>

          <div className="max-w-4xl mx-auto px-4">
            {/* モール切り替えタブ */}
            <div className="flex justify-center py-2 sm:py-4 border-b border-gray-100 mb-1">
              <div className="inline-flex bg-gray-100 rounded-full p-0.5 sm:p-1">
                <Link 
                  href={`/?mall=rakuten${query ? `&q=${encodeURIComponent(query)}` : `&genre=${genreId}`}`}
                  className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    mall === "rakuten" || (!mall || (mall !== "yahoo" && mall !== "amazon")) ? "bg-white shadow-sm text-red-600" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Rakuten
                </Link>
                <Link 
                  href={`/?mall=yahoo${query ? `&q=${encodeURIComponent(query)}` : `&genre=${genreId}`}`}
                  className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    mall === "yahoo" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Yahoo!
                </Link>
                <span className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-gray-300 cursor-not-allowed" title="準備中">
                  Amazon
                </span>
              </div>
            </div>

            {/* ジャンルタブ（検索時以外表示） */}
            {!isSearchMode && (
              <div className="flex overflow-x-auto no-scrollbar gap-1 py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                {GENRES.map((g) => (
                  <Link
                    key={g.id}
                    href={`/?mall=${mall}&genre=${g.id}`}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap
                      ${
                        genreId === g.id
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          {isSearchMode ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold">
                  「{query}」の検索結果
                </h2>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border 
                  ${mall === "yahoo" ? "bg-white text-blue-600 border-blue-600" : 
                    mall === "amazon" ? "bg-white text-orange-500 border-orange-500" :
                    "bg-white text-red-600 border-red-600"}`}>
                  {mall === "yahoo" ? "Yahoo!" : mall === "amazon" ? "Amazon" : "Rakuten"}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {products.length}件の商品が見つかりました
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold">
                  {currentGenre.name}ランキング
                </h2>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border 
                  ${mall === "yahoo" ? "bg-white text-blue-600 border-blue-600" : 
                    mall === "amazon" ? "bg-white text-orange-500 border-orange-500" :
                    "bg-white text-red-600 border-red-600"}`}>
                  {mall === "yahoo" ? "Yahoo!" : mall === "amazon" ? "Amazon" : "Rakuten"}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {mall === "yahoo" ? "Yahoo!ショッピング" : mall === "amazon" ? "Amazon" : "楽天市場"}のリアルタイム人気商品
              </p>
            </div>
          )}
        </div>

        {products.length > 0 ? (
          <RankingList products={products} />
        ) : (
          <div className="text-center py-20 text-gray-400">
            データが取得できませんでした。
            <br />
            API設定を確認してください。
          </div>
        )}
      </main>
    </div>
  );
}
