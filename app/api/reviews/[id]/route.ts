import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

type RouteContext = {
  params: Promise<{ id: string }>
}

// Helper to recalculate and sync product rating details
async function syncProductRating(productId: string) {
  const allReviews = await prisma.review.findMany({
    where: { productId }
  })

  const count = allReviews.length
  if (count === 0) {
    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: 5.0,
        reviewCount: 0
      }
    })
    return
  }

  const average = allReviews.reduce((sum, r) => sum + r.rating, 0) / count
  const roundedAverage = Math.round(average * 10) / 10

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: roundedAverage,
      reviewCount: count
    }
  })
}

// Update a single review
export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params
    const { author, rating, title, body, verified } = await request.json()

    const review = await prisma.review.findUnique({
      where: { id }
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        author: author !== undefined ? author.trim() : undefined,
        rating: rating !== undefined ? parseInt(rating) : undefined,
        title: title !== undefined ? title.trim() : undefined,
        body: body !== undefined ? body.trim() : undefined,
        verified: verified !== undefined ? verified : undefined,
      }
    })

    // Recalculate average rating of the product
    await syncProductRating(updated.productId)

    return NextResponse.json({ review: updated })
  } catch (e) {
    console.error('Update review error:', e)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

// Delete a single review
export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params

    const review = await prisma.review.findUnique({
      where: { id }
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    await prisma.review.delete({
      where: { id }
    })

    // Recalculate average rating of the product
    await syncProductRating(review.productId)

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Delete review error:', e)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
