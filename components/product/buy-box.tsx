'use client'

import { useEffect, useState } from 'react'
import { Heart, Minus, Plus, ShoppingBag } from 'lucide-react'
import type { Product } from '@/lib/types'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/star-rating'
import { useCart } from '@/components/providers/cart-provider'
import { useWishlist } from '@/components/providers/wishlist-provider'

export function BuyBox({ product: initialProduct }: { product: Product }) {
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const [product, setProduct] = useState<Product>(initialProduct)

  useEffect(() => {
    fetch(`/api/products/${initialProduct.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product)
        }
      })
      .catch((e) => console.error('Failed to fetch product details:', e))
  }, [initialProduct.id])

  const [variantId, setVariantId] = useState(
    product.variants.find((v) => v.id === 'classic')?.id ?? product.variants[0].id,
  )
  const [quantity, setQuantity] = useState(1)

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0]
  const saved = has(product.id)

  return (
    <div className="flex flex-col">
      <p className="text-xs uppercase tracking-[0.25em] text-primary">{product.collection}</p>
      <h1 className="mt-2 font-serif text-4xl text-balance">{product.name}</h1>
      <p className="mt-2 text-lg text-muted-foreground text-pretty">{product.tagline}</p>

      <div className="mt-3 flex items-center gap-2">
        <StarRating rating={product.rating} size={16} />
        <a href="#reviews" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          {product.rating} ({product.reviewCount} reviews)
        </a>
      </div>

      <p className="mt-5 font-serif text-3xl">{formatPrice(variant.price)}</p>

      <p className="mt-5 leading-relaxed text-foreground/85 text-pretty">{product.description}</p>

      <div className="mt-7">
        <p className="text-sm font-medium">Size</p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setVariantId(v.id)}
              className={cn(
                'flex flex-col items-start gap-0.5 rounded-md border p-3 text-left transition',
                v.id === variantId
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-border hover:border-primary/40',
              )}
            >
              <span className="text-sm font-medium">{v.label}</span>
              <span className="text-xs text-muted-foreground">{v.size} · {v.burnTime}</span>
              <span className="mt-1 text-sm">{formatPrice(v.price)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 flex items-center gap-3">
        <div className="flex items-center rounded-md border">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="grid size-11 place-items-center text-muted-foreground transition hover:text-foreground"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-10 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
            className="grid size-11 place-items-center text-muted-foreground transition hover:text-foreground"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <Button
          size="lg"
          className="flex-1 gap-2"
          disabled={!product.inStock}
          onClick={() => addItem(product.id, variantId, quantity)}
        >
          <ShoppingBag className="size-4" />
          {product.inStock ? 'Add to cart' : 'Sold out'}
        </Button>

        <Button
          size="lg"
          variant="outline"
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => toggle(product.id)}
          className="px-4"
        >
          <Heart className={cn('size-5', saved && 'fill-primary text-primary')} />
        </Button>
      </div>

      <ul className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-primary" /> Free carbon-neutral shipping over ₹1,875
        </li>
        <li className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-primary" /> Hand-poured soy wax, {variant.burnTime} burn time
        </li>
        <li className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-primary" /> 30-day happiness guarantee
        </li>
      </ul>
    </div>
  )
}
