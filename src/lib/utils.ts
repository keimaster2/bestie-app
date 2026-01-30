export function getBrandPath(brand: string, path: string = ""): string {
  // 🛡️ 環境判定（ブラウザ側での実行を想定）
  const isLocal = typeof window !== "undefined" && window.location.hostname.includes("localhost");

  // 本家(bestie)の場合は常に接頭辞なし
  // サブドメイン運用時（本番）も、そのドメイン内での遷移なら接頭辞なしにする
  const prefix = (!isLocal || brand === "bestie" || brand === "default") ? "" : `/${brand}`;
  
  // path が / で始まる場合はそのまま結合、そうでなければ / を挟む
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // ルートへの遷移で path が空または / の場合
  if (path === "/" || path === "") {
    return prefix || "/";
  }
  
  // 連結して返す
  return `${prefix}${cleanPath}`;
}
