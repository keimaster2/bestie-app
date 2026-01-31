export type InsightType = {
    id: string;
    icon: string;
    tag: string;
    title: string;
    desc: string;
    sources: string[];
    score: number;
    url: string;
    color: string;
    details?: {
        summary: string;
        evidence: { label: string; value: string; trend: 'up' | 'down' | 'stable' }[];
        readingTime: string;
        author: string;
    };
};

export const INSIGHTS_DATA: InsightType[] = [
    {
        id: "market-logic",
        icon: "📉",
        tag: "Market Shift",
        title: "円高局面、今『資産』を守るための最適解。",
        desc: "日経平均と為替の相関を分析。過去10年の同様の局面では、特定のセクターが85%の確率で反発。今、静かに資金を移動させるべき場所とは。",
        sources: ["Nikkei", "Yahoo Finance", "Lion Analytica"],
        score: 94,
        url: "/plus/insight/market-logic",
        color: "text-indigo-400",
        details: {
            summary: "現在の為替相場は、単なるボラティリティではなく構造的な転換点にあります。AIによる時系列分析の結果、輸出セクターから内需・割安株への資金シフトが明確な優位性を示しています。",
            evidence: [
                { label: "Correlation with USD/JPY", value: "0.82", trend: "up" },
                { label: "Institutional Inflow", value: "+12.4%", trend: "up" },
                { label: "Historical Repeat Rate", value: "85%", trend: "stable" }
            ],
            readingTime: "3 min",
            author: "Lion Analytica // Quant Group"
        }
    },
    {
        id: "ai-frontier",
        icon: "🤖",
        tag: "AI Frontier",
        title: "あなたの仕事が、明日から『自動運転』になる。",
        desc: "ManusやCursorの最新アップデートを検知。単純作業の9割をAIが代替する境界線を越えました。今、身につけるべきは『問いを立てる力』、それ一点です。",
        sources: ["Antigravity", "ITmedia", "Wired"],
        score: 98,
        url: "/plus/insight/ai-frontier",
        color: "text-teal-400",
        details: {
            summary: "エージェント型AI（Manus等）の台頭により、ソフトウェア開発とデスクワークの定義が根本から変容しています。もはやツールを使うフェーズは終わり、AIを指揮する『オーケストレーション能力』が市場価値の源泉となります。",
            evidence: [
                { label: "Agent Success Rate", value: "92%", trend: "up" },
                { label: "Code Automation Ratio", value: "75%", trend: "up" },
                { label: "Prompt Complexity Depth", value: "Level 8", trend: "up" }
            ],
            readingTime: "5 min",
            author: "Bestie Tech Lab // Agentic AI Team"
        }
    },
    {
        id: "trend-logic",
        icon: "⚡",
        tag: "Trend Convergence",
        title: "全プラットフォームで1位。この商品の本質。",
        desc: "楽天・Yahoo・Amazonの全データが一点で交差。単なる流行ではなく、生活の『負』を解消する発明。ライオンくんが「一生モノ」と断言する理由を全公開。",
        sources: ["Multi-Mall Sync", "User Reviews", "Social Pulse"],
        score: 92,
        url: "/plus/insight/trend-logic",
        color: "text-amber-400",
        details: {
            summary: "3大モールすべてで同時期にトップランク入りする商品は、1000件に1件もありません。この『特異点』を分析した結果、単なるマーケティングの勝利ではなく、潜在的なユーザーの不満を解消する圧倒的なプロダクトパワーが確認されました。",
            evidence: [
                { label: "Cross-Mall Rank", value: "Triple #1", trend: "stable" },
                { label: "Review Sentiment Score", value: "4.8/5", trend: "up" },
                { label: "Repeat Purchase Intent", value: "68%", trend: "up" }
            ],
            readingTime: "4 min",
            author: "Cultural Scouting Unit"
        }
    },
    {
        id: "culture-logic",
        icon: "🧸",
        tag: "Culture Pulse",
        title: "『LABUBU』現象、その裏にある市場の熱。",
        desc: "単なるホビーを越え、資産価値を持つコレクターズアイテムへ。StockXの取引量とリセール価格の推移を解読。今、手に入れるべき『本物』の見分け方と、ピークの予測。",
        sources: ["StockX", "Mercari Data", "SNS Buzz"],
        score: 88,
        url: "/plus/insight/culture-logic",
        color: "text-pink-400",
        details: {
            summary: "アートトイ市場は、今やスニーカーや高級時計と同じ『投資対照』として機能しています。特にLABUBUの特定のシリーズは、発売から3ヶ月で価格が200%上昇する傾向があり、その流動性は極めて高いレベルにあります。",
            evidence: [
                { label: "Secondary Market Premium", value: "+210%", trend: "up" },
                { label: "Global Social Search Vol", value: "850k/mo", trend: "up" },
                { label: "Authentic Verification Rate", value: "99.2%", trend: "up" }
            ],
            readingTime: "3 min",
            author: "Trend Pulse // Hobby Div."
        }
    }
];


