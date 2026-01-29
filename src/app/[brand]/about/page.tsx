import { getSiteConfig } from "@/lib/config";
import { getBrandPath } from "@/lib/utils";
import { use } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { headers } from "next/headers";

export const runtime = 'edge';

export default async function AboutPage({
  params: paramsPromise,
}: {
  params: Promise<{ brand: string }>;
}) {
  const params = await paramsPromise;
  const host = (await headers()).get("host") || "";
  const config = getSiteConfig(params.brand || host);

  return (
    <div className="min-h-screen pb-20 font-sans transition-colors duration-500 text-gray-800"
      style={{ 
        backgroundColor: config.theme.background,
        "--brand-primary": config.themeColor.primary,
        "--brand-accent": config.themeColor.accent,
      } as React.CSSProperties}
    >
      <Header config={config} minimal={true} />

      <Breadcrumbs 
        brand={params.brand}
        config={config}
        items={[{ label: "当サイトについて" }]}
      />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ color: config.themeColor.primary }}>{config.brandName} について</h1>
            <p className="text-gray-500">{config.tagline}</p>
          </div>

          <section className="prose prose-slate max-w-none space-y-8 text-gray-600">
            <div>
              <h2 className="text-xl font-bold text-gray-900 border-l-4 pl-4 mb-4" style={{ borderColor: config.themeColor.accent }}>私たちのミッション</h2>
              <p className="leading-relaxed text-sm whitespace-pre-wrap">
                {config.eeat.brandStory}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 border-l-4 pl-4 mb-4" style={{ borderColor: config.themeColor.accent }}>情報の透明性について</h2>
              <p className="leading-relaxed text-sm">
                当メディアでは、ユーザーの皆様に信頼いただけるよう、公平なデータに基づいたランキング作成を徹底しています。
                各ショップからの直接的な金銭受領による順位操作は一切行わず、客観的な売上データと評価を基準としています。
              </p>
            </div>

            <div className="p-6 rounded-2xl border" style={{ backgroundColor: `${config.themeColor.primary}08`, borderColor: `${config.themeColor.primary}20` }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: config.themeColor.primary }}>アフィリエイト・プログラムについて</h2>
              <p className="text-sm leading-relaxed mb-4">
                {config.brandName} は、Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者です。
              </p>
              <p className="text-sm leading-relaxed">
                また、楽天市場およびYahoo!ショッピングのアフィリエイトプログラムを利用しており、本サイト経由での購入に対して、適格販売により収入を得る場合があります。これにより得られた収益は、サイトの運営・改善およびより質の高い情報提供のために活用されます。
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 border-l-4 pl-4 mb-4" style={{ borderColor: config.themeColor.accent }}>プライバシーポリシー</h2>
              <p className="text-sm leading-relaxed">
                当サイトでは、アクセス解析や広告配信のためにクッキー（Cookie）を使用することがあります。
                クッキーを通じて収集される情報には、個人を特定する情報は含まれません。ブラウザの設定によりクッキーを無効にすることも可能です。
              </p>
            </div>
          </section>
        </div>
      </main>
      
      <Footer brand={params.brand} config={config} />
    </div>
  );
}
