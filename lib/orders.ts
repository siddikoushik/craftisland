import type { Order } from './types'

export const sampleOrders: Order[] = [
  {
    id: 'VW-10428',
    date: '2026-05-12',
    status: 'delivered',
    total: 134,
    items: [
      { name: 'Amber Noir', variant: 'Classic Jar · 9 oz', quantity: 2, price: 42, image: '/images/products/amber-noir.png' },
      { name: 'Vanilla Bourbon', variant: 'Travel Tin · 4 oz', quantity: 1, price: 26, image: '/images/products/vanilla-bourbon.png' },
    ],
  },
  {
    id: 'VW-10391',
    date: '2026-04-03',
    status: 'delivered',
    total: 66,
    items: [
      { name: 'Velvet Rose', variant: 'Grand Vessel · 14 oz', quantity: 1, price: 66, image: '/images/products/velvet-rose.png' },
    ],
  },
  {
    id: 'VW-10522',
    date: '2026-05-26',
    status: 'shipped',
    total: 91,
    items: [
      { name: 'Cardamom & Cedar', variant: 'Classic Jar · 9 oz', quantity: 1, price: 45, image: '/images/products/cardamom-cedar.png' },
      { name: 'Sea Salt & Sage', variant: 'Classic Jar · 9 oz', quantity: 1, price: 42, image: '/images/products/sea-salt-sage.png' },
    ],
  },
]
