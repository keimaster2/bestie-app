"use client";

import { INSIGHTS_DATA, InsightType } from "@/lib/insights-data";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { LionBrain } from "@/lib/lion-brain";

export const runtime = 'edge';

export default function InsightDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const [insight, setInsight] = useState<InsightType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const found = INSIGHTS_DATA.find((i) => i.id === id);
        if (found) {
            setInsight(found);
            const area = found.id.split('-')[0];
            LionBrain.trackInterest(area, 1);
        }
        setLoading(false);
    }, [id]);

    if (!loading && !insight) return notFound();
    if (!insight) return <div className="min-h-screen bg-black" />;

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30">
            {/* Top Navigation */}
            <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-white/5">
                <Link href="/plus" className="flex items-center gap-2 group">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:bg-indigo-500/20 transition-all duration-300">
                        <span className="text-xs">←</span>
                    </span>
                    <span className="text-[10px] tracking-[0.3em] font-black uppercase opacity-40 group-hover:opacity-100 transition-opacity">Back to Portal</span>
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-[9px] tracking-[0.4em] font-black uppercase opacity-30">Quant Report // v1.0</span>
                    <div className="h-4 w-[1px] bg-white/10"></div>
                    <span className="text-[9px] font-mono opacity-30">{new Date().toISOString().split('T')[0]}</span>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
                {/* Header Section */}
                <header className="mb-16 space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="h-[2px] w-12 bg-indigo-500"></span>
                        <h2 className={`text-xs sm:text-sm tracking-[0.5em] font-black uppercase ${insight.color}`}>
                            {insight.tag}
                        </h2>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-bold leading-tight tracking-tighter">
                        {insight.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 items-center pt-4">
                        {insight.sources.map(s => (
                            <span key={s} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest opacity-60">
                                {s}
                            </span>
                        ))}
                        <div className="h-4 w-[1px] bg-white/10 hidden sm:block"></div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400">Conviction</span>
                            <span className="text-sm font-mono font-black text-indigo-400">{insight.score}%</span>
                        </div>
                    </div>
                </header>

                {/* Content Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Main Column */}
                    <div className="md:col-span-2 space-y-12">
                        <section className="space-y-6">
                            <h3 className="text-lg font-black uppercase tracking-widest opacity-40 border-b border-white/5 pb-2">Analysis Summary</h3>
                            <p className="text-xl sm:text-2xl leading-relaxed font-medium text-white/90">
                                {insight.details?.summary}
                            </p>
                        </section>

                        <section className="space-y-8">
                            <h3 className="text-lg font-black uppercase tracking-widest opacity-40 border-b border-white/5 pb-2">Evidence Matrix</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {insight.details?.evidence.map((ev, idx) => (
                                    <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group">
                                        <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-1">{ev.label}</div>
                                        <div className="flex items-end justify-between">
                                            <div className="text-3xl font-mono font-black group-hover:text-indigo-400 transition-colors">{ev.value}</div>
                                            <div className={`text-xs font-bold ${ev.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {ev.trend === 'up' ? '▲ ASCENDING' : '▼ STABLE/DESC'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col justify-center">
                                    <div className="text-[10px] uppercase tracking-widest text-indigo-400 font-black mb-2 italic">Lion Logic Verdict</div>
                                    <div className="text-sm font-bold leading-snug">
                                        High alpha detected. Strategical priority confirmed.
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Meta Column */}
                    <aside className="space-y-12">
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-3xl">
                            <div className="text-4xl mb-6">{insight.icon}</div>
                            <div className="space-y-6">
                                <div>
                                    <div className="text-[9px] uppercase tracking-[0.3em] opacity-30 font-black mb-1">Time to Insight</div>
                                    <div className="text-xl font-bold">{insight.details?.readingTime}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] uppercase tracking-[0.3em] opacity-30 font-black mb-1">Analyst Group</div>
                                    <div className="text-sm font-mono font-bold leading-tight">{insight.details?.author}</div>
                                </div>
                                <button className="w-full py-4 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-400 hover:text-white transition-all">
                                    Share Report
                                </button>
                            </div>
                        </div>

                        <div className="px-4 space-y-4">
                            <div className="text-[9px] uppercase tracking-[0.3em] opacity-30 font-black">Linked Intelligence</div>
                            <div className="space-y-2">
                                {insight.sources.map(s => (
                                    <div key={s} className="flex items-center gap-3 text-[10px] opacity-50 font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                        {s} DATASTREAM
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Footer Decoration */}
            <footer className="h-64 flex items-center justify-center overflow-hidden pointer-events-none opacity-20">
                <div className="text-[20vw] font-black uppercase tracking-tighter text-white/5 whitespace-nowrap">
                    LION LOGIC INSIGHT 2026
                </div>
            </footer>
        </div>
    );
}
