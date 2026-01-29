"use client";

import Link from "next/link";
import { SITE_REGISTRY } from "@/lib/config";
import { getBrandPath } from "@/lib/utils";

export default function DebugMenu() {
  // 🛡️ 開発環境（localhost）以外では、コンポーネント自体を存在させない
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="mt-20 border-t-4 border-black bg-yellow-50 p-8 font-mono text-xs text-left">
      <h2 className="mb-4 text-xl font-black uppercase tracking-tighter text-black flex items-center gap-2">
        🛠️ Admin Debug Menu <span className="text-[10px] bg-black text-yellow-400 px-2 py-0.5 rounded">HIDDEN MODE</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {Object.entries(SITE_REGISTRY).map(([id, config]) => (
          <div key={id} className="border border-gray-300 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-black text-sm mb-3 border-b pb-1 text-indigo-600 uppercase">
              {id}: {config.brandName}
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="font-bold text-red-600 mb-1 flex items-center justify-between">
                  <span>楽天市場</span>
                  <span className="text-[8px] font-normal text-gray-400">Total: {config.rakutenCategories.length}</span>
                </p>
                <ul className="space-y-1">
                  {config.rakutenCategories.map(cat => (
                    <li key={cat.id}>
                      <Link 
                        href={`${getBrandPath(id, "/")}?mall=rakuten&genre=${cat.id}&debug=true`}
                        className="hover:underline text-blue-500 flex justify-between gap-2"
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[9px] text-gray-400 font-normal shrink-0">ID:{cat.mallId}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-bold text-blue-600 mb-1 flex items-center justify-between">
                  <span>Yahoo!ショッピング</span>
                  <span className="text-[8px] font-normal text-gray-400">Total: {config.yahooCategories.length}</span>
                </p>
                <ul className="space-y-1">
                  {config.yahooCategories.map(cat => (
                    <li key={cat.id}>
                      <Link 
                        href={`${getBrandPath(id, "/")}?mall=yahoo&genre=${cat.id}&debug=true`}
                        className="hover:underline text-blue-500 flex justify-between gap-2"
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[9px] text-gray-400 font-normal shrink-0">ID:{cat.mallId}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 pt-4 border-t border-gray-200 text-gray-400 text-[10px] text-center">
        This menu is only visible when <code className="bg-gray-100 px-1">?debug=true</code> is present in the URL.
      </div>
    </div>
  );
}
