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
 * Mobile-prototype presentation: full-bleed on real phones, centered device
 * frame on desktop (this IS a mobile prototype — the frame stays), and
 * full-width across both segments when an iPhone Duo spans. Chrome floats
 * as translucent material (apple-design §12) inside the frame.
 */
export function AppShell({ activeTab = 'home', showTabs = true, topBarExtra, children, footer }: AppShellProps) {
  const { tr } = useApp()
  return (
    <div className="flex h-dvh justify-center bg-page sm:items-center sm:py-6">
      <div
        className={
          'relative flex h-dvh w-full flex-col overflow-hidden bg-shell ' +
          'sm:h-[min(844px,calc(100dvh-3rem))] sm:w-[390px] sm:rounded-[2.25rem] sm:border sm:border-line-strong/70 sm:shadow-xl ' +
          '[@media(horizontal-viewport-segments:2)]:!h-dvh [@media(horizontal-viewport-segments:2)]:!w-full ' +
          '[@media(horizontal-viewport-segments:2)]:!rounded-none [@media(horizontal-viewport-segments:2)]:!border-0'
        }
      >
        <header className="pointer-events-none z-30 flex items-center gap-2 bg-gradient-to-b from-shell via-shell/90 to-transparent px-4 pb-4 pt-[calc(0.75rem+env(safe-area-inset-top))]">
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
    </div>
  )
}
