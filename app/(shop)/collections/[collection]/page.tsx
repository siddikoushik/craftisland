import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/product-card'
import { collections } from '@/lib/products'
import { getDbProducts } from '@/lib/db-products'
import type { Collection } from '@/lib/types'

interface Params {
  params: Promise<{ collection: string }>
}

export function generateStaticParams() {
  return collections.map((c) => ({ collection: c.id }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { collection } = await params
  const meta = collections.find((c) => c.id === collection)
  if (!meta) return { title: 'Collection · Craft Island' }
  return {
    title: `${meta.name} Collection · Craft Island`,
    description: meta.description,
  }
}

export default async function CollectionPage({ params }: Params) {
  const { collection } = await params
  const meta = collections.find((c) => c.id === collection)
  if (!meta) notFound()

  const productsList = await getDbProducts()
  const items = productsList.filter((p) => p.collection === (collection as Collection))

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-primary">Collection</p>
        <h1 className="mt-2 font-serif text-4xl text-balance sm:text-5xl">{meta.name}</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed text-pretty">{meta.description}</p>
      </header>

      {items.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">Nothing here just yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
