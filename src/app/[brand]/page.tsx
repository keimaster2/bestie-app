import type { Metadata } from "next";
import { Product } from "@/lib/types";
import { getSiteConfig, SiteConfig } from "@/lib/config";
import { generateLionReview, assignComparisonLabels } from "@/lib/lion-logic";
import { MallClient, MallType } from "@/lib/malls/factory";
import ClientHome from "./ClientHome";

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
  const params = await props.params;
  const sParams = await props.searchParams;
  const config = getSiteConfig(params.brand);
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
  const isSubBrand = params.brand !== "bestie";
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
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function Home(props: {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await props.params;
  const sParams = await props.searchParams;
  const config = getSiteConfig(params.brand);

  const mall = ((sParams.mall as string) || "rakuten") as MallType;
  const query = (sParams.q as string) || "";
  const sort = (sParams.sort as string) || "default";
  const mallName = mall === "yahoo" ? "Yahoo!" : "楽天市場";
  const isSearchMode = !!query;

  const { categories, currentGenre } = getActiveContext(config, mall, sParams.genre as string);

  if (!currentGenre) {
    return <div className="p-20 text-center font-bold text-gray-400">Configuration Error.</div>;
  }

  let finalProducts: Product[] = [];

  if (isSearchMode) {
    // 🔍 【検索モード】モール横断検索を実施
    const [rakutenRes, yahooRes] = await Promise.all([
      MallClient.getProducts("rakuten", config.rakutenCategories[0].mallId, query, true),
      MallClient.getProducts("yahoo", config.yahooCategories[0].mallId, query, true)
    ]);

    // マージ
    finalProducts = [...rakutenRes, ...yahooRes];

    // ソート処理
    if (sort === "price_asc") {
      finalProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      finalProducts.sort((a, b) => b.price - a.price);
    } else {
      // デフォルトは関連度（各モールの順序を維持しつつ混ぜる）
      const merged: Product[] = [];
      const maxLen = Math.max(rakutenRes.length, yahooRes.length);
      for (let i = 0; i < maxLen; i++) {
        if (rakutenRes[i]) merged.push(rakutenRes[i]);
        if (yahooRes[i]) merged.push(yahooRes[i]);
      }
      finalProducts = merged;
    }
  } else {
    // 🏆 【ランキングモード】従来通り
    const otherMall: MallType = mall === "rakuten" ? "yahoo" : "rakuten";
    const otherCategories = (otherMall === "yahoo" ? config.yahooCategories : config.rakutenCategories) || [];
    const mainMallId = currentGenre.mallId;
    const otherMallId = otherCategories.find(c => c.id === currentGenre.id)?.mallId || otherCategories[0]?.mallId || "";

    const [mainProducts, otherProducts] = await Promise.all([
      MallClient.getProducts(mall, mainMallId, query, isSearchMode),
      MallClient.getProducts(otherMall, otherMallId, query, isSearchMode)
    ]);

    const cleanTitle = (t: string) => t.replace(/[【】\[\]\(\)\s]/g, "").replace(/送料無料|ポイント\d+倍|公式|国内正規品|あす楽/g, "").substring(0, 10);

    finalProducts = mainProducts.map((p) => {
      const pClean = cleanTitle(p.title);
      const matchedOther = otherProducts.find(op => {
        const opClean = cleanTitle(op.title);
        return opClean === pClean && pClean.length > 3;
      });

      return { 
        ...p, 
        isWRank: !!matchedOther,
        rakutenUrl: mall === "rakuten" ? p.url : matchedOther?.url,
        yahooUrl: mall === "yahoo" ? p.url : matchedOther?.url,
      };
    });
  }

  // 1. 称号（ラベル）を付与
  finalProducts = assignComparisonLabels(finalProducts);

  // 2. ライオンくんの目利き（レビュー）を付与
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
      query={query}
      genreId={currentGenre.id}
      isSearchMode={isSearchMode}
      currentGenre={currentGenre}
      breadcrumbItems={[]}
    />
  );
}
