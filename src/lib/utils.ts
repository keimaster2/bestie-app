export function getBrandPath(brand: string, path: string = ""): string {
  // 本家(bestie)の場合は接頭辞なし
  const prefix = (brand === "bestie" || brand === "default") ? "" : `/${brand}`;
  
  // path が / で始まる場合はそのまま、そうでなければ / を付ける
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // ルート("/")への遷移の場合
  if (path === "/" || path === "") {
    return prefix || "/";
  }
  
  // prefixが空（本家）の場合はそのままcleanPath（例: /favorites）を返す
  // prefixがある場合は連結する（例: /beauty/favorites）
  return `${prefix}${cleanPath}`;
}
