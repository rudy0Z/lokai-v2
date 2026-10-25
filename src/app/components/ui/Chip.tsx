import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

/** Quick-reply / suggestion chip. Wraps gracefully for long Indic strings. */
export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  leadingIcon?: ReactNode
}

export function Chip({ selected = false, leadingIcon, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'pressable inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-150',
        selected
          ? 'bg-brand-solid text-on-brand-solid'
          : 'bg-container text-fg-primary',
        className,
      )}
      {...rest}
    >
      {leadingIcon}
      <span className="text-start whitespace-normal">{children}</span>
    </button>
  )
}
