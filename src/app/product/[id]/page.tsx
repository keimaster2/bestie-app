import ProductDetailPage from "../../[brand]/product/[id]/page";

export const runtime = 'edge';

export default async function Page(props: any) {
  const params = props.params ? props.params.then((p: any) => ({ ...p, brand: "" })) : Promise.resolve({ brand: "" });
  return <ProductDetailPage {...props} params={params} />;
}
