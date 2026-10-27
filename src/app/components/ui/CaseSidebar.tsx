import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useApp } from '../../lib/app-context'
import { navigate } from '../../lib/router'
import { MATTERS } from '../../data/matters'
import { cn } from '../../lib/cn'
import { IconFolder, IconPanelLeft, IconPlus, IconX } from './icons'

/**
 * The Case-Folder drawer (ChatGPT-Projects model) — rendered INSIDE the
 * device frame as a slide-over sheet, so it never breaks the 390px
 * prototype presentation. Ivory-garden calm by law: sunken warm wells,
 * a subtle folder glyph, monospace date stamps — no loud tier badges
 * (the status line is quiet mono text, the way a paper docket reads).
 */
export function CaseSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { tr, activeCaseId, setActiveCase, direction } = useApp()
  const [expanded, setExpanded] = useState<string | null>(null)

  const newDayChat = (id: string) => {
    setActiveCase(id)
    navigate('/')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 z-40 bg-scrim"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: direction === 'rtl' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: direction === 'rtl' ? '100%' : '-100%' }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 start-0 z-50 flex w-[86%] max-w-[320px] flex-col border-e border-line-default bg-shell shadow-xl"
            role="dialog"
            aria-label={tr('sidebarTitle')}
          >
            <div className="flex items-center justify-between px-4 pb-2 pt-[calc(0.9rem+env(safe-area-inset-top))]">
              <div>
                <h2 className="font-serif text-base font-semibold text-fg-primary">{tr('sidebarTitle')}</h2>
                <p className="mt-0.5 text-2xs text-fg-tertiary">{tr('sidebarHint')}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={tr('back')}
                className="pressable inline-flex size-11 items-center justify-center rounded-full text-fg-secondary hover:bg-hover-veil"
              >
                <IconX className="size-4" />
              </button>
            </div>

            <div className="scroll-calm flex-1 overflow-y-auto px-3 pb-6 pt-1">
              <div className="flex flex-col gap-1.5">
                {MATTERS.map((m) => {
                  const isActive = activeCaseId === m.id
                  const isOpen = expanded === m.id
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        'rounded-2xl transition-colors',
                        isActive ? 'bg-sunken' : 'bg-transparent hover:bg-component-hover',
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => (isOpen ? setExpanded(null) : setExpanded(m.id))}
                        aria-expanded={isOpen}
                        className="flex w-full items-start gap-2.5 px-3 py-3 text-start"
                      >
                        <IconFolder
                          className={cn(
                            'mt-0.5 size-4 shrink-0',
                            m.resolved ? 'text-fg-tertiary' : 'text-brand-fg',
                          )}
                        />
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              'block truncate text-sm',
                              m.resolved ? 'text-fg-secondary' : 'font-medium text-fg-primary',
                            )}
                            lang={m.lang}
                          >
                            {m.titleNative}
                            {m.resolved && <span className="ms-1.5 text-fg-tertiary">✓</span>}
                          </span>
                          {/* quiet mono docket line — no badges by design */}
                          <span className="mt-0.5 block truncate font-mono text-2xs text-fg-tertiary" lang="en">
                            {m.amount} · {m.statusLine}
                          </span>
                        </span>
                        <IconChevron isOpen={isOpen} />
                      </button>

                      {isOpen && (
                        <div className="px-3 pb-3">
                          {/* mono date stamps, the docket way */}
                          <div className="flex flex-wrap gap-1.5">
                            {m.days.map((d, i) => (
                              <button
                                key={d.id}
                                type="button"
                                onClick={() => {
                                  navigate(`/case/${m.id}/d/${i}`)
                                  onClose()
                                }}
                                className="rounded-full bg-card px-2.5 py-1 font-mono text-2xs text-fg-secondary transition-colors hover:bg-component-hover"
                                lang={m.lang}
                              >
                                {d.dateLabel}
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => newDayChat(m.id)}
                            className="mt-2 flex min-h-9 w-full items-center gap-1.5 rounded-xl px-2 text-start text-2xs font-medium text-brand-fg transition-colors hover:bg-hover-veil"
                          >
                            <IconPlus className="size-3.5" />
                            {tr('newDayChat')}
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="border-t border-line-subtle px-4 py-3">
              <button
                type="button"
                onClick={() => {
                  setActiveCase(null)
                  onClose()
                }}
                className="pressable inline-flex min-h-9 items-center gap-1.5 rounded-full text-2xs text-fg-tertiary hover:text-fg-secondary"
              >
                <IconPanelLeft className="size-3.5" />
                {tr('tabHome')} — {tr('chipOther')}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function IconChevron({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      className={cn('mt-1 shrink-0 text-fg-tertiary transition-transform', isOpen && 'rotate-90')}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </span>
  )
}
