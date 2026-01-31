import { NextResponse } from 'next/server';

/**
 * Lion Brain: Shadow Profile Sync API
 * 
 * Receives the local affinity scores and "persists" them.
 * In production, this would write to Cloudflare KV or D1.
 * For local dev, we log it or store in a simple global/file cache to demonstrate persistence.
 */

export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { bestie_id, scores, timestamp } = body;

        if (!bestie_id || !scores) {
            return NextResponse.json({ status: 'error', message: 'Missing Data' }, { status: 400 });
        }

        // Mock Persistence: In a real app, await env.LION_BRAIN_KV.put(bestie_id, JSON.stringify(scores));
        console.log(`[LionBrain Sync] ID: ${bestie_id} evolved!`, scores);

        return NextResponse.json({
            status: 'success',
            message: 'Shadow Profile Synced',
            synced_at: new Date(timestamp).toISOString()
        });

    } catch (error) {
        return NextResponse.json({ status: 'error' }, { status: 500 });
    }
}


