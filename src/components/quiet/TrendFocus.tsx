"use client";

import React from 'react';
import { PanelHeader } from './PanelHeader';

// --- Icons ---
const XIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="opacity-90 group-hover:opacity-100 transition-all duration-300">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const InstaIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="url(#instaGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-90 group-hover:opacity-100 transition-all duration-300">
        <defs>
            <linearGradient id="instaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f09433" />
                <stop offset="25%" stopColor="#e6683c" />
                <stop offset="50%" stopColor="#dc2743" />
                <stop offset="75%" stopColor="#cc2366" />
                <stop offset="100%" stopColor="#bc1888" />
            </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);

const YouTubeIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#FF0000" className="opacity-80 group-hover:opacity-100 transition-all duration-300">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.017 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

type TrendItem = {
    label: string;
    platform: string;
    type?: 'rising' | 'ranking';
};

export default function TrendFocus() {
    const [hotWords, setHotWords] = React.useState<TrendItem[]>([
        { label: "確定申告", platform: "X" },
        { label: "花粉症", platform: "X" },
        { label: "春新作コスメ", platform: "Insta" },
        { label: "新生活", platform: "YouTube" },
        { label: "iOSアップデート", platform: "X" }
    ]);

    React.useEffect(() => {
        const fetchTrends = async () => {
            try {
                const res = await fetch('/api/portal-pulse');
                const data = await res.json();
                if (data.snsTrends && data.snsTrends.length > 0) {
                    setHotWords(data.snsTrends);
                }
            } catch (e) {
                console.error("Trend fetch failed", e);
            }
        };

        fetchTrends();
        // Update trends every 60 seconds (random rotation)
        const interval = setInterval(fetchTrends, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case "X": return <XIcon />;
            case "Insta": return <InstaIcon />;
            case "YouTube": return <YouTubeIcon />;
            default: return <XIcon />;
        }
    };

    const getSearchUrl = (label: string, platform: string) => {
        const query = encodeURIComponent(label);
        switch (platform) {
            case "X": return `https://x.com/search?q=${query}`;
            case "YouTube": return `https://www.youtube.com/results?search_query=${query}`;
            case "Insta": return `https://www.instagram.com/explore/search/keyword/?q=${query}`;
            default: return `https://x.com/search?q=${query}`;
        }
    };

    return (
        <div className="w-full flex flex-col">
            <PanelHeader
                icon="📈"
                title="SNS Trend Words"
                rightElement={
                    <span className="text-[8px] font-mono opacity-50">REALTIME</span>
                }
            />

            <div className="p-4">
                <div className="flex flex-wrap gap-2">
                    {hotWords.map((item, i) => (
                        <a
                            key={i}
                            href={getSearchUrl(item.label, item.platform)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${item.type === 'rising'
                                ? 'bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30 hover:bg-rose-100 dark:hover:bg-rose-500/20 dark:hover:border-rose-500/40' // Rising: Rose theme
                                : 'bg-gray-100 border-gray-200 dark:bg-white/5 dark:border-white/5 hover:bg-gray-200 dark:hover:bg-indigo-500/20 dark:hover:border-indigo-500/30' // Ranking: Gray theme
                                }`}
                        >
                            <span className={`text-[10px] sm:text-[11px] font-medium transition-colors ${item.type === 'rising'
                                ? 'text-rose-600 dark:text-rose-400 group-hover:text-rose-700 dark:group-hover:text-rose-300'
                                : 'text-gray-800 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white'
                                }`}>
                                <span className={`mr-1 ${item.type === 'rising' ? 'opacity-50' : 'opacity-30'}`}>#</span>
                                {item.label}
                            </span>
                            {getPlatformIcon(item.platform)}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
