import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Fetch reviews list for a specific product
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    const reviews = await prisma.review.findMany({
      where: productId ? { productId } : {},
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ reviews })
  } catch (e) {
    console.error('Fetch reviews error:', e)
    return NextResponse.json({ error: 'Failed to retrieve reviews' }, { status: 500 })
  }
}

// Submit a new review for a product
export async function POST(request: Request) {
  try {
    const { productId, author, rating, title, body } = await request.json()

    if (!productId || !author || rating === undefined || !title || !body) {
      return NextResponse.json({ error: 'Missing required review fields' }, { status: 400 })
    }

    const ratingNum = parseInt(rating)
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ error: 'Rating must be a number between 1 and 5' }, { status: 400 })
    }

    const dateStr = new Date().toISOString().split('T')[0]

    // Save review to DB
    const createdReview = await prisma.review.create({
      data: {
        productId,
        author: author.trim(),
        rating: ratingNum,
        title: title.trim(),
        body: body.trim(),
        date: dateStr,
        verified: true, // Auto-verified for instant boutique test submissions
      }
    })

    // Dynamically query all reviews to aggregate averages
    const allReviews = await prisma.review.findMany({
      where: { productId }
    })

    const count = allReviews.length
    const average = allReviews.reduce((sum, r) => sum + r.rating, 0) / count
    const roundedAverage = Math.round(average * 10) / 10

    // Sync updated average rating and count directly into the product catalog table
    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: roundedAverage,
        reviewCount: count
      }
    })

    return NextResponse.json({ review: createdReview })
  } catch (e) {
    console.error('Post review error:', e)
    return NextResponse.json({ error: 'Failed to post review' }, { status: 500 })
  }
}
