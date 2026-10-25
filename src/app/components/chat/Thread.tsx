import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface ThreadProps {
  children: ReactNode
  /** value that changes whenever content grows — drives auto-scroll */
  scrollKey: string | number
  /** when false (empty state), no auto-scroll happens */
  autoScroll?: boolean
  className?: string
}

export function Thread({ children, scrollKey, autoScroll = true, className }: ThreadProps) {
  const ref = useRef<HTMLDivElement>(null)
  const firstRef = useRef(true)

  useEffect(() => {
    if (!autoScroll) return
    const el = ref.current
    if (!el) return
    // only follow when the user is already near the bottom (their content)
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 160
    if (firstRef.current || nearBottom) {
      firstRef.current = false
      el.scrollTo({ top: el.scrollHeight, behavior: firstRef.current ? 'auto' : 'smooth' })
    }
  }, [scrollKey, autoScroll])

  return (
    <div ref={ref} className={cn('scroll-calm flex-1 overflow-y-auto overscroll-contain px-3.5 py-4', className)}>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  )
}
