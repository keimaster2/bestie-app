import Link from 'next/link';

export const runtime = 'edge';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="text-6xl mb-4">🦁</div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">ページが見つかりませんでした</h2>
      <p className="text-gray-500 mb-8">お探しのページは、移動したか削除された可能性があります。</p>
      <Link 
        href="/"
        className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
      >
        トップページに戻る
      </Link>
    </div>
  );
}
