import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { useApp } from '../../lib/app-context'
import { LogoMark } from '../ui/LogoMark'
import { IconPlay } from '../ui/icons'

export type MessageRole = 'user' | 'assistant' | 'system'

export interface VoiceMeta {
  /** monospace duration pill, e.g. '0:18' */
  duration: string
  edited?: boolean
}

export interface MessageBubbleProps {
  role: MessageRole
  children: ReactNode
  /** user message being edited / changed downstream */
  stale?: boolean
  onStaleAction?: () => void
  staleActionLabel?: string
  /** this user bubble is a chosen answer (Update affordance lives here) */
  isAnswer?: boolean
  /** quiet action row under assistant text (copy etc.) */
  actions?: ReactNode
  /** thread item id — lets the thread scroll this block's top into view */
  dataId?: number
  /** renders the simulated voice-note header above the text */
  voiceMeta?: VoiceMeta
  className?: string
}

/**
 * ChatGPT/Gemini-style asymmetry: user turns get a soft bubble on the end
 * side; assistant turns read as full-width document text (cards live inside
 * them); system notes are quiet centered chrome.
 */
const BAR_HEIGHTS = [38, 62, 90, 55, 78, 40, 95, 60, 84, 45, 70, 100, 52, 88, 42, 74, 58, 92, 48, 80, 36, 66, 90, 56]

/** Simulated voice-note header: play, 24-bar waveform, duration — honest by
 *  law (no audio exists; the progress is a timed visual, tagged by caption). */
function VoiceNoteHeader({ meta }: { meta: VoiceMeta }) {
  const { tr } = useApp()
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!playing) return
    const total = 18 // the simulated clip length in seconds
    const t = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 1) {
          setPlaying(false)
          return 0
        }
        return Math.min(1, p + 0.25 / total)
      })
    }, 250)
    return () => window.clearInterval(t)
  }, [playing])
  const filled = Math.round(progress * BAR_HEIGHTS.length)
  return (
    <div className="mb-2 flex flex-col gap-1.5 border-b border-dashed border-line-subtle pb-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          aria-pressed={playing}
          aria-label={playing ? tr('replayPause') : tr('replayPlay')}
          className="pressable flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-solid text-on-brand-solid"
        >
          {playing ? (
            <span className="flex gap-[3px]" aria-hidden="true">
              <span className="h-2.5 w-[3px] bg-current" />
              <span className="h-2.5 w-[3px] bg-current" />
            </span>
          ) : (
            <IconPlay className="size-3.5" />
          )}
        </button>
        <div className="flex h-7 min-w-0 flex-1 items-end gap-[2px]" aria-hidden="true">
          {BAR_HEIGHTS.map((h, i) => (
            <span
              key={i}
              className={cn('w-full max-w-[6px] flex-1 rounded-full transition-colors', i < filled ? 'bg-brand-solid' : 'bg-fg-tertiary/30')}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <span className="shrink-0 rounded-full bg-sunken px-2 py-0.5 font-mono text-2xs text-fg-secondary" lang="en">
          {meta.duration}
        </span>
      </div>
      <p className="text-2xs text-fg-tertiary">{tr('voiceMetaCaption')}{meta.edited ? ' · ✓' : ''}</p>
    </div>
  )
}

export function MessageBubble({
  role,
  children,
  stale = false,
  onStaleAction,
  staleActionLabel,
  isAnswer = false,
  actions,
  dataId,
  className,
  voiceMeta,
}: MessageBubbleProps) {
  if (role === 'system') {
    return (
      <div className={cn('flex justify-center px-2 py-1', className)}>
        <p className="rounded-full bg-sunken px-3 py-1 text-2xs text-fg-tertiary">{children}</p>
      </div>
    )
  }

  if (role === 'assistant') {
    return (
      <div className={cn('flex flex-col gap-1.5 scroll-mt-20', className)} data-chat-item={dataId}>
        <div className="flex items-center gap-2" aria-hidden="true">
          <LogoMark size="sm" />
          <span className="text-2xs font-medium text-fg-tertiary">LokAI</span>
        </div>
        <div className="min-w-0 text-fg-primary">{children}</div>
        {actions && <div className="-mt-0.5 flex items-center gap-1">{actions}</div>}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-end scroll-mt-20', className)} data-chat-item={dataId}>
      <div
        className={cn(
          'max-w-[85%] rounded-[18px] border px-3.5 py-2.5 text-sm ltr:rounded-br-[4px] rtl:rounded-bl-[4px]',
          stale
            ? 'border-warning-line bg-warning-subtle text-on-warning-subtle'
            : 'border-line-default bg-component text-fg-primary',
        )}
      >
        {voiceMeta && <VoiceNoteHeader meta={voiceMeta} />}
        {children}
      </div>
      {onStaleAction && (stale || isAnswer) && (
        <button
          type="button"
          onClick={onStaleAction}
          className="pressable mt-1 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-2xs font-medium text-brand-fg underline-offset-4 hover:underline"
        >
          {staleActionLabel}
        </button>
      )}
    </div>
  )
}
