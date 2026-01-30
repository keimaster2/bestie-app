import type { Product } from "../types";
import { fetchRakutenRanking, searchRakutenItems, convertRakutenToProduct } from "../rakuten";
import { fetchYahooRanking, searchYahooItems, convertYahooToProduct } from "../yahoo";

export type MallType = "rakuten" | "yahoo";

/**
 * モール横断でランキング・検索データを取得するファクトリークラス
 */
export const MallClient = {
  /**
   * ランキングまたは検索結果を取得して Product型で返す
   */
  async getProducts(mall: MallType, mallId: string, query: string = "", isSearch: boolean = false): Promise<Product[]> {
    if (isSearch) {
      if (mall === "yahoo") {
        const raw = await searchYahooItems(query, mallId);
        return convertYahooToProduct(raw, false);
      } else {
        const raw = await searchRakutenItems(query, mallId);
        return convertRakutenToProduct(raw, false);
      }
    } else {
      if (mall === "yahoo") {
        const raw = await fetchYahooRanking(mallId);
        return convertYahooToProduct(raw, true);
      } else {
        const raw = await fetchRakutenRanking(mallId);
        return convertRakutenToProduct(raw, true);
      }
    }
  }
};
