import ProductDetailPage from "../../[brand]/product/[id]/page";

export const runtime = 'edge';

// ルートの商品詳細 (/product/[id])
export default function DefaultProductDetail(props: any) {
  const params = props.params.then((p: any) => ({ ...p, brand: "bestie" }));
  return <ProductDetailPage {...props} params={params} />;
}
