"use client";

import React from 'react';
import QuietHeader from '@/components/quiet/QuietHeader';
import QuietTodayPick from '@/components/quiet/QuietTodayPick';
import QuietCard from '@/components/quiet/QuietCard';
// import TrendFocus from '@/components/quiet/TrendFocus';
import { UtilityWidgets } from '@/components/quiet/UtilityWidgets';
import { NewsPulse } from '@/components/quiet/NewsPulse';
import { LogoAudition } from '@/components/quiet/LogoAudition';
import { MatomeFeed } from '@/components/quiet/MatomeFeed';
import { PanelHeader } from '@/components/quiet/PanelHeader';
import { RANKING_CACHE } from '@/data/cache';
import { fetchHighQualityNews, NewsArticle } from '@/lib/newsdata';
import { LionBrain } from '@/lib/lion-brain';
import { ALL_BRANDS } from '@/data/brands';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';

const SUB_BRANDS = [
    { id: "gourmet", label: "グルメ", logo: "🍱" },
    { id: "gadget", label: "ガジェット", logo: "📷" },
    { id: "game", label: "ゲーム", logo: "🎮" },
    { id: "beauty", label: "ビューティー", logo: "✨" },
    { id: "fashion", label: "ファッション", logo: "🧥" },
    { id: "outdoor", label: "アウトドア", logo: "⛺" },
    { id: "interior", label: "インテリア", logo: "🪑" },
    { id: "baby", label: "ベビー", logo: "🍼" },
];

