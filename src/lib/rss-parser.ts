import { XMLParser } from 'fast-xml-parser';

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

const xmlParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_'
});

/**
 * Decode HTML entities in text
 */
function decodeHTMLEntities(text: string): string {
    if (typeof text !== 'string') return String(text);

    // Decode numeric entities (&#x300C; and &#12300;)
    text = text.replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
    );
    text = text.replace(/&#(\d+);/g, (_, dec) =>
        String.fromCharCode(parseInt(dec, 10))
    );

    // Decode common named entities
    const entities: Record<string, string> = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&apos;': "'",
        '&nbsp;': ' '
    };

    for (const [entity, char] of Object.entries(entities)) {
        text = text.replace(new RegExp(entity, 'g'), char);
    }

    return text;
}

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
            const response = await fetch(feed.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                signal: AbortSignal.timeout(5000)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const xmlText = await response.text();
            const parsed = xmlParser.parse(xmlText);

            // Handle different RSS formats
            let items: any[] = [];

            // RSS 2.0 format
            if (parsed.rss && parsed.rss.channel && parsed.rss.channel.item) {
                items = Array.isArray(parsed.rss.channel.item)
                    ? parsed.rss.channel.item
                    : [parsed.rss.channel.item];
            }
            // Atom format
            else if (parsed.feed && parsed.feed.entry) {
                items = Array.isArray(parsed.feed.entry)
                    ? parsed.feed.entry
                    : [parsed.feed.entry];
            }
            // RDF format
            else if (parsed['rdf:RDF'] && parsed['rdf:RDF'].item) {
                items = Array.isArray(parsed['rdf:RDF'].item)
                    ? parsed['rdf:RDF'].item
                    : [parsed['rdf:RDF'].item];
            }

            return items.map((item): RSSNewsItem => {
                // Extract title
                let title = item.title || item['dc:title'] || 'No Title';
                title = typeof title === 'string' ? title : String(title);
                title = decodeHTMLEntities(title);

                // Extract description
                let description = item.description
                    || item.summary
                    || item['dc:description']
                    || item.content
                    || '';
                description = typeof description === 'string' ? description : String(description);
                description = decodeHTMLEntities(description);

                // Extract link
                let link = item.link || '#';
                if (typeof link === 'object' && link['@_href']) {
                    link = link['@_href'];
                }
                link = typeof link === 'string' ? link : String(link);

                // Extract pubDate
                const pubDate = item.pubDate
                    || item.published
                    || item.updated
                    || item['dc:date']
                    || new Date().toISOString();

                // Extract content
                let content = item['content:encoded']
                    || item.content
                    || item.description
                    || '';
                content = typeof content === 'string' ? content : String(content);
                content = decodeHTMLEntities(content);

                return {
                    title,
                    link,
                    description,
                    pubDate: typeof pubDate === 'string' ? pubDate : String(pubDate),
                    source_id: feed.source_id,
                    content,
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


