import { useApp } from '../../lib/app-context'
import { Badge } from '../ui/Badge'

/**
 * Renders a legal citation's section reference, converting the raw
 * `[VERIFY — …]` bracket syntax into a structured, localized chip so a lay
 * citizen never reads bare scaffolding as broken software. The bracket
 * detail survives as the chip's title/tooltip. Deep-audit fix (P3-15).
 */
export function SectionRef({ sectionRef, className }: { sectionRef: string; className?: string }) {
  const { tr } = useApp()
  const marker = /\[VERIFY[^\]]*\]/.exec(sectionRef)
  const clean = sectionRef.replace(/\s*\[VERIFY[^\]]*\]/g, '').trim()

  return (
    <span className={'inline-flex flex-wrap items-center gap-2 ' + (className ?? '')}>
      {clean && (
        <span className="font-mono text-2xs text-fg-secondary" lang="en">
          {clean}
        </span>
      )}
      {marker && (
        <Badge tone="warning" variant="outline" title={marker[0]}>
          {tr('verifyStamp')}
        </Badge>
      )}
    </span>
  )
}
