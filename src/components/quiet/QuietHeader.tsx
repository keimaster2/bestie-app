"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LionGreeting } from './LionGreeting';
import { ThemeToggle } from './ThemeToggle';

interface QuietHeaderProps {
    isDark: boolean;
    toggleTheme: () => void;
    logoPath?: string;
    fontClass?: string;
}

export default function QuietHeader({ isDark, toggleTheme, logoPath, fontClass }: QuietHeaderProps) {
    const [dateStr, setDateStr] = useState("");

    useEffect(() => {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        };
        setDateStr(now.toLocaleDateString('ja-JP', options));
    }, []);

    return (
        <header className="relative pt-6 pb-2 z-50">
            {/* Ambient Background Light for Header - Subdued and shifted */}
            <div className="absolute top-[-50%] left-0 w-[200px] h-[200px] bg-indigo-500/10 blur-[100px] ambient-pulse rounded-full pointer-events-none"></div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                <Link href="/plus" className="group">
                    <div className="flex flex-col">
                        <h1 className={`text-xl sm:text-2xl tracking-tighter transition-colors ${fontClass || 'font-[var(--font-inter)] font-black'}`}>
                            Bestie<span className={`${fontClass ? 'opacity-70' : 'text-indigo-500 dark:text-indigo-400'}`}>+</span>
                        </h1>
                        <p className="text-[7px] tracking-[0.3em] uppercase font-medium font-sans opacity-60">
                            {dateStr}
                        </p>
                    </div>
                </Link>

                {/* Dynamic & Warm Community Status */}
                <div className="flex items-center gap-3">
                    <ThemeToggle isDark={isDark} toggle={toggleTheme} />
                    <div className="flex-shrink-0">
                        <LionGreeting />
                    </div>
                </div>
            </div>
        </header>
    );
}
