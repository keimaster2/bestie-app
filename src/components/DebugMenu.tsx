"use client";

import Link from "next/link";
import { getBrandPath } from "@/lib/utils";

export default function DebugMenu() {
  // 🛡️ 開発環境（localhost）以外では、コンポーネント自体を存在させない
  // SITE_REGISTRYをインポートしないことでビルドサイズを削減
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="mt-20 border-t-4 border-black bg-yellow-50 p-8 font-mono text-xs text-left text-black">
      <h2 className="mb-4 text-xl font-black uppercase tracking-tighter flex items-center gap-2">
        🛠️ Admin Debug Menu <span className="text-[10px] bg-black text-yellow-400 px-2 py-0.5 rounded">HIDDEN MODE</span>
      </h2>
      <p>Debug menu items removed from production bundle to reduce worker size.</p>
    </div>
  );
}
