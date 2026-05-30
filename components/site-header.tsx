'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Heart, Menu, ShoppingBag, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useCart } from '@/components/providers/cart-provider'
import { useWishlist } from '@/components/providers/wishlist-provider'
import { CartDrawer } from '@/components/cart-drawer'

const navLinks = [
  { href: '/shop', label: 'Shop All' },
  { href: '/collections/signature', label: 'Signature' },
  { href: '/collections/seasonal', label: 'Seasonal' },
  { href: '/collections/limited', label: 'Limited' },
  { href: '/about', label: 'Our Story' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { count, setOpen } = useCart()
  const { count: wishCount } = useWishlist()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="mt-8 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2.5 text-base transition hover:bg-secondary"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2.5 text-base transition hover:bg-secondary"
                >
                  My Account
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <Link href="/" className="flex shrink-0 items-center gap-2.5 lg:flex-none">
          <Image
            src="/logo.jpg"
            alt="Craft Island Logo"
            width={36}
            height={36}
            className="rounded-full object-cover border border-border/40"
          />
          <span className="font-serif text-xl tracking-tight sm:text-2xl">Craft Island</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-foreground/80',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" asChild aria-label="Account">
            <Link href="/account">
              <User className="size-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="Wishlist" className="relative">
            <Link href="/wishlist">
              <Heart className="size-5" />
              {wishCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {wishCount}
                </span>
              )}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            className="relative"
            onClick={() => setOpen(true)}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {count}
              </span>
            )}
          </Button>
        </div>
      </div>
      <CartDrawer />
    </header>
  )
}
