import Home from "./[brand]/page";

export const runtime = 'edge';

type Props = {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// カスタムドメイン（サブドメイン）および本家用ルートページ
export default async function DefaultHome({ params, searchParams }: Props) {
  const resolvedParams = await params;
  // brand パラメータを空で渡す（[brand]/page.tsx 側でホスト名から自動判定される）
  const newParams = Promise.resolve({ ...resolvedParams, brand: "" });
  return <Home params={newParams} searchParams={searchParams} />;
}
