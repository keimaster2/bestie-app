import { fetchRakutenRanking, searchRakutenItems, convertRakutenToProduct } from "@/lib/rakuten";
import { fetchYahooRanking, searchYahooItems, convertYahooToProduct } from "@/lib/yahoo";
import { Product } from "@/lib/types";
import { getSiteConfig, SiteConfig } from "@/lib/config";
import RankingList from "@/components/RankingList";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getBrandPath } from "@/lib/utils";
import type { Metadata } from "next";

// 1. メタデータ生成 (Server側で動作)
export async function generateMetadata(
  props: { 
    params: Promise<{ brand: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const sParams = await props.searchParams;
  // ここでは headers() は使わず、params.brand から取得
  const config = getSiteConfig(params.brand);

  const genreId = (sParams.genre as string) || config.categories[0].id;
  const query = (sParams.q as string) || "";
  const mall = (sParams.mall as string) || "rakuten";
  
  const genre = config.categories.find(g => g.id === genreId) || config.categories[0];
  const mallName = mall === "yahoo" ? "Yahoo!ショッピング" : "楽天市場";

  if (query) {
    return {
      title: `「${query}」の検索結果・売れ筋比較`,
      description: `${mallName}での「${query}」の検索結果です。リアルタイムで今売れている人気商品を比較して、ベストな選択をサポートします。`,
    };
  }

  return {
    title: `${genre.name}人気ランキング - ${mallName}売れ筋比較`,
    description: `${mallName}の${genre.name}カテゴリで「今まさに売れている」人気商品をリアルタイムでお届け。選び疲れをゼロにする最強の比較メディアです。`,
  };
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// 2. Client用コンポーネントを分離せず、Server Component として実装し、必要な部分だけ Client Component を使う
// もしくは全体を Server Component として構築し直す（現在の流れに合わせる）
import ClientHome from "./ClientHome";

export default async function Home(props: {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await props.params;
  const sParams = await props.searchParams;
  const config = getSiteConfig(params.brand);

  const genreId = (sParams.genre as string) || config.categories[0].id;
  const mall = (sParams.mall as string) || "rakuten";
  const query = (sParams.q as string) || "";
  
  const isSearchMode = !!query;
  const currentGenre = config.categories.find(g => g.id === genreId) || config.categories[0];

  let products: Product[] = [];
  let otherProducts: Product[] = [];

  // データの取得
  if (isSearchMode) {
    if (mall === "yahoo") {
      const rawData = await searchYahooItems(query);
      products = convertYahooToProduct(rawData, false);
      const rawRakuten = await searchRakutenItems(query);
      otherProducts = convertRakutenToProduct(rawRakuten, false);
    } else {
      const rawData = await searchRakutenItems(query);
      products = convertRakutenToProduct(rawData, false);
      const rawYahoo = await searchYahooItems(query);
      otherProducts = convertYahooToProduct(rawYahoo, false);
    }
  } else {
    if (mall === "yahoo") {
      const rawData = await fetchYahooRanking(currentGenre.yahooId, currentGenre.minPrice);
      products = convertYahooToProduct(rawData, true);
      if (currentGenre.rakutenId) {
        const rawRakuten = await fetchRakutenRanking(currentGenre.rakutenId);
        otherProducts = convertRakutenToProduct(rawRakuten, true);
      }
    } else {
      const rawData = await fetchRakutenRanking(currentGenre.rakutenId);
      products = convertRakutenToProduct(rawData, true);
      if (currentGenre.yahooId) {
        const rawYahoo = await fetchYahooRanking(currentGenre.yahooId, currentGenre.minPrice);
        otherProducts = convertYahooToProduct(rawYahoo, true);
      }
    }
  }

  // マッチングロジック
  const cleanTitle = (t: string) => t.replace(/[【】\[\]\(\)\s]/g, "").replace(/送料無料|ポイント\d+倍|公式|国内正規品|あす楽/g, "").substring(0, 8);
  
  products = products.map(p => {
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

  if (!isSearchMode) {
    products.sort((a, b) => (a.rank || 999) - (b.rank || 999));
  }

  return (
    <ClientHome 
      params={params} 
      config={config} 
      products={products}
      mall={mall}
      query={query}
      genreId={genreId}
      isSearchMode={isSearchMode}
      currentGenre={currentGenre}
    />
  );
}
