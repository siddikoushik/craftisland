import { PrismaClient } from '@prisma/client'
import { products } from '../lib/products'
import { DEFAULT_HOMEPAGE_SETTINGS } from '../lib/settings'
import { reviews } from '../lib/reviews'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // 1. Seed Products
  console.log('Cleaning existing products...')
  await prisma.product.deleteMany({})

  console.log('Inserting default products...')
  for (const p of products) {
    await prisma.product.create({
      data: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        story: p.story,
        collection: p.collection,
        moods: p.mood.join(', '),
        image: p.image,
        price: p.price,
        variants: JSON.stringify(p.variants),
        notesTop: p.notes.top.join(', '),
        notesHeart: p.notes.heart.join(', '),
        notesBase: p.notes.base.join(', '),
        rating: p.rating,
        reviewCount: p.reviewCount,
        bestseller: p.bestseller ?? false,
        isNew: p.isNew ?? false,
        inStock: p.inStock,
      },
    })
  }

  // 2. Seed Homepage Settings
  console.log('Cleaning existing homepage settings...')
  await prisma.homepageSettings.deleteMany({})

  console.log('Inserting default homepage settings...')
  await prisma.homepageSettings.create({
    data: {
      id: 'active',
      heroImage: DEFAULT_HOMEPAGE_SETTINGS.heroImage,
      heroTagline: DEFAULT_HOMEPAGE_SETTINGS.heroTagline,
      heroTitle: DEFAULT_HOMEPAGE_SETTINGS.heroTitle,
      heroDescription: DEFAULT_HOMEPAGE_SETTINGS.heroDescription,
      heroPrimaryBtnText: DEFAULT_HOMEPAGE_SETTINGS.heroPrimaryBtnText,
      heroSecondaryBtnText: DEFAULT_HOMEPAGE_SETTINGS.heroSecondaryBtnText,
      
      prop1Title: DEFAULT_HOMEPAGE_SETTINGS.prop1Title,
      prop1Desc: DEFAULT_HOMEPAGE_SETTINGS.prop1Desc,
      prop1Icon: DEFAULT_HOMEPAGE_SETTINGS.prop1Icon,
      
      prop2Title: DEFAULT_HOMEPAGE_SETTINGS.prop2Title,
      prop2Desc: DEFAULT_HOMEPAGE_SETTINGS.prop2Desc,
      prop2Icon: DEFAULT_HOMEPAGE_SETTINGS.prop2Icon,
      
      prop3Title: DEFAULT_HOMEPAGE_SETTINGS.prop3Title,
      prop3Desc: DEFAULT_HOMEPAGE_SETTINGS.prop3Desc,
      prop3Icon: DEFAULT_HOMEPAGE_SETTINGS.prop3Icon,
      
      prop4Title: DEFAULT_HOMEPAGE_SETTINGS.prop4Title,
      prop4Desc: DEFAULT_HOMEPAGE_SETTINGS.prop4Desc,
      prop4Icon: DEFAULT_HOMEPAGE_SETTINGS.prop4Icon,
      
      craftImage: DEFAULT_HOMEPAGE_SETTINGS.craftImage,
      craftTagline: DEFAULT_HOMEPAGE_SETTINGS.craftTagline,
      craftTitle: DEFAULT_HOMEPAGE_SETTINGS.craftTitle,
      craftDescription: DEFAULT_HOMEPAGE_SETTINGS.craftDescription,
      craftBullets: DEFAULT_HOMEPAGE_SETTINGS.craftBullets.join('\n'),
      craftBtnText: DEFAULT_HOMEPAGE_SETTINGS.craftBtnText,
      
      scentHeading: DEFAULT_HOMEPAGE_SETTINGS.scentHeading,
      scentSubtitle: DEFAULT_HOMEPAGE_SETTINGS.scentSubtitle,
      scentFloralDesc: DEFAULT_HOMEPAGE_SETTINGS.scentFloralDesc,
      scentWoodyDesc: DEFAULT_HOMEPAGE_SETTINGS.scentWoodyDesc,
      scentGourmandDesc: DEFAULT_HOMEPAGE_SETTINGS.scentGourmandDesc,
      scentFreshDesc: DEFAULT_HOMEPAGE_SETTINGS.scentFreshDesc,
      
      testimonialHeading: DEFAULT_HOMEPAGE_SETTINGS.testimonialHeading,
      testimonialTitle: DEFAULT_HOMEPAGE_SETTINGS.testimonialTitle,
      testimonial1Body: DEFAULT_HOMEPAGE_SETTINGS.testimonial1Body,
      testimonial1Author: DEFAULT_HOMEPAGE_SETTINGS.testimonial1Author,
      testimonial1Location: DEFAULT_HOMEPAGE_SETTINGS.testimonial1Location,
      testimonial2Body: DEFAULT_HOMEPAGE_SETTINGS.testimonial2Body,
      testimonial2Author: DEFAULT_HOMEPAGE_SETTINGS.testimonial2Author,
      testimonial2Location: DEFAULT_HOMEPAGE_SETTINGS.testimonial2Location,
      testimonial3Body: DEFAULT_HOMEPAGE_SETTINGS.testimonial3Body,
      testimonial3Author: DEFAULT_HOMEPAGE_SETTINGS.testimonial3Author,
      testimonial3Location: DEFAULT_HOMEPAGE_SETTINGS.testimonial3Location,
    },
  })

  // 3. Seed Product Reviews
  console.log('Cleaning existing reviews...')
  await prisma.review.deleteMany({})

  console.log('Inserting default reviews...')
  for (const r of reviews) {
    await prisma.review.create({
      data: {
        id: r.id,
        productId: r.productId,
        author: r.author,
        rating: r.rating,
        title: r.title,
        body: r.body,
        date: r.date,
        verified: r.verified,
      }
    })
  }

  console.log('✅ Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
