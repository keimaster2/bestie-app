import Parser from 'rss-parser';

export interface MatomeArticle {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    source_id: string;
    site: string;
    categories: string[];
    ago?: number; // minutes ago
}

// RSS Feed Sources for Matome sites
const MATOME_RSS_FEEDS = [
    {
        url: 'https://b.hatena.ne.jp/hotentry/it.rss',
        source_id: 'hatena_tech',
        site: 'はてブ IT',
        defaultCategories: ['gadget', 'ai']
    },
    {
        url: 'https://b.hatena.ne.jp/hotentry/entertainment.rss',
        source_id: 'hatena_entertainment',
        site: 'はてブ エンタメ',
        defaultCategories: ['game', 'fashion']
    },
    {
        url: 'https://qiita.com/popular-items/feed',
        source_id: 'qiita',
        site: 'Qiita',
        defaultCategories: ['gadget', 'ai']
    },
    {
        url: 'https://rss.itmedia.co.jp/rss/2.0/nlab.xml',
        source_id: 'netorabo',
        site: 'ねとらぼ',
        defaultCategories: ['game', 'gadget']
    }
];

const parser = new Parser({
    timeout: 3000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
});

/**
 * Category keywords mapping for intelligent categorization
 */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
    gourmet: ['グルメ', '料理', 'レシピ', '食', 'レストラン', 'カフェ', '飲食'],
    gadget: ['ガジェット', 'pc', 'スマホ', 'iphone', 'android', 'テクノロジー', '技術', 'デバイス'],
    game: ['ゲーム', 'game', 'eスポーツ', 'プレイステーション', 'nintendo', 'switch'],
    beauty: ['ビューティー', 'コスメ', '美容', 'スキンケア', 'メイク'],
    fashion: ['ファッション', 'アパレル', '服', 'コーデ', 'おしゃれ'],
    outdoor: ['アウトドア', 'キャンプ', '登山', 'bbq', 'バーベキュー'],
    interior: ['インテリア', 'diy', '家具', '部屋', 'デスク環境'],
    baby: ['育児', '子育て', 'ベビー', '赤ちゃん', '子供'],
    ai: ['ai', '人工知能', '生成ai', 'chatgpt', 'gemini', 'claude', '機械学習']
};

/**
 * Detect categories from article title and description
 */
function detectCategories(title: string, description: string): string[] {
    const content = (title + ' ' + description).toLowerCase();
    const detected: string[] = [];

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(keyword => content.includes(keyword.toLowerCase()))) {
            detected.push(category);
        }
    }

    return detected;
}

/**
 * Calculate how many minutes ago the article was published
 */
function calculateMinutesAgo(pubDate: string): number {
    try {
        const published = new Date(pubDate);
        const now = new Date();
        const diffMs = now.getTime() - published.getTime();
        return Math.floor(diffMs / 60000); // Convert to minutes
    } catch {
        return 0;
    }
}

/**
 * Fetch and parse RSS feeds from matome sites
 */
export async function fetchMatomeArticles(): Promise<MatomeArticle[]> {
    const allArticles: MatomeArticle[] = [];

    // Fetch all feeds in parallel
    const feedPromises = MATOME_RSS_FEEDS.map(async (feed) => {
        try {
            const feedData = await parser.parseURL(feed.url);

            return feedData.items.slice(0, 10).map((item): MatomeArticle => {
                const title = item.title || 'No Title';
                const description = item.contentSnippet || item.description || '';
                const detectedCategories = detectCategories(title, description);

                return {
                    title,
                    link: item.link || '#',
                    description,
                    pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
                    source_id: feed.source_id,
                    site: feed.site,
                    categories: detectedCategories.length > 0 ? detectedCategories : feed.defaultCategories,
                    ago: calculateMinutesAgo(item.pubDate || item.isoDate || new Date().toISOString())
                };
            });
        } catch (error) {
            console.error(`Failed to fetch matome RSS feed ${feed.source_id}:`, error);
            return [];
        }
    });

    const results = await Promise.all(feedPromises);

    // Flatten all results
    results.forEach(items => {
        allArticles.push(...items);
    });

    // Sort by publication date (newest first)
    allArticles.sort((a, b) => {
        const dateA = new Date(a.pubDate).getTime();
        const dateB = new Date(b.pubDate).getTime();
        return dateB - dateA;
    });

    return allArticles;
}


