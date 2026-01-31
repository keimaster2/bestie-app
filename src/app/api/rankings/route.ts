import { NextResponse } from 'next/server';
import { fetchYahooRanking } from '@/lib/yahoo';
import { convertYahooToProduct } from '@/lib/yahoo-client';
import { fetchRakutenRanking, convertRakutenToProduct } from '@/lib/rakuten';

export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId') || '1';
    const platform = searchParams.get('platform') || 'yahoo';

    try {
        let products = [];

        if (platform === 'rakuten') {
            const rawData = await fetchRakutenRanking(categoryId);
            products = convertRakutenToProduct(rawData, true).slice(0, 20);
        } else {
            // Default to Yahoo
            const rawData = await fetchYahooRanking(categoryId);
            products = convertYahooToProduct(rawData, true).slice(0, 20);
        }

        return NextResponse.json(products, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
            }
        });
    } catch (error) {
        console.error('Rankings API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch rankings' }, { status: 500 });
    }
}


