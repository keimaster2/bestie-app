"use client";

import ProductDetailPage from "../../[brand]/product/[id]/page";

// 本家用詳細ページ (/)
export default function DefaultProductDetail(props: any) {
  // brand パラメータを "bestie" として固定で渡す
  const params = props.params.then((p: any) => ({ ...p, brand: "bestie" }));
  return <ProductDetailPage {...props} params={params} />;
}
