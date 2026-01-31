import { XMLParser } from 'fast-xml-parser';

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

            return items.slice(0, 10).map((item): MatomeArticle => {
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

                const detectedCategories = detectCategories(title, description);

                return {
                    title,
                    link,
                    description,
                    pubDate: typeof pubDate === 'string' ? pubDate : String(pubDate),
                    source_id: feed.source_id,
                    site: feed.site,
                    categories: detectedCategories.length > 0 ? detectedCategories : feed.defaultCategories,
                    ago: calculateMinutesAgo(typeof pubDate === 'string' ? pubDate : String(pubDate))
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


