import { Product } from "./types";
import { SiteConfig } from "./config";
import * as Messages from "../data/lion-messages";

export type LionReview = {
  header: string;
  comment: string;
};

/**
 * 毎日・曜日ごとに変化するライオンの目利きロジック
 */
export function generateLionReview(p: Product, config: SiteConfig, mallName: string): LionReview {
  const rank = p.rank || 0;
  if (rank > 10 || rank === 0) return { header: "", comment: "" };

  const now = new Date();
  const dayOfWeek = now.getDay();
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

  // 市場分析
  let marketInsight = pick(Messages.marketObservation);

  // 今日限定の直感
  const dailyLuck = pick(Messages.dailyLuckPool);

  const mood = pick(Messages.weeklyThemes[dayOfWeek]);
  const title = p.title.toLowerCase();
  const isFood = !!title.match(/精米|肉|魚|スイーツ|チョコ|飲|飯|食|菓子/);

  let comment = `${marketInsight}${mood}。${dailyLuck}`;
  if (isFood) {
    comment = `${marketInsight}${mood}として、最高に誠実な選択だよ。${pick(["心も体も、きっと喜ぶはずさ。", "日々の何気ない時間が、ぐっと上質になるよ。"])}`;
  }

  return { header, comment };
}

export function getDailyLionShout(): string {
  const now = new Date();
  const date = now.getDate();
  const month = now.getMonth() + 1;
  const day = now.getDay();
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const dayStr = dayNames[day];

  const base = `今日は${month}月${date}日（${dayStr}）。`;
  
  // 1. 記念日・特定日
  const specialKey = `${month}-${date}`;
  if (Messages.specialDates[specialKey]) return base + Messages.specialDates[specialKey];

  // 2. 季節イベント
  const isValentineSeason = (month === 1 && date >= 20) || (month === 2 && date <= 14);
  if (isValentineSeason) {
    return base + Messages.valentineMessages[date % Messages.valentineMessages.length];
  }

  // 3. ライフサイクル
  if (date === 25) return base + "今日は多くの人の給料日。一ヶ月頑張った自分を盛大に労わってやろう！";
  if (date <= 3) return base + "一ヶ月のスタート。新しい自分へのご褒美には最高の日だよ。";
  if (date >= 28) return base + "今月もラストスパート。やり残した買い物はないかい？俺が最後までサポートするよ。";
  if (date === 29) return base + Messages.dailyContexts[0]; // 肉の日

  // 4. 曜日別バリエーション
  const dayMessages = Messages.weeklyThemes[day];
  const allPool = [...dayMessages, ...Messages.genericInsights];
  const genericSeed = date + month;
  
  return base + allPool[genericSeed % allPool.length];
}
