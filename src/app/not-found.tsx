import Link from 'next/link';

export const runtime = 'edge';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="text-6xl mb-4">ｦ・/div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">繝壹・繧ｸ縺瑚ｦ九▽縺九ｊ縺ｾ縺帙ｓ縺ｧ縺励◆</h2>
      <p className="text-gray-500 mb-8">縺頑爾縺励・繝壹・繧ｸ縺ｯ縲∫ｧｻ蜍輔＠縺溘°蜑企勁縺輔ｌ縺溷庄閭ｽ諤ｧ縺後≠繧翫∪縺吶・/p>
      <Link 
        href="/"
        className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
      >
        繝医ャ繝励・繝ｼ繧ｸ縺ｫ謌ｻ繧・      </Link>
    </div>
  );
}
