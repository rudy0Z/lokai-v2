import type { ReactNode } from 'react'
import { useApp } from '../../lib/app-context'
import { cn } from '../../lib/cn'
import { BrandLockup } from './LogoMark'
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
        'inline-flex size-9 items-center justify-center rounded-lg text-fg-secondary transition-colors hover:bg-hover-veil',
        className,
      )}
    >
      {theme === 'light' ? <IconMoon className="size-4" /> : <IconSun className="size-4" />}
    </button>
  )
}

export function LanguageSelect({ className }: { className?: string }) {
  const { lang, setLang, tr } = useApp()
  return (
    <label className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="sr-only">{tr('langLabel')}</span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as typeof lang)}
        aria-label={tr('langLabel')}
        className="min-h-9 cursor-pointer rounded-full border border-line-default bg-container px-2.5 py-1 text-2xs font-medium text-fg-primary focus-visible:border-brand-line focus-visible:outline-none"
      >
        <option value="en">EN</option>
        <option value="hi">हिं</option>
        <option value="mr">मरा</option>
        <option value="ta">தமி</option>
        <option value="ur">اردو</option>
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
  /** full-bleed main (no horizontal padding) — flows manage their own */
  bare?: boolean
}

/**
 * The 390px framed prototype shell: full-bleed on small screens, centered
 * quiet frame on desktop. Top bar = brand + language + theme; bottom =
 * composer/footer and, on app surfaces, the tab bar.
 */
export function AppShell({ activeTab = 'home', showTabs = true, topBarExtra, children, footer }: AppShellProps) {
  const { tr } = useApp()
  return (
    <div className="flex h-dvh justify-center overflow-hidden bg-page">
      <div className="flex h-dvh w-full max-w-[390px] flex-col bg-shell sm:my-6 sm:h-[min(844px,calc(100dvh-3rem))] sm:rounded-3xl sm:border sm:border-line-default sm:shadow-xl overflow-hidden">
        <header className="flex items-center gap-2 border-b border-line-subtle bg-shell px-3 py-2.5">
          <BrandLockup tagline={tr('roleLine')} />
          <div className="ms-auto flex items-center gap-1.5">
            {topBarExtra}
            <LanguageSelect />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        {footer && (
          <div className="border-t border-line-subtle bg-shell px-3 py-2.5">{footer}</div>
        )}
        {showTabs && <TabBar active={activeTab} />}
      </div>
    </div>
  )
}
