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
        'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150',
        selected
          ? 'border-brand-line bg-brand-subtle text-on-brand-subtle'
          : 'border-line-default bg-component text-fg-primary hover:bg-component-hover active:bg-component-active',
        className,
      )}
      {...rest}
    >
      {leadingIcon}
      <span className="text-start whitespace-normal">{children}</span>
    </button>
  )
}
