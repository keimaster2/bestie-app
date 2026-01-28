import Link from "next/link";
import SearchBar from "./SearchBar";
import { GENRES } from "@/lib/genres";

type HeaderProps = {
  mall: string;
  query: string;
  genreId: string;
  isSearchMode: boolean;
};

export default function Header({ mall, query, genreId, isSearchMode }: HeaderProps) {
  return (
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
            
            <Link href="/favorites" className="sm:hidden text-gray-400 hover:text-red-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex-1 sm:w-64">
            <SearchBar />
          </div>
          <Link href="/favorites" className="hidden sm:flex flex-col items-center text-gray-400 hover:text-red-500 transition text-xs font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            Favorites
          </Link>
        </div>
      </div>
      
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-2 text-center sm:text-left border-b border-gray-50">
           <p className="text-[10px] sm:text-xs text-gray-500 font-medium leading-tight">
             <span className="hidden sm:inline">選び疲れをゼロに。</span>
             大手モールの<span className="text-gray-900 font-bold">「今まさに売れている」</span>人気商品をリアルタイムにお届け。
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
  );
}
