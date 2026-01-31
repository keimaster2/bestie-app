import type { Product } from "./types";

/**
 * Yahoo!ショッピングの生データを共通のProduct型に変換するユーティリティ。
 * サーバー・クライアント両方で安全に使用可能。
 */
export function convertYahooToProduct(items: Record<string, unknown>[], isRanking: boolean): Product[] {
    return items.map((item, index) => {
        // V3は小文字開始、V2ランキングは多くが大文字開始
        const name = (item.name as string) || (item.Name as string) || "";
        const cleanTitle = name.replace(/【.*?】/g, "").replace(/\[.*?\]/g, "").replace(/返品種別[A-Z]?/g, "").trim();

        // 価格の取得 (V3: price, V2: Price._value)
        let price = 0;
        if (typeof item.price === "number") {
            price = item.price;
        } else if (item.Price && typeof item.Price === "object") {
            const p = item.Price as any;
            price = parseInt(p._value || p.toString() || "0");
        } else if (item.price) {
            price = parseInt(item.price.toString());
        }

        // 画像の取得 (V3: image.medium, V2: Image.Medium)
        const imageObj = (item.image || item.Image) as any;
        let image = imageObj?.medium || imageObj?.Medium || "/placeholder.svg";
        if (image.includes("/i/g/")) {
            image = image.replace("/i/g/", "/i/n/");
        } else if (image.includes("/i/l/")) {
            image = image.replace("/i/l/", "/i/n/");
        }

        // レビューの取得 (V3: review.rate, V2: Review.Rate)
        const reviewObj = (item.review || item.Review) as any;
        const rating = reviewObj?.rate || reviewObj?.Rate || 0;
        const reviewCount = reviewObj?.count || reviewObj?.Count || 0;

        // コード・URL・ショップ名の取得
        const code = (item.code as string) || (item.Code as string) || `item-${index}`;
        const storeObj = (item.seller || item.Store) as any;
        const shopName = storeObj?.name || storeObj?.Name || "Yahoo!ショッピング";
        const url = (item.url as string) || (item.Url as string) || "#";
        const catchphrase = (item.headLine as string) || (item.HeadLine as string) || "";

        return {
            id: `yahoo-${code}`,
            rank: isRanking ? (index + 1) : undefined,
            title: cleanTitle,
            price: price,
            rating: typeof rating === "string" ? parseFloat(rating) : rating,
            reviewCount: typeof reviewCount === "string" ? parseInt(reviewCount) : reviewCount,
            image: image,
            mall: "Yahoo",
            shopName: shopName,
            url: url,
            catchphrase: catchphrase,
        };
    });
}
