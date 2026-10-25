import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface ThreadProps {
  children: ReactNode
  /** value that changes whenever content grows — drives auto-scroll */
  scrollKey: string | number
  className?: string
}

export function Thread({ children, scrollKey, className }: ThreadProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [scrollKey])

  return (
    <div ref={ref} className={cn('scroll-calm flex-1 overflow-y-auto overscroll-contain px-3.5 py-4', className)}>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  )
}
