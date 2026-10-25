import { useApp } from '../lib/app-context'
import { AppShell } from '../components/ui/shell'
import { Badge } from '../components/ui/Badge'
import { IconBookmark } from '../components/ui/icons'

interface SavedEntry {
  id: string
  kind: string
  title: string
  meta: string
}

const SAVED: SavedEntry[] = [
  { id: 's1', kind: 'Finding', title: 'Cracked on arrival is a product defect', meta: 'CPA 2019 · S. 2(10) [VERIFY]' },
  { id: 's2', kind: 'Draft', title: 'WhatsApp message to HomeKart', meta: 'Editable · copied once' },
]

export default function SavedPage() {
  const { tr } = useApp()
  return (
    <AppShell activeTab="saved">
      <div className="scroll-calm flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto flex max-w-[340px] flex-col gap-3">
          <h1 className="font-serif text-xl font-semibold text-fg-primary">{tr('savedTitle')}</h1>
          {SAVED.length === 0 && <p className="text-sm text-fg-tertiary">{tr('emptySaved')}</p>}
          {SAVED.map((s) => (
            <div key={s.id} className="rounded-2xl border border-line-default bg-card p-4">
              <div className="flex items-center gap-2">
                <IconBookmark className="size-4 text-brand-fg" />
                <Badge tone="neutral" variant="outline" lang="en">{s.kind}</Badge>
              </div>
              <p className="mt-2 text-sm font-medium text-fg-primary" lang="en">{s.title}</p>
              <p className="mt-0.5 font-mono text-2xs text-fg-tertiary" lang="en">{s.meta}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
