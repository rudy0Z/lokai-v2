import { cn } from '../../lib/cn'

/**
 * Small paper exhibit thumbnail (ported from v1's ExhibitPaper): accent edge
 * + content-line skeleton, reads as a physical document chip.
 */
export function ExhibitPaper({ name, className }: { name: string; className?: string }) {
  return (
    <div className={cn('paper relative w-full overflow-hidden rounded-[10px] px-3 pb-3 pt-2', className)}>
      <span className="absolute inset-y-0 start-0 w-1 bg-brand-solid" aria-hidden="true" />
      <p className="truncate ps-1.5 font-mono text-2xs text-fg-secondary" lang="en">
        {name}
      </p>
      <div className="mt-2 flex flex-col gap-1.5 ps-1.5" aria-hidden="true">
        <div className="h-1.5 w-4/5 rounded-full bg-fg-secondary/25" />
        <div className="h-1.5 w-3/5 rounded-full bg-fg-secondary/25" />
        <div className="h-1.5 w-2/3 rounded-full bg-fg-secondary/25" />
      </div>
    </div>
  )
}
