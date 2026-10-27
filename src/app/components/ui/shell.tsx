import type { ReactNode } from 'react'
import { useState } from 'react'
import { useApp } from '../../lib/app-context'
import { cn } from '../../lib/cn'
import { ALL_LANGS, LANGUAGES } from '../../data/languages'
import { matterById } from '../../data/matters'
import { navigate } from '../../lib/router'
import { LogoMark } from './LogoMark'
import { CaseSidebar } from './CaseSidebar'
import { SandboxDrawer } from '../sandbox/SandboxDrawer'
import { TabBar, type TabId } from './TabBar'
import { IconFolder, IconMoon, IconPanelLeft, IconSun } from './icons'

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
    <label className={cn('inline-flex items-center', className)}>
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
 * Desktop reviewer tour — a quiet floating card in the margin OUTSIDE the
 * device frame (lg+): the six moments that matter, ~60 seconds.
 */
function ReviewerTour({ onUrdu }: { onUrdu: () => void }) {
  const stops: { n: string; label: string; go: () => void }[] = [
    { n: '01', label: 'Voice intake → review', go: () => navigate('/voice') },
    { n: '02', label: 'Golden refund journey', go: () => navigate('/?s=refund-golden') },
    { n: '03', label: 'Marathi notice reader', go: () => navigate('/notice') },
    { n: '04', label: 'Safety hard-stop', go: () => navigate('/?s=stop-eviction') },
    { n: '05', label: 'Urdu RTL', go: onUrdu },
    { n: '06', label: 'Type specimen', go: () => navigate('/specimen') },
  ]
  return (
    <aside className="pointer-events-none fixed start-8 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
      <div className="pointer-events-auto flex w-64 flex-col gap-1.5 rounded-3xl border border-line-subtle bg-shell/85 p-4 shadow-xl backdrop-blur-xl">
        <p className="font-serif text-sm font-semibold text-fg-primary">Reviewing the prototype?</p>
        <p className="mb-1.5 text-2xs leading-relaxed text-fg-tertiary">
          Six moments, about a minute. The phone is live — everything runs on mock data.
        </p>
        {stops.map((s) => (
          <button
            key={s.n}
            type="button"
            onClick={s.go}
            className="pressable flex min-h-11 items-center gap-2.5 rounded-xl px-2 text-start text-2xs font-medium text-fg-secondary transition-colors hover:bg-hover-veil"
          >
            <span className="font-mono text-2xs text-brand-fg">{s.n}</span>
            {s.label}
          </button>
        ))}
      </div>
    </aside>
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
  const { tr, setLang, activeCaseId } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const activeCase = activeCaseId ? matterById(activeCaseId) : undefined
  return (
    <div className="flex h-dvh justify-center bg-page sm:items-center sm:py-6">
      <ReviewerTour onUrdu={() => { setLang('ur'); navigate('/') }} />
      <div
        className={
          'relative flex h-dvh w-full flex-col overflow-hidden bg-shell ' +
          'sm:h-[min(844px,calc(100dvh-3rem))] sm:w-[390px] sm:rounded-[2.25rem] sm:border sm:border-line-strong/70 sm:shadow-xl ' +
          '[@media(horizontal-viewport-segments:2)]:!h-dvh [@media(horizontal-viewport-segments:2)]:!w-full ' +
          '[@media(horizontal-viewport-segments:2)]:!rounded-none [@media(horizontal-viewport-segments:2)]:!border-0'
        }
      >
        <header className="pointer-events-none z-30 flex items-center gap-2 bg-gradient-to-b from-shell via-shell/90 to-transparent px-4 pb-4 pt-[calc(0.75rem+env(safe-area-inset-top))]">
          <div className="pointer-events-auto flex min-w-0 items-center gap-2">
            {/* Case-Folder drawer toggle — the notebook icon, native chrome */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label={tr('sidebarTitle')}
              className="pressable inline-flex size-10 shrink-0 items-center justify-center rounded-full text-fg-secondary hover:bg-hover-veil"
            >
              <IconPanelLeft className="size-[18px]" />
            </button>
            <LogoMark />
            <span className="font-serif text-lg font-semibold tracking-[-0.01em] text-fg-primary">LokAI</span>
            {activeCase && (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label={tr('caseBadgeAria')}
                className="pressable flex min-w-0 items-center gap-1.5 rounded-full bg-sunken px-2.5 py-1"
              >
                <IconFolder className="size-3 shrink-0 text-brand-fg" />
                <span className="truncate font-mono text-2xs text-fg-secondary" lang={activeCase.lang}>
                  {activeCase.titleNative}
                </span>
              </button>
            )}
          </div>
          <div className="pointer-events-auto ms-auto flex shrink-0 items-center gap-0.5">
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
        <SandboxDrawer />
        <CaseSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <p className="sr-only">{tr('roleLine')}</p>
      </div>
    </div>
  )
}
