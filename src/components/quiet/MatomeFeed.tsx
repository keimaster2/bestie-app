"use client";

import React from 'react';
import { PanelHeader } from './PanelHeader';
import { LionBrain } from '@/lib/lion-brain';

interface MatomeArticle {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    source_id: string;
    site: string;
    categories: string[];
    ago?: number;
}

interface MatomeFeedProps {
    isDark?: boolean;
}

export function MatomeFeed({ isDark = false }: MatomeFeedProps) {
    const [articles, setArticles] = React.useState<MatomeArticle[]>([]);
    const [allArticles, setAllArticles] = React.useState<MatomeArticle[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [visibleCount, setVisibleCount] = React.useState(5);

    React.useEffect(() => {
        const loadArticles = async () => {
            try {
                const response = await fetch('/api/matome', { cache: 'no-store' });
                const data = await response.json();

                if (data.status === "success" && data.results) {
                    // Get user's affinity scores from LionBrain
                    const affinity = LionBrain.getAffinity();

                    // Score each article based on user interests
                    const scoredArticles = data.results.map((article: MatomeArticle) => {
                        let score = 0;

                        // Calculate score based on matching categories
                        article.categories.forEach(category => {
                            score += affinity[category] || 0;
                        });

                        // Add recency bonus (newer articles get slight boost)
                        const recencyBonus = Math.max(0, 100 - (article.ago || 0)) / 100;
                        score += recencyBonus;

                        return { ...article, score };
                    });

                    // Sort by score (highest first) but maintain some diversity
                    scoredArticles.sort((a: any, b: any) => b.score - a.score);

                    // Store all articles and show first 5
                    setAllArticles(scoredArticles);
                    setArticles(scoredArticles.slice(0, 5));
                }
            } catch (error) {
                console.error("Failed to load matome articles:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadArticles();

        // Refresh every 15 minutes
        const interval = setInterval(loadArticles, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLoadMore = () => {
        const newCount = visibleCount + 5;
        setVisibleCount(newCount);
        setArticles(allArticles.slice(0, newCount));
    };

    const hasMore = allArticles.length > visibleCount;

    // Get color based on source
    const getSourceColor = (sourceId: string): string => {
        const colors: Record<string, string> = {
            'hatena_tech': 'text-blue-400',
            'hatena_entertainment': 'text-purple-400',
            'qiita': 'text-green-500',
            'netorabo': 'text-red-500'
        };
        return colors[sourceId] || 'text-gray-400';
    };

    // Mock comment count (since RSS doesn't provide this)
    const getMockComments = (index: number): number => {
        const counts = [142, 89, 356, 54, 210];
        return counts[index] || Math.floor(Math.random() * 200) + 50;
    };

    return (
        <div className="w-full h-full flex flex-col">
            <PanelHeader
                icon="⚡"
                title="Matome Threads"
                rightElement={
                    <>
                        <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse"></span>
                        <span className="text-[8px] font-mono">LIVE</span>
                    </>
                }
            />

            <div className="p-1 space-y-0">
                {isLoading ? (
                    // Loading skeleton
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="p-3 rounded-lg">
                            <div className="h-4 w-full bg-white/5 animate-pulse rounded mb-2"></div>
                            <div className="h-3 w-24 bg-white/5 animate-pulse rounded"></div>
                        </div>
                    ))
                ) : (
                    articles.map((article, idx) => (
                        <a
                            key={idx}
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col gap-1 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-[var(--glass-border)]"
                        >
                            <h4 className={`text-[13px] sm:text-sm font-bold leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'} group-hover:text-indigo-500 transition-colors line-clamp-2`}>
                                {article.title}
                            </h4>

                            <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[11px] font-bold opacity-70 ${getSourceColor(article.source_id)}`}>
                                        {article.site}
                                    </span>
                                    <span className="text-[10px] opacity-40">
                                        {article.ago && article.ago >= 60 ? `${Math.floor(article.ago / 60)}時間前` : `${article.ago}分前`}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px]">💬</span>
                                    <span className="text-[10px] font-mono">{getMockComments(idx)}</span>
                                </div>
                            </div>
                        </a>
                    ))
                )}
            </div>

            {hasMore && !isLoading && articles.length > 0 && (
                <div className="pt-0 -mt-1 pr-4 text-right">
                    <span
                        onClick={handleLoadMore}
                        className="text-[11px] opacity-40 hover:opacity-100 cursor-pointer font-mono tracking-tighter transition-colors transform hover:translate-x-1 inline-block uppercase font-bold"
                    >
                        more
                    </span>
                </div>
            )}
        </div>
    );
}
