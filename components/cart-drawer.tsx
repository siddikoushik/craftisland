'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/components/providers/cart-provider'
import { formatPrice } from '@/lib/format'

export function CartDrawer() {
  const { isOpen, setOpen, lines, subtotal, count, updateQuantity, removeItem } = useCart()
  const freeShippingThreshold = 75
  const remaining = Math.max(0, freeShippingThreshold - subtotal)

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="font-serif text-xl">
            Your Cart {count > 0 && <span className="text-muted-foreground">({count})</span>}
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-serif text-lg">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Find a scent you’ll love.</p>
            </div>
            <Button onClick={() => setOpen(false)} asChild>
              <Link href="/shop">Shop candles</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {subtotal < freeShippingThreshold ? (
                <p className="mb-4 rounded-md bg-secondary px-3 py-2 text-center text-xs text-secondary-foreground">
                  You’re {formatPrice(remaining)} away from free shipping.
                </p>
              ) : (
                <p className="mb-4 rounded-md bg-accent px-3 py-2 text-center text-xs text-accent-foreground">
                  You’ve unlocked free shipping.
                </p>
              )}

              <ul className="flex flex-col gap-4">
                {lines.map((line) => (
                  <li key={`${line.productId}-${line.variantId}`} className="flex gap-3">
                    <Link
                      href={`/products/${line.slug}`}
                      onClick={() => setOpen(false)}
                      className="relative size-20 shrink-0 overflow-hidden rounded-md bg-secondary"
                    >
                      <Image src={line.image || '/placeholder.svg'} alt={line.name} fill className="object-cover" sizes="80px" />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium leading-tight">{line.name}</p>
                          <p className="text-xs text-muted-foreground">{line.variantLabel}</p>
                        </div>
                        <button
                          onClick={() => removeItem(line.productId, line.variantId)}
                          aria-label="Remove item"
                          className="text-muted-foreground transition hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-md border">
                          <button
                            onClick={() => updateQuantity(line.productId, line.variantId, line.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="grid size-8 place-items-center text-muted-foreground transition hover:text-foreground"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm">{line.quantity}</span>
                          <button
                            onClick={() => updateQuantity(line.productId, line.variantId, line.quantity + 1)}
                            aria-label="Increase quantity"
                            className="grid size-8 place-items-center text-muted-foreground transition hover:text-foreground"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-medium">{formatPrice(line.unitPrice * line.quantity)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="border-t px-5 py-4">
              <div className="flex w-full flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-serif text-lg">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
                <Button size="lg" className="w-full" asChild onClick={() => setOpen(false)}>
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="gap-1.5">
                  <X className="size-3.5" /> Continue shopping
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
