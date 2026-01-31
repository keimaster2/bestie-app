export const NEWS_DOMAINS = [
    "news.yahoo.co.jp",
    "mainichi.jp",
    "www.nhk.or.jp"
];

export interface NewsArticle {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    source_id: string;
    image_url?: string;
    isNew?: boolean;
    categories?: string[];
}

export async function fetchHighQualityNews(): Promise<NewsArticle[]> {
    try {
        // Call our internal API route instead of direct NewsData.io fetch
        const response = await fetch('/api/news', { cache: 'no-store' });
        const data = await response.json();

        if (data && data.status === "success") {
            const results = data.results || [];
            return results.map((item: any) => ({
                title: item.title || "No Title",
                link: item.link || "#",
                description: item.description || "",
                pubDate: item.pubDate || new Date().toISOString(),
                source_id: item.source_id || "unknown",
                image_url: item.image_url || null,
                categories: item.categories || []
            }));
        } else {
            const errorMsg = data?.message || data?.results?.message || "Unknown API Error (Empty response)";
            console.error("Internal API Error:", errorMsg, data);
            return [];
        }
    } catch (error) {
        console.error("Client Fetch Exception:", error);
        return [];
    }
}


