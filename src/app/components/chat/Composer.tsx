import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { toast } from 'sonner'
import { useApp } from '../../lib/app-context'
import { cn } from '../../lib/cn'
import { IconDoc, IconPaperclip, IconSend, IconX } from '../ui/icons'

export interface ComposerProps {
  onSend: (text: string, attachments: string[]) => void
  disabled?: boolean
  offline?: boolean
  attachments: string[]
  onAttach: (name: string) => void
  onRemoveAttachment: (name: string) => void
}

const MOCK_DOCS = ['bill-homekart.pdf', 'photo-when-opened.jpg']

/**
 * Large rounded composer (ChatGPT/Gemini register) with a MOCK attachment
 * tray — real file inputs are forbidden by the verify gate.
 */
export function Composer({ onSend, disabled, offline, attachments, onAttach, onRemoveAttachment }: ComposerProps) {
  const { tr } = useApp()
  const [text, setText] = useState('')
  const [trayOpen, setTrayOpen] = useState(false)
  const areaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = areaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [text])

  const submit = () => {
    const value = text.trim()
    if (!value || disabled || offline) return
    onSend(value, attachments)
    setText('')
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {trayOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute inset-x-0 bottom-full mb-2 rounded-2xl border border-line-default bg-modal p-3 shadow-large"
            role="dialog"
            aria-label={tr('attachTitle')}
          >
            <p className="text-2xs font-semibold text-fg-primary">{tr('attachTitle')}</p>
            <p className="mt-0.5 text-2xs text-fg-tertiary">{tr('attachHint')}</p>
            <div className="mt-2 flex flex-col gap-1">
              {MOCK_DOCS.map((doc) => (
                <button
                  key={doc}
                  type="button"
                  onClick={() => {
                    onAttach(doc)
                    setTrayOpen(false)
                  }}
                  className="flex min-h-11 items-center gap-2.5 rounded-lg px-2 text-start hover:bg-hover-veil"
                >
                  <IconDoc className="size-4 shrink-0 text-fg-tertiary" />
                  <span className="text-sm text-fg-primary">{doc}</span>
                  <span className="text-2xs text-fg-tertiary">(mock)</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          'rounded-3xl border bg-container p-2 transition-colors',
          offline ? 'border-line-default opacity-60' : 'border-line-default focus-within:border-brand-line',
        )}
      >
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-1 pt-1">
            {attachments.map((a) => (
              <span
                key={a}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-sunken px-2.5 text-2xs text-fg-secondary"
              >
                <IconDoc className="size-3.5" />
                {a}
                <button
                  type="button"
                  aria-label={`${tr('discard')} ${a}`}
                  onClick={() => onRemoveAttachment(a)}
                  className="rounded-full p-0.5 text-fg-tertiary hover:text-fg-primary"
                >
                  <IconX className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end gap-1.5">
          <button
            type="button"
            aria-label={tr('composerAttach')}
            disabled={disabled || offline}
            onClick={() => setTrayOpen((v) => !v)}
            className="mb-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-fg-tertiary transition-colors hover:bg-hover-veil hover:text-fg-primary disabled:opacity-40"
          >
            <IconPaperclip className="size-5" />
          </button>

          <textarea
            ref={areaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submit()
              }
            }}
            rows={1}
            disabled={disabled || offline}
            placeholder={offline ? tr('offlineBanner') : tr('composerPlaceholder')}
            aria-label={tr('composerPlaceholder')}
            className="max-h-[140px] flex-1 resize-none bg-transparent py-2.5 text-sm text-fg-primary placeholder:text-fg-tertiary focus:outline-none"
          />

          <button
            type="button"
            aria-label={tr('composerSend')}
            disabled={disabled || offline || text.trim() === ''}
            onClick={submit}
            className={cn(
              'mb-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors',
              text.trim() === '' || disabled || offline
                ? 'bg-sunken text-fg-disabled'
                : 'bg-brand-solid text-on-brand-solid hover:bg-brand-solid-hover shadow-default',
            )}
          >
            <IconSend className="size-5" />
          </button>
        </div>
      </div>
      {disabled && (
        <p className="mt-1.5 px-2 text-2xs text-fg-tertiary" role="status">
          <TypingHint />
        </p>
      )}
    </div>
  )
}

function TypingHint() {
  const { tr } = useApp()
  return <>{tr('stageWriting')}…</>
}

/** tiny helper so gallery can trigger a copy toast without sonner imports */
export function copiedToast(label: string) {
  toast.success(label)
}
