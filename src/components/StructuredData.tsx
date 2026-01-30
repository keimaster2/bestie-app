import type { Product } from "@/lib/types";

type StructuredDataProps = {
  type: "ItemList" | "Product";
  data: any;
};

export default function StructuredData({ type, data }: StructuredDataProps) {
  let schema: any = null;

  if (type === "ItemList") {
    const products: Product[] = data.products;
    schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": products.map((p, index) => ({
        "@type": "ListItem",
        "position": p.rank || index + 1,
        "url": p.url,
        "name": p.title,
        "image": p.image
      }))
    };
  } else if (type === "Product") {
    const p: Product = data;
    schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": p.title,
      "image": p.image,
      "description": p.catchphrase || p.description,
      "brand": {
        "@type": "Brand",
        "name": p.shopName
      },
      "offers": {
        "@type": "Offer",
        "url": p.url,
        "priceCurrency": "JPY",
        "price": p.price,
        "availability": "https://schema.org/InStock"
      }
    };
    if (p.rating > 0) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": p.rating,
        "reviewCount": p.reviewCount || 1
      };
    }
  }

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
