import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'inverted'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  block?: boolean
}

const variantClass: Record<Variant, string> = {
  primary:
    'bg-brand-solid text-on-brand-solid shadow-default enabled:hover:bg-brand-solid-hover enabled:active:bg-brand-solid-active',
  secondary:
    'bg-component text-fg-primary enabled:hover:bg-component-hover enabled:active:bg-component-active',
  ghost: 'bg-transparent text-fg-secondary enabled:hover:bg-hover-veil',
  danger: 'bg-danger-solid text-on-danger-solid enabled:hover:bg-danger-solid-hover',
  inverted:
    'bg-fg-on-inverted text-standout',
}

const sizeClass: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-2xs gap-1.5 rounded-full',
  md: 'h-11 px-5 text-sm gap-2 rounded-full',
  lg: 'h-12 px-6 text-base gap-2 rounded-full',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  leadingIcon,
  trailingIcon,
  block = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(
        'pressable inline-flex items-center justify-center font-medium transition-colors duration-150 select-none',
        variantClass[variant],
        sizeClass[size],
        block && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="inline-block size-4 rounded-full border-2 border-current border-t-transparent animate-spin"
        />
      ) : (
        leadingIcon
      )}
      {children}
      {trailingIcon}
    </button>
  )
}
