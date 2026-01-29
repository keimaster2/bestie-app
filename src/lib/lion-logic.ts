import { Product } from "./types";
import { SiteConfig } from "./config";
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
  const pick = (arr: string[]) => arr[seed % arr.length];

  // 順位ごとのヘッダー
  let header = "";
  if (rank === 1) {
    header = pick(Messages.marketInsights.rank1);
  } else if (rank <= 3) {
    header = pick(Messages.marketInsights.top3);
  } else {
    header = pick(Messages.marketInsights.others);
  }

  // 市場分析（曜日ムードと汎用をミックス）
  const dayMessages = Messages.weeklyThemes[now.getDay()];
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
  
  // ライオンくんの本音・つぶやき（25%の確率で出現させ、より人間味を出す）
  const showWhisper = seed % 4 === 0;
  const whisper = showWhisper ? `\n\n${pickModule(Messages.detailModules.whispers)}` : "";

  return {
    analysis: `${intro} ${analysis}`,
    tip: `${value} ${closing}${whisper}`
  };
}

/**
 * 3. ライオンくんの「今日の叫び」を生成
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
  if (Messages.specialDates[specialKey]) return base + Messages.specialDates[specialKey];

  const isValentineSeason = (month === 1 && date >= 20) || (month === 2 && date <= 14);
  if (isValentineSeason) {
    return base + Messages.valentineMessages[date % Messages.valentineMessages.length];
  }

  if (date === 25) return base + "今日は多くの人の給料日。一ヶ月頑張った自分を盛大に労わってやろう！";
  if (date <= 3) return base + "一ヶ月のスタート。新しい自分へのご褒美には最高の日だよ。";
  if (date >= 28) return base + "今月もラストスパート。やり残した買い物はないかい？俺が最後までサポートするよ。";
  if (date === 29) return base + Messages.dailyContexts[0]; 

  const dayMessages = Messages.weeklyThemes[day];
  const allPool = [...dayMessages, ...Messages.genericInsights];
  const seed = date + month + day;
  
  return base + allPool[seed % allPool.length];
}
