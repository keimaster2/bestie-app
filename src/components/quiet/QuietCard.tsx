"use client";

import React from 'react';
import { Product } from '@/lib/types';
import Image from 'next/image';

import Link from 'next/link';
import { getBrandPath } from '@/lib/utils';

interface QuietCardProps {
    product: Product;
    currentGenre?: string;
    isDark?: boolean;
}


export default function QuietCard({ product, currentGenre, isDark = false }: QuietCardProps) {
    // Generate internal Bestie URL for higher engagement
    // Using currentGenre if provided, otherwise defaulting based on product metadata
    const genre = currentGenre || (product.shopName?.toLowerCase().includes('beauty') ? 'beauty' : 'gadget');

    // Construct internal path
    const internalPath = getBrandPath(genre, `/product/${product.id.replace('yahoo-', '').replace('rakuten-', '')}`);

    // Add product data as search params to satisfy ProductDetailPage requirements
    const searchParams = new URLSearchParams({
        title: product.title,
        price: product.price.toString(),
        image: product.image,
        mall: product.mall,
        shop: product.shopName || "",
        url: product.url || "",
        rakutenUrl: product.rakutenUrl || "",
        yahooUrl: product.yahooUrl || "",
        catchphrase: product.catchphrase || "",
        rank: (product.rank || 0).toString(),
        rating: (product.rating || 0).toString(),
        review: (product.reviewCount || 0).toString(),
    });

    const fullInternalUrl = `${internalPath}?${searchParams.toString()}`;

    // Determine target domain based on shopName or other metadata (for visual tag)
    const getDomainPrefix = (shop: string) => {
        const s = shop.toLowerCase();
        if (s.includes('beauty') || s.includes('cosme')) return 'beauty';
        if (s.includes('gadget') || s.includes('pc') || s.includes('camera')) return 'gadget';
        return 'game';
    };

    const domainPrefix = getDomainPrefix(product.shopName || "");

    return (
        <Link
            href={fullInternalUrl}
            className="group flex items-start gap-4 sm:gap-6 py-4 sm:py-6 border-b border-[var(--glass-border)] last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-500 rounded-xl px-2 -mx-2 cursor-pointer relative"
        >
            {/* Rank Indicator - Inset */}
            <div className="flex-shrink-0 w-6 sm:w-8 pt-1 text-[12px] sm:text-[14px] font-mono font-black opacity-80 group-hover:opacity-100 group-hover:text-indigo-400 transition-all">
                {product.rank?.toString().padStart(2, '0')}
            </div>

            {/* Product Image - Futuristic Frame */}
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-[var(--panel-bg)] relative overflow-hidden rounded-lg transition-all duration-700 border border-[var(--glass-border)] group-hover:border-indigo-500/30">
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain p-2 opacity-90 group-hover:opacity-100 transition-opacity"
                />
            </div>

            {/* Product Info */}
            <div className="flex-grow space-y-1.5 min-w-0 pr-2">
                <div className="flex items-center gap-2">
                    <span className="text-[7px] sm:text-[8px] tracking-[0.25em] font-black text-indigo-400 uppercase">
                        {product.shopName}
                    </span>
                </div>
                <h4 className={`text-[13px] sm:text-sm font-bold leading-relaxed line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'} group-hover:text-indigo-400 transition-all`}>
                    {product.title}
                </h4>
                <div className="flex items-center justify-between pt-1">
                    <span className="text-[12px] sm:text-[14px] font-mono font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                        ¥{product.price.toLocaleString()}
                    </span>
                    <span className="text-[8px] sm:text-[9px] opacity-10 group-hover:text-indigo-400 transition-all uppercase tracking-[0.2em] font-black mr-2">
                        INSIGHT +
                    </span>
                </div>
            </div>

            {/* Subtle Neon Line - Bottom Indicator */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-indigo-500/50 group-hover:w-[80%] transition-all duration-700 opacity-0 group-hover:opacity-100 blur-[1px]"></div>
        </Link>
    );
}
