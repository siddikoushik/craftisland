import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { mapDbProduct } from '../route'

type RouteContext = {
  params: Promise<{ id: string }>
}

// Fetch a single product by id or slug
export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product: mapDbProduct(product) })
  } catch (e) {
    console.error('Fetch product detail error:', e)
    return NextResponse.json({ error: 'Failed to retrieve product details' }, { status: 500 })
  }
}

// Update a single product's detail
export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      name, tagline, description, story, collection, mood,
      image, price, variants, notes, bestseller, isNew, inStock
    } = body

    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: {
        name: name !== undefined ? name : undefined,
        tagline: tagline !== undefined ? tagline : undefined,
        description: description !== undefined ? description : undefined,
        story: story !== undefined ? story : undefined,
        collection: collection !== undefined ? collection : undefined,
        moods: mood !== undefined ? mood.join(', ') : undefined,
        image: image !== undefined ? image : undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        variants: variants !== undefined ? JSON.stringify(variants) : undefined,
        notesTop: notes?.top !== undefined ? notes.top.join(', ') : undefined,
        notesHeart: notes?.heart !== undefined ? notes.heart.join(', ') : undefined,
        notesBase: notes?.base !== undefined ? notes.base.join(', ') : undefined,
        bestseller: bestseller !== undefined ? bestseller : undefined,
        isNew: isNew !== undefined ? isNew : undefined,
        inStock: inStock !== undefined ? inStock : undefined,
      }
    })

    return NextResponse.json({ product: mapDbProduct(updated) })
  } catch (e) {
    console.error('Update product error:', e)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// Delete a product from inventory
export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await prisma.product.delete({
      where: { id: product.id }
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Delete product error:', e)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
