import type { Metadata } from "next";
import { Product, SiteConfig } from "@/lib/types";
import { getSiteConfig } from "@/lib/config";
import { generateLionReview, assignComparisonLabels, getDailyLionShout } from "@/lib/lion-logic";
import { MallClient, MallType } from "@/lib/malls/factory";
import ClientHome from "./ClientHome";
import { headers } from "next/headers";

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
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function Home(props: {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
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
  
  // 現在選択されているカテゴリのID（共通ID: ladies, mensなど）
  const activeId = currentGenre.id;
  
  const rakutenGenreId = rakutenCategories.find(c => c.id === activeId)?.mallId || rakutenCategories[0]?.mallId || "";
  const yahooGenreId = yahooCategories.find(c => c.id === activeId)?.mallId || yahooCategories[0]?.mallId || "";

  // カテゴリ固有のキーワードがある場合、それを検索クエリとして使用する
  const effectiveQuery = queryFromUrl || currentGenre.keyword || "";
  
  // URLに明示的な検索クエリがある場合のみ「純粋な検索モード」とする
  const isSearchMode = !!queryFromUrl;
  // カテゴリ選択によってキーワード検索を行うモード
  // このモードでは、商品に「順位」を付けたい（ランキングとして見せたい）
  const isKeywordCategory = !queryFromUrl && !!currentGenre.keyword;

  let finalProducts: Product[] = [];

  if (isSearchMode || isKeywordCategory) {
    // 🔍 【検索モードまたはキーワード付きカテゴリ】モール横断検索を実施
    // それぞれのモールに正しいカテゴリIDを渡して検索する
    const [rakutenRes, yahooRes] = await Promise.all([
      MallClient.getProducts("rakuten", rakutenGenreId, effectiveQuery, true),
      MallClient.getProducts("yahoo", yahooGenreId, effectiveQuery, true)
    ]);

    // マージ
    const merged: Product[] = [];
    const maxLen = Math.max(rakutenRes.length, yahooRes.length);
    for (let i = 0; i < maxLen; i++) {
      if (rakutenRes[i]) merged.push(rakutenRes[i]);
      if (yahooRes[i]) merged.push(yahooRes[i]);
    }

    // キーワード付きカテゴリ（＝ランキング代わり）の場合は、マージ後の順序に沿って順位を振る
    if (isKeywordCategory) {
      finalProducts = merged.map((p, index) => ({
        ...p,
        rank: index + 1
      }));
    } else {
      finalProducts = merged;
    }

    // ソート処理
    if (sort === "price_asc") {
      finalProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      finalProducts.sort((a, b) => b.price - a.price);
    }
  } else {
    // 🏆 【ランキングモード】従来通り（メインモールのデータを取得）
    const otherMall: MallType = mall === "rakuten" ? "yahoo" : "rakuten";
    const otherCategories = (otherMall === "yahoo" ? config.yahooCategories : config.rakutenCategories) || [];
    const mainMallId = currentGenre.mallId;
    const otherMallId = otherCategories.find(c => c.id === currentGenre.id)?.mallId || otherCategories[0]?.mallId || "";

    const [mainProducts, otherProducts] = await Promise.all([
      MallClient.getProducts(mall, mainMallId, "", false),
      MallClient.getProducts(otherMall, otherMallId, "", false)
    ]);

    const cleanTitle = (t: string) => t.replace(/[【】\[\]\(\)\s]/g, "").replace(/送料無料|ポイント\d+倍|公式|国内正規品|あす楽/g, "").substring(0, 20);

    finalProducts = mainProducts.map((p) => {
      const pClean = cleanTitle(p.title);
      const matchedOther = otherProducts.find(op => {
        const opClean = cleanTitle(op.title);
        // 判定精度を前方20文字に強化
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
      query={queryFromUrl}
      genreId={currentGenre.id}
      isSearchMode={isSearchMode} // URLからの検索時のみtrue
      currentGenre={currentGenre}
      breadcrumbItems={[]}
      initialShout={getDailyLionShout()}
    />
  );
}
