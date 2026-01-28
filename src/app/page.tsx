import Home from "./[brand]/page";

export const runtime = 'edge';

// トップページ (/)
export default async function DefaultHome(props: any) {
  const params = Promise.resolve({ brand: "bestie" });
  return <Home {...props} params={params} />;
}

// SEO用の動的メタデータ
export { generateMetadata } from "./[brand]/page";
