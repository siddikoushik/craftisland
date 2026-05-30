import { prisma } from './db'
import type { Review } from './types'

export async function getDbReviews(productId: string): Promise<Review[]> {
  try {
    const dbReviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' }
    })
    return dbReviews.map((r) => ({
      id: r.id,
      productId: r.productId,
      author: r.author,
      rating: r.rating,
      title: r.title,
      body: r.body,
      date: r.date,
      verified: r.verified
    }))
  } catch (e) {
    console.error('Failed to fetch DB reviews:', e)
    return []
  }
}
