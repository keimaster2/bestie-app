"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const LOGO_CANDIDATES = [
    { id: "lk1", path: "/logos/lionkun_1.png", label: "Lion-kun (Original)", series: "Lion-kun" },
    { id: "c1", path: "/logos/companion_1.png", label: "Pure Bestie (Rabbit)", series: "Companion" },
    { id: "c2", path: "/logos/companion_2.png", label: "B+ ears (Rabbit)", series: "Companion" },
    { id: "c3", path: "/logos/companion_3.png", label: "Portal Bestie", series: "Companion" },
    { id: 1, path: "/logos/logo_1.png", label: "Geometric Fusion", series: "Tech" },
    { id: 2, path: "/logos/logo_2.png", label: "Circuit Lion", series: "Tech" },
    { id: 3, path: "/logos/logo_3.png", label: "Insight Spark", series: "Tech" },
    { id: 4, path: "/logos/logo_4.png", label: "Portal Cub", series: "Tech" },
    { id: 5, path: "/logos/logo_5.png", label: "Dynamic Network", series: "Tech" },
    { id: 6, path: "/logos/logo_6.png", label: "Modern Crest", series: "Tech" },
    { id: 7, path: "/logos/logo_7.png", label: "Neon Block", series: "Tech" },
    { id: 8, path: "/logos/logo_8.png", label: "Aurora Drift", series: "Tech" },
    { id: 9, path: "/logos/logo_9.png", label: "Precision Lens", series: "Tech" },
    { id: 10, path: "/logos/logo_10.png", label: "Infinity Bestie", series: "Tech" },
];

const FONTS = [
    { name: "LINE Seed (Geometric Rounded)", var: "var(--font-lexend)", className: "font-[var(--font-lexend)]" },
    { name: "Instagram (Geometric Sans)", var: "var(--font-outfit)", className: "font-[var(--font-outfit)]" },
    { name: "Microsoft (Segoe UI Style)", var: "var(--font-geist-sans)", className: "font-[var(--font-geist-sans)]" },
    { name: "NVIDIA (Sharp Tech)", var: "var(--font-inter)", className: "font-[var(--font-inter)] tracking-tight font-black" },
    { name: "OpenAI (Modern Clean)", var: "var(--font-inter)", className: "font-[var(--font-inter)] tracking-tight font-medium" },
];

interface LogoAuditionProps {
    onSelect: (logoPath: string, fontClass: string) => void;
    currentLogo: string;
    currentFont: string;
}

export function LogoAudition({ onSelect, currentLogo, currentFont }: LogoAuditionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-4 left-4 z-[9999]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg hover:bg-indigo-700 transition-all uppercase tracking-widest border border-white/20"
            >
                Brand Debug
            </button>

            {isOpen && (
                <div className="absolute bottom-12 left-0 w-[400px] h-[600px] bg-[var(--panel-bg)] border border-[var(--glass-border)] rounded-2xl shadow-2xl p-6 overflow-y-auto backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-black tracking-widest uppercase opacity-80">Branding Audition</h3>
                        <button onClick={() => setIsOpen(false)} className="opacity-40 hover:opacity-100">✕</button>
                    </div>

                    <div className="space-y-8">
                        {/* Font Selection */}
                        <section>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3 opacity-40">Select Font Style</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {FONTS.map((font) => (
                                    <button
                                        key={font.name}
                                        onClick={() => onSelect(currentLogo, font.className)}
                                        className={`text-left px-4 py-3 rounded-lg border transition-all ${currentFont === font.className ? 'border-indigo-500 bg-indigo-500/10' : 'border-[var(--glass-border)] hover:bg-white/5'}`}
                                    >
                                        <p className="text-[9px] opacity-40 mb-1">{font.name}</p>
                                        <p className={`text-lg ${font.className}`}>Bestie+</p>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3 opacity-40">Lion-kun Series (Character style)</h4>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {LOGO_CANDIDATES.filter(l => l.series === "Lion-kun").map((logo) => (
                                    <button
                                        key={logo.id}
                                        onClick={() => onSelect(logo.path, currentFont)}
                                        className={`group relative aspect-square rounded-xl border overflow-hidden transition-all ${currentLogo === logo.path ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-[var(--glass-border)] hover:bg-white/5'}`}
                                    >
                                        <img src={logo.path} alt={logo.label} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                                            <span className="text-[9px] text-white font-bold uppercase tracking-tighter">{logo.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3 opacity-40">Companion Series (Bestie focus)</h4>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {LOGO_CANDIDATES.filter(l => l.series === "Companion").map((logo) => (
                                    <button
                                        key={logo.id}
                                        onClick={() => onSelect(logo.path, currentFont)}
                                        className={`group relative aspect-square rounded-xl border overflow-hidden transition-all ${currentLogo === logo.path ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-[var(--glass-border)] hover:bg-white/5'}`}
                                    >
                                        <img src={logo.path} alt={logo.label} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                                            <span className="text-[9px] text-white font-bold uppercase tracking-tighter">{logo.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3 opacity-40">Tech Series (Previous candidates)</h4>
                            <div className="grid grid-cols-3 gap-3 opacity-60 hover:opacity-100 transition-opacity">
                                {LOGO_CANDIDATES.filter(l => l.series === "Tech").map((logo) => (
                                    <button
                                        key={logo.id}
                                        onClick={() => onSelect(logo.path, currentFont)}
                                        className={`group relative aspect-square rounded-lg border overflow-hidden transition-all ${currentLogo === logo.path ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-[var(--glass-border)] hover:bg-white/5'}`}
                                    >
                                        <img src={logo.path} alt={logo.label} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
}
