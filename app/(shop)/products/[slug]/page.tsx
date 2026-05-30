import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { getDbProduct, getDbRelated, getDbProducts } from '@/lib/db-products'
import { getDbReviews } from '@/lib/db-reviews'
import { BuyBox } from '@/components/product/buy-box'
import { ScentNotes } from '@/components/product/scent-notes'
import { ReviewsSection } from '@/components/product/reviews-section'
import { ProductCard } from '@/components/product-card'
import { SectionHeading } from '@/components/section-heading'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

interface Params {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const productsList = await getDbProducts()
  return productsList.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const product = await getDbProduct(slug)
  if (!product) return { title: 'Product · Craft Island' }
  return {
    title: `${product.name} · Craft Island`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params
  const product = await getDbProduct(slug)
  if (!product) notFound()

  const reviews = await getDbReviews(product.id)
  const related = await getDbRelated(slug)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="size-3.5" />
        <Link href="/shop" className="hover:text-foreground">Shop</Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {product.bestseller && <Badge>Bestseller</Badge>}
            {product.isNew && <Badge variant="secondary">New</Badge>}
            {product.mood.map((m) => (
              <Badge key={m} variant="outline" className="bg-background/80 backdrop-blur">{m}</Badge>
            ))}
          </div>
        </div>

        <BuyBox product={product} />
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl">Fragrance notes</h2>
          <div className="mt-5">
            <ScentNotes notes={product.notes} />
          </div>
        </div>
        <div>
          <h2 className="font-serif text-2xl">The story</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground text-pretty">{product.story}</p>
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="care">
              <AccordionTrigger>Candle care</AccordionTrigger>
              <AccordionContent>
                On first burn, let the wax melt fully to the edges to prevent tunneling. Trim the
                wick to ¼ inch before each light and never burn for more than 4 hours at a time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping & returns</AccordionTrigger>
              <AccordionContent>
                Free carbon-neutral shipping on orders over ₹1,875. Most orders ship within 2 business
                days. Unlit candles can be returned within 30 days for a full refund.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ingredients">
              <AccordionTrigger>Ingredients</AccordionTrigger>
              <AccordionContent>
                100% natural soy wax, lead-free cotton wick, and phthalate-free fragrance oils.
                Vegan and never tested on animals.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="mt-16 border-t border-border pt-12">
        <ReviewsSection productId={product.id} initialReviews={reviews} />
      </div>

      <div className="mt-16 border-t border-border pt-12">
        <SectionHeading eyebrow="You may also like" title="Pairs beautifully with" />
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
