'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DEFAULT_HOMEPAGE_SETTINGS } from '@/lib/settings'

export function Hero() {
  const [settings, setSettings] = useState(DEFAULT_HOMEPAGE_SETTINGS)

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings({ ...DEFAULT_HOMEPAGE_SETTINGS, ...data.settings })
        }
      })
      .catch((e) => console.error('Failed to fetch hero settings:', e))
  }, [])

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={settings.heroImage || '/images/hero-candle.png'}
          alt="A hand-poured candle glowing on a linen surface"
          fill
          priority
          className="object-cover"
          unoptimized={settings.heroImage?.startsWith('http')}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
      </div>

      <div className="mx-auto flex min-h-[78vh] max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-xl text-background">
          <p className="text-sm uppercase tracking-[0.3em] text-background/80">
            {settings.heroTagline}
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] text-balance sm:text-6xl">
            {settings.heroTitle}
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-background/85 text-pretty">
            {settings.heroDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/shop">{settings.heroPrimaryBtnText}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-background/40 bg-transparent text-background hover:bg-background hover:text-foreground"
            >
              <Link href="/about">{settings.heroSecondaryBtnText}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
