export type Collection = 'signature' | 'seasonal' | 'limited'

export interface ScentNote {
  top: string[]
  heart: string[]
  base: string[]
}

export interface ProductVariant {
  id: string
  label: string
  size: string
  price: number
  burnTime: string
}

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  story: string
  collection: Collection
  mood: string[]
  image: string
  price: number
  variants: ProductVariant[]
  notes: ScentNote
  rating: number
  reviewCount: number
  bestseller?: boolean
  isNew?: boolean
  inStock: boolean
}

export interface Review {
  id: string
  productId: string
  author: string
  rating: number
  title: string
  body: string
  date: string
  verified: boolean
}

export interface CartItem {
  productId: string
  variantId: string
  quantity: number
}

export interface OrderItem {
  name: string
  variant: string
  quantity: number
  price: number
  image: string
}

export interface Order {
  id: string
  date: string
  status: 'processing' | 'shipped' | 'delivered'
  total: number
  items: OrderItem[]
}
