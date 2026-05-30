'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import type { CartItem } from '@/lib/types'
import { getProductById } from '@/lib/products'
import type { Product } from '@/lib/types'

interface CartLine extends CartItem {
  name: string
  variantLabel: string
  unitPrice: number
  image: string
  slug: string
}

interface CartContextValue {
  items: CartItem[]
  lines: CartLine[]
  count: number
  subtotal: number
  isOpen: boolean
  setOpen: (open: boolean) => void
  addItem: (productId: string, variantId: string, quantity?: number) => void
  removeItem: (productId: string, variantId: string) => void
  updateQuantity: (productId: string, variantId: string, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'velvet-wick-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [productsList, setProductsList] = useState<Product[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {
      // ignore
    }
    setHydrated(true)

    // Dynamic real-time catalog fetch
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProductsList(data.products)
        }
      })
      .catch((e) => console.error('Failed to load active products inside cart provider:', e))
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const lines = useMemo<CartLine[]>(() => {
    return items
      .map((item) => {
        const product = productsList.find((p) => p.id === item.productId) || getProductById(item.productId)
        const variant = product?.variants.find((v) => v.id === item.variantId)
        if (!product || !variant) return null
        return {
          ...item,
          name: product.name,
          slug: product.slug,
          variantLabel: `${variant.label} · ${variant.size}`,
          unitPrice: variant.price,
          image: product.image,
        }
      })
      .filter(Boolean) as CartLine[]
  }, [items, productsList])

  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0)

  function addItem(productId: string, variantId: string, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId && i.variantId === variantId)
      if (existing) {
        return prev.map((i) =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        )
      }
      return [...prev, { productId, variantId, quantity }]
    })
    const product = productsList.find((p) => p.id === productId) || getProductById(productId)
    toast.success(`${product?.name ?? 'Item'} added to cart`)
    setOpen(true)
  }

  function removeItem(productId: string, variantId: string) {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)))
  }

  function updateQuantity(productId: string, variantId: string, quantity: number) {
    if (quantity <= 0) return removeItem(productId, variantId)
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i,
      ),
    )
  }

  function clear() {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{ items, lines, count, subtotal, isOpen, setOpen, addItem, removeItem, updateQuantity, clear }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
