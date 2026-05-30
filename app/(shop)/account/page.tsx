'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  User,
  ShoppingBag,
  Lock,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Award,
  Compass,
  Gift,
  LogOut,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  ChevronRight,
  Copy,
  Check,
  Eye,
  EyeOff
} from 'lucide-react'
import { formatPrice } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// Default mock orders to populate if a user is new or has no active orders, giving a rich immediate experience
const DEFAULT_MOCK_ORDERS: any[] = []

export default function AccountPage() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  
  // Auth view state
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  
  // Registration inputs
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regAddress, setRegAddress] = useState('')
  
  // Dashboard view tab
  const [activeTab, setActiveTab] = useState<'vip' | 'orders' | 'profile'>('vip')

  // Profile Form States
  const [profileName, setProfileName] = useState('')
  const [profilePhone, setProfilePhone] = useState('')
  const [profileAddress, setProfileAddress] = useState('')
  const [scentPreference, setScentPreference] = useState('Woodsy & Earthy')
  const [selectedMood, setSelectedMood] = useState('Calm')
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Orders list state
  const [orders, setOrders] = useState<any[]>([])

  // Clipboard copies
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    document.title = 'My Account · Craft Island'

    // Load active session from server
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
          setProfileName(data.user.name || '')
          setProfilePhone(data.user.phone || '')
          setProfileAddress(data.user.address || '')
          setScentPreference(data.user.scentPreference || 'Woodsy & Earthy')
          setSelectedMood(data.user.selectedMood || 'Calm')
          // Load orders
          loadUserOrders()
        }
      })
      .catch((e) => console.error('Session loading error:', e))
  }, [])

  const loadUserOrders = () => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) {
          const parsed = data.orders.map((o: any) => {
            const step = o.status === 'Delivered' ? 4 : 2
            return {
              ...o,
              trackingStep: step,
              paymentMethod: o.paymentMethod || 'UPI / Bank Transfer',
            }
          })
          setOrders(parsed)
        }
      })
      .catch((e) => console.error('Failed to load user orders:', e))
  }

  // Handle Copy Coupon Code
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Coupon code ${code} copied to clipboard!`)
    setTimeout(() => {
      setCopiedCode(null)
    }, 2000)
  }

  // Handle Mock Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) {
      toast.error('Please enter your email and password details.')
      return
    }

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password: loginPassword })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error)
          return
        }
        const signedUser = data.user
        setUser(signedUser)
        setProfileName(signedUser.name)
        setProfilePhone(signedUser.phone || '')
        setProfileAddress(signedUser.address || '')
        setScentPreference(signedUser.scentPreference || 'Woodsy & Earthy')
        setSelectedMood(signedUser.selectedMood || 'Calm')
        
        // Reload orders for this customer
        loadUserOrders()
        
        toast.success(`Welcome back, ${signedUser.name}!`)
      })
      .catch((err) => {
        console.error('Login error:', err)
        toast.error('Invalid email or password.')
      })
  }

  // Handle Mock Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!regName || !regEmail || !regPassword) {
      toast.error('Please fill in all required fields.')
      return
    }

    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        address: regAddress
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error)
          return
        }
        const newUser = data.user
        setUser(newUser)
        setProfileName(newUser.name)
        setProfilePhone(newUser.phone || '')
        setProfileAddress(newUser.address || '')
        setScentPreference(newUser.scentPreference || 'Fresh & Citrusy')
        setSelectedMood(newUser.selectedMood || 'Energized')
        setOrders([])
        toast.success(`Welcome to the Scent Club, ${newUser.name}!`)
      })
      .catch((err) => {
        console.error('Registration error:', err)
        toast.error('Failed to create account.')
      })
  }

  // Handle Profile Update
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)

    fetch('/api/auth/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: profileName,
        phone: profilePhone,
        address: profileAddress,
        scentPreference,
        selectedMood
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error)
          return
        }
        const updated = data.user
        setUser(updated)
        toast.success('Your scent profile and shipping preferences updated!')
      })
      .catch((err) => {
        console.error('Profile update failed:', err)
        toast.error('Failed to save profile changes.')
      })
      .finally(() => {
        setIsSavingProfile(false)
      })
  }

  // Handle Logout
  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST' })
      .then(() => {
        setUser(null)
        setLoginEmail('')
        setLoginPassword('')
        setOrders([])
        toast.success('Successfully signed out. Come back soon!')
      })
      .catch((e) => {
        console.error('Logout error:', e)
        toast.error('Failed to cleanly log out.')
      })
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#faf8f5] text-foreground dark:bg-[#121110] transition-colors py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* UNAUTHENTICATED LOGIN / REGISTER VIEW                                     */}
        {/* ========================================================================= */}
        {!user ? (
          <div className="mx-auto max-w-md bg-[#fbf9f6] border border-[#ece8e2] rounded-2xl p-8 shadow-xs dark:bg-[#161513] dark:border-[#252422] mt-4">
            
            {/* Header branding */}
            <div className="text-center mb-8">
              <div className="mx-auto flex justify-center mb-4">
                <Image
                  src="/logo.jpg"
                  alt="Craft Island Logo"
                  width={64}
                  height={64}
                  className="rounded-full object-cover border border-[#ece8e2] dark:border-[#252422]"
                />
              </div>
              <h1 className="font-serif text-3xl font-bold tracking-tight">Scent Club Login</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-2.5">
                Craft Island • Pure Hand-Poured Soy Cures
              </p>
            </div>

            {/* Auth Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 border-b border-[#ece8e2] pb-4 mb-6 dark:border-[#252422]">
              <button
                type="button"
                onClick={() => setAuthTab('login')}
                className={`py-2 text-sm font-semibold uppercase tracking-wider transition ${
                  authTab === 'login'
                    ? 'border-b-2 border-primary text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('register')}
                className={`py-2 text-sm font-semibold uppercase tracking-wider transition ${
                  authTab === 'register'
                    ? 'border-b-2 border-primary text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* SIGN IN VIEW */}
            {authTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. guest@craftisland.in"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background pl-9 pr-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background pl-9 pr-10 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-6 h-10 font-semibold tracking-wide uppercase text-xs">
                  Access Account
                </Button>

                {/* Guest credentials helper card */}
                <div className="rounded-lg border border-[#ece8e2]/80 bg-[#f5f1ea]/30 p-4 mt-6 text-xs text-muted-foreground dark:border-[#252422]/80 space-y-1">
                  <p className="font-semibold text-foreground flex items-center gap-1">
                    <Sparkles className="size-3.5 text-primary" /> Guest Testing Profile
                  </p>
                  <p>Skip signing up! Log in instantly using our demo account:</p>
                  <div className="pt-2 font-mono flex flex-col gap-0.5 text-[11px] text-foreground">
                    <p>Email: <span className="underline select-all">guest@craftisland.in</span></p>
                    <p>Password: <span className="underline select-all">password123</span></p>
                  </div>
                </div>
              </form>
            )}

            {/* CREATE ACCOUNT VIEW */}
            {authTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background pl-9 pr-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background pl-9 pr-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Create a strong password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background pl-9 pr-10 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="+91 99999 88888"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background pl-9 pr-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Shipping Address (Optional)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="12, Luxury Boulevard, New Delhi, DL"
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      className="w-full rounded-md border border-[#ece8e2] bg-background pl-9 pr-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground leading-relaxed">
                  By joining the Scent Club, you unlock VIP points on every pour purchase, early access to cured soy collections, and custom preference filters.
                </div>

                <Button type="submit" className="w-full mt-4 h-10 font-semibold tracking-wide uppercase text-xs">
                  Create Member Account
                </Button>
              </form>
            )}

          </div>
        ) : (
          
          // ========================================================================= 
          // AUTHENTICATED DASHBOARD VIEW                                              
          // ========================================================================= 
          <div className="space-y-8 animate-fade-in">
            
            {/* 1. Header greeting & Member Tier Card */}
            <div className="rounded-2xl border border-[#ece8e2] bg-gradient-to-br from-[#1c1a18] to-[#2e2a26] text-[#f7f5f0] p-8 shadow-sm dark:border-[#252422] dark:from-[#0d0c0b] dark:to-[#171614] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative size-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <User className="size-8 text-primary" />
                  <span className="absolute -bottom-1.5 -right-1.5 rounded-full bg-primary text-[9px] font-bold text-primary-foreground px-2 py-0.5 uppercase tracking-wide">
                    Gold
                  </span>
                </div>
                <div>
                  <h1 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight">
                    Greetings, {user.name}
                  </h1>
                  <p className="text-xs text-[#d3ceb7]/80 mt-1 uppercase tracking-widest font-semibold">
                    Gold VIP Scent Member • Member since {user.memberSince || 'May 2026'}
                  </p>
                </div>
              </div>

              {/* VIP Metric progress stats */}
              <div className="flex gap-8 border-t border-[#f7f5f0]/10 pt-6 md:border-t-0 md:pt-0">
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-widest text-[#d3ceb7]/80 font-bold">Loyalty Points</p>
                  <p className="text-3xl font-serif font-bold text-primary mt-1">{user.points || 275} <span className="text-xs text-[#d3ceb7]">PTS</span></p>
                </div>
                <div className="text-left shrink-0">
                  <p className="text-[10px] uppercase tracking-widest text-[#d3ceb7]/80 font-bold">Next Reward Status</p>
                  <p className="text-sm font-semibold text-primary-foreground mt-2 flex items-center gap-1.5">
                    <Gift className="size-4 text-primary shrink-0" /> 25 Points to Free Wick Trimmer
                  </p>
                  <div className="w-44 bg-[#f7f5f0]/15 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Menu Navigation and Primary Grid */}
            <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
              
              {/* Sidebar Menu Controls */}
              <aside className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('vip')}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium tracking-wide transition ${
                    activeTab === 'vip'
                      ? 'bg-[#ece8e2] text-foreground dark:bg-[#252422]'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Award className="size-4 text-primary" /> VIP Scent Club
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium tracking-wide transition ${
                    activeTab === 'orders'
                      ? 'bg-[#ece8e2] text-foreground dark:bg-[#252422]'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <ShoppingBag className="size-4 text-primary" /> Order History
                  {orders.length > 0 && (
                    <span className="ml-auto rounded-full bg-secondary border px-2 py-0.5 text-xs text-foreground font-semibold">
                      {orders.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium tracking-wide transition ${
                    activeTab === 'profile'
                      ? 'bg-[#ece8e2] text-foreground dark:bg-[#252422]'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Compass className="size-4 text-primary" /> Scent & Profile Info
                </button>

                <div className="h-px bg-[#ece8e2] my-4 dark:bg-[#252422]" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium tracking-wide text-red-500 hover:bg-red-50/20 dark:hover:bg-red-950/10 transition"
                >
                  <LogOut className="size-4 shrink-0" /> Sign Out Session
                </button>
              </aside>

              {/* Main Content Area */}
              <main className="min-h-[500px]">

                {/* ==================== TAB 1: VIP SCENT CLUB ==================== */}
                {activeTab === 'vip' && (
                  <div className="space-y-8 animate-fade-in">
                    
                    {/* Club summary introduction card */}
                    <div className="rounded-xl border border-[#ece8e2] bg-[#fbf9f6] p-6 dark:border-[#252422] dark:bg-[#161513]">
                      <h2 className="font-serif text-2xl font-bold flex items-center gap-2 mb-3">
                        <Sparkles className="size-5 text-primary shrink-0" /> Exclusive VIP Club Vouchers
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Copy these members-only premium promo vouchers and paste them at the basket summary drawer during checkout to claim your discounts and benefits.
                      </p>

                      {/* Vouchers list layout */}
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mt-6">
                        
                        {/* Voucher 1 */}
                        <div className="rounded-lg border border-dashed border-primary/50 bg-primary/5 p-4 text-center flex flex-col justify-between h-40">
                          <div>
                            <span className="inline-block rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 mb-2">
                              Gold Members
                            </span>
                            <h3 className="text-xl font-serif font-bold text-foreground">20% VIP Saving</h3>
                            <p className="text-xs text-muted-foreground mt-1">20% off all single pours</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyCode('CRAFT20')}
                            className="w-full bg-background border border-primary/30 hover:border-primary/60 text-xs font-bold py-1.5 rounded-md flex items-center justify-center gap-1.5 transition mt-3"
                          >
                            {copiedCode === 'CRAFT20' ? <><Check className="size-3.5 text-emerald-600" /> Copied</> : <><Copy className="size-3.5" /> Copy Code: CRAFT20</>}
                          </button>
                        </div>

                        {/* Voucher 2 */}
                        <div className="rounded-lg border border-dashed border-primary/50 bg-primary/5 p-4 text-center flex flex-col justify-between h-40">
                          <div>
                            <span className="inline-block rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 mb-2">
                              Point Perks
                            </span>
                            <h3 className="text-xl font-serif font-bold text-foreground">Free Travel Tin</h3>
                            <p className="text-xs text-muted-foreground mt-1">Free 4oz travel tin with order</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyCode('WELCOME10')}
                            className="w-full bg-background border border-primary/30 hover:border-primary/60 text-xs font-bold py-1.5 rounded-md flex items-center justify-center gap-1.5 transition mt-3"
                          >
                            {copiedCode === 'WELCOME10' ? <><Check className="size-3.5 text-emerald-600" /> Copied</> : <><Copy className="size-3.5" /> Copy Code: WELCOME10</>}
                          </button>
                        </div>

                        {/* Voucher 3 */}
                        <div className="rounded-lg border border-dashed border-primary/50 bg-primary/5 p-4 text-center flex flex-col justify-between h-40">
                          <div>
                            <span className="inline-block rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 mb-2">
                              Club Special
                            </span>
                            <h3 className="text-xl font-serif font-bold text-foreground">Free Shipping</h3>
                            <p className="text-xs text-muted-foreground mt-1">Complimentary Courier delivery</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyCode('CRAFTCLUB')}
                            className="w-full bg-background border border-primary/30 hover:border-primary/60 text-xs font-bold py-1.5 rounded-md flex items-center justify-center gap-1.5 transition mt-3"
                          >
                            {copiedCode === 'CRAFTCLUB' ? <><Check className="size-3.5 text-emerald-600" /> Copied</> : <><Copy className="size-3.5" /> Copy: CRAFTCLUB</>}
                          </button>
                        </div>

                      </div>
                    </div>

                    {/* Member benefits overview grids */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-semibold">Active Member Privileges</h3>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border border-[#ece8e2] bg-[#fbf9f6] p-5 dark:border-[#252422] dark:bg-[#161513]">
                          <Award className="size-6 text-primary mb-3" />
                          <h4 className="font-serif font-semibold text-sm">Early Access Cures</h4>
                          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                            Order next month’s seasonal collections two weeks before public release, guaranteeing yours before allocation finishes.
                          </p>
                        </div>

                        <div className="rounded-lg border border-[#ece8e2] bg-[#fbf9f6] p-5 dark:border-[#252422] dark:bg-[#161513]">
                          <Clock className="size-6 text-primary mb-3" />
                          <h4 className="font-serif font-semibold text-sm">Priority Cure Queue</h4>
                          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                            As a Gold VIP member, your pours bypass standard curation queues and are accelerated to the top of our stamping table.
                          </p>
                        </div>

                        <div className="rounded-lg border border-[#ece8e2] bg-[#fbf9f6] p-5 dark:border-[#252422] dark:bg-[#161513]">
                          <Truck className="size-6 text-primary mb-3" />
                          <h4 className="font-serif font-semibold text-sm">Carbon-Neutral Transits</h4>
                          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                            100% of the distribution transit offsets are entirely funded by our studio, delivering luxury wicks with zero guilt.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* ==================== TAB 2: ORDER HISTORY ==================== */}
                {activeTab === 'orders' && (
                  <div className="space-y-6 animate-fade-in">
                    <h2 className="font-serif text-2xl font-bold flex items-center gap-2 border-b border-[#ece8e2] pb-3 dark:border-[#252422]">
                      Your Scent Archive
                    </h2>

                    {orders.length === 0 ? (
                      <div className="rounded-xl border border-[#ece8e2] bg-[#fbf9f6] p-12 text-center dark:border-[#252422] dark:bg-[#161513]">
                        <ShoppingBag className="size-10 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-serif text-lg font-semibold">No candle orders found</h3>
                        <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-2 leading-relaxed">
                          Your archive is empty. Head to our scent library to select premium hand-poured soy jars.
                        </p>
                        <Button asChild className="mt-6 text-xs" size="sm">
                          <Link href="/shop">Explore Pours</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="rounded-xl border border-[#ece8e2] bg-[#fbf9f6] p-6 dark:border-[#252422] dark:bg-[#161513] space-y-5 shadow-2xs"
                          >
                            {/* Order general header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#ece8e2] pb-3 dark:border-[#252422] gap-3">
                              <div className="flex items-center gap-3">
                                <div>
                                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Order Reference</p>
                                  <p className="font-mono text-sm font-bold text-foreground mt-0.5">{order.id}</p>
                                </div>
                                <div className="border-l border-[#ece8e2] pl-3 dark:border-[#252422]">
                                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Date Placed</p>
                                  <p className="text-sm font-semibold mt-0.5">{order.date}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 self-start sm:self-auto">
                                <div className="text-right">
                                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Grand Total</p>
                                  <p className="font-serif text-base font-bold text-primary mt-0.5">
                                    {/* Handle formatted values if already formatted string or scale raw numeric cents/totals */}
                                    {typeof order.total === 'string' ? order.total : formatPrice(order.total)}
                                  </p>
                                </div>
                                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  order.trackingStep === 4
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-500'
                                    : 'bg-primary/10 text-primary ring-1 ring-primary/30'
                                }`}>
                                  {order.trackingStep === 4 ? 'Cure Finished' : 'Curing / Shipping'}
                                </span>
                              </div>
                            </div>

                            {/* Order Item details recap */}
                            <div className="text-sm">
                              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">Pours in Transit</p>
                              {order.itemsList && order.itemsList.length > 0 ? (
                                <ul className="divide-y divide-[#ece8e2]/60 dark:divide-[#252422]/60">
                                  {order.itemsList.map((item: any, idx: number) => (
                                    <li key={idx} className="py-2 flex justify-between text-xs font-semibold">
                                      <div>
                                        <span className="text-foreground">{item.name}</span>
                                        <span className="block text-[10px] text-muted-foreground mt-0.5">{item.variantLabel} x{item.quantity}</span>
                                      </div>
                                      <span className="font-serif">{formatPrice(item.unitPrice * item.quantity)}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-xs italic text-muted-foreground leading-relaxed">
                                  {order.items}
                                </p>
                              )}
                            </div>

                            {/* Live step-by-step visual tracker stepper */}
                            <div className="pt-2 border-t border-[#ece8e2]/60 dark:border-[#252422]/60">
                              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-4">Real-Time Scent Delivery Status</p>
                              
                              <div className="relative">
                                {/* Running progress horizontal line */}
                                <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#ece8e2] dark:bg-[#252422] -z-0">
                                  <div
                                    className="bg-primary h-0.5 transition-all duration-500"
                                    style={{
                                      width: `${((Math.max(1, order.trackingStep) - 1) / 3) * 100}%`
                                    }}
                                  ></div>
                                </div>

                                <div className="relative flex justify-between text-center -z-0">
                                  
                                  {/* Step 1: Hand poured */}
                                  <div className="flex flex-col items-center">
                                    <div className={`size-8 rounded-full flex items-center justify-center border font-bold text-xs bg-background transition ${
                                      order.trackingStep >= 1
                                        ? 'border-primary text-primary ring-2 ring-primary/10'
                                        : 'border-muted text-muted-foreground'
                                    }`}>
                                      {order.trackingStep >= 1 ? <CheckCircle2 className="size-4 shrink-0" /> : '1'}
                                    </div>
                                    <span className="text-[10px] font-bold text-foreground mt-2">Curing Soy</span>
                                    <span className="text-[8px] text-muted-foreground">Hand-poured</span>
                                  </div>

                                  {/* Step 2: Cured & Stamp */}
                                  <div className="flex flex-col items-center">
                                    <div className={`size-8 rounded-full flex items-center justify-center border font-bold text-xs bg-background transition ${
                                      order.trackingStep >= 2
                                        ? 'border-primary text-primary ring-2 ring-primary/10'
                                        : 'border-muted text-muted-foreground'
                                    }`}>
                                      {order.trackingStep >= 2 ? <CheckCircle2 className="size-4 shrink-0" /> : '2'}
                                    </div>
                                    <span className="text-[10px] font-bold text-foreground mt-2">Wicks Trimmed</span>
                                    <span className="text-[8px] text-muted-foreground">Stamped & wrapped</span>
                                  </div>

                                  {/* Step 3: Courier dispatch */}
                                  <div className="flex flex-col items-center">
                                    <div className={`size-8 rounded-full flex items-center justify-center border font-bold text-xs bg-background transition ${
                                      order.trackingStep >= 3
                                        ? 'border-primary text-primary ring-2 ring-primary/10'
                                        : 'border-muted text-muted-foreground'
                                    }`}>
                                      {order.trackingStep >= 3 ? <CheckCircle2 className="size-4 shrink-0" /> : '3'}
                                    </div>
                                    <span className="text-[10px] font-bold text-foreground mt-2">Eco-Courier</span>
                                    <span className="text-[8px] text-muted-foreground">Carbon-offset transit</span>
                                  </div>

                                  {/* Step 4: Arrived */}
                                  <div className="flex flex-col items-center">
                                    <div className={`size-8 rounded-full flex items-center justify-center border font-bold text-xs bg-background transition ${
                                      order.trackingStep >= 4
                                        ? 'border-primary text-primary ring-2 ring-primary/10'
                                        : 'border-muted text-muted-foreground'
                                    }`}>
                                      {order.trackingStep >= 4 ? <CheckCircle2 className="size-4 shrink-0" /> : '4'}
                                    </div>
                                    <span className="text-[10px] font-bold text-foreground mt-2">Arrived</span>
                                    <span className="text-[8px] text-muted-foreground">At your library</span>
                                  </div>

                                </div>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                )}

                {/* ==================== TAB 3: PROFILE & SCENT PREFERENCES ==================== */}
                {activeTab === 'profile' && (
                  <div className="space-y-8 animate-fade-in">
                    
                    {/* Scent Quiz/Personality Customizer */}
                    <div className="rounded-xl border border-[#ece8e2] bg-[#fbf9f6] p-6 dark:border-[#252422] dark:bg-[#161513]">
                      <h2 className="font-serif text-xl font-bold flex items-center gap-2 mb-2">
                        <Compass className="size-5 text-primary shrink-0" /> Personalized Scent Personality Quiz
                      </h2>
                      <p className="text-xs text-muted-foreground mb-6">
                        Customise your sensory catalog preferences. Craft Island dynamically selects recommendation wicks and early releases matching your profile.
                      </p>

                      <div className="grid gap-6 sm:grid-cols-2">
                        
                        {/* Preference 1 */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Favorite Scent Family</label>
                          <select
                            value={scentPreference}
                            onChange={(e) => setScentPreference(e.target.value)}
                            className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                          >
                            <option value="Woodsy & Earthy">Woodsy & Earthy (Oak, Cedarwood, Vetiver)</option>
                            <option value="Fresh & Citrusy">Fresh & Citrusy (Bergamot, Sea Salt, Sage)</option>
                            <option value="Floral & Herbal">Floral & Herbal (Rose, Lavender, Jasmine)</option>
                            <option value="Warm & Cozy">Warm & Cozy (Amber, Vanilla, Tobacco Leaves)</option>
                          </select>
                        </div>

                        {/* Preference 2 */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Desired Room Atmosphere</label>
                          <div className="grid grid-cols-3 gap-2">
                            {['Calm', 'Focused', 'Energized'].map((mood) => (
                              <button
                                key={mood}
                                type="button"
                                onClick={() => setSelectedMood(mood)}
                                className={`rounded-md border py-2 text-xs font-semibold uppercase tracking-wider transition ${
                                  selectedMood === mood
                                    ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                    : 'border-[#ece8e2] hover:border-primary/30 text-muted-foreground dark:border-[#252422]'
                                }`}
                              >
                                {mood}
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Standard Contact Details Editing Form */}
                    <form onSubmit={handleUpdateProfile} className="rounded-xl border border-[#ece8e2] bg-[#fbf9f6] p-6 dark:border-[#252422] dark:bg-[#161513] space-y-4">
                      <h3 className="font-serif text-lg font-semibold border-b border-[#ece8e2] pb-2 dark:border-[#252422]">
                        Customer Contact & Delivery Settings
                      </h3>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Full Name</label>
                          <input
                            type="text"
                            required
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Email Address (Read Only)</label>
                          <input
                            type="email"
                            disabled
                            value={user.email}
                            className="w-full rounded-md border border-[#ece8e2] bg-secondary/50 px-3 py-2 text-sm outline-none text-muted-foreground dark:border-[#252422] cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Phone Number</label>
                          <input
                            type="tel"
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Default Shipping Destination</label>
                          <input
                            type="text"
                            value={profileAddress}
                            onChange={(e) => setProfileAddress(e.target.value)}
                            className="w-full rounded-md border border-[#ece8e2] bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50 dark:border-[#252422]"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button type="submit" disabled={isSavingProfile} className="px-6 text-xs tracking-wider uppercase font-bold">
                          {isSavingProfile ? 'Saving Details...' : 'Save Profile Changes'}
                        </Button>
                      </div>
                    </form>

                  </div>
                )}

              </main>

            </div>

          </div>
        )}

      </div>
    </div>
  )
}
