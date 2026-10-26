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

/**
 * Floating glass tab bar (apple-design material §12) — anchored inside the
 * device frame (absolute, not fixed), so it stays within the prototype
 * presentation on desktop and full-bleed on phones.
 */
export function TabBar({ active }: { active: TabId }) {
  const { tr } = useApp()
  return (
    <nav
      aria-label={tr('navLabel')}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center pb-[calc(0.875rem+env(safe-area-inset-bottom))]"
    >
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/30 bg-shell/70 p-1.5 shadow-large backdrop-blur-2xl">
        {TABS.map(({ id, path, icon: Icon, labelKey }) => {
          const isActive = id === active
          return (
            <button
              key={id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => navigate(path)}
              className={cn(
                'pressable flex min-h-11 min-w-[4.25rem] flex-col items-center justify-center gap-0.5 rounded-full px-3 transition-colors duration-150',
                isActive
                  ? 'bg-brand-solid text-on-brand-solid'
                  : 'text-fg-tertiary',
              )}
            >
              <Icon className="size-5" strokeWidth={isActive ? 2 : 1.75} />
              <span className="text-2xs font-medium">{tr(labelKey)}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
