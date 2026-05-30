'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  CheckCircle,
  Flame,
  Gift,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Smartphone,
  Check,
  MessageSquare,
  PhoneCall,
  ArrowRightLeft,
} from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { formatPrice } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart()

  // Form states
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const [apartment, setApartment] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  
  // Shipping & Promo states
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard')
  const [promoCode, setPromoCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0) // percentage
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] = useState('')

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'contact'>('upi')

  // Card Payment states (unrendered, kept for compatibility)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')

  // UPI states
  const [upiId, setUpiId] = useState('')
  const [isUpiVerified, setIsUpiVerified] = useState(false)
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false)

  // Netbanking states
  const [selectedBank, setSelectedBank] = useState('')

  // Processing states
  const [isProcessing, setIsProcessing] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate pricing values
  const discountAmount = subtotal * (appliedDiscount / 100)
  const subtotalAfterDiscount = subtotal - discountAmount
  
  // Threshold remains subtotal >= 75 (which maps to 75 * 25 = ₹1,875 subtotal)
  const isFreeShipping = subtotalAfterDiscount >= 75
  const shippingCost = shippingMethod === 'standard' ? (isFreeShipping ? 0 : 6.99) : 15.00
  const taxAmount = subtotalAfterDiscount * 0.08 // 8% tax
  const grandTotal = subtotalAfterDiscount + shippingCost + taxAmount

  // Handle Promo Code Apply
  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    setPromoError('')
    setPromoSuccess('')

    const code = promoCode.trim().toUpperCase()
    if (code === 'WELCOME10') {
      setAppliedDiscount(10)
      setPromoSuccess('Promo WELCOME10 applied! You saved 10% on your pours.')
    } else if (code === 'CRAFT20') {
      setAppliedDiscount(20)
      setPromoSuccess('VIP Promo CRAFT20 applied! You saved 20% on your pours.')
    } else if (code) {
      setPromoError('Invalid promo code. Try WELCOME10 or CRAFT20.')
    }
  }

  // Handle UPI Verification simulation
  const verifyUpi = () => {
    if (!upiId || !upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID (e.g. name@upi)')
      return
    }
    setIsVerifyingUpi(true)
    setTimeout(() => {
      setIsVerifyingUpi(false)
      setIsUpiVerified(true)
      toast.success('UPI ID verified successfully!')
    }, 1000)
  }

  // Handle Submit Order
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !firstName || !lastName || !address || !city || !state || !zip) {
      toast.error('Please complete all required shipping fields.')
      return
    }

    // Payment validation based on active checkout option
    if (paymentMethod === 'upi') {
      if (!upiId) {
        toast.error('Please enter your UPI ID.')
        return
      }
      if (!isUpiVerified) {
        toast.error('Please click verify to validate your UPI ID.')
        return
      }
    }

    setIsProcessing(true)

    // Simulate luxury processing
    setTimeout(() => {
      const paymentLabel = 
        paymentMethod === 'upi' ? `UPI (${upiId})` : 'Direct Contact Payment'

      const itemsPayload = lines.map((l) => ({
        name: l.name,
        variant: l.variantLabel,
        quantity: l.quantity,
        price: l.price,
        image: l.image,
      }))

      // POST to live database API
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: `${firstName} ${lastName}`,
          customerEmail: email,
          items: itemsPayload,
          total: grandTotal,
          paymentMethod: paymentMethod === 'upi' ? 'UPI / GPay' : 'Direct Contact Payment',
          paymentDetails: paymentMethod === 'upi' ? upiId : 'ICICI Bank Transfer Coordination',
          date: new Date().toISOString().split('T')[0],
        })
      })
      .then((res) => res.json())
      .then((data) => {
        const orderId = data.order?.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`
        
        setConfirmedOrder({
          id: orderId,
          customerName: `${firstName} ${lastName}`,
          email,
          total: grandTotal,
          shippingAddress: `${address}, ${apartment ? apartment + ', ' : ''}${city}, ${state} ${zip}`,
          date: new Date().toISOString().split('T')[0],
          itemsList: [...lines],
          paymentMethodLabel: paymentLabel,
        })

        // Clear basket and progress
        clear()
        setIsProcessing(false)
        setIsConfirmed(true)
        toast.success('Order placed successfully! Light something beautiful.')
      })
      .catch((err) => {
        console.error('Failed to submit order to API:', err)
        toast.error('Failed to coordinate checkout transaction.')
        setIsProcessing(false)
      })
    }, 1800)
  }

  if (!mounted) return null

  // Cart is empty and order is not confirmed
  if (lines.length === 0 && !isConfirmed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf8f5] dark:bg-[#121110] px-4 py-12 text-center">
        <div className="grid size-20 place-items-center rounded-full bg-[#f5f1ea] dark:bg-[#181715] mb-6">
          <ShoppingBag className="size-9 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl mb-2">Your checkout basket is empty</h1>
        <p className="text-muted-foreground max-w-sm mb-6">Add premium hand-poured candles to your cart before proceeding to checkout.</p>
        <Button asChild>
          <Link href="/shop">Shop all candles</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-foreground dark:bg-[#121110]">
      {/* Distraction-free Header */}
      <header className="border-b border-[#ece8e2] bg-[#fbf9f6] py-5 dark:border-[#252422] dark:bg-[#161513]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.jpg" alt="Logo" width={32} height={32} className="rounded-full object-cover" />
            <span className="font-serif text-lg tracking-tight sm:text-xl font-semibold">Craft Island</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            <ShieldCheck className="size-4 text-emerald-600" /> Secure Checkout
          </div>
        </div>
      </header>

      {/* -------------------- ORDER CONFIRMED VIEW -------------------- */}
      {isConfirmed && confirmedOrder && (
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 animate-fade-in">
          <div className="rounded-2xl border border-[#ece8e2] bg-[#fbf9f6] p-8 text-center shadow-xs dark:border-[#252422] dark:bg-[#161513] md:p-12">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-500 mb-6">
              <CheckCircle className="size-10" />
            </div>
            
            <h1 className="font-serif text-4xl font-bold tracking-tight mb-3">Order Confirmed!</h1>
            <p className="text-muted-foreground text-pretty max-w-md mx-auto mb-8">
              Thank you, <span className="font-semibold text-foreground">{confirmedOrder.customerName}</span>. 
              Your candles are being hand-poured in our studio and will cure for 2 full weeks before shipping.
            </p>

            {/* Order Receipt */}
            <div className="rounded-lg border border-[#ece8e2] bg-[#faf8f5] p-6 text-left dark:border-[#252422] dark:bg-[#121110] mb-8 space-y-4">
              <div className="flex justify-between border-b border-[#ece8e2] pb-3 dark:border-[#252422] text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Order Reference</p>
                  <p className="font-mono font-semibold mt-0.5">{confirmedOrder.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Date Placed</p>
                  <p className="font-semibold mt-0.5">{confirmedOrder.date}</p>
                </div>
              </div>

              {/* Items recap */}
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Pours Ordered</p>
                <ul className="divide-y divide-[#ece8e2]/60 dark:divide-[#252422]/60">
                  {confirmedOrder.itemsList.map((item: any) => (
                    <li key={`${item.productId}-${item.variantId}`} className="py-2.5 flex justify-between text-sm">
                      <div>
                        <span className="font-medium text-foreground">{item.name}</span>
                        <span className="block text-xs text-muted-foreground">{item.variantLabel} x{item.quantity}</span>
                      </div>
                      <span className="font-medium">{formatPrice(item.unitPrice * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Delivery and Totals recap */}
              <div className="border-t border-[#ece8e2] pt-3 dark:border-[#252422] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping To</span>
                  <span className="font-medium text-right max-w-[200px] line-clamp-1">{confirmedOrder.shippingAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium">{confirmedOrder.paymentMethodLabel}</span>
                </div>
                <div className="flex justify-between border-t border-[#ece8e2]/60 pt-2 dark:border-[#252422]/60 text-sm font-semibold text-foreground">
                  <span>Grand Total (Charged)</span>
                  <span className="font-serif">{formatPrice(confirmedOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8">
                <Link href="/admin">Go to Admin Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* -------------------- BILLING & FORM COLS -------------------- */}
      {!isConfirmed && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr]">
            
            {/* Left Column Forms */}
            <form onSubmit={handlePlaceOrder} className="space-y-10">
              
              {/* Step 1: Customer Contact */}
              <div className="space-y-4">
                <h2 className="font-serif text-2xl flex items-center gap-2 border-b border-[#ece8e2] pb-2 dark:border-[#252422]">
                  <span className="font-sans text-xs bg-primary text-primary-foreground size-5 rounded-full grid place-items-center">1</span>
                  Contact Information
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="(555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Destination */}
              <div className="space-y-4">
                <h2 className="font-serif text-2xl flex items-center gap-2 border-b border-[#ece8e2] pb-2 dark:border-[#252422]">
                  <span className="font-sans text-xs bg-primary text-primary-foreground size-5 rounded-full grid place-items-center">2</span>
                  Shipping Address
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">First Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Last Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="123 Scent Lane"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Apt / Suite</label>
                    <input
                      type="text"
                      placeholder="Apt 4B"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">City</label>
                    <input
                      type="text"
                      required
                      placeholder="New Delhi"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">State</label>
                    <input
                      type="text"
                      required
                      placeholder="Delhi"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">ZIP Code</label>
                    <input
                      type="text"
                      required
                      placeholder="110001"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Shipping Method */}
              <div className="space-y-4">
                <h2 className="font-serif text-2xl flex items-center gap-2 border-b border-[#ece8e2] pb-2 dark:border-[#252422]">
                  <span className="font-sans text-xs bg-primary text-primary-foreground size-5 rounded-full grid place-items-center">3</span>
                  Delivery Options
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div
                    onClick={() => setShippingMethod('standard')}
                    className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition ${
                      shippingMethod === 'standard'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-[#ece8e2] hover:border-primary/45 dark:border-[#252422]'
                    }`}
                  >
                    <Truck className="size-5 text-primary shrink-0 mt-0.5" />
                    <div className="w-full">
                      <div className="text-sm font-semibold flex items-center justify-between w-full">
                        <span>Standard Delivery</span>
                        <span className="font-serif">{isFreeShipping ? 'FREE' : formatPrice(6.99)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Ships carbon-neutral. Hand-poured batch cures for 2 weeks, then arrives in 3-5 business days.</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition ${
                      shippingMethod === 'express'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-[#ece8e2] hover:border-primary/45 dark:border-[#252422]'
                    }`}
                  >
                    <Truck className="size-5 text-primary shrink-0 mt-0.5" />
                    <div className="w-full">
                      <div className="text-sm font-semibold flex items-center justify-between w-full">
                        <span>Express Delivery</span>
                        <span className="font-serif">{formatPrice(15)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Accelerated curation queue. Priority shipping arriving in 1-2 business days.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Checkout Options */}
              <div className="space-y-4">
                <h2 className="font-serif text-2xl flex items-center gap-2 border-b border-[#ece8e2] pb-2 dark:border-[#252422]">
                  <span className="font-sans text-xs bg-primary text-primary-foreground size-5 rounded-full grid place-items-center">4</span>
                  Checkout Options
                </h2>
                
                {/* Method selector tabs */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-xs font-bold uppercase tracking-wider transition ${
                      paymentMethod === 'upi'
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                        : 'border-[#ece8e2] hover:border-primary/40 text-muted-foreground dark:border-[#252422]'
                    }`}
                  >
                    <Smartphone className="size-6 text-primary" /> UPI / GPay
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('contact')}
                    className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-xs font-bold uppercase tracking-wider transition ${
                      paymentMethod === 'contact'
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                        : 'border-[#ece8e2] hover:border-primary/40 text-muted-foreground dark:border-[#252422]'
                    }`}
                  >
                    <MessageSquare className="size-6 text-primary" /> Contact Payment
                  </button>
                </div>

                {/* Tab Forms */}
                <div className="rounded-lg border border-[#ece8e2] bg-[#fbf9f6] p-6 dark:border-[#252422] dark:bg-[#161513]">
                  
                  {/* UPI OPTION */}
                  {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold uppercase tracking-wider border-b border-[#ece8e2] pb-2 dark:border-[#252422]">
                        <Smartphone className="size-4" /> UPI / Google Pay / PhonePe
                      </div>
                      
                      <p className="text-xs text-muted-foreground">Enter your virtual payment address (VPA) below to initiate secure checkout payment.</p>
                      
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">UPI ID / VPA</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="username@okhdfcbank"
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value)
                              setIsUpiVerified(false)
                            }}
                            className="flex-1 rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                          />
                          <button
                            type="button"
                            onClick={verifyUpi}
                            disabled={isVerifyingUpi || isUpiVerified}
                            className={`rounded-md px-4 py-2 text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                              isUpiVerified
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-500'
                                : 'bg-primary text-primary-foreground hover:bg-primary/95'
                            }`}
                          >
                            {isVerifyingUpi ? 'Verifying...' : isUpiVerified ? <><Check className="size-3" /> Verified</> : 'Verify ID'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DIRECT CONTACT PAYMENT */}
                  {paymentMethod === 'contact' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold uppercase tracking-wider border-b border-[#ece8e2] pb-2 dark:border-[#252422]">
                        <MessageSquare className="size-4 text-primary" /> Direct Contact Payment
                      </div>
                      
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        To maintain direct, personal service, coordinate your payment directly with our studio team. We support dynamic direct payouts, Instant UPI scans, and bank transfers.
                      </p>

                      {/* ICICI Bank Details */}
                      <div className="rounded-lg border border-[#ece8e2] bg-[#faf8f5] p-4 dark:border-[#252422] dark:bg-[#121110] space-y-2">
                        <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <ArrowRightLeft className="size-3.5 text-primary" /> Option A: Direct Bank Transfer (IMPS/NEFT)
                        </p>
                        <div className="grid grid-cols-2 gap-y-1.5 text-xs font-mono pt-1 text-muted-foreground">
                          <span>Bank Name:</span>
                          <span className="font-semibold text-foreground">ICICI Bank</span>
                          <span>Account Name:</span>
                          <span className="font-semibold text-foreground">Craft Island Soy Pours</span>
                          <span>Account No:</span>
                          <span className="font-semibold text-foreground select-all">0123 4567 8912</span>
                          <span>IFSC Code:</span>
                          <span className="font-semibold text-foreground select-all">ICIC0000123</span>
                        </div>
                      </div>

                      {/* WhatsApp / Phone Details */}
                      <div className="rounded-lg border border-[#ece8e2] bg-[#faf8f5] p-4 dark:border-[#252422] dark:bg-[#121110] space-y-2">
                        <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <PhoneCall className="size-3.5 text-primary" /> Option B: Direct WhatsApp Coordination
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Coordinate immediately by scanning our studio pay QR or chat directly with our scent artisan via mobile to finalize.
                        </p>
                        <div className="pt-1 font-mono text-xs flex justify-between text-muted-foreground">
                          <span>WhatsApp Artisan:</span>
                          <span className="font-semibold text-foreground">+91 98765 43210</span>
                        </div>
                        
                        <a
                          href={`https://wa.me/919876543210?text=Hi%20Craft%20Island%20Studio,%20I'm%20coordinating%20direct%20payment%20worth%20${formatPrice(grandTotal)}%20for%20my%20order.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 mt-2 transition"
                        >
                          <MessageSquare className="size-3.5 shrink-0" /> Coordinate via WhatsApp
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex flex-col gap-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isProcessing}
                  className="w-full h-12 text-base font-semibold"
                >
                  {isProcessing ? 'Processing secure order...' : `Place Secure Order (${formatPrice(grandTotal)})`}
                </Button>
                <Link
                  href="/shop"
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground justify-center transition"
                >
                  <ArrowLeft className="size-4" /> Back to Scent Library
                </Link>
              </div>

            </form>

            {/* Right Column Order Recap Summary */}
            <aside className="space-y-6">
              <div className="rounded-2xl border border-[#ece8e2] bg-[#fbf9f6] p-6 dark:border-[#252422] dark:bg-[#161513]">
                <h2 className="font-serif text-xl border-b border-[#ece8e2] pb-3 mb-4 dark:border-[#252422]">Order Summary</h2>

                {/* Items Summaries */}
                <ul className="divide-y divide-[#ece8e2]/60 dark:divide-[#252422]/60 max-h-[300px] overflow-y-auto pr-1">
                  {lines.map((line) => (
                    <li key={`${line.productId}-${line.variantId}`} className="py-3 flex gap-3.5">
                      <div className="relative size-16 overflow-hidden rounded-md bg-secondary shrink-0">
                        <Image
                          src={line.image || '/placeholder.svg'}
                          alt={line.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-semibold">{line.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{line.variantLabel}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Quantity: {line.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold font-serif text-right">{formatPrice(line.unitPrice * line.quantity)}</span>
                    </li>
                  ))}
                </ul>

                {/* Promo Code Input */}
                <form onSubmit={applyPromo} className="border-t border-b border-[#ece8e2] py-4 my-4 dark:border-[#252422]">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Discount / Gift Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 rounded-md border border-[#ece8e2] bg-background px-3 py-1.5 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                    />
                    <Button type="submit" variant="outline" size="sm" className="h-9 px-4">
                      Apply
                    </Button>
                  </div>
                  {promoError && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">✕ {promoError}</p>}
                  {promoSuccess && <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">✓ {promoSuccess}</p>}
                </form>

                {/* Pricing Breakdowns */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount ({appliedDiscount}%)</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Delivery</span>
                    <span className="font-medium">{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Taxes (8%)</span>
                    <span className="font-medium">{formatPrice(taxAmount)}</span>
                  </div>

                  <div className="flex justify-between border-t border-[#ece8e2] pt-3 mt-3 text-base font-bold text-foreground dark:border-[#252422]">
                    <span>Total Due</span>
                    <span className="font-serif text-lg">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="rounded-xl border border-[#ece8e2]/80 bg-[#f5f1ea]/30 p-5 dark:border-[#252422]/80 space-y-4">
                <div className="flex gap-3 text-xs">
                  <Truck className="size-5 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">Carbon-Neutral Shipping</p>
                    <p className="text-muted-foreground mt-0.5">Every order contributes to carbon offset projects at no extra cost to you.</p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs">
                  <Gift className="size-5 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">Pure Cotton & Eco Wax</p>
                    <p className="text-muted-foreground mt-0.5">Made with lead-free wicks, eco-friendly soy wax, and clean phthalate-free oils.</p>
                  </div>
                </div>
              </div>

            </aside>

          </div>
        </section>
      )}
    </div>
  )
}
