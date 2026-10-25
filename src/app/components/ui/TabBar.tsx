import { navigate } from '../../lib/router'
import { cn } from '../../lib/cn'
import { useApp } from '../../lib/app-context'
import { IconBookmark, IconClock, IconHome, IconUser } from './icons'

const TABS = [
  { id: 'home', path: '/', icon: IconHome, labelKey: 'tabHome' },
  { id: 'history', path: '/history', icon: IconClock, labelKey: 'tabHistory' },
  { id: 'saved', path: '/saved', icon: IconBookmark, labelKey: 'tabSaved' },
  { id: 'profile', path: '/profile', icon: IconUser, labelKey: 'tabProfile' },
] as const

export type TabId = (typeof TABS)[number]['id']

/** Bottom tab bar — the only global navigation (DESIGN.md). */
export function TabBar({ active }: { active: TabId }) {
  const { tr } = useApp()
  return (
    <nav
      aria-label={tr('navLabel')}
      className="flex items-stretch justify-around border-t border-line-subtle bg-shell px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
    >
      {TABS.map(({ id, path, icon: Icon, labelKey }) => {
        const isActive = id === active
        return (
          <button
            key={id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => navigate(path)}
            className={cn(
              'flex min-h-11 min-w-16 flex-col items-center justify-center gap-0.5 rounded-xl px-2 transition-colors',
              isActive ? 'text-brand-fg' : 'text-fg-tertiary hover:text-fg-secondary',
            )}
          >
            <Icon className="size-5" strokeWidth={isActive ? 2 : 1.75} />
            <span className={cn('text-2xs', isActive && 'font-semibold')}>{tr(labelKey)}</span>
          </button>
        )
      })}
    </nav>
  )
}
