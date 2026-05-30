'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DEFAULT_HOMEPAGE_SETTINGS } from '@/lib/settings'

export function ScentFamily() {
  const [settings, setSettings] = useState(DEFAULT_HOMEPAGE_SETTINGS)

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings({ ...DEFAULT_HOMEPAGE_SETTINGS, ...data.settings })
        }
      })
      .catch((e) => console.error('Failed to fetch scent settings:', e))
  }, [])

  const families = [
    {
      name: 'Floral',
      desc: settings.scentFloralDesc,
      mood: 'Floral',
    },
    {
      name: 'Woody',
      desc: settings.scentWoodyDesc,
      mood: 'Smoky',
    },
    {
      name: 'Gourmand',
      desc: settings.scentGourmandDesc,
      mood: 'Gourmand',
    },
    {
      name: 'Fresh',
      desc: settings.scentFreshDesc,
      mood: 'Fresh',
    },
  ]

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/80">
          {settings.scentSubtitle}
        </p>
        <h2 className="mt-2 font-serif text-4xl text-foreground sm:text-5xl">
          {settings.scentHeading}
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        {families.map((family) => (
          <Link
            key={family.name}
            href={`/shop?mood=${family.mood}`}
            className="group flex flex-col justify-center rounded-md border border-border/70 bg-card px-8 py-7 text-left transition-all duration-300 hover:border-primary/45 hover:shadow-xs transform hover:-translate-y-[1px]"
          >
            <h3 className="font-serif text-2xl text-foreground transition-colors duration-300 group-hover:text-primary">
              {family.name}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {family.desc}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
