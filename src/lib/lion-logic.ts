import { Product, SiteConfig } from "./types";
import * as Messages from "../data/lion-messages";

export type LionReview = {
  header: string;
  comment: string;
};

/**
 * 1. 一覧ページ用：毎日・曜日ごとに変化する目利き
 */
export function generateLionReview(p: Product, config: SiteConfig, mallName: string): LionReview {
  const rank = p.rank || 0;
  if (rank > 10 || rank === 0) return { header: "", comment: "" };

  const now = new Date();
  const date = now.getDate();
  const month = now.getMonth() + 1;

  const seedStr = (p.id || "") + date + month + rank + mallName;
  const seed = seedStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const pick = (arr: string[]) => (arr && arr.length > 0) ? arr[seed % arr.length] : "";

  // 順位ごとのヘッダー
  let header = "";
  if (rank === 1) {
    header = pick(Messages.marketInsights.rank1);
  } else if (rank <= 3) {
    header = pick(Messages.marketInsights.top3);
  } else {
    header = pick(Messages.marketInsights.others);
  }

  // 市場分析
  const dayMessages = Messages.weeklyThemes[now.getDay()] || [];
  const allPool = [...dayMessages, ...Messages.genericInsights];
  const marketInsight = pick(allPool);
  const dailyLuck = pick(Messages.dailyLuckPool);

  const title = p.title.toLowerCase();
  const isFood = !!title.match(/精米|肉|魚|スイーツ|チョコ|飲|飯|食|菓子/);

  let comment = `${marketInsight}。${dailyLuck}`;
  if (isFood) {
    comment = `${marketInsight}として、最高に誠実な選択だよ。${pick(["心も体も、きっと喜ぶはずさ。", "日々の何気ない時間が、ぐっと上質になるよ。"])}`;
  }

  return { header, comment };
}

/**
 * 2. 詳細ページ用：無限バリエーション・モジュール式目利きエンジン
 */
export function generateSmartDetailedReview(p: Product, config: SiteConfig, mallName: string): { analysis: string, tip: string } {
  const now = new Date();
  const seedStr = (p.id || "") + now.getDate() + now.getMonth() + (p.rank || 0) + mallName + config.id;
  const seed = seedStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const pickModule = (arr: string[]) => {
    if (!arr || arr.length === 0) return "";
    let template = arr[seed % arr.length];
    return template
      .replace(/\$\{rank\}/g, (p.rank || "上位").toString())
      .replace(/\$\{mallName\}/g, mallName)
      .replace(/\$\{config\.brandName\}/g, config.brandName)
      .replace(/\$\{rating\}/g, (p.rating || 0).toString())
      .replace(/\$\{reviewCount\}/g, (p.reviewCount || 0).toLocaleString())
      .replace(/\$\{price\}/g, (p.price || 0).toLocaleString());
  };

  const intro = pickModule(Messages.detailModules.intro);
  const analysis = pickModule(Messages.detailModules.analysis);
  const value = pickModule(Messages.detailModules.value);
  const closing = pickModule(Messages.detailModules.closing);
  
  const showWhisper = seed % 4 === 0;
  const whisper = showWhisper ? `\n\n${pickModule(Messages.detailModules.whispers)}` : "";

  return {
    analysis: `${intro} ${analysis}`,
    tip: `${value} ${closing}${whisper}`
  };
}

/**
 * 3. 称号システム：トップ3を比較してキャッチーなラベルを付与する
 */
export function assignComparisonLabels(products: Product[]): Product[] {
  if (products.length < 2) return products;

  // 比較対象（上位10件程度）
  const candidates = products.slice(0, 10);
  
  // 1. 最安値の特定
  const prices = candidates.map(p => p.price).filter(p => p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  
  // 2. 最大レビュー数の特定
  const reviewCounts = candidates.map(p => p.reviewCount);
  const maxReviews = reviewCounts.length > 0 ? Math.max(...reviewCounts) : 0;
  
  // 3. 最高評価の特定
  const ratings = candidates.map(p => p.rating);
  const maxRating = ratings.length > 0 ? Math.max(...ratings) : 0;

  return products.map(p => {
    let label = "";
    
    // レビュー数が一定数（例：10件）未満の場合は、口コミ関連のラベルを付けない（信頼性の担保）
    // また、その圏内（上位10件）で圧倒的に多い場合のみ「圧倒的」とする
    const isSignificantReviews = p.reviewCount >= 10 && p.reviewCount === maxReviews;
    // 満足度最高峰は「レビュー100件以上 ＋ 評価4.8以上」という極めて高いハードルを設定
    const isEliteRating = p.rating >= 4.8 && p.rating === maxRating && p.reviewCount >= 100;

    // 不動の支持率No.1は「売上1位 ＋ 圏内最大レビュー ＋ レビュー100件以上」という最強の証
    const isImmortalNo1 = p.rank === 1 && p.reviewCount === maxReviews && p.reviewCount >= 100;
    
    // 圧倒的な口コミ数は「圏内最大 ＋ 100件以上」
    const isImmortalReviews = p.reviewCount === maxReviews && p.reviewCount >= 100;
    
    if (isImmortalNo1) {
      label = "不動の支持率Ｎｏ．１";
    } else if (p.price === minPrice && p.price > 0 && candidates.length > 1) {
      label = "この圏内での最安値";
    } else if (isImmortalReviews) {
      label = "圧倒的な口コミ数";
    } else if (isEliteRating) {
      label = "ユーザー満足度最高峰";
    } else if (p.rank === 1) {
      label = "現在売上トップ";
    } else if (p.isWRank) {
      label = "モール横断の人気者";
    } else if (p.price > minPrice * 2 && isEliteRating) {
      label = "こだわりの高級志向";
    }

    return { ...p, comparisonLabel: label };
  });
}

/**
 * 4. ライオンくんの「今日の叫び」を生成
 */
export function getDailyLionShout(): string {
  const now = new Date();
  const date = now.getDate();
  const month = now.getMonth() + 1;
  const day = now.getDay();
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const dayStr = dayNames[day];

  const base = `今日は${month}月${date}日（${dayStr}）。`;
  
  const specialKey = `${month}-${date}`;
  if (Messages.specialDates && Messages.specialDates[specialKey]) return base + Messages.specialDates[specialKey];

  const isValentineSeason = (month === 1 && date >= 20) || (month === 2 && date <= 14);
  if (isValentineSeason) {
    const vMsg = Messages.valentineMessages || [];
    if (vMsg.length > 0) return base + vMsg[date % vMsg.length];
  }

  if (date === 25) return base + "今日は多くの人の給料日。一ヶ月頑張った自分を盛大に労わってやろう！";
  if (date <= 3) return base + "一ヶ月のスタート。新しい自分へのご褒美には最高の日だよ。";
  if (date >= 28) return base + "今月もラストスパート。やり残した買い物はないかい？俺が最後までサポートするよ。";
  if (date === 29 && Messages.dailyContexts && Messages.dailyContexts.length > 0) return base + Messages.dailyContexts[0]; 

  const dayMessages = Messages.weeklyThemes[day] || [];
  const allPool = [...dayMessages, ...Messages.genericInsights];
  const seed = date + month + day;
  
  if (allPool.length === 0) return base + "今日も最高の目利きをお届けするよ！";
  return base + allPool[seed % allPool.length];
}
