import { Hero } from '@/components/home/hero'
import { ValueProps } from '@/components/home/value-props'
import { ScentFamily } from '@/components/home/scent-family'
import { CollectionStrip } from '@/components/home/collection-strip'
import { CraftSection } from '@/components/home/craft-section'
import { Testimonials } from '@/components/home/testimonials'
import { SectionHeading } from '@/components/section-heading'
import { ProductCard } from '@/components/product-card'
import { getDbProducts } from '@/lib/db-products'

export default async function HomePage() {
  const productsList = await getDbProducts()
  const bestsellers = productsList.filter((p) => p.bestseller).slice(0, 4)

  return (
    <>
      <Hero />
      <ValueProps />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Most loved"
          title="Our bestselling pours"
          description="The fragrances our community keeps coming back for, season after season."
          linkHref="/shop"
          linkLabel="Shop all candles"
        />
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <CollectionStrip />
      <CraftSection />
      <Testimonials />
      <ScentFamily />
    </>
  )
}
