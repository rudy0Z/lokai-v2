import { useApp } from '../lib/app-context'
import { AppShell } from '../components/ui/shell'
import { Badge } from '../components/ui/Badge'
import { isVaultCleared, getMatterLog } from '../lib/vault'
import { formatDate } from '../lib/format'
import { MatterFolder } from '../components/documents/MatterFolder'
import { ExhibitPaper } from '../components/documents/ExhibitPaper'

const EXHIBITS = [
  { id: 'e1', name: 'bill-homekart.pdf' },
  { id: 'e2', name: 'photo-when-opened.jpg' },
  { id: 'e3', name: 'demand-notice-draft.txt' },
]

const SAVED = [
  { id: 's1', kind: 'Finding', title: 'Cracked on arrival is a product defect', meta: 'CPA 2019 · S. 2(10) [VERIFY]' },
  { id: 's2', kind: 'Draft', title: 'WhatsApp message to HomeKart', meta: 'Editable · copied once' },
]

export default function SavedPage() {
  const { tr } = useApp()
  const cleared = isVaultCleared()
  const exhibits = cleared ? [] : EXHIBITS
  const saved = cleared ? [] : SAVED
  const userSaved = getMatterLog().saved ?? []
  return (
    <AppShell activeTab="saved">
      <div className="scroll-calm flex-1 overflow-y-auto px-4 pt-5">
        <div className="mx-auto flex max-w-[340px] flex-col gap-4 pb-4">
          <h1 className="font-serif text-xl font-semibold text-fg-primary">{tr('savedTitle')}</h1>

          {cleared ? (
            <p className="text-sm text-fg-tertiary">{tr('emptySaved')}</p>
          ) : (
            <>
              <MatterFolder exhibits={exhibits} />

              <section className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-fg-primary">{tr('exhibitsLabel')}</h2>
                <div className="grid grid-cols-2 gap-2.5">
                  {exhibits.map((ex) => (
                    <ExhibitPaper key={ex.id} name={ex.name} />
                  ))}
                </div>
                <p className="text-2xs text-fg-tertiary" lang="en">
                  Mock exhibits — this prototype stores nothing and uploads nothing.
                </p>
              </section>

              <section className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-fg-primary">{tr('savedTitle')}</h2>
                {saved.map((s) => (
                  <div key={s.id} className="rounded-[22px] bg-card p-4">
                    <Badge tone="neutral" variant="outline" lang="en">{s.kind}</Badge>
                    <p className="mt-2 text-sm font-medium text-fg-primary" lang="en">{s.title}</p>
                    <p className="mt-0.5 font-mono text-2xs text-fg-tertiary" lang="en">{s.meta}</p>
                  </div>
                ))}
              </section>
            </>
          )}

          {/* items the user saved themselves via the closure card (§6c) —
              real device-local records, shown even after a demo-data wipe */}
          {userSaved.length > 0 && (
            <section className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold text-fg-primary">{tr('savedFromChat')}</h2>
              {userSaved.map((s, i) => (
                <div key={`${s.savedAt}-${i}`} className="rounded-[22px] bg-card p-4">
                  <p className="text-sm font-medium text-fg-primary">{s.title}</p>
                  <p className="mt-0.5 font-mono text-2xs text-fg-tertiary">{formatDate(s.savedAt)}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </AppShell>
  )
}
