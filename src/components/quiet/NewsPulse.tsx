"use client";

import React from 'react';
import { PanelHeader } from './PanelHeader';
import { NewsArticle } from '@/lib/newsdata';

interface NewsPulseProps {
    articles?: NewsArticle[];
    isDark?: boolean;
}

export function NewsPulse({ articles = [], isDark = false }: NewsPulseProps) {
    const [visibleCount, setVisibleCount] = React.useState(5);

    const handleLoadMore = () => {
        setVisibleCount(prev => Math.min(prev + 5, 30));
    };

    const hasMore = articles.length > visibleCount && visibleCount < 30;

    // Get Japanese source name and color
    const getSourceInfo = (sourceId: string): { name: string; color: string } => {
        const sources: Record<string, { name: string; color: string }> = {
            'yahoo_jp': { name: 'Yahoo Japan', color: 'text-purple-400' },
            'yahoo_jp_tech': { name: 'Yahoo テック', color: 'text-purple-400' },
            'yahoo_jp_science': { name: 'Yahoo 科学', color: 'text-blue-400' },
            'yahoo_gourmet': { name: 'Yahoo グルメ', color: 'text-orange-400' },
            'yahoo_fashion': { name: 'Yahoo ファッション', color: 'text-pink-400' },
            'yahoo_entertainment': { name: 'Yahoo エンタメ', color: 'text-yellow-400' },
            'nikkei': { name: '日経新聞', color: 'text-orange-400' },
            'mainichi': { name: '毎日新聞', color: 'text-green-400' },
            'itmedia': { name: 'ITmedia', color: 'text-red-400' },
            'itmedia_ai': { name: 'ITmedia AI+', color: 'text-pink-400' },
            'cnet_japan': { name: 'CNET Japan', color: 'text-cyan-400' },
            'engadget_jp': { name: 'Engadget', color: 'text-indigo-400' },
            'gigazine': { name: 'GIGAZINE', color: 'text-yellow-400' },
            'zdnet_japan': { name: 'ZDNet Japan', color: 'text-teal-400' }
        };
        return sources[sourceId] || { name: sourceId.toUpperCase(), color: 'text-gray-400' };
    };

    // Calculate minutes ago
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

    return (
        <div className="w-full h-full flex flex-col">
            <PanelHeader
                icon="📰"
                title="News Pulse"
                rightElement={
                    <>
                        <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse"></span>
                        <span className="text-[8px] font-mono">LIVE</span>
                    </>
                }
            />

            <div className="p-1 space-y-0">
                {articles.length > 0 ? (
                    articles.slice(0, visibleCount).map((item, idx) => {
                        const sourceInfo = getSourceInfo(item.source_id);
                        const minutesAgo = calculateMinutesAgo(item.pubDate);

                        return (
                            <a
                                key={idx}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group flex flex-col gap-1 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-[var(--glass-border)] ${item.isNew ? 'news-arrival-flash' : ''}`}
                            >
                                <h4 className={`text-[13px] sm:text-sm font-bold leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'} group-hover:text-indigo-500 transition-colors line-clamp-2`}>
                                    {item.title}
                                    {item.isNew && (
                                        <span className="ml-2 inline-block px-1.5 py-0.5 text-[9px] font-bold text-white bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]">
                                            NEW
                                        </span>
                                    )}
                                </h4>

                                <div className="flex items-center gap-2">
                                    <span className={`text-[11px] font-bold opacity-70 ${sourceInfo.color}`}>
                                        {sourceInfo.name}
                                    </span>
                                    <span className="text-[10px] opacity-40">
                                        {minutesAgo >= 60 ? `${Math.floor(minutesAgo / 60)}時間前` : `${minutesAgo}分前`}
                                    </span>
                                </div>
                            </a>
                        );
                    })
                ) : (
                    // News Skeletons
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="p-3 rounded-lg">
                            <div className="h-4 w-full bg-white/5 animate-pulse rounded mb-2"></div>
                            <div className="h-3 w-24 bg-white/5 animate-pulse rounded"></div>
                        </div>
                    ))
                )}
            </div>

            {hasMore && articles.length > 0 && (
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
