import Image from "next/image";
import { fetchRakutenRanking, searchRakutenItems, RakutenItem, RAKUTEN_GENRES } from "@/lib/rakuten";
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

// 楽天データを統一フォーマットに変換する関数
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

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const genreId = (params.genre as string) || "";
  const query = (params.q as string) || "";
  
  const isSearchMode = !!query;
  const currentGenre = RAKUTEN_GENRES.find(g => g.id === genreId) || RAKUTEN_GENRES[0];

  let rawData: RakutenItem[] = [];
  if (isSearchMode) {
    rawData = await searchRakutenItems(query);
  } else {
    rawData = await fetchRakutenRanking(genreId);
  }
  
  const products = convertRakutenToProduct(rawData, !isSearchMode);

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
        
        {!isSearchMode && (
          <div className="border-t border-gray-100 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex overflow-x-auto no-scrollbar gap-1 py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                {RAKUTEN_GENRES.map((g) => (
                  <a
                    key={g.id}
                    href={`/?genre=${g.id}`}
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
            </div>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          {isSearchMode ? (
            <div>
              <h2 className="text-2xl font-bold mb-1">
                「{query}」の検索結果
              </h2>
              <p className="text-sm text-gray-500">
                {products.length}件の商品が見つかりました
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {currentGenre.name}ランキング
              </h2>
              <p className="text-sm text-gray-500">
                楽天市場のリアルタイム人気商品（上位30位）
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
            商品が見つかりませんでした。
            <br />
            別のキーワードを試してみてください。
          </div>
        )}
      </main>
    </div>
  );
}
