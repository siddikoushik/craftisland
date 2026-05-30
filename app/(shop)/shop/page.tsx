import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ShopBrowser } from '@/components/shop/shop-browser'
import { getDbProducts } from '@/lib/db-products'

export const metadata: Metadata = {
  title: 'Shop All Candles · Craft Island',
  description: 'Browse every Craft Island fragrance — signature, seasonal, and limited-edition hand-poured candles.',
}

export default async function ShopPage() {
  const productsList = await getDbProducts()
  const dynamicMoods = Array.from(new Set(productsList.flatMap((p) => p.mood))).sort()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-primary">The collection</p>
        <h1 className="mt-2 font-serif text-4xl text-balance sm:text-5xl">Shop all candles</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed text-pretty">
          Every pour is made by hand in small batches. Filter by collection or mood to find the
          scent that fits your space.
        </p>
      </header>
      <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading products...</div>}>
        <ShopBrowser products={productsList} moods={dynamicMoods} />
      </Suspense>
    </div>
  )
}
