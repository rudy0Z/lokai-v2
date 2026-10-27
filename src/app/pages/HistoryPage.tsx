import { useApp } from '../lib/app-context'
import { navigate } from '../lib/router'
import { isVaultCleared } from '../lib/vault'
import { AppShell } from '../components/ui/shell'
import { Badge } from '../components/ui/Badge'
import { IconDoc } from '../components/ui/icons'

interface HistoryEntry {
  id: string
  title: string
  when: string
  tier: 'consumer' | 'notice' | 'stop'
}

const HISTORY: HistoryEntry[] = [
  { id: 'h1', title: 'Mixer grinder — refund refused', when: 'Today, 10:24', tier: 'consumer' },
  { id: 'h2', title: 'Property-tax demand (Marathi notice)', when: 'Yesterday', tier: 'notice' },
  { id: 'h3', title: 'Eviction letter from landlord', when: '12 Oct', tier: 'stop' },
]

const tierBadge = { consumer: 'brand', notice: 'neutral', stop: 'warning' } as const

export default function HistoryPage() {
  const { tr } = useApp()
  const entries = isVaultCleared() ? [] : HISTORY
  return (
    <AppShell activeTab="history">
      <div className="scroll-calm flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto flex max-w-[340px] flex-col gap-3">
          <h1 className="font-serif text-xl font-semibold text-fg-primary">{tr('historyTitle')}</h1>
          {entries.length === 0 && <p className="text-sm text-fg-tertiary">{tr('emptyHistory')}</p>}
          {entries.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => navigate(`/matter/${h.id}`)}
              className="pressable flex items-center gap-3 bg-card rounded-2xl p-4 text-start transition-colors"
            >
              <IconDoc className="size-5 shrink-0 text-fg-tertiary" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-fg-primary" lang="en">
                  {h.title}
                </span>
                <span className="text-2xs text-fg-tertiary" lang="en">
                  {h.when}
                </span>
              </span>
              <Badge tone={tierBadge[h.tier]} variant="outline">
                {h.tier === 'consumer' ? tr('tierProceed') : h.tier === 'notice' ? tr('chipNotice') : tr('tierHardStop')}
              </Badge>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
