import Home from "./[brand]/page";

export const runtime = 'edge';

// カスタムドメイン（サブドメイン）および本家用ルートページ
export default async function DefaultHome(props: any) {
  // brand パラメータを空で渡す（[brand]/page.tsx 側でホスト名から自動判定される）
  const params = props.params ? props.params.then((p: any) => ({ ...p, brand: "" })) : Promise.resolve({ brand: "" });
  return <Home {...props} params={params} />;
}
