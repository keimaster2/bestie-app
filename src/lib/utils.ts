export function getBrandPath(brand: string, path: string = ""): string {
  // 本家(bestie)の場合は接頭辞なし、それ以外は /brand を付ける
  const prefix = (brand === "bestie" || brand === "default") ? "" : `/${brand}`;
  
  // path が / で始まる場合はそのまま結合、そうでなければ / を挟む
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // ルートへの遷移で path が空または / の場合
  if (path === "/" || path === "") {
    return prefix || "/";
  }
  
  // prefixが空（本家）の場合はそのままcleanPathを返す（例: /favorites）
  // prefixがある場合は連結する（例: /beauty/favorites）
  return `${prefix}${cleanPath}`;
}
