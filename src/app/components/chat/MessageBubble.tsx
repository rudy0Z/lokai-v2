import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { LogoMark } from '../ui/LogoMark'

export type MessageRole = 'user' | 'assistant' | 'system'

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
  className?: string
}

/**
 * ChatGPT/Gemini-style asymmetry: user turns get a soft bubble on the end
 * side; assistant turns read as full-width document text (cards live inside
 * them); system notes are quiet centered chrome.
 */
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
          'max-w-[85%] rounded-2xl border px-3.5 py-2.5 text-sm',
          stale
            ? 'border-warning-line bg-warning-subtle text-on-warning-subtle'
            : 'border-line-default bg-component text-fg-primary',
        )}
      >
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
