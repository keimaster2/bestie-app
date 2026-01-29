import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { SITE_REGISTRY } from '@/lib/config';

export const runtime = 'edge';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ brand: string }> }
) {
  try {
    const { brand } = await params;
    const { searchParams } = new URL(req.url);

    // パラメータ取得
    const title = searchParams.get('title') || 'おすすめアイテム';
    const price = searchParams.get('price') || '0';
    let image = searchParams.get('image') || '';
    const rank = searchParams.get('rank') || '';
    const mall = searchParams.get('mall') || 'Rakuten';

    // 高画質化ロジック
    if (mall === 'Yahoo' && image.includes('/i/g/')) {
      image = image.replace('/i/g/', '/i/n/');
    } else if (mall === 'Rakuten' && image.includes('?_ex=')) {
      image = image.split('?')[0];
    }

    const config = SITE_REGISTRY[brand] || SITE_REGISTRY['bestie'];
    const brandColor = config.themeColor.primary;
    const accentColor = config.themeColor.accent;

    // Pinterest推奨サイズ: 1000 x 1500 px
    const width = 1000;
    const height = 1500;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            position: 'relative',
            border: `32px solid ${brandColor}`,
            padding: '50px 60px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* 背景装飾 */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', opacity: 0.02, backgroundImage: `radial-gradient(${brandColor} 5px, transparent 5px)`, backgroundSize: '80px 80px' }} />

          {/* 1. ヘッダー：バランス重視のサイズ */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '64px' }}>🎁</span>
              <span style={{ fontSize: '56px', fontWeight: '950', color: brandColor, letterSpacing: '-0.05em' }}>
                {config.brandName}
              </span>
            </div>
            
            {/* モールバッジ：サイズを落として「名脇役」に */}
            <div style={{ 
              display: 'flex', 
              backgroundColor: mall === 'Yahoo' ? '#ff0033' : '#dc2626', 
              padding: '8px 30px', 
              borderRadius: '12px', 
              boxShadow: '0 4px 10px rgba(255, 0, 51, 0.15)',
            }}>
              <span style={{ fontSize: '20px', color: '#ffffff', fontWeight: '900' }}>
                {mall === 'Yahoo' ? 'Yahoo!ショッピング' : '楽天市場'}
              </span>
            </div>
          </div>

          {/* 2. 商品画像エリア：サイズをさらに拡大 (600px -> 800px) */}
          <div style={{ display: 'flex', width: '850px', height: '800px', backgroundColor: '#ffffff', borderRadius: '60px', border: '1px solid #f3f4f6', boxShadow: '0 40px 80px rgba(0,0,0,0.06)', alignItems: 'center', justifyContent: 'center', padding: '60px', marginBottom: '40px', position: 'relative', zIndex: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            
            {rank && (
              <div style={{ position: 'absolute', top: '-30px', right: '-40px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '140px', height: '140px', backgroundColor: accentColor, borderRadius: '70px', color: '#ffffff', border: '10px solid white', boxShadow: '0 15px 30px rgba(0,0,0,0.15)' }}>
                <span style={{ fontSize: '72px', fontWeight: '950' }}>{`#${rank}`}</span>
              </div>
            )}
          </div>

          {/* 3. テキストエリア：文字サイズを抑えて「情報の品格」を出す */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', zIndex: 10, flexGrow: 1, justifyContent: 'flex-start' }}>
            
            {/* 商品タイトル：フォントサイズを抑制 */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'center', height: '150px', overflow: 'hidden', marginBottom: '15px' }}>
              <span style={{ 
                fontSize: '40px', 
                fontWeight: '900', 
                color: '#111827', 
                lineHeight: 1.2, 
                letterSpacing: '-0.02em',
                textAlign: 'center'
              }}>
                {title.length > 95 ? title.substring(0, 95) + '...' : title}
              </span>
            </div>

            {/* 価格：フォントサイズを抑制 */}
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: '110px', fontWeight: '950', color: '#e11d48', lineHeight: 1 }}>
                {`¥${Number(price).toLocaleString()}`}
              </span>
              <span style={{ fontSize: '32px', fontWeight: '900', color: '#e11d48', marginLeft: '12px' }}>税込</span>
            </div>
          </div>

          {/* 4. ライオンくんバッジ：さらに小さくして下の余白を確保 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#ffffff', padding: '10px 30px', borderRadius: '100px', border: `2px solid ${brandColor}22`, boxShadow: '0 6px 15px rgba(0,0,0,0.03)', marginTop: '20px', zIndex: 20 }}>
            <span style={{ fontSize: '42px' }}>🦁</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '16px', fontWeight: '900', color: brandColor }}>ライオンくんの目利き済み</span>
              <span style={{ fontSize: '8px', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '0.05em' }}>VERIFIED BY LION-KUN</span>
            </div>
          </div>
        </div>
      ),
      { width, height }
    );
  } catch (e: any) {
    console.error(e.message);
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
