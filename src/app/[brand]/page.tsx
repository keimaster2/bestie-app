import type { Metadata } from "next";
import { Product, SiteConfig } from "@/lib/types";
import { getSiteConfig } from "@/lib/config";
import { generateLionReview, assignComparisonLabels, getDailyLionShout } from "@/lib/lion-logic";
import { MallClient, MallType } from "@/lib/malls/factory";
import ClientHome from "./ClientHome";
import { headers } from "next/headers";

// Timestamp for refresh: 2026-01-30 15:30

// Helper to safely get categories and current category
function getActiveContext(config: SiteConfig, mall: string, genreIdFromParam?: string) {
  const categories = (mall === "yahoo" ? config.yahooCategories : config.rakutenCategories) || [];
  if (categories.length === 0) return { categories: [], currentGenre: null, genreId: "" };

  const currentGenre = categories.find(g => g.id === genreIdFromParam) || categories[0];
  const genreId = currentGenre?.id || "";

  return { categories, currentGenre, genreId };
}

export async function generateMetadata(
  props: {
    params: Promise<{ brand: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
): Promise<Metadata> {
  try {
    const params = await props.params;
    const sParams = await props.searchParams;
    const host = (await headers()).get("host") || "";
    const brandKey = params.brand && params.brand !== "default" ? params.brand : host;
    const config = getSiteConfig(brandKey);
    const mall = (sParams.mall as string) || "rakuten";
    const { currentGenre } = getActiveContext(config, mall, sParams.genre as string);

    if (sParams.q) {
      return {
        title: `「${sParams.q}」の売れ筋比較 | ${config.brandName}`,
        description: `${config.brandName}による「${sParams.q}」の市場分析結果。`,
      };
    }

    if (!currentGenre) return { title: config.siteTitle, description: config.description };

    const brandLabel = config.brandName.replace("Bestie ", "");
    const isSubBrand = config.id !== "bestie";
    const categories = (mall === "yahoo" ? config.yahooCategories : config.rakutenCategories) || [];
    const isFirstCategory = categories.length > 0 && currentGenre.id === categories[0].id;

    if (isSubBrand && isFirstCategory) {
      return {
        title: `${brandLabel}人気ランキング | ${config.brandName} | Bestie`,
        description: config.description,
      };
    }

    const suffix = isSubBrand ? ` | ${config.brandName} | Bestie` : ` | Bestie`;
    return {
      title: `${currentGenre.name}人気ランキング${suffix}`,
      description: `${config.brandName}が分析する${currentGenre.name}の最新トレンド。`,
    };
  } catch (e) {
    console.error("Metadata error:", e);
    return { title: "Bestie | モール横断ランキング" };
  }
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function Home(props: {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  try {
    const params = await props.params;
    const sParams = await props.searchParams;
    const host = (await headers()).get("host") || "";
    const brandKey = params.brand && params.brand !== "default" ? params.brand : host;
    const config = getSiteConfig(brandKey);

    const mall = ((sParams.mall as string) || "rakuten") as MallType;
    const queryFromUrl = (sParams.q as string) || "";
    const sort = (sParams.sort as string) || "default";
    const mallName = mall === "yahoo" ? "Yahoo!" : "楽天市場";

    const { categories, currentGenre } = getActiveContext(config, mall, sParams.genre as string);

    if (!currentGenre) {
      return <div className="p-20 text-center font-bold text-gray-400">Configuration Error.</div>;
    }

    // 🛍️ 両方のモールのカテゴリIDを特定する
    const rakutenCategories = config.rakutenCategories || [];
    const yahooCategories = config.yahooCategories || [];

    // 現在選択されているカテゴリのID
    const activeId = currentGenre.id;

    const rakutenGenreId = rakutenCategories.length > 0 ? (rakutenCategories.find(c => c.id === activeId)?.mallId || rakutenCategories[0].mallId) : "0";
    const yahooGenreId = yahooCategories.length > 0 ? (yahooCategories.find(c => c.id === activeId)?.mallId || yahooCategories[0].mallId) : "1";

    const effectiveQuery = queryFromUrl || currentGenre.keyword || "";
    const isSearchMode = !!queryFromUrl;
    const isKeywordCategory = !queryFromUrl && !!currentGenre.keyword;

    let finalProducts: Product[] = [];

    if (isSearchMode || isKeywordCategory) {
      const [rakutenRes, yahooRes] = await Promise.all([
        MallClient.getProducts("rakuten", rakutenGenreId, effectiveQuery, true, brandKey),
        MallClient.getProducts("yahoo", yahooGenreId, effectiveQuery, true, brandKey)
      ]);

      const merged: Product[] = [];
      const maxLen = Math.max(rakutenRes.length, yahooRes.length);
      for (let i = 0; i < maxLen; i++) {
        if (rakutenRes[i]) merged.push(rakutenRes[i]);
        if (yahooRes[i]) merged.push(yahooRes[i]);
      }

      if (isKeywordCategory) {
        finalProducts = merged.map((p, index) => ({ ...p, rank: index + 1 }));
      } else {
        finalProducts = merged;
      }

      if (sort === "price_asc") finalProducts.sort((a, b) => a.price - b.price);
      else if (sort === "price_desc") finalProducts.sort((a, b) => b.price - a.price);
    } else {
      const otherMall: MallType = mall === "rakuten" ? "yahoo" : "rakuten";
      const otherCategories = (otherMall === "yahoo" ? config.yahooCategories : config.rakutenCategories) || [];
      const mainMallId = currentGenre.mallId;
      const otherMallId = otherCategories.find(c => c.id === currentGenre.id)?.mallId || otherCategories[0]?.mallId || "0";

      const [mainProducts, otherProducts] = await Promise.all([
        MallClient.getProducts(mall, mainMallId, "", false, brandKey),
        MallClient.getProducts(otherMall, otherMallId, "", false, brandKey)
      ]);

      const cleanTitle = (t: string) => t.replace(/[【】\[\]\(\)\s]/g, "").replace(/送料無料|ポイント\d+倍|公式|国内正規品|あす楽/g, "").substring(0, 20);

      finalProducts = mainProducts.map((p) => {
        const pClean = cleanTitle(p.title);
        const matchedOther = otherProducts.find(op => {
          const opClean = cleanTitle(op.title);
          return opClean === pClean && pClean.length > 5;
        });

        return {
          ...p,
          isWRank: !!matchedOther,
          rakutenUrl: mall === "rakuten" ? p.url : matchedOther?.url,
          yahooUrl: mall === "yahoo" ? p.url : matchedOther?.url,
        };
      });
    }

    finalProducts = assignComparisonLabels(finalProducts);
    finalProducts = finalProducts.map((p) => ({
      ...p,
      expertReview: generateLionReview(p, config, mallName)
    }));

    return (
      <ClientHome
        params={params}
        config={config}
        products={finalProducts}
        mall={mall}
        query={queryFromUrl}
        genreId={currentGenre.id}
        isSearchMode={isSearchMode}
        currentGenre={currentGenre}
        breadcrumbItems={[]}
        initialShout={getDailyLionShout()}
      />
    );
  } catch (error) {
    console.error("Home render error:", error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="text-4xl mb-4">🦁</div>
        <h2 className="text-xl font-bold mb-2">データの読み込み中にエラーが発生しました</h2>
        <p className="text-gray-500 text-sm mb-6">しばらく時間を置いてから再度お試しください</p>
      </div>
    );
  }
}
