"use client";

import React from 'react';

interface ThemeToggleProps {
    isDark: boolean;
    toggle: () => void;
}

export function ThemeToggle({ isDark, toggle }: ThemeToggleProps) {
    return (
        <button
            onClick={toggle}
            className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-indigo-500/50 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 overflow-hidden flex-shrink-0"
            aria-label="Toggle Theme"
        >
            <div className="relative w-5 h-5 transition-transform duration-700 transform group-hover:rotate-12">
                {/* Sun Icon */}
                <div className={`absolute inset-0 transition-all duration-700 ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                </div>
                {/* Moon Icon */}
                <div className={`absolute inset-0 transition-all duration-700 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-300">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                </div>
            </div>
            {/* Hover Glow */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr ${isDark ? 'from-indigo-500/10 to-purple-500/10' : 'from-amber-500/10 to-orange-500/10'}`}></div>
        </button>
    );
}
