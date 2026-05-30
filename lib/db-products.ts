import { prisma } from './db'
import type { Product } from './types'

export function mapDbProduct(p: any): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    story: p.story,
    collection: p.collection,
    mood: p.moods ? p.moods.split(',').map((m: string) => m.trim()).filter(Boolean) : [],
    image: p.image,
    price: p.price,
    variants: p.variants ? JSON.parse(p.variants) : [],
    notes: {
      top: p.notesTop ? p.notesTop.split(',').map((n: string) => n.trim()).filter(Boolean) : [],
      heart: p.notesHeart ? p.notesHeart.split(',').map((n: string) => n.trim()).filter(Boolean) : [],
      base: p.notesBase ? p.notesBase.split(',').map((n: string) => n.trim()).filter(Boolean) : [],
    },
    rating: p.rating,
    reviewCount: p.reviewCount,
    bestseller: p.bestseller,
    isNew: p.isNew,
    inStock: p.inStock,
  }
}

export async function getDbProducts(): Promise<Product[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return dbProducts.map(mapDbProduct)
  } catch (e) {
    console.error('Failed to fetch DB products:', e)
    return []
  }
}

export async function getDbProduct(slug: string): Promise<Product | null> {
  try {
    const dbProduct = await prisma.product.findUnique({
      where: { slug }
    })
    return dbProduct ? mapDbProduct(dbProduct) : null
  } catch (e) {
    console.error('Failed to fetch DB product:', e)
    return null
  }
}

export async function getDbProductById(id: string): Promise<Product | null> {
  try {
    const dbProduct = await prisma.product.findUnique({
      where: { id }
    })
    return dbProduct ? mapDbProduct(dbProduct) : null
  } catch (e) {
    console.error('Failed to fetch DB product by id:', e)
    return null
  }
}

export async function getDbRelated(slug: string, limit = 4): Promise<Product[]> {
  try {
    const allProducts = await getDbProducts()
    const current = allProducts.find((p) => p.slug === slug)
    if (!current) return allProducts.slice(0, limit)
    
    return allProducts
      .filter((p) => p.slug !== slug && p.collection === current.collection)
      .concat(allProducts.filter((p) => p.slug !== slug && p.collection !== current.collection))
      .slice(0, limit)
  } catch (e) {
    console.error('Failed to fetch related products:', e)
    return []
  }
}
