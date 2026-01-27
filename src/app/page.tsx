import Image from "next/image";
import { fetchRakutenRanking, searchRakutenItems, RakutenItem } from "@/lib/rakuten";
import { fetchYahooRanking, searchYahooItems, YahooItem } from "@/lib/yahoo";
import { GENRES } from "@/lib/genres";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";

// 内部で使用する統一フォーマット
type Product = {
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
  return items.map((item, index) => {
    const i = item.Item;
    return {
      id: `rakuten-${index}`,
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
  return items.map((item, index) => {
    // Yahooの画像はいくつかサイズがあるがmediumを使う
    return {
      id: `yahoo-${item.code || index}`,
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
    } else {
      // デフォルトは楽天
      const rawData = await fetchRakutenRanking(currentGenre.rakutenId);
      products = convertRakutenToProduct(rawData, true);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-20 font-sans">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <span className="text-2xl">👑</span>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 whitespace-nowrap">
                Life Best X
              </h1>
            </a>
            
            {/* モバイル用お気に入りリンク */}
            <a href="/favorites" className="sm:hidden text-gray-500 hover:text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </a>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex-1 sm:w-64">
              <SearchBar />
            </div>
            {/* PC用お気に入りリンク */}
            <a href="/favorites" className="hidden sm:flex flex-col items-center text-gray-500 hover:text-red-500 transition text-xs font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              Favorites
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            {/* モール切り替えタブ */}
            <div className="flex justify-center py-4 border-b border-gray-100 mb-2">
              <div className="inline-flex bg-gray-100 rounded-full p-1">
                <a 
                  href={`/?mall=rakuten${query ? `&q=${encodeURIComponent(query)}` : `&genre=${genreId}`}`}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    mall !== "yahoo" ? "bg-white shadow-sm text-red-600" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Rakuten
                </a>
                <a 
                  href={`/?mall=yahoo${query ? `&q=${encodeURIComponent(query)}` : `&genre=${genreId}`}`}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    mall === "yahoo" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Yahoo!
                </a>
                <span className="px-6 py-2 rounded-full text-sm font-bold text-gray-300 cursor-not-allowed" title="準備中">
                  Amazon
                </span>
              </div>
            </div>

            {/* ジャンルタブ（検索時以外表示） */}
            {!isSearchMode && (
              <div className="flex overflow-x-auto no-scrollbar gap-1 py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                {GENRES.map((g) => (
                  <a
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
                  </a>
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
                  ${mall === "yahoo" ? "bg-white text-blue-600 border-blue-600" : "bg-white text-red-600 border-red-600"}`}>
                  {mall === "yahoo" ? "Yahoo!" : "Rakuten"}
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
                  ${mall === "yahoo" ? "bg-white text-blue-600 border-blue-600" : "bg-white text-red-600 border-red-600"}`}>
                  {mall === "yahoo" ? "Yahoo!" : "Rakuten"}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {mall === "yahoo" ? "Yahoo!ショッピング" : "楽天市場"}のリアルタイム人気商品
              </p>
            </div>
          )}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
