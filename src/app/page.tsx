import Link from 'next/link';
import { categories } from '@/data/products';

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">
          LifeBest3
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
          「どれがいい？」と聞かれたら、<br className="sm:hidden" />
          責任を持ってこの3つだけを推す。<br />
          自腹で試し続けたガジェットオタクの結論。
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        <section>
          <h2 className="text-2xl font-semibold mb-8 border-b pb-2">Latest Guides</h2>
          
          <div className="grid gap-8">
            {categories.map((category) => (
              <div key={category.id} className="border rounded-2xl p-6 hover:shadow-lg transition-shadow dark:border-gray-800">
                <div className="mb-4">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">GADGETS</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{category.description}</p>
                
                <div className="space-y-4">
                  {category.products.map((product) => (
                    <div key={product.rank} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className={`
                        w-8 h-8 flex items-center justify-center rounded-full font-bold text-white shrink-0
                        ${product.rank === 1 ? 'bg-yellow-500' : product.rank === 2 ? 'bg-gray-400' : 'bg-orange-700'}
                      `}>
                        {product.rank}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.price}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-right">
                  <Link 
                    href={`/category/${category.id}`}
                    className="inline-block bg-foreground text-background px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity"
                  >
                    詳細を見る →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-24 text-center text-gray-500 text-sm">
        <p>© 2026 LifeBest3. All rights reserved.</p>
      </footer>
    </div>
  );
}
