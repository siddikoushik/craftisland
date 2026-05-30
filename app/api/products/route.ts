import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Helper function to map SQLite relational product record to clean client-compatible Product structure
export function mapDbProduct(p: any) {
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

// Fetch all catalog products
export async function GET() {
  try {
    const dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
    const products = dbProducts.map(mapDbProduct)
    return NextResponse.json({ products })
  } catch (e) {
    console.error('Fetch products error:', e)
    return NextResponse.json({ error: 'Failed to retrieve products' }, { status: 500 })
  }
}

// Create a new product in the catalog
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name, tagline, description, story, collection, mood,
      image, price, variants, notes, bestseller, isNew, inStock
    } = body

    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const created = await prisma.product.create({
      data: {
        id: slug,
        slug,
        name,
        tagline: tagline || '',
        description: description || '',
        story: story || '',
        collection: collection || 'signature',
        moods: mood ? mood.join(', ') : '',
        image: image || '/images/products/amber-noir.png',
        price: parseFloat(price),
        variants: JSON.stringify(variants || []),
        notesTop: notes?.top ? notes.top.join(', ') : '',
        notesHeart: notes?.heart ? notes.heart.join(', ') : '',
        notesBase: notes?.base ? notes.base.join(', ') : '',
        bestseller: bestseller ?? false,
        isNew: isNew ?? false,
        inStock: inStock ?? true,
      }
    })

    return NextResponse.json({ product: mapDbProduct(created) })
  } catch (e) {
    console.error('Create product error:', e)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