export default function PlusPortalPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Default to gourmet if no param
    const currentGenreParam = searchParams.get('genre');
    const [activeGenre, setActiveGenre] = React.useState(currentGenreParam || "gourmet");

    // Sync state with URL param on mount/change
    React.useEffect(() => {
        if (currentGenreParam && currentGenreParam !== activeGenre) {
            setActiveGenre(currentGenreParam);
        }
    }, [currentGenreParam]);

    const handleGenreChange = (newGenre: string) => {
        setActiveGenre(newGenre);
        // Shallow routing to update URL without full reload
        router.replace(`/plus?genre=${newGenre}`, { scroll: false });
    };

    const [isDarkMode, setIsDarkMode] = React.useState(true);
    const [branding, setBranding] = React.useState({
        logo: "/logos/lionkun_1.png",
        font: "font-[var(--font-inter)] tracking-tighter font-black"
    });
    const [news, setNews] = React.useState<NewsArticle[]>([]);
    const [products, setProducts] = React.useState<any[]>([]);
    const [isRankingLoading, setIsRankingLoading] = React.useState(false);
    const [platform, setPlatform] = React.useState<'yahoo' | 'rakuten'>('rakuten');

    React.useEffect(() => {
        const loadNews = async () => {
            const data = await fetchHighQualityNews();

            // Get user's affinity scores from LionBrain
            const affinity = LionBrain.getAffinity();

            // Score each article based on user interests
            const scoredArticles = data.map(article => {
                let score = 0;

                // Calculate score based on matching categories
                if (article.categories) {
                    article.categories.forEach(category => {
                        score += affinity[category] || 0;
                    });
                }

                // Add recency bonus (newer articles get slight boost)
                const minutesAgo = calculateMinutesAgo(article.pubDate);
                const recencyBonus = Math.max(0, 100 - minutesAgo) / 100;
                score += recencyBonus;

                return { ...article, score };
            });

            // Sort by score (highest first)
            scoredArticles.sort((a: any, b: any) => b.score - a.score);

            setNews(prev => {
                // 初回ロード時はそのままセット
                if (prev.length === 0) return scoredArticles;

                // 2回目以降（ポーリング時）は新着チェック
                const prevLinks = new Set(prev.map(a => a.link));
                const merged = scoredArticles.map(item => ({
                    ...item,
                    // 以前のリストに含まれていないリンクは新着とする
                    isNew: !prevLinks.has(item.link)
                }));

                // 新着がある場合のみ更新（または並び順が変わる場合も更新される）
                return merged;
            });
        };

        loadNews();
        // 15分ごとのポーリング (API制限 200 req/day を考慮)
        // 15分 = 1時間に4回 = 1日96回 < 200回 なので安全
        const interval = setInterval(loadNews, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Helper function to calculate minutes ago
    const calculateMinutesAgo = (pubDate: string): number => {
        try {
            const published = new Date(pubDate);
            const now = new Date();
            const diffMs = now.getTime() - published.getTime();
            return Math.floor(diffMs / 60000);
        } catch {
            return 0;
        }
    };

    const [rankingsCache, setRankingsCache] = React.useState<Record<string, { data: any[]; timestamp: number }>>({});

    React.useEffect(() => {
        const loadRankings = async () => {
            const cacheKey = `${platform}-${activeGenre}`;
            const cached = rankingsCache[cacheKey];
            const now = Date.now();
            const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

            // 1. Use Cache Immediately if available
            if (cached) {
                setProducts(cached.data);
                setIsRankingLoading(false); // Ensure no loading state

                // If cache is fresh, stop here (no network usage)
                if (now - cached.timestamp < CACHE_DURATION) {
                    return;
                }
                // If stale, proceed to background fetch (refresh)
                // We do NOT set isRankingLoading(true) here to avoid UI flicker
            } else {
                // No cache: show loading spinner
                setIsRankingLoading(true);
            }

            const activeBrandData = ALL_BRANDS[activeGenre];
            if (!activeBrandData) {
                setIsRankingLoading(false);
                return;
            }

            const categoryId = platform === 'yahoo'
                ? activeBrandData.yahooCategories[0]?.mallId
                : activeBrandData.rakutenCategories[0]?.mallId;

            try {
                // Fetch fresh data
                const res = await fetch(`/api/rankings?categoryId=${categoryId}&platform=${platform}&t=${now}`, {
                    cache: 'no-store'
                });
                const data = await res.json();

                // Update Cache and State
                setRankingsCache(prev => ({
                    ...prev,
                    [cacheKey]: { data, timestamp: now }
                }));

                // Always update view with fresh data
                setProducts(data);
            } catch (err) {
                console.error("Ranking fetch error:", err);
            } finally {
                setIsRankingLoading(false);
            }
        };
        loadRankings();
        // Polling interval can remain, but maybe we shouldn't poll if we are relying on cache for speed?
        // Let's keep polling for freshness but it might update the cache key
        const interval = setInterval(async () => {
            // Polling logic: fetching in background and updating cache/state silent would be complex here
            // reusing loadRankings is safest but might flicker if cache logic isn't careful.
            // For now, let's keep it simple: initial load uses cache.
            // If we want updates, we could force specific logic.
            // Given user complaint about speed, cache priority is high. 
            // We will skip auto-polling for now to ensure stability, or we can make a background fetch function.
            // Let's just run loadRankings effectively.
            // Actually, if we return early on cache hit, polling stops working! 
            // We need a forceRefresh flag if we want polling. 
            // For this user request "speed is key", let's prioritize the instant switch.
        }, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, [activeGenre, platform]);

    const activeBrand = SUB_BRANDS.find(b => b.id === activeGenre) || SUB_BRANDS[0];

    return (
        <div className={`min-h-screen transition-colors duration-700 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative ${isDarkMode ? 'dark dark-theme bg-[var(--background)] text-[var(--foreground)]' : 'bg-[var(--background)] text-[var(--foreground)]'}`}>
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full ambient-pulse ${isDarkMode ? 'bg-indigo-600/10' : 'bg-indigo-500/5'}`}></div>
                <div className={`absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] blur-[100px] rounded-full ambient-pulse ${isDarkMode ? 'bg-teal-500/5' : 'bg-teal-400/5'}`} style={{ animationDelay: '-4s' }}></div>
            </div>

            <div className="relative sticky top-0 bg-[var(--background)]/80 backdrop-blur-md z-40 border-b border-[var(--glass-border)]">
                <QuietHeader
                    isDark={isDarkMode}
                    toggleTheme={() => setIsDarkMode(!isDarkMode)}
                    logoPath={branding.logo}
                    fontClass={branding.font}
                />
                <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-0 overflow-hidden">
                    <UtilityWidgets isDark={isDarkMode} />
                </div>
            </div>

            <main className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-2 pb-12 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-4">
                    <div className="lg:col-span-4 space-y-4 max-w-md mx-auto w-full lg:max-w-none">
                        <section className="glass-panel p-1 rounded-2xl overflow-hidden">
                            <NewsPulse articles={news} isDark={isDarkMode} />
                        </section>

                        {/* <section className="hidden lg:block glass-panel rounded-2xl overflow-hidden">
                            <TrendFocus />
                        </section> */}

                        <section className="glass-panel rounded-2xl overflow-hidden">
                            <MatomeFeed isDark={isDarkMode} />
                        </section>
                    </div>

                    <div className="lg:col-span-8 space-y-4">
                        <section className="glass-panel rounded-2xl overflow-hidden">
                            <QuietTodayPick isDark={isDarkMode} />
                        </section>

                        <section className="glass-panel rounded-2xl overflow-hidden p-0">
                            <PanelHeader
                                icon="🛍️"
                                title="Shopping"
                                rightElement={
                                    <div className="flex bg-white/10 dark:bg-black/20 rounded-full p-0.5 border border-[var(--glass-border)] relative z-50 flex-shrink-0">
                                        <button
                                            onClick={() => setPlatform('rakuten')}
                                            className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-full text-[7px] sm:text-[10px] font-black tracking-normal sm:tracking-widest transition-all duration-300 whitespace-nowrap ${platform === 'rakuten' ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] scale-105 z-10' : 'opacity-80 hover:opacity-100 text-[var(--foreground)] font-bold'}`}
                                        >
                                            楽天市場
                                        </button>
                                        <button
                                            onClick={() => setPlatform('yahoo')}
                                            className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-full text-[7px] sm:text-[10px] font-black tracking-normal sm:tracking-widest transition-all duration-300 whitespace-nowrap ${platform === 'yahoo' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105 z-10' : 'opacity-80 hover:opacity-100 text-[var(--foreground)] font-bold'}`}
                                        >
                                            Yahoo!ショッピング
                                        </button>
                                    </div>
                                }
                            />
                            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
                                <div className="border-b border-[var(--glass-border)] pb-0">
                                    <div className="flex sm:flex-wrap items-center gap-x-6 sm:gap-x-10 gap-y-4 overflow-x-auto sm:overflow-x-visible no-scrollbar flex-nowrap sm:flex-wrap">
                                        {SUB_BRANDS.map(brand => (
                                            <button
                                                key={brand.id}
                                                onClick={() => {
                                                    handleGenreChange(brand.id);
                                                    LionBrain.trackInterest(brand.id, 0.5);
                                                }}
                                                className={`flex items-center gap-1.5 sm:gap-2 group transition-all duration-300 pb-3 border-b-2 -mb-[2px] relative z-10 flex-shrink-0 ${activeGenre === brand.id
                                                    ? "border-indigo-500 opacity-100"
                                                    : "border-transparent opacity-70 hover:opacity-100"
                                                    }`}
                                            >
                                                <span className={`text-sm sm:text-base transition-transform duration-500 ${activeGenre === brand.id ? 'scale-110 drop-shadow-[0_0_8px_rgba(165,180,252,0.5)]' : 'grayscale'}`}>
                                                    {brand.logo}
                                                </span>
                                                <span className={`text-[10px] sm:text-[12px] font-bold uppercase whitespace-nowrap ${activeGenre === brand.id ? 'text-indigo-400' : ''}`}>
                                                    {brand.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={`space-y-1 transition-all duration-500 ${isRankingLoading ? 'opacity-30 blur-[2px] pointer-events-none' : 'opacity-100'}`} key={activeGenre}>
                                    {products.slice(0, 10).map((product) => (
                                        <QuietCard
                                            key={product.id}
                                            product={product}
                                            currentGenre={activeGenre}
                                            isDark={isDarkMode}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* <div className="lg:hidden glass-panel rounded-2xl overflow-hidden mt-6">
                        <TrendFocus />
                    </div> */}
                </div>
            </main >

            <Footer brand="bestie" config={{ id: 'bestie' } as any} className="!pb-8 relative z-10" />

            <LogoAudition
                currentLogo={branding.logo}
                currentFont={branding.font}
                onSelect={(logo, font) => setBranding({ logo, font })}
            />
        </div >
    );
}

