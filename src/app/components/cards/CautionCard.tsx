import { useApp } from '../../lib/app-context'
import { JOURNEY_STRINGS } from '../../data/refund-journey'
import { CAUTION_UNCLEAR, CAUTION_REASONING } from '../../data/localized-content'
import { legalById } from '../../data/legal-content'
import type { ScopeDecision } from '../../data/scope-rules'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { Chip } from '../ui/Chip'
import { ConfidenceIndicator } from '../trust/ConfidenceIndicator'
import { VerificationBadge } from '../trust/VerificationBadge'
import { ReasoningPill } from '../trust/ReasoningPill'
import { CardActions } from './CardActions'

/**
 * Caution state — NOT an automatic stop (A2.4 / Phase 1 spec). TWO honest
 * faces (deep-audit fix: the downgrade law must not claim a time limit the
 * user never gave):
 *  - time-barred (ruleId 'possible-time-barred'): time limits may apply…
 *  - unclear (any other caution): "I did not understand — one more detail",
 *    with three disambiguation doors, never a fabricated limitation warning.
 */
export function CautionCard({
  decision,
  onConsumer,
  onNotice,
  onOther,
  onDiscard,
}: {
  decision?: ScopeDecision
  onConsumer?: () => void
  onNotice?: () => void
  onOther?: () => void
  onDiscard?: () => void
}) {
  const { tr, lang } = useApp()
  const timeBarred = decision?.ruleId === 'possible-time-barred'
  const legal = legalById('cpa-limitation')
  const unclear = CAUTION_UNCLEAR[lang] ?? CAUTION_UNCLEAR.en!
  const reasoning = (CAUTION_REASONING[lang] ?? CAUTION_REASONING.en!)[
    timeBarred ? 'timeBarred' : 'unclear'
  ]

  return (
    <Card className="flex flex-col gap-3.5 border-warning-line">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif text-lg font-semibold leading-snug text-fg-primary">
          {timeBarred ? tr('cautionTitle') : unclear.title}
        </h3>
        <Badge tone="warning" variant="subtle">{tr('tierCaution')}</Badge>
      </div>

      {timeBarred ? (
        <>
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
        </>
      ) : (
        <>
          <p className="text-sm leading-relaxed text-fg-primary">{unclear.body}</p>
          <div className="flex flex-col gap-1.5">
            <p className="text-2xs font-semibold text-fg-secondary">{tr('pickClosest')}</p>
            <div className="flex flex-wrap gap-2">
              {onConsumer && <Chip onClick={onConsumer}>{tr('chipItConsumer')}</Chip>}
              {onNotice && <Chip onClick={onNotice}>{tr('chipItOfficial')}</Chip>}
              {onOther && <Chip onClick={onOther}>{tr('chipOther')}</Chip>}
            </div>
          </div>
          <ConfidenceIndicator level="unsure" />
        </>
      )}

      <ReasoningPill steps={reasoning} />
      <CardActions onDiscard={onDiscard} />
    </Card>
  )
}
