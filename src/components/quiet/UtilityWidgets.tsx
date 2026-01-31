"use client";

import React from 'react';

interface UtilityWidgetsProps {
    isDark?: boolean;
}

export function UtilityWidgets({ isDark = false }: UtilityWidgetsProps) {
    const [data, setData] = React.useState<any>(null);

    React.useEffect(() => {
        const fetchPulse = () => {
            fetch('/api/portal-pulse')
                .then(res => res.json())
                .then(json => setData(json))
                .catch(() => { });
        };

        fetchPulse();
        const interval = setInterval(fetchPulse, 5 * 60 * 1000); // 5 mins
        return () => clearInterval(interval);
    }, []);

    const weather = data?.weather;
    const market = data?.market;
    const snsTrends = data?.snsTrends || [];

    return (
        <div className="flex flex-col gap-2 px-0 py-2 transition-opacity duration-1000 w-full overflow-hidden">
            {/* Top Row: Weather & Market - Single line layout */}
            <div className="flex items-center gap-3 w-full overflow-x-auto no-scrollbar flex-nowrap">
                {/* Weather */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] tracking-[0.1em] opacity-40 uppercase font-bold">{weather?.city || 'Portal'}</span>
                    {weather ? (
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-medium opacity-80">{weather.temp}°C</span>
                            <span className={`text-xs ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{weather.icon}</span>
                        </div>
                    ) : (
                        <div className="w-12 h-3 bg-[var(--glass-border)] animate-pulse rounded"></div>
                    )}
                </div>

                <div className="h-3 w-[1px] bg-[var(--glass-border)] flex-shrink-0"></div>

                {/* Market - Horizontal line without wrapping, smaller fonts */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-baseline gap-1">
                        <span className="text-[8px] tracking-tight opacity-40 font-bold uppercase whitespace-nowrap">日経平均</span>
                        <span className="text-[10px] font-mono leading-tight whitespace-nowrap opacity-70">
                            {market ? (
                                <>
                                    {Math.floor(market.nikkei).toLocaleString()}
                                </>
                            ) : (
                                <div className="h-3 w-8 bg-[var(--glass-border)] animate-pulse rounded"></div>
                            )}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-[8px] tracking-tight opacity-40 font-bold uppercase whitespace-nowrap">NYダウ</span>
                        <span className="text-[10px] font-mono leading-tight whitespace-nowrap opacity-70">
                            {market ? (
                                <>
                                    {Math.floor(market.dow).toLocaleString()}
                                </>
                            ) : (
                                <div className="h-3 w-8 bg-[var(--glass-border)] animate-pulse rounded"></div>
                            )}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-[8px] tracking-tight opacity-40 font-bold uppercase whitespace-nowrap">ドル／円</span>
                        <span className="text-[10px] font-mono leading-tight whitespace-nowrap opacity-70">
                            {market ? (
                                <>
                                    {market.usdjpy.toFixed(2)}
                                </>
                            ) : (
                                <div className="h-3 w-6 bg-[var(--glass-border)] animate-pulse rounded"></div>
                            )}
                        </span>
                    </div>
                </div>
            </div>

            <div className={`relative w-full overflow-hidden flex items-center h-6 rounded-full border transition-colors duration-500 ${isDark ? 'bg-white/10 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                <div
                    key={JSON.stringify(snsTrends)}
                    className="flex items-center animate-marquee whitespace-nowrap"
                >
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center gap-6 pr-6">
                            {snsTrends.length > 0 ? snsTrends.map((trend: any, idx: number) => (
                                <a
                                    key={`${i}-${idx}`}
                                    href={`https://x.com/search?q=${encodeURIComponent(trend.label)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 group hover:opacity-100 transition-all py-0.5"
                                >
                                    <span className={`text-[9px] font-black ${trend.type === 'rising' ? (isDark ? 'text-rose-500 opacity-90' : 'text-rose-600') : (isDark ? 'text-white/60' : 'text-gray-900 opacity-90')}`}>#</span>
                                    <span className={`text-[10px] uppercase tracking-wider transition-all ${trend.type === 'rising'
                                        ? `font-black ${isDark ? 'text-rose-500' : 'text-rose-600'}`
                                        : `font-medium ${isDark ? 'text-white/80' : 'font-medium opacity-90'}`
                                        }`}>
                                        {trend.label}
                                    </span>
                                </a>
                            )) : (
                                <div className="flex items-center gap-6 pr-6">
                                    {[...Array(6)].map((_, j) => (
                                        <div key={j} className="w-12 h-1.5 bg-[var(--glass-border)] animate-pulse rounded-full flex-shrink-0"></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {/* Fade edges */}
                {/* Fade edges removed to fix dark mode shadow issue */}
            </div>
        </div>
    );
}
