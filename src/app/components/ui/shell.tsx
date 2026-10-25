import type { ReactNode } from 'react'
import { useApp } from '../../lib/app-context'
import { cn } from '../../lib/cn'
import { LANG_OPTIONS } from '../../data/languages'
import { LogoMark } from './LogoMark'
import { TabBar, type TabId } from './TabBar'
import { IconMoon, IconSun } from './icons'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, tr } = useApp()
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`${tr('themeLabel')}: ${theme}`}
      className={cn(
        'pressable inline-flex size-10 items-center justify-center rounded-full text-fg-secondary',
        className,
      )}
    >
      {theme === 'light' ? <IconMoon className="size-[18px]" /> : <IconSun className="size-[18px]" />}
    </button>
  )
}

export function LanguageSelect({ className }: { className?: string }) {
  const { lang, setLang, tr } = useApp()
  return (
    <label className={cn('inline-flex items-center', className)}>
      <span className="sr-only">{tr('langLabel')}</span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as typeof lang)}
        aria-label={tr('langLabel')}
        className="h-10 cursor-pointer rounded-full bg-transparent px-1.5 text-sm font-medium text-fg-secondary focus-visible:outline-none"
      >
        {Object.values(LANG_OPTIONS).map((o) => (
          <option key={o.code} value={o.code}>
            {o.short}
          </option>
        ))}
      </select>
    </label>
  )
}

export interface AppShellProps {
  activeTab?: TabId
  showTabs?: boolean
  topBarExtra?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

/**
 * Full-bleed app surface — no frame, no box (2026 reference standard).
 * Chrome floats as translucent material (apple-design §12); content runs
 * edge to edge beneath it. dvh + safe-area aware.
 */
export function AppShell({ activeTab = 'home', showTabs = true, topBarExtra, children, footer }: AppShellProps) {
  const { tr } = useApp()
  return (
    <div className="flex h-dvh flex-col bg-shell">
      <header className="pointer-events-none sticky top-0 z-30 flex items-center gap-2 bg-gradient-to-b from-shell via-shell/90 to-transparent px-4 pb-4 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <div className="pointer-events-auto flex items-center gap-2.5">
          <LogoMark />
          <span className="font-serif text-lg font-semibold tracking-[-0.01em] text-fg-primary">LokAI</span>
        </div>
        <div className="pointer-events-auto ms-auto flex items-center gap-0.5">
          {topBarExtra}
          <LanguageSelect />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">{children}</main>

      {footer && (
        <div className="relative z-20 px-4 pb-[calc(6.25rem+env(safe-area-inset-bottom))]">{footer}</div>
      )}
      {showTabs && <TabBar active={activeTab} />}
      {!footer && showTabs && <div aria-hidden="true" className="h-[6.25rem] shrink-0" />}
      <p className="sr-only">{tr('roleLine')}</p>
    </div>
  )
}
