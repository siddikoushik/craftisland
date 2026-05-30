import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function SectionHeading({
  eyebrow,
  title,
  description,
  linkHref,
  linkLabel,
}: {
  eyebrow?: string
  title: string
  description?: string
  linkHref?: string
  linkLabel?: string
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
        )}
        <h2 className="mt-2 font-serif text-3xl text-balance sm:text-4xl">{title}</h2>
        {description && (
          <p className="mt-3 text-muted-foreground leading-relaxed text-pretty">{description}</p>
        )}
      </div>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary"
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
