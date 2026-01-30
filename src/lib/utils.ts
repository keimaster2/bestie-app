export function getBrandPath(brand: string | undefined | null, path: string = ""): string {
  // 🛡️ 環境判定
  const isDev = process.env.NODE_ENV === "development";

  // brand が falsy（空文字など）または "bestie", "default" の場合は接頭辞なし
  const hasPrefix = isDev && brand && brand !== "bestie" && brand !== "default";
  const prefix = hasPrefix ? `/${brand}` : "";
  
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // ルートへの遷移処理
  if (path === "/" || path === "") {
    return prefix || "/";
  }
  
  // prefix が空なら "/about", prefix があれば "/beauty/about" となる
  // これにより "//about" (外部ドメイン扱い) になるのを防ぐ
  return `${prefix}${cleanPath}`;
}
