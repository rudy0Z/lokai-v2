import { useApp } from '../../lib/app-context'
import { JOURNEY_STRINGS } from '../../data/refund-journey'
import { legalById } from '../../data/legal-content'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { ConfidenceIndicator } from '../trust/ConfidenceIndicator'
import { VerificationBadge } from '../trust/VerificationBadge'
import { ReasoningPill } from '../trust/ReasoningPill'
import { CardActions } from './CardActions'

/**
 * Caution state — NOT an automatic stop (A2.4 / Phase 1 spec): time limits
 * may apply, delay may be excusable [VERIFY], free steps stay available.
 */
export function CautionCard({ onDiscard }: { onDiscard?: () => void }) {
  const { tr, lang } = useApp()
  const legal = legalById('cpa-limitation')
  return (
    <Card className="flex flex-col gap-3.5 border-warning-line">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif text-lg font-semibold leading-snug text-fg-primary">{tr('cautionTitle')}</h3>
        <Badge tone="warning" variant="subtle">{tr('tierCaution')}</Badge>
      </div>
      <p className="text-sm text-fg-primary">{JOURNEY_STRINGS.cautionIntro![lang]}</p>
      {legal && (
        <div className="flex flex-wrap items-center gap-2" lang="en">
          <span className="font-mono text-2xs text-fg-secondary">
            {legal.source} · {legal.sectionRef}
          </span>
          <VerificationBadge verified={legal.verified} />
        </div>
      )}
      <ConfidenceIndicator level="likely" />
      <ReasoningPill
        steps={[
          'Read your message and the dates you gave',
          'Checked the boundary: still a consumer matter',
          'Time-limit rule flagged as needs-verification [VERIFY]',
          'Kept the free steps; paused the formal notice',
        ]}
      />
      <CardActions onDiscard={onDiscard} />
    </Card>
  )
}
