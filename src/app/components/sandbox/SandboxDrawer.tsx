import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { useApp } from '../../lib/app-context'
import { navigate, useHashRoute } from '../../lib/router'
import { INTERACTIVE_SCENARIOS } from '../../data/interactive-scenarios'
import { REPLAY_SCRIPTS } from '../../data/replays'
import { LANGUAGES, type LangCode } from '../../data/languages'
import { markVaultCleared } from '../../lib/vault'
import { cn } from '../../lib/cn'
import { IconSparkle, IconX } from '../ui/icons'

type Tab = 'scenarios' | 'replays' | 'inspector'

/**
 * The floating "Recruiter & Dev Sandbox" — a glass HUD pill docked low in
 * the frame, deliberately SEPARATE from LokAI's native product chrome so a
 * reviewer never mistakes meta-controls for the consumer UI. Three tabs:
 * live branching scenarios (with an upfront language selector), the scripted
 * replays, and the system inspector.
 */
const TIER_1_LANGS: LangCode[] = ['en', 'hi', 'mr', 'ta', 'ur']
const TIER_2_LANGS: LangCode[] = ['bn', 'gu', 'kn', 'ml', 'or', 'pa', 'te']

const SCENARIO_META: Record<string, { domain: string; law: string; tag: string }> = {
  scn1: { domain: 'E-Commerce Refund', law: 'CPA 2019 · E-Commerce Rules', tag: '₹8,999' },
  scn2: { domain: 'Landlord Deposit', law: 'Sec 108(m) Transfer of Property Act', tag: '₹35,000' },
  scn3: { domain: 'Municipal Tax Notice', law: '15-Day Objection Window · S. 149', tag: '₹18,450' },
  scn4: { domain: 'Wrong UPI & Salary', law: 'Sec 72 Contract Act / Labour Portal', tag: '₹12k / ₹68k' },
  scn5: { domain: 'Domestic Safety Stop', law: 'Immediate Stop · 181 / 112 / DLSA', tag: 'Safety Stop' },
}

