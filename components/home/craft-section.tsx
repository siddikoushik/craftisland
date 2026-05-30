'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DEFAULT_HOMEPAGE_SETTINGS } from '@/lib/settings'

export function CraftSection() {
  const [settings, setSettings] = useState(DEFAULT_HOMEPAGE_SETTINGS)

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings({ ...DEFAULT_HOMEPAGE_SETTINGS, ...data.settings })
        }
      })
      .catch((e) => console.error('Failed to fetch craft settings:', e))
  }, [])

  return (
    <section className="bg-card">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src={settings.craftImage || '/images/lifestyle-pour.png'}
            alt="An artisan hand-pouring wax into a candle vessel"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            unoptimized={settings.craftImage?.startsWith('http')}
          />
        </div>
        <div className="max-w-lg">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">
            {settings.craftTagline}
          </p>
          <h2 className="mt-2 font-serif text-3xl text-balance sm:text-4xl">
            {settings.craftTitle}
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
            {settings.craftDescription}
          </p>
          <ul className="mt-6 flex flex-col gap-3 text-sm">
            {(settings.craftBullets || []).map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
          <Button className="mt-8" variant="outline" asChild>
            <Link href="/about">{settings.craftBtnText}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
