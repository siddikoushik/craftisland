'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal } from 'lucide-react'
import type { Collection, Product } from '@/lib/types'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating'

const collectionFilters: { id: Collection | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'signature', label: 'Signature' },
  { id: 'seasonal', label: 'Seasonal' },
  { id: 'limited', label: 'Limited' },
]

export function ShopBrowser({ products, moods }: { products: Product[]; moods: string[] }) {
  const searchParams = useSearchParams()
  const [productsList, setProductsList] = useState<Product[]>(products)
  const [collection, setCollection] = useState<Collection | 'all'>('all')
  const [activeMoods, setActiveMoods] = useState<string[]>([])
  const [sort, setSort] = useState<SortKey>('featured')

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProductsList(data.products)
        }
      })
      .catch((e) => console.error('Failed to fetch products:', e))
  }, [])

  useEffect(() => {
    const moodParam = searchParams.get('mood')
    if (moodParam && moods.includes(moodParam)) {
      setActiveMoods([moodParam])
    }
  }, [searchParams, moods])

  function toggleMood(mood: string) {
    setActiveMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood],
    )
  }

  const filtered = useMemo(() => {
    let list = productsList.filter((p) => (collection === 'all' ? true : p.collection === collection))
    if (activeMoods.length) {
      list = list.filter((p) => activeMoods.every((m) => p.mood.includes(m)))
    }
    switch (sort) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price)
      case 'rating':
        return [...list].sort((a, b) => b.rating - a.rating)
      default:
        return [...list].sort((a, b) => Number(b.bestseller ?? 0) - Number(a.bestseller ?? 0))
    }
  }, [products, collection, activeMoods, sort])

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <aside className="lg:w-60 lg:shrink-0">
        <div className="flex items-center gap-2 text-sm font-medium">
          <SlidersHorizontal className="size-4" /> Filters
        </div>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Collection</p>
          <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:items-start">
            {collectionFilters.map((c) => (
              <button
                key={c.id}
                onClick={() => setCollection(c.id)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-sm transition lg:rounded-md',
                  collection === c.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Mood</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => toggleMood(mood)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm transition',
                  activeMoods.includes(mood)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40',
                )}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {(collection !== 'all' || activeMoods.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-5 px-0 text-muted-foreground"
            onClick={() => {
              setCollection('all')
              setActiveMoods([])
            }}
          >
            Clear filters
          </Button>
        )}
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'candle' : 'candles'}
          </p>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            No candles match those filters. Try clearing a few.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
