import Image from 'next/image'
import Link from 'next/link'
import { collections } from '@/lib/products'
import { getDbProducts } from '@/lib/db-products'

export async function CollectionStrip() {
  const productsList = await getDbProducts()
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        {collections.map((collection) => {
          const cover = productsList.find((p) => p.collection === collection.id)
          return (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-lg"
            >
              <Image
                src={cover?.image || '/placeholder.svg'}
                alt={collection.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="relative p-6 text-background">
                <p className="font-serif text-2xl">{collection.name}</p>
                <p className="mt-1 max-w-xs text-sm text-background/85 text-pretty">
                  {collection.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
