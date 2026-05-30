import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Our Story · Craft Island',
  description: 'How Craft Island went from a single test batch in a borrowed kitchen to small-batch luxury candles loved by thousands.',
}

const milestones = [
  { year: '2019', text: 'A single test batch poured in a borrowed kitchen.' },
  { year: '2021', text: 'Opened our studio and introduced the Signature collection.' },
  { year: '2023', text: 'Switched to fully carbon-neutral shipping.' },
  { year: '2026', text: 'Over 12,000 five-star reviews and counting.' },
]

export default function AboutPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src="/images/lifestyle-pour.png" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-foreground/55" />
        </div>
        <div className="mx-auto max-w-3xl px-4 py-28 text-center text-background sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-[0.3em] text-background/80">Est. 2019</p>
          <h1 className="mt-4 font-serif text-5xl text-balance sm:text-6xl">Our story</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-background/85 text-pretty">
            Craft Island began with a simple belief: that the everyday act of lighting a candle
            deserves to feel like a ritual.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-6 text-lg leading-relaxed text-foreground/85 text-pretty">
          <p>
            It started in a borrowed kitchen with a thermometer, a bag of soy wax, and a stubborn
            refusal to settle for fragrances that smelled artificial. The first batch of Amber Noir
            took eleven tries. We still pour it the same way today.
          </p>
          <p>
            Everything we make is blended, poured, and finished by hand in small batches. We cure
            each candle for two full weeks so the fragrance settles deep into the wax — a step most
            makers skip, and the reason our scent throw is what it is.
          </p>
          <p>
            We use only clean-burning soy wax, lead-free cotton wicks, and phthalate-free fragrance
            oils. Our vessels are designed to be kept long after the wax is gone, and every order
            ships carbon-neutral.
          </p>
        </div>
      </section>

      <section className="bg-card">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center font-serif text-3xl">A few moments along the way</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m) => (
              <div key={m.year} className="text-center">
                <p className="font-serif text-4xl text-primary">{m.year}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl text-balance">Find your scent</h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground text-pretty">
          Whether you’re after something warm and smoky or fresh and bright, there’s a pour for you.
        </p>
        <Button size="lg" className="mt-6" asChild>
          <Link href="/shop">Shop the collection</Link>
        </Button>
      </section>
    </div>
  )
}
