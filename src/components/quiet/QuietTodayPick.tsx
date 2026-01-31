"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { LionBrain, InterestArea } from '@/lib/lion-brain';
import { INSIGHTS_DATA, InsightType } from '@/lib/insights-data';

interface QuietTodayPickProps {
    isDark?: boolean;
}

export default function QuietTodayPick({ isDark = false }: QuietTodayPickProps) {
    const [sortedInsights, setSortedInsights] = useState(INSIGHTS_DATA);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // Load affinity and re-sort insights
        const affinity = LionBrain.getAffinity();
        const sorted = [...INSIGHTS_DATA].sort((a, b) => {
            const areaA = a.id.split('-')[0];
            const areaB = b.id.split('-')[0];
            const scoreA = affinity[areaA] || 0;
            const scoreB = affinity[areaB] || 0;
            return scoreB - scoreA;
        });
        setSortedInsights(sorted);

        const timer = setInterval(() => {
            setIsFading(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % sorted.length);
                setIsFading(false);
            }, 600);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    const handleInsightClick = (insightId: string) => {
        const area = insightId.split('-')[0];
        LionBrain.trackInterest(area, 2); // Explicit click weighted higher
    };

    const current = sortedInsights[currentIndex] || sortedInsights[0];

    return (
        <section className="mb-6 sm:mb-8">
            <a
                href={current.url}
                onClick={() => handleInsightClick(current.tag)}
                className={`group block p-5 sm:p-10 relative overflow-hidden flex flex-col items-center hover:bg-white/5 transition-all duration-700 h-[360px] sm:h-[420px] justify-center ${isFading ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}
            >
                {/* Ambient glow behind the picker */}
                <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>

                <div className="relative z-10 w-full flex flex-col md:flex-row items-center gap-5 md:gap-10">
                    {/* Simplified Luminous Icon */}
                    <div className="w-14 h-14 sm:w-20 sm:h-20 glass-panel rounded-full flex items-center justify-center text-2xl sm:text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-700">
                        {current.icon}
                    </div>

                    <div className="flex-grow space-y-4 text-center md:text-left min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <span className="h-[1.5px] w-8 bg-indigo-500/50"></span>
                                <h2 className={`text-[9px] sm:text-[11px] tracking-[0.4em] font-black uppercase transition-colors duration-500 ${current.color}`}>
                                    {current.tag}
                                </h2>
                            </div>
                            <div className="flex gap-2 justify-center md:justify-start">
                                {current.sources?.map(s => (
                                    <span key={s} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] opacity-50 font-bold uppercase tracking-widest">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <h3 className={`text-xl sm:text-3xl font-bold leading-tight tracking-tight line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {current.title}
                        </h3>

                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <p className={`text-[11px] sm:text-[14px] leading-relaxed max-w-xl mx-auto md:mx-0 font-medium line-clamp-2 ${isDark ? 'text-gray-300 opacity-80' : 'text-gray-600'}`}>
                                {current.desc}
                            </p>

                            <div className="flex items-center justify-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-sm self-center md:self-start">
                                <div className="text-center">
                                    <div className="text-[8px] uppercase tracking-tighter opacity-40 font-black">Conviction</div>
                                    <div className="text-lg font-black font-mono text-indigo-400">{current.score}%</div>
                                </div>
                                <div className="w-[1px] h-8 bg-white/10"></div>
                                <div className="text-[8px] uppercase tracking-widest leading-tight opacity-50 font-bold">Verified<br />By Lion</div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex flex-shrink-0 items-center justify-center">
                        <div className="w-40 h-40 rounded-full border border-[var(--glass-border)] p-4 group-hover:border-indigo-500/30 transition-all duration-700">
                            <div className="w-full h-full rounded-full bg-[var(--glass-bg)] glass-panel group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                                <div className="text-[9px] tracking-[0.3em] opacity-40 uppercase font-black transform -rotate-45">
                                    INSIGHT +
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Carousel Indicator Dots - Horizontal */}
                <div className="flex flex-row gap-2 mt-8 z-10">
                    {sortedInsights.map((_: InsightType, i: number) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-700 ${i === currentIndex ? 'w-8 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'w-2 bg-white/10'}`}
                        />
                    ))}
                </div>

                {/* Subtle Progress Indicator */}
                <div className="absolute bottom-0 left-0 h-[1.5px] bg-indigo-500/30 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
            </a>
        </section>
    );
}
