'use client'

import { useState, useEffect } from 'react'
import { Leaf, Flame, Recycle, Truck, Sparkles, Heart, Gift, Award, HelpCircle } from 'lucide-react'
import { DEFAULT_HOMEPAGE_SETTINGS } from '@/lib/settings'

const ICON_MAP: Record<string, any> = {
  Leaf,
  Flame,
  Recycle,
  Truck,
  Sparkles,
  Heart,
  Gift,
  Award,
}

function getIcon(name: string) {
  return ICON_MAP[name] || HelpCircle
}

export function ValueProps() {
  const [settings, setSettings] = useState(DEFAULT_HOMEPAGE_SETTINGS)

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings({ ...DEFAULT_HOMEPAGE_SETTINGS, ...data.settings })
        }
      })
      .catch((e) => console.error('Failed to fetch props settings:', e))
  }, [])

  const props = [
    { icon: getIcon(settings.prop1Icon), title: settings.prop1Title, desc: settings.prop1Desc },
    { icon: getIcon(settings.prop2Icon), title: settings.prop2Title, desc: settings.prop2Desc },
    { icon: getIcon(settings.prop3Icon), title: settings.prop3Title, desc: settings.prop3Desc },
    { icon: getIcon(settings.prop4Icon), title: settings.prop4Title, desc: settings.prop4Desc },
  ]

  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        {props.map((p, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary">
              <p.icon className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{p.title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground text-pretty">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
