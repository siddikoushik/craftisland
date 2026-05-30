import type { Product, Collection } from './types'

function variants(base: number): Product['variants'] {
  return [
    { id: 'travel', label: 'Travel Tin', size: '4 oz', price: Math.round(base * 0.55), burnTime: '20 hrs' },
    { id: 'classic', label: 'Classic Jar', size: '9 oz', price: base, burnTime: '55 hrs' },
    { id: 'grand', label: 'Grand Vessel', size: '14 oz', price: Math.round(base * 1.5), burnTime: '90 hrs' },
  ]
}

export const products: Product[] = [
  {
    id: 'amber-noir',
    slug: 'amber-noir',
    name: 'Amber Noir',
    tagline: 'Smoldering amber wrapped in sandalwood',
    description:
      'A deep, resinous fragrance built on golden amber and creamy sandalwood, finished with a whisper of vanilla. Amber Noir fills a room with quiet warmth.',
    story:
      'Our most beloved pour, Amber Noir began as a single test batch in a borrowed kitchen. The blend of amber resin and aged sandalwood proved impossible to improve upon, so we never did.',
    collection: 'signature',
    mood: ['Warm', 'Cozy', 'Evening'],
    image: '/images/products/amber-noir.png',
    price: 42,
    variants: variants(42),
    notes: {
      top: ['Bergamot', 'Black Pepper'],
      heart: ['Amber Resin', 'Cedarwood'],
      base: ['Sandalwood', 'Vanilla', 'Musk'],
    },
    rating: 4.9,
    reviewCount: 214,
    bestseller: true,
    inStock: true,
  },
  {
    id: 'velvet-rose',
    slug: 'velvet-rose',
    name: 'Velvet Rose',
    tagline: 'Dewy garden roses with a soft musk finish',
    description:
      'Lush and romantic without ever turning sweet. Velvet Rose layers fresh-cut roses and peony over a grounding base of white musk.',
    story:
      'Inspired by the founder’s grandmother’s rose garden after a summer rain, this scent took eleven iterations to capture that exact dewy softness.',
    collection: 'signature',
    mood: ['Romantic', 'Floral', 'Fresh'],
    image: '/images/products/velvet-rose.png',
    price: 44,
    variants: variants(44),
    notes: {
      top: ['Dewy Petals', 'Mandarin'],
      heart: ['Bulgarian Rose', 'Peony'],
      base: ['White Musk', 'Soft Woods'],
    },
    rating: 4.7,
    reviewCount: 168,
    bestseller: true,
    inStock: true,
  },
  {
    id: 'tobacco-oak',
    slug: 'tobacco-oak',
    name: 'Tobacco & Oak',
    tagline: 'Sweet pipe tobacco and weathered oak',
    description:
      'A handsome, library-worthy scent. Rich tobacco leaf meets aged oak and a touch of honey for a fragrance that feels like a leather armchair by the fire.',
    story:
      'We aged the oak accord for months to soften its edges, pairing it with a tobacco note that smells sweet rather than smoky.',
    collection: 'signature',
    mood: ['Warm', 'Masculine', 'Evening'],
    image: '/images/products/tobacco-oak.png',
    price: 46,
    variants: variants(46),
    notes: {
      top: ['Honey', 'Clove'],
      heart: ['Tobacco Leaf', 'Tonka Bean'],
      base: ['Aged Oak', 'Leather'],
    },
    rating: 4.8,
    reviewCount: 132,
    inStock: true,
  },
  {
    id: 'sea-salt-sage',
    slug: 'sea-salt-sage',
    name: 'Sea Salt & Sage',
    tagline: 'Crisp coastal air and garden herbs',
    description:
      'Clean and bright, this airy blend of mineral sea salt and fresh sage transports you to a windswept shoreline. Our most refreshing pour.',
    story:
      'Created for the founder’s seaside studio, Sea Salt & Sage balances briny ozone notes with herbal calm.',
    collection: 'signature',
    mood: ['Fresh', 'Clean', 'Daytime'],
    image: '/images/products/sea-salt-sage.png',
    price: 42,
    variants: variants(42),
    notes: {
      top: ['Sea Salt', 'Ozone'],
      heart: ['Sage', 'Eucalyptus'],
      base: ['Driftwood', 'White Amber'],
    },
    rating: 4.6,
    reviewCount: 97,
    inStock: true,
  },
  {
    id: 'fig-cassis',
    slug: 'fig-cassis',
    name: 'Fig & Cassis',
    tagline: 'Ripe figs and tart blackcurrant',
    description:
      'A fruit-forward, sophisticated scent. Juicy fig and tart cassis are grounded by green leaves and a creamy coconut base.',
    story:
      'A seasonal favorite that returns each autumn, Fig & Cassis is bottled orchard nostalgia.',
    collection: 'seasonal',
    mood: ['Fruity', 'Cozy', 'Autumn'],
    image: '/images/products/fig-cassis.png',
    price: 44,
    variants: variants(44),
    notes: {
      top: ['Blackcurrant', 'Green Leaf'],
      heart: ['Ripe Fig', 'Jasmine'],
      base: ['Coconut Cream', 'Cedar'],
    },
    rating: 4.7,
    reviewCount: 84,
    isNew: true,
    inStock: true,
  },
  {
    id: 'cardamom-cedar',
    slug: 'cardamom-cedar',
    name: 'Cardamom & Cedar',
    tagline: 'Spiced cardamom over dry cedarwood',
    description:
      'Warm and a little exotic. Freshly cracked cardamom and pink pepper sit atop a dry, woody cedar base for a grounding, meditative burn.',
    story:
      'Blended to evoke a spice market at dusk, this pour rewards slow evenings and good company.',
    collection: 'seasonal',
    mood: ['Spiced', 'Warm', 'Evening'],
    image: '/images/products/cardamom-cedar.png',
    price: 45,
    variants: variants(45),
    notes: {
      top: ['Cardamom', 'Pink Pepper'],
      heart: ['Nutmeg', 'Iris'],
      base: ['Cedarwood', 'Vetiver'],
    },
    rating: 4.8,
    reviewCount: 76,
    isNew: true,
    inStock: true,
  },
  {
    id: 'vanilla-bourbon',
    slug: 'vanilla-bourbon',
    name: 'Vanilla Bourbon',
    tagline: 'Madagascar vanilla and aged bourbon',
    description:
      'Indulgent and gourmand. Real vanilla bean melts into smooth bourbon and a hint of caramel for the coziest scent we make.',
    story:
      'A holiday limited edition that sold out three years running before earning a permanent place in our lineup.',
    collection: 'limited',
    mood: ['Sweet', 'Cozy', 'Gourmand'],
    image: '/images/products/vanilla-bourbon.png',
    price: 48,
    variants: variants(48),
    notes: {
      top: ['Caramel', 'Maple'],
      heart: ['Bourbon', 'Tonka'],
      base: ['Madagascar Vanilla', 'Sandalwood'],
    },
    rating: 4.9,
    reviewCount: 203,
    bestseller: true,
    inStock: true,
  },
  {
    id: 'smoked-birch',
    slug: 'smoked-birch',
    name: 'Smoked Birch',
    tagline: 'Crackling birchwood and soft smoke',
    description:
      'The scent of a winter cabin fire. Smoked birch and embered woods are softened with a touch of clove and frankincense.',
    story:
      'Our boldest limited release, hand-poured in small batches and rarely restocked.',
    collection: 'limited',
    mood: ['Smoky', 'Warm', 'Winter'],
    image: '/images/products/smoked-birch.png',
    price: 49,
    variants: variants(49),
    notes: {
      top: ['Clove', 'Cardamom'],
      heart: ['Birch Tar', 'Frankincense'],
      base: ['Embered Wood', 'Patchouli'],
    },
    rating: 4.8,
    reviewCount: 61,
    inStock: false,
  },
]

export const collections: { id: Collection; name: string; description: string }[] = [
  {
    id: 'signature',
    name: 'Signature',
    description: 'Our year-round, never-out-of-style fragrances. The heart of Craft Island.',
  },
  {
    id: 'seasonal',
    name: 'Seasonal',
    description: 'Limited pours that capture a moment in the year. Here while the season lasts.',
  },
  {
    id: 'limited',
    name: 'Limited Edition',
    description: 'Rare, small-batch releases. Once they’re gone, they’re gone.',
  },
]

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getRelated(slug: string, limit = 4): Product[] {
  const current = getProduct(slug)
  if (!current) return products.slice(0, limit)
  return products
    .filter((p) => p.slug !== slug && p.collection === current.collection)
    .concat(products.filter((p) => p.slug !== slug && p.collection !== current.collection))
    .slice(0, limit)
}

export const allMoods = Array.from(new Set(products.flatMap((p) => p.mood))).sort()
