'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  ArrowLeft,
  Box,
  CheckCircle,
  Database,
  Flame,
  LayoutDashboard,
  ListOrdered,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  Edit2,
  Trash2,
} from 'lucide-react'
import { products as defaultProducts } from '@/lib/products'
import type { Product, Collection } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { DEFAULT_HOMEPAGE_SETTINGS } from '@/lib/settings'

// Helper to generate variants for a new product
function generateVariants(base: number) {
  return [
    { id: 'travel', label: 'Travel Tin', size: '4 oz', price: Math.round(base * 0.55), burnTime: '20 hrs' },
    { id: 'classic', label: 'Classic Jar', size: '9 oz', price: base, burnTime: '55 hrs' },
    { id: 'grand', label: 'Grand Vessel', size: '14 oz', price: Math.round(base * 1.5), burnTime: '90 hrs' },
  ]
}

// Mock Sales Data for Charts
const revenueData: any[] = []

// Mock Orders Data
const mockOrders: any[] = []

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders' | 'reviews' | 'content'>('overview')
  const [productsList, setProductsList] = useState<Product[]>([])
  const [ordersList, setOrdersList] = useState<any[]>([])
  const [reviewsList, setReviewsList] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [collectionFilter, setCollectionFilter] = useState<'all' | Collection>('all')
  const [mounted, setMounted] = useState(false)

  // Drawer / Form state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Review Drawer state
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<any | null>(null)
  const [formReviewAuthor, setFormReviewAuthor] = useState('')
  const [formReviewRating, setFormReviewRating] = useState('5')
  const [formReviewTitle, setFormReviewTitle] = useState('')
  const [formReviewBody, setFormReviewBody] = useState('')
  const [formReviewVerified, setFormReviewVerified] = useState(true)
  const [formName, setFormName] = useState('')
  const [formTagline, setFormTagline] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formStory, setFormStory] = useState('')
  const [formPrice, setFormPrice] = useState('42')
  const [formCategory, setFormCategory] = useState<Collection>('signature')
  const [formMoods, setFormMoods] = useState('Warm, Cozy')
  const [formNotesTop, setFormNotesTop] = useState('Bergamot')
  const [formNotesHeart, setFormNotesHeart] = useState('Amber')
  const [formNotesBase, setFormNotesBase] = useState('Sandalwood')
  const [formInStock, setFormInStock] = useState(true)
  const [formBestseller, setFormBestseller] = useState(false)
  const [formIsNew, setFormIsNew] = useState(false)
  const [formImage, setFormImage] = useState('/images/products/amber-noir.png')

  // Homepage Content States
  const [homeHeroImage, setHomeHeroImage] = useState(DEFAULT_HOMEPAGE_SETTINGS.heroImage)
  const [homeHeroTagline, setHomeHeroTagline] = useState(DEFAULT_HOMEPAGE_SETTINGS.heroTagline)
  const [homeHeroTitle, setHomeHeroTitle] = useState(DEFAULT_HOMEPAGE_SETTINGS.heroTitle)
  const [homeHeroDescription, setHomeHeroDescription] = useState(DEFAULT_HOMEPAGE_SETTINGS.heroDescription)
  const [homeHeroPrimaryBtnText, setHomeHeroPrimaryBtnText] = useState(DEFAULT_HOMEPAGE_SETTINGS.heroPrimaryBtnText)
  const [homeHeroSecondaryBtnText, setHomeHeroSecondaryBtnText] = useState(DEFAULT_HOMEPAGE_SETTINGS.heroSecondaryBtnText)

  const [homeProp1Title, setHomeProp1Title] = useState(DEFAULT_HOMEPAGE_SETTINGS.prop1Title)
  const [homeProp1Desc, setHomeProp1Desc] = useState(DEFAULT_HOMEPAGE_SETTINGS.prop1Desc)
  const [homeProp1Icon, setHomeProp1Icon] = useState(DEFAULT_HOMEPAGE_SETTINGS.prop1Icon)

  const [homeProp2Title, setHomeProp2Title] = useState(DEFAULT_HOMEPAGE_SETTINGS.prop2Title)
  const [homeProp2Desc, setHomeProp2Desc] = useState(DEFAULT_HOMEPAGE_SETTINGS.prop2Desc)
  const [homeProp2Icon, setHomeProp2Icon] = useState(DEFAULT_HOMEPAGE_SETTINGS.prop2Icon)

  const [homeProp3Title, setHomeProp3Title] = useState(DEFAULT_HOMEPAGE_SETTINGS.prop3Title)
  const [homeProp3Desc, setHomeProp3Desc] = useState(DEFAULT_HOMEPAGE_SETTINGS.prop3Desc)
  const [homeProp3Icon, setHomeProp3Icon] = useState(DEFAULT_HOMEPAGE_SETTINGS.prop3Icon)

  const [homeProp4Title, setHomeProp4Title] = useState(DEFAULT_HOMEPAGE_SETTINGS.prop4Title)
  const [homeProp4Desc, setHomeProp4Desc] = useState(DEFAULT_HOMEPAGE_SETTINGS.prop4Desc)
  const [homeProp4Icon, setHomeProp4Icon] = useState(DEFAULT_HOMEPAGE_SETTINGS.prop4Icon)

  const [homeCraftImage, setHomeCraftImage] = useState(DEFAULT_HOMEPAGE_SETTINGS.craftImage)
  const [homeCraftTagline, setHomeCraftTagline] = useState(DEFAULT_HOMEPAGE_SETTINGS.craftTagline)
  const [homeCraftTitle, setHomeCraftTitle] = useState(DEFAULT_HOMEPAGE_SETTINGS.craftTitle)
  const [homeCraftDescription, setHomeCraftDescription] = useState(DEFAULT_HOMEPAGE_SETTINGS.craftDescription)
  const [homeCraftBullets, setHomeCraftBullets] = useState(DEFAULT_HOMEPAGE_SETTINGS.craftBullets.join('\n'))
  const [homeCraftBtnText, setHomeCraftBtnText] = useState(DEFAULT_HOMEPAGE_SETTINGS.craftBtnText)

  const [homeScentHeading, setHomeScentHeading] = useState(DEFAULT_HOMEPAGE_SETTINGS.scentHeading)
  const [homeScentSubtitle, setHomeScentSubtitle] = useState(DEFAULT_HOMEPAGE_SETTINGS.scentSubtitle)
  const [homeScentFloralDesc, setHomeScentFloralDesc] = useState(DEFAULT_HOMEPAGE_SETTINGS.scentFloralDesc)
  const [homeScentWoodyDesc, setHomeScentWoodyDesc] = useState(DEFAULT_HOMEPAGE_SETTINGS.scentWoodyDesc)
  const [homeScentGourmandDesc, setHomeScentGourmandDesc] = useState(DEFAULT_HOMEPAGE_SETTINGS.scentGourmandDesc)
  const [homeScentFreshDesc, setHomeScentFreshDesc] = useState(DEFAULT_HOMEPAGE_SETTINGS.scentFreshDesc)

  // Testimonials & Reviews states
  const [homeTestimonialHeading, setHomeTestimonialHeading] = useState(DEFAULT_HOMEPAGE_SETTINGS.testimonialHeading)
  const [homeTestimonialTitle, setHomeTestimonialTitle] = useState(DEFAULT_HOMEPAGE_SETTINGS.testimonialTitle)
  const [homeTestimonial1Body, setHomeTestimonial1Body] = useState(DEFAULT_HOMEPAGE_SETTINGS.testimonial1Body)
  const [homeTestimonial1Author, setHomeTestimonial1Author] = useState(DEFAULT_HOMEPAGE_SETTINGS.testimonial1Author)
  const [homeTestimonial1Location, setHomeTestimonial1Location] = useState(DEFAULT_HOMEPAGE_SETTINGS.testimonial1Location)
  const [homeTestimonial2Body, setHomeTestimonial2Body] = useState(DEFAULT_HOMEPAGE_SETTINGS.testimonial2Body)
  const [homeTestimonial2Author, setHomeTestimonial2Author] = useState(DEFAULT_HOMEPAGE_SETTINGS.testimonial2Author)
  const [homeTestimonial2Location, setHomeTestimonial2Location] = useState(DEFAULT_HOMEPAGE_SETTINGS.testimonial2Location)
  const [homeTestimonial3Body, setHomeTestimonial3Body] = useState(DEFAULT_HOMEPAGE_SETTINGS.testimonial3Body)
  const [homeTestimonial3Author, setHomeTestimonial3Author] = useState(DEFAULT_HOMEPAGE_SETTINGS.testimonial3Author)
  const [homeTestimonial3Location, setHomeTestimonial3Location] = useState(DEFAULT_HOMEPAGE_SETTINGS.testimonial3Location)

  useEffect(() => {
    setMounted(true)
    
    // Load products from DB
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProductsList(data.products)
        }
      })
      .catch((e) => console.error('Failed to load admin products:', e))

    // Load orders from DB
    fetch('/api/orders?all=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) {
          setOrdersList(data.orders)
        }
      })
      .catch((e) => console.error('Failed to load admin orders:', e))

    // Load reviews from DB
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) {
          setReviewsList(data.reviews)
        }
      })
      .catch((e) => console.error('Failed to load admin reviews:', e))

    // Load settings from DB
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          const parsed = data.settings
          setHomeHeroImage(parsed.heroImage || DEFAULT_HOMEPAGE_SETTINGS.heroImage)
          setHomeHeroTagline(parsed.heroTagline || DEFAULT_HOMEPAGE_SETTINGS.heroTagline)
          setHomeHeroTitle(parsed.heroTitle || DEFAULT_HOMEPAGE_SETTINGS.heroTitle)
          setHomeHeroDescription(parsed.heroDescription || DEFAULT_HOMEPAGE_SETTINGS.heroDescription)
          setHomeHeroPrimaryBtnText(parsed.heroPrimaryBtnText || DEFAULT_HOMEPAGE_SETTINGS.heroPrimaryBtnText)
          setHomeHeroSecondaryBtnText(parsed.heroSecondaryBtnText || DEFAULT_HOMEPAGE_SETTINGS.heroSecondaryBtnText)

          setHomeProp1Title(parsed.prop1Title || DEFAULT_HOMEPAGE_SETTINGS.prop1Title)
          setHomeProp1Desc(parsed.prop1Desc || DEFAULT_HOMEPAGE_SETTINGS.prop1Desc)
          setHomeProp1Icon(parsed.prop1Icon || DEFAULT_HOMEPAGE_SETTINGS.prop1Icon)

          setHomeProp2Title(parsed.prop2Title || DEFAULT_HOMEPAGE_SETTINGS.prop2Title)
          setHomeProp2Desc(parsed.prop2Desc || DEFAULT_HOMEPAGE_SETTINGS.prop2Desc)
          setHomeProp2Icon(parsed.prop2Icon || DEFAULT_HOMEPAGE_SETTINGS.prop2Icon)

          setHomeProp3Title(parsed.prop3Title || DEFAULT_HOMEPAGE_SETTINGS.prop3Title)
          setHomeProp3Desc(parsed.prop3Desc || DEFAULT_HOMEPAGE_SETTINGS.prop3Desc)
          setHomeProp3Icon(parsed.prop3Icon || DEFAULT_HOMEPAGE_SETTINGS.prop3Icon)

          setHomeProp4Title(parsed.prop4Title || DEFAULT_HOMEPAGE_SETTINGS.prop4Title)
          setHomeProp4Desc(parsed.prop4Desc || DEFAULT_HOMEPAGE_SETTINGS.prop4Desc)
          setHomeProp4Icon(parsed.prop4Icon || DEFAULT_HOMEPAGE_SETTINGS.prop4Icon)

          setHomeCraftImage(parsed.craftImage || DEFAULT_HOMEPAGE_SETTINGS.craftImage)
          setHomeCraftTagline(parsed.craftTagline || DEFAULT_HOMEPAGE_SETTINGS.craftTagline)
          setHomeCraftTitle(parsed.craftTitle || DEFAULT_HOMEPAGE_SETTINGS.craftTitle)
          setHomeCraftDescription(parsed.craftDescription || DEFAULT_HOMEPAGE_SETTINGS.craftDescription)
          setHomeCraftBullets((parsed.craftBullets || DEFAULT_HOMEPAGE_SETTINGS.craftBullets).join('\n'))
          setHomeCraftBtnText(parsed.craftBtnText || DEFAULT_HOMEPAGE_SETTINGS.craftBtnText)

          setHomeScentHeading(parsed.scentHeading || DEFAULT_HOMEPAGE_SETTINGS.scentHeading)
          setHomeScentSubtitle(parsed.scentSubtitle || DEFAULT_HOMEPAGE_SETTINGS.scentSubtitle)
          setHomeScentFloralDesc(parsed.scentFloralDesc || DEFAULT_HOMEPAGE_SETTINGS.scentFloralDesc)
          setHomeScentWoodyDesc(parsed.scentWoodyDesc || DEFAULT_HOMEPAGE_SETTINGS.scentWoodyDesc)
          setHomeScentGourmandDesc(parsed.scentGourmandDesc || DEFAULT_HOMEPAGE_SETTINGS.scentGourmandDesc)
          setHomeScentFreshDesc(parsed.scentFreshDesc || DEFAULT_HOMEPAGE_SETTINGS.scentFreshDesc)

          // Testimonials & Reviews DB load
          setHomeTestimonialHeading(parsed.testimonialHeading || DEFAULT_HOMEPAGE_SETTINGS.testimonialHeading)
          setHomeTestimonialTitle(parsed.testimonialTitle || DEFAULT_HOMEPAGE_SETTINGS.testimonialTitle)
          setHomeTestimonial1Body(parsed.testimonial1Body || DEFAULT_HOMEPAGE_SETTINGS.testimonial1Body)
          setHomeTestimonial1Author(parsed.testimonial1Author || DEFAULT_HOMEPAGE_SETTINGS.testimonial1Author)
          setHomeTestimonial1Location(parsed.testimonial1Location || DEFAULT_HOMEPAGE_SETTINGS.testimonial1Location)
          setHomeTestimonial2Body(parsed.testimonial2Body || DEFAULT_HOMEPAGE_SETTINGS.testimonial2Body)
          setHomeTestimonial2Author(parsed.testimonial2Author || DEFAULT_HOMEPAGE_SETTINGS.testimonial2Author)
          setHomeTestimonial2Location(parsed.testimonial2Location || DEFAULT_HOMEPAGE_SETTINGS.testimonial2Location)
          setHomeTestimonial3Body(parsed.testimonial3Body || DEFAULT_HOMEPAGE_SETTINGS.testimonial3Body)
          setHomeTestimonial3Author(parsed.testimonial3Author || DEFAULT_HOMEPAGE_SETTINGS.testimonial3Author)
          setHomeTestimonial3Location(parsed.testimonial3Location || DEFAULT_HOMEPAGE_SETTINGS.testimonial3Location)
        }
      })
      .catch((e) => console.error('Failed to load admin settings:', e))
  }, [])

  // Sync back to localStorage
  const syncProducts = (updated: Product[]) => {
    setProductsList(updated)
    localStorage.setItem('vw_products', JSON.stringify(updated))
  }

  // Toggle inStock level
  const toggleInStock = (id: string) => {
    const targetProduct = productsList.find((p) => p.id === id)
    if (!targetProduct) return

    fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock: !targetProduct.inStock })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          setProductsList(productsList.map((p) => p.id === id ? data.product : p))
          toast.success('Product availability toggled!')
        }
      })
      .catch((e) => {
        console.error('Failed to toggle product status:', e)
        toast.error('Failed to update product status.')
      })
  }

  // Reset browser data back to pristine state
  const resetToDefault = () => {
    if (confirm('Are you sure you want to reset all accounts and browser states? All cached items will be lost.')) {
      localStorage.clear()
      fetch('/api/auth/logout', { method: 'POST' })
        .then(() => {
          toast.success('Browser cache and user sessions reset to pristine empty state!')
          window.location.reload()
        })
        .catch((e) => {
          console.error(e)
          window.location.reload()
        })
    }
  }

  const handleSaveHomepageSettings = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedSettings = {
      heroImage: homeHeroImage,
      heroTagline: homeHeroTagline,
      heroTitle: homeHeroTitle,
      heroDescription: homeHeroDescription,
      heroPrimaryBtnText: homeHeroPrimaryBtnText,
      heroSecondaryBtnText: homeHeroSecondaryBtnText,

      prop1Title: homeProp1Title, prop1Desc: homeProp1Desc, prop1Icon: homeProp1Icon,
      prop2Title: homeProp2Title, prop2Desc: homeProp2Desc, prop2Icon: homeProp2Icon,
      prop3Title: homeProp3Title, prop3Desc: homeProp3Desc, prop3Icon: homeProp3Icon,
      prop4Title: homeProp4Title, prop4Desc: homeProp4Desc, prop4Icon: homeProp4Icon,

      craftImage: homeCraftImage,
      craftTagline: homeCraftTagline,
      craftTitle: homeCraftTitle,
      craftDescription: homeCraftDescription,
      craftBullets: homeCraftBullets.split('\n').map(s => s.trim()).filter(Boolean),
      craftBtnText: homeCraftBtnText,

      scentHeading: homeScentHeading,
      scentSubtitle: homeScentSubtitle,
      scentFloralDesc: homeScentFloralDesc,
      scentWoodyDesc: homeScentWoodyDesc,
      scentGourmandDesc: homeScentGourmandDesc,
      scentFreshDesc: homeScentFreshDesc,

      testimonialHeading: homeTestimonialHeading,
      testimonialTitle: homeTestimonialTitle,
      testimonial1Body: homeTestimonial1Body,
      testimonial1Author: homeTestimonial1Author,
      testimonial1Location: homeTestimonial1Location,
      testimonial2Body: homeTestimonial2Body,
      testimonial2Author: homeTestimonial2Author,
      testimonial2Location: homeTestimonial2Location,
      testimonial3Body: homeTestimonial3Body,
      testimonial3Author: homeTestimonial3Author,
      testimonial3Location: homeTestimonial3Location,
    }

    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSettings)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          toast.success('Homepage contents and photo links saved successfully!')
        }
      })
  }

  // Delete review
  const deleteReview = (id: string) => {
    if (confirm('Are you sure you want to delete this customer review?')) {
      fetch(`/api/reviews/${id}`, { method: 'DELETE' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setReviewsList(reviewsList.filter((r) => r.id !== id))
            toast.success('Review deleted!')
            
            // Re-fetch products list to update average ratings in inventory/overview tables in real-time!
            fetch('/api/products')
              .then((res) => res.json())
              .then((prodData) => {
                if (prodData.products) setProductsList(prodData.products)
              })
          }
        })
        .catch((e) => {
          console.error('Failed to delete review:', e)
          toast.error('Failed to delete review.')
        })
    }
  }

  // Open review drawer for editing
  const openEditReviewDrawer = (review: any) => {
    setEditingReview(review)
    setFormReviewAuthor(review.author)
    setFormReviewRating(review.rating.toString())
    setFormReviewTitle(review.title)
    setFormReviewBody(review.body)
    setFormReviewVerified(review.verified)
    setIsReviewDrawerOpen(true)
  }

  // Save review form
  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formReviewAuthor || !formReviewTitle || !formReviewBody) {
      toast.error('Please fill in all fields')
      return
    }

    const payload = {
      author: formReviewAuthor,
      rating: parseInt(formReviewRating) || 5,
      title: formReviewTitle,
      body: formReviewBody,
      verified: formReviewVerified,
    }

    fetch(`/api/reviews/${editingReview.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.review) {
          setReviewsList(reviewsList.map(r => r.id === editingReview.id ? data.review : r))
          toast.success('Review updated successfully!')
          setIsReviewDrawerOpen(false)

          // Re-fetch products list to update average ratings in inventory/overview tables in real-time!
          fetch('/api/products')
            .then((res) => res.json())
            .then((prodData) => {
              if (prodData.products) setProductsList(prodData.products)
            })
        }
      })
      .catch((e) => {
        console.error('Failed to update review:', e)
        toast.error('Failed to update review.')
      })
  }

  // Delete product
  const deleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      fetch(`/api/products/${id}`, { method: 'DELETE' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProductsList(productsList.filter((p) => p.id !== id))
            toast.success('Product deleted!')
          }
        })
        .catch((e) => {
          console.error('Failed to delete product:', e)
          toast.error('Failed to delete product.')
        })
    }
  }

  // Open drawer for adding a new product
  const openAddDrawer = () => {
    setEditingProduct(null)
    setFormName('')
    setFormTagline('')
    setFormDesc('')
    setFormStory('')
    setFormPrice('42')
    setFormCategory('signature')
    setFormMoods('Warm, Cozy')
    setFormNotesTop('Bergamot')
    setFormNotesHeart('Amber')
    setFormNotesBase('Sandalwood')
    setFormInStock(true)
    setFormBestseller(false)
    setFormIsNew(true)
    setFormImage('/images/products/amber-noir.png')
    setIsDrawerOpen(true)
  }

  // Open drawer for editing a product
  const openEditDrawer = (product: Product) => {
    setEditingProduct(product)
    setFormName(product.name)
    setFormTagline(product.tagline)
    setFormDesc(product.description)
    setFormStory(product.story)
    setFormPrice(product.price.toString())
    setFormCategory(product.collection)
    setFormMoods(product.mood.join(', '))
    setFormNotesTop(product.notes.top.join(', '))
    setFormNotesHeart(product.notes.heart.join(', '))
    setFormNotesBase(product.notes.base.join(', '))
    setFormInStock(product.inStock)
    setFormBestseller(product.bestseller ?? false)
    setFormIsNew(product.isNew ?? false)
    setFormImage(product.image || '/images/products/amber-noir.png')
    setIsDrawerOpen(true)
  }

  // Save Add/Edit form
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formName) {
      toast.error('Please enter a product name')
      return
    }

    const priceNum = parseFloat(formPrice) || 0
    const moodArray = formMoods.split(',').map((s) => s.trim()).filter(Boolean)
    const notesTopArray = formNotesTop.split(',').map((s) => s.trim()).filter(Boolean)
    const notesHeartArray = formNotesHeart.split(',').map((s) => s.trim()).filter(Boolean)
    const notesBaseArray = formNotesBase.split(',').map((s) => s.trim()).filter(Boolean)

    const productPayload = {
      name: formName,
      tagline: formTagline,
      description: formDesc,
      story: formStory,
      price: priceNum,
      collection: formCategory,
      mood: moodArray,
      image: formImage,
      inStock: formInStock,
      bestseller: formBestseller,
      isNew: formIsNew,
      variants: generateVariants(priceNum),
      notes: {
        top: notesTopArray,
        heart: notesHeartArray,
        base: notesBaseArray,
      },
    }

    if (editingProduct) {
      // Editing existing product
      fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.product) {
            setProductsList(productsList.map(p => p.id === editingProduct.id ? data.product : p))
            toast.success('Product updated successfully!')
          }
        })
        .catch((e) => {
          console.error('Failed to update product:', e)
          toast.error('Failed to update product.')
        })
    } else {
      // Creating a new product
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.product) {
            setProductsList([data.product, ...productsList])
            toast.success('Product added successfully!')
          }
        })
        .catch((e) => {
          console.error('Failed to add product:', e)
          toast.error('Failed to add product.')
        })
    }

    setIsDrawerOpen(false)
  }

  // Filter products for Table List
  const filteredProducts = productsList.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                          product.tagline.toLowerCase().includes(search.toLowerCase())
    const matchesCollection = collectionFilter === 'all' ? true : product.collection === collectionFilter
    return matchesSearch && matchesCollection
  })

  // Analytics Metrics calculations
  const totalRevenue = ordersList.reduce((acc, o) => acc + (parseFloat(o.total) || 0), 0)
  const ordersCount = ordersList.length
  const outOfStockCount = productsList.filter((p) => !p.inStock).length
  const bestsellersCount = productsList.filter((p) => p.bestseller).length

  // Prep data for popular products chart
  const popularityChartData = productsList.slice(0, 5).map((p) => ({
    name: p.name,
    Reviews: p.reviewCount,
    Rating: Math.round(p.rating * 20), // Normalize 5.0 to 100 for better scaling
  }))

  return (
    <div className="flex min-h-screen bg-[#faf8f5] dark:bg-[#121110]">
      {/* Sidebar Panel */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-[#ece8e2] bg-[#f5f1ea] px-5 py-6 dark:border-[#252422] dark:bg-[#181715]">
        <div className="flex items-center gap-2 px-2 pb-6 border-b border-[#ece8e2] dark:border-[#252422]">
          <img src="/logo.jpg" alt="Logo" className="size-6 rounded-full object-cover border border-[#ece8e2] dark:border-[#252422]" />
          <span className="font-serif text-lg font-semibold tracking-wide text-foreground">Craft Island</span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary uppercase">Admin</span>
        </div>

        <nav className="mt-8 flex-1 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
              activeTab === 'overview'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-[#ece8e2] hover:text-foreground dark:hover:bg-[#252422]'
            }`}
          >
            <LayoutDashboard className="size-4.5" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
              activeTab === 'inventory'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-[#ece8e2] hover:text-foreground dark:hover:bg-[#252422]'
            }`}
          >
            <Box className="size-4.5" /> Inventory & Stock
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
              activeTab === 'orders'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-[#ece8e2] hover:text-foreground dark:hover:bg-[#252422]'
            }`}
          >
            <ListOrdered className="size-4.5" /> Recent Orders
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
              activeTab === 'reviews'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-[#ece8e2] hover:text-foreground dark:hover:bg-[#252422]'
            }`}
          >
            <Flame className="size-4.5" /> Product Reviews
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
              activeTab === 'content'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-[#ece8e2] hover:text-foreground dark:hover:bg-[#252422]'
            }`}
          >
            <Edit2 className="size-4.5" /> Homepage Content
          </button>
        </nav>

        <div className="border-t border-[#ece8e2] pt-4 dark:border-[#252422]">
          <Link
            href="/"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-[#ece8e2] hover:text-foreground dark:hover:bg-[#252422]"
          >
            <ArrowLeft className="size-4" /> View Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="ml-64 flex-1 px-8 py-8 lg:px-12">
        {/* Top bar controls */}
        <header className="flex flex-col gap-4 border-b border-[#ece8e2] pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-[#252422]">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
              {activeTab === 'overview' && 'Business Overview'}
              {activeTab === 'inventory' && 'Inventory Catalog'}
              {activeTab === 'orders' && 'Order Logs'}
              {activeTab === 'reviews' && 'Customer Product Reviews'}
              {activeTab === 'content' && 'Homepage Content Editor'}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeTab === 'overview' && 'Real-time sales charts and key growth figures.'}
              {activeTab === 'inventory' && 'Modify candle configurations, stocks, and toggle parameters.'}
              {activeTab === 'orders' && 'Monitor recently logged customer purchases.'}
              {activeTab === 'reviews' && 'Moderate and edit dynamic reviews posted by customers.'}
              {activeTab === 'content' && 'Customize background media, banner texts, benefit blocks, and stories.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={resetToDefault}
              className="flex items-center gap-1.5 rounded-md border border-[#ece8e2] bg-[#f5f1ea] px-3.5 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-[#ece8e2] hover:text-foreground dark:border-[#252422] dark:bg-[#181715] dark:hover:bg-[#252422]"
            >
              <RefreshCw className="size-3.5" /> Reset Database
            </button>
          </div>
        </header>

        {/* -------------------- OVERVIEW TAB -------------------- */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-8">
            {/* Top Stat Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-[#ece8e2] bg-[#fbf9f6] p-6 shadow-xs dark:border-[#252422] dark:bg-[#161513]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <TrendingUp className="size-4" />
                  </div>
                </div>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{formatPrice(totalRevenue)}</p>
                <p className="mt-1 text-xs text-emerald-600 font-medium">+14.2% from last month</p>
              </div>

              <div className="rounded-xl border border-[#ece8e2] bg-[#fbf9f6] p-6 shadow-xs dark:border-[#252422] dark:bg-[#161513]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Transactions</span>
                  <div className="rounded-full bg-[#3b82f6]/10 p-2 text-[#3b82f6]">
                    <ShoppingBag className="size-4" />
                  </div>
                </div>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{ordersCount}</p>
                <p className="mt-1 text-xs text-emerald-600 font-medium">+8.5% this week</p>
              </div>

              <div className="rounded-xl border border-[#ece8e2] bg-[#fbf9f6] p-6 shadow-xs dark:border-[#252422] dark:bg-[#161513]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Out of Stock</span>
                  <div className="rounded-full bg-[#ef4444]/10 p-2 text-[#ef4444]">
                    <AlertCircle className="size-4" />
                  </div>
                </div>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{outOfStockCount}</p>
                <p className="mt-1 text-xs text-muted-foreground">Needs restocking attention</p>
              </div>

              <div className="rounded-xl border border-[#ece8e2] bg-[#fbf9f6] p-6 shadow-xs dark:border-[#252422] dark:bg-[#161513]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Bestsellers</span>
                  <div className="rounded-full bg-[#eab308]/10 p-2 text-[#eab308]">
                    <CheckCircle className="size-4" />
                  </div>
                </div>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{bestsellersCount}</p>
                <p className="mt-1 text-xs text-muted-foreground">Community favorites flagged</p>
              </div>
            </div>

            {/* Charts Section */}
            {mounted && (
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Monthly Revenue Chart */}
                <div className="rounded-xl border border-[#ece8e2] bg-[#fbf9f6] p-6 dark:border-[#252422] dark:bg-[#161513]">
                  <h3 className="font-serif text-lg font-semibold mb-6">Revenue Growth Trend</h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#f5f1ea', border: '1px solid #ece8e2', color: '#24123c' }} />
                        <Area type="monotone" dataKey="Sales" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Popularity Metrics Chart */}
                <div className="rounded-xl border border-[#ece8e2] bg-[#fbf9f6] p-6 dark:border-[#252422] dark:bg-[#161513]">
                  <h3 className="font-serif text-lg font-semibold mb-6">Popularity Index (Top Pours)</h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={popularityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#f5f1ea', border: '1px solid #ece8e2', color: '#24123c' }} />
                        <Bar dataKey="Reviews" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------- INVENTORY TAB -------------------- */}
        {activeTab === 'inventory' && (
          <div className="mt-8 space-y-6">
            {/* Toolbar and controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-[#fbf9f6] p-4 rounded-xl border border-[#ece8e2] dark:border-[#252422] dark:bg-[#161513]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search catalog by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-md border border-[#ece8e2] bg-background py-2 pl-10 pr-4 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {(['all', 'signature', 'seasonal', 'limited'] as const).map((col) => (
                  <button
                    key={col}
                    onClick={() => setCollectionFilter(col)}
                    className={`rounded-md px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                      collectionFilter === col
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-background border border-[#ece8e2] hover:bg-[#ece8e2] text-muted-foreground dark:border-[#252422] dark:hover:bg-[#252422]'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>

              <button
                onClick={openAddDrawer}
                className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/95"
              >
                <Plus className="size-4" /> Add Candle
              </button>
            </div>

            {/* Catalog Grid/Table */}
            <div className="overflow-x-auto rounded-xl border border-[#ece8e2] bg-[#fbf9f6] shadow-xs dark:border-[#252422] dark:bg-[#161513]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#ece8e2] bg-[#f5f1ea]/50 text-xs font-semibold text-muted-foreground uppercase dark:border-[#252422] dark:bg-[#181715]/50">
                    <th className="px-6 py-4">Image & Product</th>
                    <th className="px-6 py-4">Collection</th>
                    <th className="px-6 py-4">Base Price</th>
                    <th className="px-6 py-4">Active Scent Notes</th>
                    <th className="px-6 py-4">Availability</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ece8e2] dark:divide-[#252422]">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#f5f1ea]/20 dark:hover:bg-[#181715]/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 overflow-hidden rounded-md bg-secondary">
                            <img src={p.image || '/placeholder.svg'} alt={p.name} className="object-cover size-full" />
                          </div>
                          <div>
                            <span className="font-serif text-sm font-semibold text-foreground flex items-center gap-1.5">
                              {p.name}
                              {p.bestseller && (
                                <span className="bg-[#eab308]/10 text-[#eab308] text-[9px] px-1 py-0.5 rounded font-sans uppercase">Best</span>
                              )}
                            </span>
                            <span className="block text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{p.tagline}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground font-semibold capitalize">
                          {p.collection}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-serif text-sm font-semibold text-foreground">
                        {formatPrice(p.price)}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        <div className="flex flex-col gap-0.5">
                          <span>Top: {p.notes.top.slice(0, 2).join(', ')}</span>
                          <span>Base: {p.notes.base.slice(0, 2).join(', ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleInStock(p.id)}
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                            p.inStock
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-500'
                              : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-500'
                          }`}
                        >
                          {p.inStock ? '● In Stock' : '○ Out of Stock'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditDrawer(p)}
                            className="p-1 text-muted-foreground hover:text-foreground transition"
                            title="Edit Product"
                          >
                            <Edit2 className="size-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1 text-muted-foreground hover:text-red-500 transition"
                            title="Delete Product"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                        No catalog items found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------- ORDERS TAB -------------------- */}
        {activeTab === 'orders' && (
          <div className="mt-8 space-y-6">
            <div className="rounded-xl border border-[#ece8e2] bg-[#fbf9f6] shadow-xs dark:border-[#252422] dark:bg-[#161513]">
              <div className="px-6 py-4 border-b border-[#ece8e2] dark:border-[#252422] flex items-center justify-between">
                <span className="font-serif text-base font-semibold">Incoming Boutique Logs</span>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary font-semibold">5 Active Logs</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#ece8e2] bg-[#f5f1ea]/50 text-xs font-semibold text-muted-foreground uppercase dark:border-[#252422] dark:bg-[#181715]/50">
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer Name</th>
                      <th className="px-6 py-4">Products Selected</th>
                      <th className="px-6 py-4">Order Value</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ece8e2] dark:divide-[#252422] text-sm">
                    {ordersList.map((o) => (
                      <tr key={o.id} className="hover:bg-[#f5f1ea]/20 dark:hover:bg-[#181715]/20">
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-foreground">{o.id}</td>
                        <td className="px-6 py-4 font-medium text-foreground">{o.customer}</td>
                        <td className="px-6 py-4 text-xs text-muted-foreground line-clamp-1 max-w-[280px]">{o.items}</td>
                        <td className="px-6 py-4 font-serif font-semibold text-foreground">{formatPrice(o.total)}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                            o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-500' :
                            o.status === 'Shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-500' :
                            'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-500'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-xs text-muted-foreground">{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- HOMEPAGE CONTENT EDITOR TAB -------------------- */}
        {activeTab === 'content' && (
          <form onSubmit={handleSaveHomepageSettings} className="mt-8 space-y-8 animate-fade-in pb-16">
            
            {/* SECTION 1: HERO BANNER */}
            <div className="rounded-xl border border-[#ece8e2] bg-[#fbf9f6] p-6 dark:border-[#252422] dark:bg-[#161513] space-y-4">
              <h2 className="font-serif text-xl font-bold border-b border-[#ece8e2] pb-3 text-foreground dark:border-[#252422] flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary"></span>
                Homepage Hero Banner
              </h2>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Accent Tagline</label>
                  <input
                    type="text"
                    required
                    value={homeHeroTagline}
                    onChange={(e) => setHomeHeroTagline(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Hero Main Title Heading</label>
                  <input
                    type="text"
                    required
                    value={homeHeroTitle}
                    onChange={(e) => setHomeHeroTitle(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Hero Description Paragraph</label>
                <textarea
                  required
                  rows={2}
                  value={homeHeroDescription}
                  onChange={(e) => setHomeHeroDescription(e.target.value)}
                  className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Primary Button CTA Copy</label>
                  <input
                    type="text"
                    required
                    value={homeHeroPrimaryBtnText}
                    onChange={(e) => setHomeHeroPrimaryBtnText(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Secondary Button CTA Copy</label>
                  <input
                    type="text"
                    required
                    value={homeHeroSecondaryBtnText}
                    onChange={(e) => setHomeHeroSecondaryBtnText(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Hero Background Photo (preset or paste custom URL link)</label>
                <div className="grid gap-4 sm:grid-cols-3 mb-2">
                  {[
                    { label: 'Lit Amber Candle (Default)', url: '/images/hero-candle.png' },
                    { label: 'Studio Pouring Scene', url: '/images/lifestyle-pour.png' },
                    { label: 'Cozy Living Fireplace', url: 'https://images.unsplash.com/photo-1541462608141-ad4979e408c9?auto=format&fit=crop&q=80&w=1200' },
                  ].map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setHomeHeroImage(preset.url)}
                      className={`text-left rounded-md border p-3 text-xs transition flex flex-col justify-between h-20 ${
                        homeHeroImage === preset.url
                          ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                          : 'border-[#ece8e2] hover:border-primary/30 text-muted-foreground dark:border-[#252422]'
                      }`}
                    >
                      <span className="font-semibold">{preset.label}</span>
                      <span className="text-[10px] text-muted-foreground truncate w-full">{preset.url}</span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  placeholder="Paste any custom photo URL link (e.g. from Unsplash or postimg)..."
                  value={homeHeroImage}
                  onChange={(e) => setHomeHeroImage(e.target.value)}
                  className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                />
              </div>
            </div>

            {/* SECTION 2: BENEFITS VALUE PROPS STRIP */}
            <div className="rounded-xl border border-[#ece8e2] bg-[#fbf9f6] p-6 dark:border-[#252422] dark:bg-[#161513] space-y-4">
              <h2 className="font-serif text-xl font-bold border-b border-[#ece8e2] pb-3 text-foreground dark:border-[#252422] flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary"></span>
                Benefits Value Props Strip
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Prop 1 */}
                <div className="rounded-md border border-[#ece8e2] p-4 bg-background dark:border-[#252422] space-y-3">
                  <span className="text-xs font-bold text-primary uppercase">Benefit Pillar 1</span>
                  <div className="grid grid-cols-[1.5fr_1fr] gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Title</label>
                      <input
                        type="text"
                        required
                        value={homeProp1Title}
                        onChange={(e) => setHomeProp1Title(e.target.value)}
                        className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Icon</label>
                      <select
                        value={homeProp1Icon}
                        onChange={(e) => setHomeProp1Icon(e.target.value)}
                        className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                      >
                        {['Leaf', 'Flame', 'Recycle', 'Truck', 'Sparkles', 'Heart', 'Gift', 'Award'].map((icon) => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Description</label>
                    <input
                      type="text"
                      required
                      value={homeProp1Desc}
                      onChange={(e) => setHomeProp1Desc(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                </div>

                {/* Prop 2 */}
                <div className="rounded-md border border-[#ece8e2] p-4 bg-background dark:border-[#252422] space-y-3">
                  <span className="text-xs font-bold text-primary uppercase">Benefit Pillar 2</span>
                  <div className="grid grid-cols-[1.5fr_1fr] gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Title</label>
                      <input
                        type="text"
                        required
                        value={homeProp2Title}
                        onChange={(e) => setHomeProp2Title(e.target.value)}
                        className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Icon</label>
                      <select
                        value={homeProp2Icon}
                        onChange={(e) => setHomeProp2Icon(e.target.value)}
                        className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                      >
                        {['Leaf', 'Flame', 'Recycle', 'Truck', 'Sparkles', 'Heart', 'Gift', 'Award'].map((icon) => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Description</label>
                    <input
                      type="text"
                      required
                      value={homeProp2Desc}
                      onChange={(e) => setHomeProp2Desc(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                </div>

                {/* Prop 3 */}
                <div className="rounded-md border border-[#ece8e2] p-4 bg-background dark:border-[#252422] space-y-3">
                  <span className="text-xs font-bold text-primary uppercase">Benefit Pillar 3</span>
                  <div className="grid grid-cols-[1.5fr_1fr] gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Title</label>
                      <input
                        type="text"
                        required
                        value={homeProp3Title}
                        onChange={(e) => setHomeProp3Title(e.target.value)}
                        className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Icon</label>
                      <select
                        value={homeProp3Icon}
                        onChange={(e) => setHomeProp3Icon(e.target.value)}
                        className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                      >
                        {['Leaf', 'Flame', 'Recycle', 'Truck', 'Sparkles', 'Heart', 'Gift', 'Award'].map((icon) => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Description</label>
                    <input
                      type="text"
                      required
                      value={homeProp3Desc}
                      onChange={(e) => setHomeProp3Desc(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                </div>

                {/* Prop 4 */}
                <div className="rounded-md border border-[#ece8e2] p-4 bg-background dark:border-[#252422] space-y-3">
                  <span className="text-xs font-bold text-primary uppercase">Benefit Pillar 4</span>
                  <div className="grid grid-cols-[1.5fr_1fr] gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Title</label>
                      <input
                        type="text"
                        required
                        value={homeProp4Title}
                        onChange={(e) => setHomeProp4Title(e.target.value)}
                        className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Icon</label>
                      <select
                        value={homeProp4Icon}
                        onChange={(e) => setHomeProp4Icon(e.target.value)}
                        className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                      >
                        {['Leaf', 'Flame', 'Recycle', 'Truck', 'Sparkles', 'Heart', 'Gift', 'Award'].map((icon) => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Description</label>
                    <input
                      type="text"
                      required
                      value={homeProp4Desc}
                      onChange={(e) => setHomeProp4Desc(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: SCENT FAMILIES */}
            <div className="rounded-xl border border-[#ece8e2] bg-[#fbf9f6] p-6 dark:border-[#252422] dark:bg-[#161513] space-y-4">
              <h2 className="font-serif text-xl font-bold border-b border-[#ece8e2] pb-3 text-foreground dark:border-[#252422] flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary"></span>
                Scent Family Category Strip
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Section Eyebrow Subtitle</label>
                  <input
                    type="text"
                    required
                    value={homeScentSubtitle}
                    onChange={(e) => setHomeScentSubtitle(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Section Main Heading</label>
                  <input
                    type="text"
                    required
                    value={homeScentHeading}
                    onChange={(e) => setHomeScentHeading(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div className="p-4 border rounded-md bg-background dark:border-[#252422] space-y-2">
                  <span className="font-serif text-sm font-semibold">Floral Scent Description</span>
                  <input
                    type="text"
                    required
                    value={homeScentFloralDesc}
                    onChange={(e) => setHomeScentFloralDesc(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
                <div className="p-4 border rounded-md bg-background dark:border-[#252422] space-y-2">
                  <span className="font-serif text-sm font-semibold">Woody Scent Description</span>
                  <input
                    type="text"
                    required
                    value={homeScentWoodyDesc}
                    onChange={(e) => setHomeScentWoodyDesc(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
                <div className="p-4 border rounded-md bg-background dark:border-[#252422] space-y-2">
                  <span className="font-serif text-sm font-semibold">Gourmand Scent Description</span>
                  <input
                    type="text"
                    required
                    value={homeScentGourmandDesc}
                    onChange={(e) => setHomeScentGourmandDesc(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
                <div className="p-4 border rounded-md bg-background dark:border-[#252422] space-y-2">
                  <span className="font-serif text-sm font-semibold">Fresh Scent Description</span>
                  <input
                    type="text"
                    required
                    value={homeScentFreshDesc}
                    onChange={(e) => setHomeScentFreshDesc(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-1.5 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: CRAFT STORY BANNER */}
            <div className="rounded-xl border border-[#ece8e2] bg-[#fbf9f6] p-6 dark:border-[#252422] dark:bg-[#161513] space-y-4">
              <h2 className="font-serif text-xl font-bold border-b border-[#ece8e2] pb-3 text-foreground dark:border-[#252422] flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary"></span>
                Artisan Story Banner (Hand-Poured)
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Accent Tagline</label>
                  <input
                    type="text"
                    required
                    value={homeCraftTagline}
                    onChange={(e) => setHomeCraftTagline(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Artisan Main Title Heading</label>
                  <input
                    type="text"
                    required
                    value={homeCraftTitle}
                    onChange={(e) => setHomeCraftTitle(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Artisan Description Paragraph</label>
                <textarea
                  required
                  rows={3}
                  value={homeCraftDescription}
                  onChange={(e) => setHomeCraftDescription(e.target.value)}
                  className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Articulate Bullet Points (one per line)</label>
                  <textarea
                    required
                    rows={3}
                    value={homeCraftBullets}
                    onChange={(e) => setHomeCraftBullets(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 font-mono text-xs dark:border-[#252422]"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Story Button Text</label>
                    <input
                      type="text"
                      required
                      value={homeCraftBtnText}
                      onChange={(e) => setHomeCraftBtnText(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Lifestyle Photo URL (preset or custom URL link)</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setHomeCraftImage('/images/lifestyle-pour.png')}
                        className={`px-3 py-1.5 text-xs rounded border transition ${
                          homeCraftImage === '/images/lifestyle-pour.png'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-[#ece8e2] text-muted-foreground hover:border-[#ece8e2]/60 dark:border-[#252422]'
                        }`}
                      >
                        Artisan Pouring
                      </button>
                      <button
                        type="button"
                        onClick={() => setHomeCraftImage('https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800')}
                        className={`px-3 py-1.5 text-xs rounded border transition ${
                          homeCraftImage.includes('unsplash')
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-[#ece8e2] text-muted-foreground hover:border-[#ece8e2]/60 dark:border-[#252422]'
                        }`}
                      >
                        Luxury Scent Jars
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground mb-1 uppercase">Custom Lifestyle Image Link</label>
                <input
                  type="text"
                  required
                  placeholder="Paste custom Unsplash or other picture URL..."
                  value={homeCraftImage}
                  onChange={(e) => setHomeCraftImage(e.target.value)}
                  className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                />
              </div>
            </div>

            {/* SECTION 5: CUSTOMER REVIEWS & TESTIMONIALS */}
            <div className="rounded-xl border border-[#ece8e2] bg-[#fbf9f6] p-6 dark:border-[#252422] dark:bg-[#161513] space-y-4">
              <h2 className="font-serif text-xl font-bold border-b border-[#ece8e2] pb-3 text-foreground dark:border-[#252422] flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary"></span>
                Customer Reviews & Testimonials
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Section Accent Tagline</label>
                  <input
                    type="text"
                    required
                    value={homeTestimonialHeading}
                    onChange={(e) => setHomeTestimonialHeading(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Section Main Title</label>
                  <input
                    type="text"
                    required
                    value={homeTestimonialTitle}
                    onChange={(e) => setHomeTestimonialTitle(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3 pt-4">
                {/* Testimonial 1 */}
                <div className="p-4 border rounded-md bg-background dark:border-[#252422] space-y-3">
                  <span className="font-serif text-sm font-semibold block border-b pb-1 dark:border-[#252422]">Review Card 1</span>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">Author Name</label>
                    <input
                      type="text"
                      required
                      value={homeTestimonial1Author}
                      onChange={(e) => setHomeTestimonial1Author(e.target.value)}
                      className="w-full rounded bg-background border border-[#ece8e2] px-2 py-1 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">Location / Tag</label>
                    <input
                      type="text"
                      required
                      value={homeTestimonial1Location}
                      onChange={(e) => setHomeTestimonial1Location(e.target.value)}
                      className="w-full rounded bg-background border border-[#ece8e2] px-2 py-1 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">Review Body Text</label>
                    <textarea
                      required
                      rows={3}
                      value={homeTestimonial1Body}
                      onChange={(e) => setHomeTestimonial1Body(e.target.value)}
                      className="w-full rounded bg-background border border-[#ece8e2] px-2 py-1 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="p-4 border rounded-md bg-background dark:border-[#252422] space-y-3">
                  <span className="font-serif text-sm font-semibold block border-b pb-1 dark:border-[#252422]">Review Card 2</span>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">Author Name</label>
                    <input
                      type="text"
                      required
                      value={homeTestimonial2Author}
                      onChange={(e) => setHomeTestimonial2Author(e.target.value)}
                      className="w-full rounded bg-background border border-[#ece8e2] px-2 py-1 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">Location / Tag</label>
                    <input
                      type="text"
                      required
                      value={homeTestimonial2Location}
                      onChange={(e) => setHomeTestimonial2Location(e.target.value)}
                      className="w-full rounded bg-background border border-[#ece8e2] px-2 py-1 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">Review Body Text</label>
                    <textarea
                      required
                      rows={3}
                      value={homeTestimonial2Body}
                      onChange={(e) => setHomeTestimonial2Body(e.target.value)}
                      className="w-full rounded bg-background border border-[#ece8e2] px-2 py-1 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div className="p-4 border rounded-md bg-background dark:border-[#252422] space-y-3">
                  <span className="font-serif text-sm font-semibold block border-b pb-1 dark:border-[#252422]">Review Card 3</span>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">Author Name</label>
                    <input
                      type="text"
                      required
                      value={homeTestimonial3Author}
                      onChange={(e) => setHomeTestimonial3Author(e.target.value)}
                      className="w-full rounded bg-background border border-[#ece8e2] px-2 py-1 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">Location / Tag</label>
                    <input
                      type="text"
                      required
                      value={homeTestimonial3Location}
                      onChange={(e) => setHomeTestimonial3Location(e.target.value)}
                      className="w-full rounded bg-background border border-[#ece8e2] px-2 py-1 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">Review Body Text</label>
                    <textarea
                      required
                      rows={3}
                      value={homeTestimonial3Body}
                      onChange={(e) => setHomeTestimonial3Body(e.target.value)}
                      className="w-full rounded bg-background border border-[#ece8e2] px-2 py-1 text-xs outline-none focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SAVE BUTTONS */}
            <div className="flex justify-end gap-3 border-t border-[#ece8e2] pt-6 dark:border-[#252422]">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Revert all field edits in this tab back to current saved parameters?')) {
                    // Trigger simple reload
                    window.location.reload()
                  }
                }}
                className="rounded-md border border-[#ece8e2] bg-background px-4 py-2 text-sm font-semibold transition hover:bg-[#ece8e2] dark:border-[#252422] dark:hover:bg-[#252422]"
              >
                Cancel Edits
              </button>
              <Button type="submit" size="lg" className="px-8 font-semibold tracking-wide">
                Save Homepage Layout
              </Button>
            </div>

          </form>
        )}

        {/* -------------------- REVIEWS TAB -------------------- */}
        {activeTab === 'reviews' && (
          <div className="mt-8 space-y-6">
            <div className="rounded-xl border border-[#ece8e2] bg-[#fbf9f6] shadow-xs dark:border-[#252422] dark:bg-[#161513]">
              <div className="px-6 py-4 border-b border-[#ece8e2] dark:border-[#252422] flex items-center justify-between">
                <span className="font-serif text-base font-semibold">Active Product Reviews</span>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary font-semibold">
                  {reviewsList.length} reviews log
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#ece8e2] bg-[#f5f1ea]/50 text-xs font-semibold text-muted-foreground uppercase dark:border-[#252422] dark:bg-[#181715]/50">
                      <th className="px-6 py-4">Author</th>
                      <th className="px-6 py-4">Product ID</th>
                      <th className="px-6 py-4">Stars</th>
                      <th className="px-6 py-4">Review Title & Details</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ece8e2] dark:divide-[#252422] text-sm">
                    {reviewsList.map((r) => (
                      <tr key={r.id} className="hover:bg-[#f5f1ea]/20 dark:hover:bg-[#181715]/20">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-foreground">{r.author}</span>
                          {r.verified && (
                            <span className="ml-1.5 rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 uppercase dark:bg-emerald-950/40 dark:text-emerald-500">
                              Verified
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{r.productId}</td>
                        <td className="px-6 py-4 text-amber-500 font-bold">★ {r.rating}.0</td>
                        <td className="px-6 py-4 max-w-sm">
                          <span className="block font-medium text-foreground">{r.title}</span>
                          <span className="block text-xs text-muted-foreground line-clamp-2 mt-0.5">{r.body}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">{r.date}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditReviewDrawer(r)}
                              className="p-1 text-muted-foreground hover:text-foreground transition"
                              title="Edit Review"
                            >
                              <Edit2 className="size-4" />
                            </button>
                            <button
                              onClick={() => deleteReview(r.id)}
                              className="p-1 text-muted-foreground hover:text-red-500 transition"
                              title="Delete Review"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {reviewsList.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                          No product reviews found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* -------------------- ADD/EDIT DRAWER SLIDE-OUT -------------------- */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          {/* Backdrop Closer */}
          <div className="flex-1" onClick={() => setIsDrawerOpen(false)} />

          {/* Drawer Form Container */}
          <div className="w-full max-w-2xl bg-[#faf8f5] shadow-2xl dark:bg-[#141311] border-l border-[#ece8e2] dark:border-[#252422] p-8 overflow-y-auto h-full flex flex-col">
            <header className="flex items-center justify-between border-b border-[#ece8e2] pb-4 mb-6 dark:border-[#252422]">
              <div>
                <h2 className="font-serif text-2xl font-bold">
                  {editingProduct ? 'Edit Candle Configuration' : 'Add New Candle'}
                </h2>
                <p className="text-xs text-muted-foreground">Configure fragrances, stock, and descriptions.</p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold transition"
              >
                ✕ Close
              </button>
            </header>

            <form onSubmit={handleSave} className="space-y-6 flex-1">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Candle Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lavender Woods"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tagline Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lavender fields backed by mossy cedarwood"
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="42"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Category Collection</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Collection)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  >
                    <option value="signature">Signature (All Year)</option>
                    <option value="seasonal">Seasonal Limited</option>
                    <option value="limited">Limited Release</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Scent Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the overall scent notes and aroma profile..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">The Scent Story</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Tell the artisan inspiration story behind this custom pour..."
                  value={formStory}
                  onChange={(e) => setFormStory(e.target.value)}
                  className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-3 border-t border-[#ece8e2] pt-4 dark:border-[#252422]">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Top Notes (comma list)</label>
                  <input
                    type="text"
                    required
                    placeholder="Bergamot, Pepper"
                    value={formNotesTop}
                    onChange={(e) => setFormNotesTop(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Heart Notes (comma list)</label>
                  <input
                    type="text"
                    required
                    placeholder="Amber, Peony"
                    value={formNotesHeart}
                    onChange={(e) => setFormNotesHeart(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Base Notes (comma list)</label>
                  <input
                    type="text"
                    required
                    placeholder="Sandalwood, Vanilla"
                    value={formNotesBase}
                    onChange={(e) => setFormNotesBase(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Mood Keywords (comma list)</label>
                  <input
                    type="text"
                    required
                    placeholder="Warm, Evening, Floral"
                    value={formMoods}
                    onChange={(e) => setFormMoods(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Vessel Mock Image URI</label>
                  <select
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  >
                    <option value="/images/products/amber-noir.png">Amber Noir (Amber Glass)</option>
                    <option value="/images/products/velvet-rose.png">Velvet Rose (Soft Crimson)</option>
                    <option value="/images/products/tobacco-oak.png">Tobacco & Oak (Dark Brown)</option>
                    <option value="/images/products/sea-salt-sage.png">Sea Salt & Sage (Clear Frost)</option>
                    <option value="/images/products/fig-cassis.png">Fig & Cassis (Cozy Orange)</option>
                    <option value="/images/products/cardamom-cedar.png">Cardamom & Cedar (Forest Green)</option>
                    <option value="/images/products/vanilla-bourbon.png">Vanilla Bourbon (Bourbon Gold)</option>
                    <option value="/images/products/smoked-birch.png">Smoked Birch (Ash Charcoal)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 border-t border-[#ece8e2] pt-6 dark:border-[#252422]">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formInStock}
                    onChange={(e) => setFormInStock(e.target.checked)}
                    className="rounded border-[#ece8e2] text-primary focus:ring-primary size-4 dark:border-[#252422]"
                  />
                  Mark as Available (In Stock)
                </label>

                <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formBestseller}
                    onChange={(e) => setFormBestseller(e.target.checked)}
                    className="rounded border-[#ece8e2] text-primary focus:ring-primary size-4 dark:border-[#252422]"
                  />
                  Flag as Bestseller
                </label>

                <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsNew}
                    onChange={(e) => setFormIsNew(e.target.checked)}
                    className="rounded border-[#ece8e2] text-primary focus:ring-primary size-4 dark:border-[#252422]"
                  />
                  Flag as New Release
                </label>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-[#ece8e2] pt-6 dark:border-[#252422]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- EDIT REVIEW DRAWER SLIDE-OUT -------------------- */}
      {isReviewDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          {/* Backdrop Closer */}
          <div className="flex-1" onClick={() => setIsReviewDrawerOpen(false)} />

          {/* Drawer Form Container */}
          <div className="w-full max-w-md bg-[#faf8f5] shadow-2xl dark:bg-[#141311] border-l border-[#ece8e2] dark:border-[#252422] p-8 overflow-y-auto h-full flex flex-col animate-fade-in">
            <header className="flex items-center justify-between border-b border-[#ece8e2] pb-4 mb-6 dark:border-[#252422]">
              <div>
                <h2 className="font-serif text-2xl font-bold">Edit Review</h2>
                <p className="text-xs text-muted-foreground">Moderate customer-submitted feedback details.</p>
              </div>
              <button
                onClick={() => setIsReviewDrawerOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold transition"
              >
                ✕ Close
              </button>
            </header>

            <form onSubmit={handleSaveReview} className="space-y-6 flex-1">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Author Name</label>
                <input
                  type="text"
                  required
                  value={formReviewAuthor}
                  onChange={(e) => setFormReviewAuthor(e.target.value)}
                  className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Rating Stars</label>
                  <select
                    value={formReviewRating}
                    onChange={(e) => setFormReviewRating(e.target.value)}
                    className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Verified Purchase</label>
                  <div className="flex items-center h-10">
                    <input
                      type="checkbox"
                      id="formReviewVerified"
                      checked={formReviewVerified}
                      onChange={(e) => setFormReviewVerified(e.target.checked)}
                      className="size-4 rounded border-[#ece8e2] text-primary focus:ring-primary dark:border-[#252422]"
                    />
                    <label htmlFor="formReviewVerified" className="ml-2 text-sm font-medium text-foreground">Verified Buyer</label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Review Title</label>
                <input
                  type="text"
                  required
                  value={formReviewTitle}
                  onChange={(e) => setFormReviewTitle(e.target.value)}
                  className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Review Content Body</label>
                <textarea
                  required
                  rows={6}
                  value={formReviewBody}
                  onChange={(e) => setFormReviewBody(e.target.value)}
                  className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-[#ece8e2] pt-6 dark:border-[#252422]">
                <Button type="button" variant="outline" onClick={() => setIsReviewDrawerOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
