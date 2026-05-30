import type { Review } from './types'

export const reviews: Review[] = [
  {
    id: 'r1',
    productId: 'amber-noir',
    author: 'Eleanor M.',
    rating: 5,
    title: 'My signature scent now',
    body: 'I burn this every evening. The amber is warm without being heavy and it fills my whole living room. On my fourth jar.',
    date: '2026-04-18',
    verified: true,
  },
  {
    id: 'r2',
    productId: 'amber-noir',
    author: 'James T.',
    rating: 5,
    title: 'Clean, long burn',
    body: 'No tunneling, no soot, and the throw is incredible. Worth every penny.',
    date: '2026-03-29',
    verified: true,
  },
  {
    id: 'r3',
    productId: 'amber-noir',
    author: 'Priya K.',
    rating: 4,
    title: 'Lovely but subtle',
    body: 'Gorgeous scent, though I wish it were a touch stronger in a large room. Still repurchasing.',
    date: '2026-02-11',
    verified: true,
  },
  {
    id: 'r4',
    productId: 'velvet-rose',
    author: 'Sofia R.',
    rating: 5,
    title: 'Real roses, not soap',
    body: 'So many rose candles smell like cleaning products. This one smells like an actual garden. Stunning.',
    date: '2026-04-02',
    verified: true,
  },
  {
    id: 'r5',
    productId: 'velvet-rose',
    author: 'Marcus L.',
    rating: 4,
    title: 'Gifted and loved',
    body: 'Bought for my wife and she adores it. Beautiful vessel too — she kept it after.',
    date: '2026-01-22',
    verified: true,
  },
  {
    id: 'r6',
    productId: 'vanilla-bourbon',
    author: 'Hannah B.',
    rating: 5,
    title: 'Coziest candle ever',
    body: 'It is everything fall should smell like. Warm, sweet, a little boozy. Obsessed.',
    date: '2026-04-25',
    verified: true,
  },
  {
    id: 'r7',
    productId: 'tobacco-oak',
    author: 'Daniel S.',
    rating: 5,
    title: 'Smells expensive',
    body: 'Like a high-end cologne in candle form. Perfect for my study.',
    date: '2026-03-14',
    verified: true,
  },
  {
    id: 'r8',
    productId: 'sea-salt-sage',
    author: 'Olivia W.',
    rating: 4,
    title: 'Fresh and calming',
    body: 'Great for the bathroom and mornings. Clean without being sterile.',
    date: '2026-02-28',
    verified: true,
  },
]

export function getReviews(productId: string): Review[] {
  return reviews
    .filter((r) => r.productId === productId)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
}
