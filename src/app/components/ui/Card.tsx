import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** border-first elevation by default; soft shadow opt-in */
  raised?: boolean
  /** paper stationery register — generated documents ONLY */
  paper?: boolean
}

export function Card({ raised = false, paper = false, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-4',
        paper ? 'paper border-warning-line/60' : 'bg-card border-line-default',
        raised && !paper && 'shadow-default',
        className,
      )}
      {...rest}
    />
  )
}

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-sm font-semibold text-fg-primary', className)} {...rest} />
}
