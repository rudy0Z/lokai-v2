import type { ReactNode } from 'react'
import { useState } from 'react'
import { useApp } from '../../lib/app-context'
import { cn } from '../../lib/cn'
import { ALL_LANGS, LANGUAGES } from '../../data/languages'
import { navigate } from '../../lib/router'
import { LogoMark } from './LogoMark'
import { CaseSidebar } from './CaseSidebar'
import { SandboxDrawer } from '../sandbox/SandboxDrawer'
import { IconMoon, IconPanelLeft, IconSun } from './icons'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, tr } = useApp()
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`${tr('themeLabel')}: ${theme}`}
      className={cn(
        // 44px target (deep-audit P2-11) — the toggle is used by older users
        'pressable inline-flex size-11 items-center justify-center rounded-full text-fg-secondary',
        className,
      )}
    >
      {theme === 'light' ? <IconMoon className="size-[18px]" /> : <IconSun className="size-[18px]" />}
    </button>
  )
}

export function LanguageSelect({ className }: { className?: string }) {
  const { lang, setLang, tr } = useApp()
  // honest grouping (deep-audit §6(e)): full languages vs interface preview
  const full = ALL_LANGS.filter((c) => LANGUAGES[c].coverage === 'full')
  const preview = ALL_LANGS.filter((c) => LANGUAGES[c].coverage !== 'full')
  return (
    <label className={cn('inline-flex items-center rounded-full bg-component px-2 py-0.5', className)}>
      <span className="sr-only">{tr('langLabel')}</span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as typeof lang)}
        aria-label={tr('langLabel')}
        className="min-h-11 cursor-pointer rounded-full bg-transparent px-1.5 text-sm font-medium text-fg-secondary focus-visible:outline-none"
      >
        <optgroup label={tr('langGroupFull')}>
          {full.map((c) => (
            <option key={c} value={c}>
              {LANGUAGES[c].short}
            </option>
          ))}
        </optgroup>
        <optgroup label={tr('langGroupPreview')}>
          {preview.map((c) => (
            <option key={c} value={c}>
              {LANGUAGES[c].short}
            </option>
          ))}
        </optgroup>
      </select>
    </label>
  )
}

/**
 * Desktop reviewer tour — moved into the Sandbox inspector (calm-authority
 * Phase 0): the consumer chat canvas carries zero floating meta-UI.
 */

export interface AppShellProps {
  /** deprecated - bottom tab bar removed for modern AI app pattern */
  activeTab?: never
  showTabs?: false
  topBarExtra?: ReactNode
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

/**
 * Mobile-prototype presentation: full-bleed on real phones, centered device
 * frame on desktop (this IS a mobile prototype — the frame stays), and
 * full-width across both segments when an iPhone Duo spans. Chrome floats
 * as translucent material (apple-design §12) inside the frame.
 * 
 * MODERNIZED: Bottom tab bar removed (ChatGPT/Gemini/Claude parity).
 * Uses hamburger menu for secondary features, contextual actions inline.
 */
export function AppShell({ topBarExtra, title, children, footer }: AppShellProps) {
  const { tr } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-dvh justify-center bg-page sm:items-center sm:py-6">
      <div
        data-app-frame
        className={
          'relative flex h-dvh w-full flex-col overflow-hidden bg-shell ' +
          'sm:h-[min(844px,calc(100dvh-3rem))] sm:w-[390px] sm:rounded-[2.25rem] sm:border sm:border-line-strong/70 sm:shadow-xl ' +
          '[@media(horizontal-viewport-segments:2)]:!h-dvh [@media(horizontal-viewport-segments:2)]:!w-full ' +
          '[@media(horizontal-viewport-segments:2)]:!rounded-none [@media(horizontal-viewport-segments:2)]:!border-0'
        }
      >
        {/* HEADER — weightless slim bar (calm-authority Phase 7): no gradient
            band; the language select sits in a tonal pill */}
        <header className="pointer-events-none z-30 flex items-center gap-2 px-4 pb-2 pt-[calc(0.75rem+env(safe-area-inset-top))]">
          <div className="pointer-events-auto flex min-w-0 shrink-0 items-center gap-2">
            {/* Hamburger menu for global nav (cases, sandbox, settings) */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label={tr('sidebarTitle')}
              className="pressable inline-flex size-11 shrink-0 items-center justify-center rounded-full text-fg-secondary hover:bg-hover-veil"
              style={{ minWidth: 'var(--touch-target)' }}
            >
              <IconPanelLeft className="size-[18px]" />
            </button>
            {title ? (
              <span className="min-w-0 truncate font-serif text-base font-semibold text-fg-primary">
                {title}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 rounded-lg py-1 transition-opacity hover:opacity-85"
              >
                <LogoMark />
                <span className="font-serif text-lg font-semibold tracking-[-0.01em] text-fg-primary">LokAI</span>
              </button>
            )}
          </div>
          <div className="pointer-events-auto ms-auto flex shrink-0 items-center gap-0.5">
            {topBarExtra && (
              <span className="hidden [@media(horizontal-viewport-segments:2)]:inline-flex">{topBarExtra}</span>
            )}
            <LanguageSelect />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col">{children}</main>

        {footer && (
          /* Phase 0: the composer sits snug above the home indicator — the
             4.9rem reserve died with the TabBar */
          <div className="relative z-20 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">{footer}</div>
        )}

        {/* BOTTOM SAFE AREA for iOS home indicator */}
        {!footer && <div aria-hidden="true" className="h-[env(safe-area-inset-bottom)] shrink-0" />}
        
        <SandboxDrawer />
        <CaseSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <p className="sr-only">{tr('roleLine')}</p>
      </div>
    </div>
  )
}
