'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import { getProductById } from '@/lib/products'

interface WishlistContextValue {
  ids: string[]
  has: (id: string) => boolean
  toggle: (id: string) => void
  remove: (id: string) => void
  count: number
}

import type { Product } from '@/lib/types'

const WishlistContext = createContext<WishlistContextValue | null>(null)
const STORAGE_KEY = 'velvet-wick-wishlist'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [productsList, setProductsList] = useState<Product[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setIds(JSON.parse(stored))
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
      .catch((e) => console.error('Failed to load active products inside wishlist provider:', e))
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }, [ids, hydrated])

  function toggle(id: string) {
    setIds((prev) => {
      const exists = prev.includes(id)
      const product = productsList.find((p) => p.id === id) || getProductById(id)
      if (exists) {
        toast(`${product?.name ?? 'Item'} removed from wishlist`)
        return prev.filter((x) => x !== id)
      }
      toast.success(`${product?.name ?? 'Item'} saved to wishlist`)
      return [...prev, id]
    })
  }

  function remove(id: string) {
    setIds((prev) => prev.filter((x) => x !== id))
  }

  return (
    <WishlistContext.Provider
      value={{ ids, has: (id) => ids.includes(id), toggle, remove, count: ids.length }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
