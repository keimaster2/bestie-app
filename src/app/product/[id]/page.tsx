import ProductDetailPage from "../../[brand]/product/[id]/page";

export const runtime = 'edge';

type Props = {
  params: Promise<{ brand: string; id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const brand = resolvedParams.brand || "";
  
  const newParams = Promise.resolve({ ...resolvedParams, brand });
  return <ProductDetailPage params={newParams} />;
}
