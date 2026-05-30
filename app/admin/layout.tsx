import type { ReactNode } from 'react'

export const metadata = {
  title: 'Admin Dashboard · Craft Island',
  description: 'Manage inventory, stock levels, and view business analytics for Craft Island.',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#121110]">
      {children}
    </div>
  )
}
