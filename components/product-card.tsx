'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import type { Product } from '@/lib/types'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/format'
import { StarRating } from '@/components/star-rating'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/providers/cart-provider'
import { useWishlist } from '@/components/providers/wishlist-provider'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const saved = has(product.id)

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
        <Link href={`/products/${product.slug}`} aria-label={product.name}>
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.bestseller && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-primary-foreground">
              Bestseller
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-foreground px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-background">
              New
            </span>
          )}
          {!product.inStock && (
            <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Sold Out
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur transition hover:bg-background"
        >
          <Heart className={cn('size-4', saved && 'fill-primary text-primary')} />
        </button>

        {product.inStock && (
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              size="sm"
              className="w-full gap-2"
              onClick={() => addItem(product.id, 'classic')}
            >
              <ShoppingBag className="size-4" />
              Quick add
            </Button>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} size={12} />
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        <Link href={`/products/${product.slug}`} className="font-serif text-lg leading-tight">
          {product.name}
        </Link>
        <p className="text-sm text-muted-foreground text-pretty">{product.tagline}</p>
        <p className="mt-1 text-sm font-medium">{formatPrice(product.price)}</p>
      </div>
    </div>
  )
}
