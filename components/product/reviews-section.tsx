'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import type { Review } from '@/lib/types'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format'
import { StarRating } from '@/components/star-rating'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export function ReviewsSection({
  productId,
  initialReviews,
}: {
  productId: string
  initialReviews: Review[]
}) {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Dynamic real-time fetch on mount/productId change
    fetch(`/api/reviews?productId=${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) {
          setReviews(data.reviews)
        }
      })
      .catch((e) => console.error('Failed to fetch product reviews dynamically:', e))
  }, [productId])

  const average = useMemo(() => {
    if (!reviews.length) return 0
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  }, [reviews])

  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]
    reviews.forEach((r) => {
      counts[r.rating - 1] += 1
    })
    return counts
  }, [reviews])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!author.trim() || !title.trim() || !body.trim()) {
      toast.error('Please fill in all fields.')
      return
    }

    setIsSubmitting(true)

    fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        author: author.trim(),
        rating,
        title: title.trim(),
        body: body.trim(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSubmitting(false)
        if (data.error) {
          toast.error(data.error)
        } else if (data.review) {
          setReviews((prev) => [data.review, ...prev])
          toast.success('Thanks for your review!')
          setAuthor('')
          setTitle('')
          setBody('')
          setRating(5)
          setShowForm(false)
          
          // Trigger a standard next/navigation refresh to immediately rebuild Server Components
          // and show the live updated product average score and reviews count in the buy-box!
          router.refresh()
        }
      })
      .catch((e) => {
        setIsSubmitting(false)
        console.error(e)
        toast.error('Failed to submit review.')
      })
  }

  return (
    <section id="reviews" className="scroll-mt-24">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div>
          <h2 className="font-serif text-3xl">Reviews</h2>
          <div className="mt-4 flex items-center gap-3">
            <span className="font-serif text-5xl">{average.toFixed(1)}</span>
            <div>
              <StarRating rating={average} size={16} />
              <p className="mt-1 text-sm text-muted-foreground">{reviews.length} reviews</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-1.5">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = distribution[stars - 1]
              const pct = reviews.length ? (count / reviews.length) * 100 : 0
              return (
                <div key={stars} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-muted-foreground">{stars}</span>
                  <Star className="size-3 fill-primary text-primary" />
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-right text-muted-foreground">{count}</span>
                </div>
              )
            })}
          </div>

          <Button className="mt-6 w-full" variant="outline" onClick={() => setShowForm((s) => !s)}>
            {showForm ? 'Cancel' : 'Write a review'}
          </Button>
        </div>

        <div>
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-8 rounded-lg border border-border bg-card p-6">
              <p className="font-serif text-xl">Share your thoughts</p>
              <div className="mt-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const value = i + 1
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-label={`${value} stars`}
                      onMouseEnter={() => setHover(value)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(value)}
                    >
                      <Star
                        className={cn(
                          'size-6 transition',
                          (hover || rating) >= value
                            ? 'fill-primary text-primary'
                            : 'fill-transparent text-muted-foreground/40',
                        )}
                      />
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="author">Your name</Label>
                  <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="title">Review title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-1.5">
                <Label htmlFor="body">Your review</Label>
                <Textarea id="body" rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
              </div>
              <Button type="submit" className="mt-4" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit review'}
              </Button>
            </form>
          )}

          <ul className="flex flex-col divide-y divide-border">
            {reviews.map((review) => (
              <li key={review.id} className="py-5 first:pt-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} size={14} />
                    {review.verified && (
                      <Badge variant="secondary" className="text-[10px]">Verified Buyer</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
                </div>
                <p className="mt-2 font-medium">{review.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">{review.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">— {review.author}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
