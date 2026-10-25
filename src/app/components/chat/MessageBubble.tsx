import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type MessageRole = 'user' | 'assistant' | 'system'

export interface MessageBubbleProps {
  role: MessageRole
  children: ReactNode
  /** user message being edited / changed downstream */
  stale?: boolean
  onStaleAction?: () => void
  staleActionLabel?: string
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
      <div className={cn('flex flex-col gap-1.5', className)}>
        <div className="flex items-center gap-2" aria-hidden="true">
          <LokMark />
          <span className="text-2xs font-medium text-fg-tertiary">LokAI</span>
        </div>
        <div className="min-w-0 text-fg-primary">{children}</div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-end', className)}>
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
      {stale && onStaleAction && (
        <button
          type="button"
          onClick={onStaleAction}
          className="mt-1 min-h-9 rounded-full px-2 text-2xs font-medium text-brand-fg underline-offset-4 hover:underline"
        >
          {staleActionLabel}
        </button>
      )}
    </div>
  )
}

/** small flame-in-navy mark for assistant turns */
export function LokMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-standout',
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-3" fill="none">
        <path
          d="M12 5c-.9 2.6-3.4 3.4-3.4 6.3a3.4 3.4 0 0 0 6.8 0C15.4 8.4 12.9 7.6 12 5z"
          fill="var(--c-spark)"
          stroke="none"
        />
      </svg>
    </span>
  )
}
