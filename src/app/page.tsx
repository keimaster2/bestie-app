import { SITE_REGISTRY, getSiteConfig } from "@/lib/config";
import Home from "./[brand]/page";
import Link from "next/link";
import { getBrandPath } from "@/lib/utils";

// トップページ (/) にアクセスした際は、デフォルトの Bestie ブランドを表示
export default async function DefaultHome(props: any) {
  // brand パラメータを "bestie" として固定で渡す
  const params = Promise.resolve({ brand: "bestie" });
  return <Home {...props} params={params} />;
}

// SEO用の動的メタデータ（トップページ用）
export { generateMetadata } from "./[brand]/page";
