import type { Metadata } from "next";
import { Product } from "@/lib/types";
import { getSiteConfig, SiteConfig } from "@/lib/config";
import { generateLionReview } from "@/lib/lion-logic";
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

  return {
    title: `${currentGenre.name}人気ランキング | ${config.brandName}`,
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
  const mallName = mall === "yahoo" ? "Yahoo!" : "楽天市場";
  const isSearchMode = !!query;

  const { categories, currentGenre } = getActiveContext(config, mall, sParams.genre as string);

  if (!currentGenre) {
    return <div className="p-20 text-center font-bold text-gray-400">Configuration Error.</div>;
  }

  // メインとサブ（比較用）の両方のモールデータを並列で取得
  const otherMall: MallType = mall === "rakuten" ? "yahoo" : "rakuten";
  
  // 他方のモールのカテゴリー設定も取得（マッチング精度向上のため）
  const otherCategories = (otherMall === "yahoo" ? config.yahooCategories : config.rakutenCategories) || [];
  const mainMallId = isSearchMode ? (categories[0]?.mallId || "") : currentGenre.mallId;
  const otherMallId = isSearchMode ? (otherCategories[0]?.mallId || "") : (otherCategories.find(c => c.id === currentGenre.id)?.mallId || otherCategories[0]?.mallId || "");

  const [mainProducts, otherProducts] = await Promise.all([
    MallClient.getProducts(mall, mainMallId, query, isSearchMode),
    MallClient.getProducts(otherMall, otherMallId, query, isSearchMode)
  ]);

  // マッチング用タイトルクレンジング関数
  const cleanTitle = (t: string) => t.replace(/[【】\[\]\(\)\s]/g, "").replace(/送料無料|ポイント\d+倍|公式|国内正規品|あす楽/g, "").substring(0, 10);

  // クロスマッチングロジック
  const productsWithLinks = mainProducts.map((p) => {
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
      expertReview: generateLionReview(p, config, mallName)
    };
  });

  const breadcrumbItems = isSearchMode 
    ? [{ label: `「${query}」の解析結果` }]
    : (currentGenre.id !== categories[0]?.id ? [{ label: currentGenre.name }] : []);

  return (
    <ClientHome 
      params={params} 
      config={config} 
      products={productsWithLinks}
      mall={mall}
      query={query}
      genreId={currentGenre.id}
      isSearchMode={isSearchMode}
      currentGenre={currentGenre}
      breadcrumbItems={breadcrumbItems}
    />
  );
}
