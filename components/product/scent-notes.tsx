import type { ScentNote } from '@/lib/types'

const layers: { key: keyof ScentNote; label: string; hint: string }[] = [
  { key: 'top', label: 'Top Notes', hint: 'The first impression' },
  { key: 'heart', label: 'Heart Notes', hint: 'The character' },
  { key: 'base', label: 'Base Notes', hint: 'The lasting finish' },
]

export function ScentNotes({ notes }: { notes: ScentNote }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
      {layers.map((layer) => (
        <div key={layer.key} className="bg-card p-6">
          <p className="text-xs uppercase tracking-wider text-primary">{layer.label}</p>
          <p className="text-xs text-muted-foreground">{layer.hint}</p>
          <ul className="mt-3 flex flex-col gap-1.5">
            {notes[layer.key].map((note) => (
              <li key={note} className="font-serif text-lg">{note}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
