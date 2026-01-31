import Parser from 'rss-parser';

export interface RSSNewsItem {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    source_id: string;
    content?: string;
    categories?: string[];
}

// RSS Feed Sources with category hints
const RSS_FEEDS = [
    // Tech & AI
    {
        url: 'https://news.yahoo.co.jp/rss/topics/it.xml',
        source_id: 'yahoo_jp_tech',
        defaultCategories: ['gadget', 'ai']
    },
    {
        url: 'https://news.yahoo.co.jp/rss/topics/science.xml',
        source_id: 'yahoo_jp_science',
        defaultCategories: ['gadget', 'ai']
    },
    {
        url: 'https://rss.itmedia.co.jp/rss/2.0/news_bursts.xml',
        source_id: 'itmedia',
        defaultCategories: ['gadget']
    },
    {
        url: 'https://rss.itmedia.co.jp/rss/2.0/aiplus.xml',
        source_id: 'itmedia_ai',
        defaultCategories: ['ai', 'gadget']
    },
    {
        url: 'https://japan.cnet.com/rss/index.rdf',
        source_id: 'cnet_japan',
        defaultCategories: ['gadget']
    },
    {
        url: 'https://gigazine.net/news/rss_2.0/',
        source_id: 'gigazine',
        defaultCategories: ['gadget']
    },
    {
        url: 'https://japan.zdnet.com/rss/index.rdf',
        source_id: 'zdnet_japan',
        defaultCategories: ['gadget']
    },
    // Gourmet
    {
        url: 'https://news.yahoo.co.jp/rss/topics/life-food.xml',
        source_id: 'yahoo_gourmet',
        defaultCategories: ['gourmet']
    },
    // Fashion & Beauty
    {
        url: 'https://news.yahoo.co.jp/rss/topics/life-fashion.xml',
        source_id: 'yahoo_fashion',
        defaultCategories: ['fashion']
    },
    // Entertainment & Games
    {
        url: 'https://news.yahoo.co.jp/rss/topics/entertainment.xml',
        source_id: 'yahoo_entertainment',
        defaultCategories: ['game']
    },
    // General News
    {
        url: 'https://mainichi.jp/rss/etc/mainichi-flash.rss',
        source_id: 'mainichi',
        defaultCategories: []
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
    gourmet: ['グルメ', '料理', 'レシピ', '食', 'レストラン', 'カフェ', '飲食', 'ラーメン', '寿司'],
    gadget: ['ガジェット', 'pc', 'スマホ', 'iphone', 'android', 'テクノロジー', '技術', 'デバイス', 'アップル'],
    game: ['ゲーム', 'game', 'eスポーツ', 'プレイステーション', 'nintendo', 'switch', 'ゲーマー'],
    beauty: ['ビューティー', 'コスメ', '美容', 'スキンケア', 'メイク', '化粧品'],
    fashion: ['ファッション', 'アパレル', '服', 'コーデ', 'おしゃれ', 'ブランド', 'スタイル'],
    outdoor: ['アウトドア', 'キャンプ', '登山', 'bbq', 'バーベキュー', 'ハイキング'],
    interior: ['インテリア', 'diy', '家具', '部屋', 'デスク環境', '収納'],
    baby: ['育児', '子育て', 'ベビー', '赤ちゃん', '子供', '教育'],
    ai: ['ai', '人工知能', '生成ai', 'chatgpt', 'gemini', 'claude', '機械学習', 'llm']
};

/**
 * Detect categories from article title and description
 */
function detectCategories(title: string, description: string, defaultCategories: string[]): string[] {
    const content = (title + ' ' + description).toLowerCase();
    const detected: string[] = [];

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(keyword => content.includes(keyword.toLowerCase()))) {
            detected.push(category);
        }
    }

    // If no categories detected, use default
    return detected.length > 0 ? detected : defaultCategories;
}

/**
 * Fetch and parse RSS feeds from multiple sources
 */
export async function fetchRSSNews(): Promise<RSSNewsItem[]> {
    const allItems: RSSNewsItem[] = [];

    // Fetch all feeds in parallel
    const feedPromises = RSS_FEEDS.map(async (feed) => {
        try {
            const feedData = await parser.parseURL(feed.url);

            return feedData.items.map((item): RSSNewsItem => {
                const title = item.title || 'No Title';
                const description = item.contentSnippet || item.description || '';

                return {
                    title,
                    link: item.link || '#',
                    description,
                    pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
                    source_id: feed.source_id,
                    content: item.content || item.contentSnippet || '',
                    categories: detectCategories(title, description, feed.defaultCategories)
                };
            });
        } catch (error) {
            console.error(`Failed to fetch RSS feed ${feed.source_id}:`, error);
            return [];
        }
    });

    const results = await Promise.all(feedPromises);

    // Flatten all results
    results.forEach(items => {
        allItems.push(...items);
    });

    // Sort by publication date (newest first)
    allItems.sort((a, b) => {
        const dateA = new Date(a.pubDate).getTime();
        const dateB = new Date(b.pubDate).getTime();
        return dateB - dateA;
    });

    return allItems;
}


