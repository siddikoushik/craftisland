import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const footerNav = [
  {
    title: 'Shop',
    links: [
      { href: '/shop', label: 'All Candles' },
      { href: '/collections/signature', label: 'Signature' },
      { href: '/collections/seasonal', label: 'Seasonal' },
      { href: '/collections/limited', label: 'Limited Edition' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'Our Story' },
      { href: '/account', label: 'My Account' },
      { href: '/wishlist', label: 'Wishlist' },
      { href: '/admin', label: 'Admin' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '/shop', label: 'Shipping & Returns' },
      { href: '/shop', label: 'Candle Care' },
      { href: '/shop', label: 'Contact Us' },
      { href: '/shop', label: 'FAQ' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_2fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/logo.jpg"
                alt="Craft Island Logo"
                width={32}
                height={32}
                className="rounded-full object-cover border border-border/30"
              />
              <p className="font-serif text-2xl">Craft Island</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
              Small-batch, hand-poured candles made with clean-burning soy wax and fragrances we’re
              proud to put our name on.
            </p>
            <form className="mt-5 flex max-w-sm gap-2" aria-label="Newsletter signup">
              <Input type="email" placeholder="Your email" aria-label="Email address" required />
              <Button type="submit">Subscribe</Button>
            </form>
            <p className="mt-2 text-xs text-muted-foreground">
              Join for early access to limited pours and 10% off your first order.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNav.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-medium">{col.title}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-muted-foreground transition hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Craft Island. All rights reserved.</p>
          <p>Hand-poured in small batches.</p>
        </div>
      </div>
    </footer>
  )
}
