'use client'

import { useState, useEffect } from 'react'
import { StarRating } from '@/components/star-rating'
import { DEFAULT_HOMEPAGE_SETTINGS } from '@/lib/settings'

export function Testimonials() {
  const [settings, setSettings] = useState<any>(DEFAULT_HOMEPAGE_SETTINGS)

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings)
        }
      })
      .catch((e) => console.error('Failed to fetch testimonials settings:', e))
  }, [])

  const quotes = [
    {
      body: settings.testimonial1Body || DEFAULT_HOMEPAGE_SETTINGS.testimonial1Body,
      author: settings.testimonial1Author || DEFAULT_HOMEPAGE_SETTINGS.testimonial1Author,
      location: settings.testimonial1Location || DEFAULT_HOMEPAGE_SETTINGS.testimonial1Location,
    },
    {
      body: settings.testimonial2Body || DEFAULT_HOMEPAGE_SETTINGS.testimonial2Body,
      author: settings.testimonial2Author || DEFAULT_HOMEPAGE_SETTINGS.testimonial2Author,
      location: settings.testimonial2Location || DEFAULT_HOMEPAGE_SETTINGS.testimonial2Location,
    },
    {
      body: settings.testimonial3Body || DEFAULT_HOMEPAGE_SETTINGS.testimonial3Body,
      author: settings.testimonial3Author || DEFAULT_HOMEPAGE_SETTINGS.testimonial3Author,
      location: settings.testimonial3Location || DEFAULT_HOMEPAGE_SETTINGS.testimonial3Location,
    },
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-primary">
          {settings.testimonialHeading || 'Loved by thousands'}
        </p>
        <h2 className="mt-2 font-serif text-3xl text-balance sm:text-4xl">
          {settings.testimonialTitle || 'Over 12,000 five-star reviews'}
        </h2>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {quotes.map((q, idx) => (
          <figure key={idx} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
            <StarRating rating={5} size={16} />
            <blockquote className="flex-1 text-pretty leading-relaxed">“{q.body}”</blockquote>
            <figcaption className="text-sm">
              <span className="font-medium">{q.author}</span>
              <span className="text-muted-foreground"> · {q.location}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
