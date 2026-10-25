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
    'bg-brand-solid text-on-brand-solid hover:bg-brand-solid-hover active:bg-brand-solid-active shadow-default',
  secondary:
    'bg-component text-fg-primary border border-line-default hover:bg-component-hover active:bg-component-active',
  ghost: 'bg-transparent text-fg-secondary hover:bg-hover-veil active:bg-component',
  danger: 'bg-danger-solid text-on-danger-solid hover:bg-danger-solid-hover',
  inverted:
    'bg-fg-on-inverted text-standout hover:bg-fg-standout-secondary',
}

const sizeClass: Record<Size, string> = {
  sm: 'h-9 px-3 text-2xs gap-1.5 rounded-md',
  md: 'h-11 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-5 text-base gap-2 rounded-xl',
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
        'inline-flex items-center justify-center font-medium transition-colors duration-150 select-none',
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
