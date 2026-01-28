export const runtime = 'edge';

import { categories } from '@/data/products';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return categories.map((category) => ({
    id: category.id,
  }));
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  const category = categories.find((c) => c.id === params.id);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-12">
        <Link href="/" className="text-sm text-gray-500 hover:underline">
          ← Back to Top
        </Link>
        <h1 className="text-3xl font-bold mt-4">{category.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{category.description}</p>
      </header>

      <div className="max-w-3xl mx-auto space-y-16">
        {category.products.map((product) => (
          <div key={product.rank} className="relative border rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
            
            {/* Rank Badge */}
            <div className={`
              absolute top-0 left-0 w-16 h-16 flex items-center justify-center rounded-br-2xl text-2xl font-bold text-white z-10
              ${product.rank === 1 ? 'bg-yellow-500 shadow-lg' : product.rank === 2 ? 'bg-gray-400' : product.rank === 3 ? 'bg-orange-700' : 'bg-gray-800'}
            `}>
              #{product.rank}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-100 dark:bg-gray-800 aspect-video md:aspect-auto flex items-center justify-center">
                 {/* Placeholder for image */}
                 <div className="text-gray-400">Image: {product.name}</div>
              </div>
              
              <div className="p-6 flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <div className="text-xl font-semibold text-blue-600 mb-4">{product.price}</div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {product.description}
                </p>

                <ul className="mb-8 space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-500">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a 
                  href={product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-red-500 hover:bg-red-600 text-white text-center font-bold py-4 rounded-xl transition-colors shadow-md"
                >
                  Amazonで見る ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