export function SandboxDrawer() {
  const { tr, setLang } = useApp()
  const { path } = useHashRoute()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('scenarios')
  const [testLang, setTestLang] = useState<LangCode>('en')

  // during a replay takeover the drawer steps aside — the player owns chrome
  if (path.startsWith('/replay')) return null

  const launch = (id: string) => {
    setLang(testLang)
    setOpen(false)
    navigate(`/?s=${id}`)
  }

  const resetVault = () => {
    try {
      window.localStorage.clear()
      window.sessionStorage.clear()
    } catch {
      /* ignore */
    }
    markVaultCleared()
    toast.success(tr('vaultResetDone'))
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'scenarios', label: tr('tabScenarios') },
    { id: 'replays', label: tr('tabReplays') },
    { id: 'inspector', label: tr('tabInspector') },
  ]

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="pressable absolute bottom-[calc(5.25rem+env(safe-area-inset-bottom))] end-3.5 z-40 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/20 bg-standout/95 px-3.5 py-2 font-mono text-2xs font-medium text-fg-on-inverted shadow-large backdrop-blur-md"
      >
        <IconSparkle className="size-3.5" />
        {tr('sandboxTitle')}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-[calc(7.8rem+env(safe-area-inset-bottom))] start-3 z-50 flex max-h-[72%] w-[330px] flex-col overflow-hidden rounded-[22px] border border-line-default bg-shell shadow-xl"
            role="dialog"
            aria-label={tr('sandboxTitle')}
          >
            <div className="flex items-center justify-between border-b border-line-subtle px-3 py-2">
              <span className="font-mono text-2xs font-semibold text-fg-secondary">{tr('sandboxTitle')}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={tr('back')}
                className="pressable inline-flex size-8 items-center justify-center rounded-full text-fg-secondary hover:bg-hover-veil"
              >
                <IconX className="size-3.5" />
              </button>
            </div>

            <div className="flex gap-1 border-b border-line-subtle px-3 py-1.5">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-pressed={tab === t.id}
                  className={cn(
                    'min-h-8 rounded-full px-2.5 text-2xs font-medium transition-colors',
                    tab === t.id ? 'bg-brand-solid text-on-brand-solid' : 'text-fg-secondary hover:bg-hover-veil',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="scroll-calm flex-1 overflow-y-auto overscroll-contain px-3 py-2.5">
              {tab === 'scenarios' && (
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-2xs font-semibold text-fg-secondary">Tier 1 · Full Multi-Turn Simulation</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {TIER_1_LANGS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setTestLang(c)}
                          aria-pressed={testLang === c}
                          className={cn(
                            'min-h-8 rounded-full px-2.5 text-2xs font-medium transition-colors',
                            testLang === c ? 'bg-brand-solid text-on-brand-solid' : 'bg-container text-fg-primary hover:bg-component-hover',
                          )}
                          lang={c}
                        >
                          {LANGUAGES[c].short}
                          {c === 'en' ? ' · EN' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-2xs font-semibold text-fg-tertiary">Tier 2 · Script & Specimen Preview</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {TIER_2_LANGS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setTestLang(c)}
                          aria-pressed={testLang === c}
                          className={cn(
                            'min-h-8 rounded-full px-2.5 text-2xs font-medium transition-colors',
                            testLang === c ? 'bg-brand-solid text-on-brand-solid' : 'bg-container text-fg-primary hover:bg-component-hover',
                          )}
                          lang={c}
                        >
                          {LANGUAGES[c].short}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    {INTERACTIVE_SCENARIOS.map((s) => {
                      const meta = SCENARIO_META[s.id]
                      const title = tr(`scn${s.id.slice(3)}Title` as never)
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => launch(s.id)}
                          className="pressable rounded-[12px] border border-line-subtle bg-card px-3.5 py-2.5 text-start transition-colors hover:bg-component-hover"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-fg-primary">{meta?.domain ?? title}</span>
                            {meta?.tag && (
                              <span className="shrink-0 rounded-full bg-sunken px-2 py-0.5 font-mono text-2xs text-fg-secondary">
                                {meta.tag}
                              </span>
                            )}
                          </div>
                          <span className="mt-1 block text-2xs text-fg-secondary">
                            {title}
                          </span>
                          <span className="mt-0.5 block font-mono text-2xs text-brand-fg">
                            {meta?.law ?? s.outcome} · {LANGUAGES[testLang].english}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {tab === 'replays' && (
                <div className="flex flex-col gap-1.5">
                  {REPLAY_SCRIPTS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setOpen(false)
                        navigate(`/replay/${s.id}`)
                      }}
                      className="pressable rounded-[10px] bg-card px-3 py-2.5 text-start transition-colors hover:bg-component-hover"
                    >
                      <span className="block text-sm font-medium text-fg-primary" lang={s.lang}>
                        {s.label}
                      </span>
                      <span className="mt-0.5 block font-mono text-2xs text-fg-tertiary" lang="en">
                        {s.outcome} · {LANGUAGES[s.lang].english}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {tab === 'inspector' && (
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: 'Type specimen', go: () => navigate('/specimen') },
                    { label: 'Component gallery', go: () => navigate('/gallery') },
                    { label: 'Notice interpreter (Marathi scan)', go: () => navigate('/notice') },
                    { label: 'Scenario launcher (classic)', go: () => navigate('/dev') },
                  ].map((l) => (
                    <button
                      key={l.label}
                      type="button"
                      onClick={l.go}
                      className="min-h-10 rounded-[10px] bg-card px-3 text-start text-sm text-fg-primary transition-colors hover:bg-component-hover"
                      lang="en"
                    >
                      {l.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={resetVault}
                    className="min-h-10 rounded-[10px] px-3 text-start text-sm text-danger-fg transition-colors hover:bg-danger-subtle"
                    lang="en"
                  >
                    {tr('resetVault')}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
