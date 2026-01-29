"use client";

import ProductDetailPage from "../../[brand]/product/[id]/page";

export const runtime = 'edge';

// サブドメインおよび本家用の詳細ページ
export default function DefaultProductDetail(props: any) {
  // brand を空で渡す（遷移先のコンポーネント側でホスト名から自動判定される）
  const params = props.params.then((p: any) => ({ ...p, brand: "" }));
  return <ProductDetailPage {...props} params={params} />;
}
