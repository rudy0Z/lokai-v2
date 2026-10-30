import { useApp } from '../../lib/app-context'
import { cn } from '../../lib/cn'
import { legalById } from '../../data/legal-content'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { ConfidenceIndicator, type ConfidenceLevel } from '../trust/ConfidenceIndicator'
import { IconDoc, IconSparkle } from '../ui/icons'
import { VerificationBadge } from '../trust/VerificationBadge'
import { SectionRef } from '../trust/SectionRef'
import { ReasoningPill } from '../trust/ReasoningPill'
import { LegalText } from '../trust/LegalText'
import { SpeakPill } from '../trust/SpeakPill'

export interface FindingCardData {
  title: string
  whatHappened: string
  lawSays: string
  means: string
  legalId: string
  confidence: ConfidenceLevel
  reasoningSteps: string[]
  /** alternate wording produced by Regenerate */
  variants?: { whatHappened: string; means: string }[]
}

export interface FindingCardProps {
  data: FindingCardData
  stale?: boolean
  onUpdate?: (data: FindingCardData) => void
  onDiscard?: () => void
  /** calm-authority M2: the plan CTA docks INSIDE the artifact */
  onShowLadder?: () => void
  ladderShown?: boolean
}

/**
 * The finding card: editorial serif heading, plain-language statutory reasoning,
 * verified citation, and quiet provenance well. A citizen cannot edit an Act of
 * Parliament — user agency (edit/regenerate/discard) lives on the generative
 * drafts in ActionLadder and DemandNoticeReview.
 */
export function FindingCard({ data, stale, onShowLadder, ladderShown }: FindingCardProps) {
  const { tr, lang } = useApp()
  const legal = legalById(data.legalId)

  /** A4b: uppercase + tracking are Latin-only niceties */
  const labelClass = cn(
    'text-xs font-semibold text-fg-tertiary',
    lang === 'en' && 'uppercase tracking-wide',
  )

  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-s-2 border-line-default py-0.5 ps-4',
        stale && 'opacity-70',
      )}
    >
      {/* top row — provenance + listen; trust chrome lives below */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          {stale && <Badge tone="warning" variant="subtle">{tr('stale')}</Badge>}
          {legal && <SectionRef sectionRef={legal.sectionRef} />}
        </div>
        <SpeakPill text={`${data.title}. ${data.whatHappened} ${data.lawSays} ${data.means}`} />
      </div>

      <h3 className="font-serif text-lg font-semibold leading-snug text-fg-primary">
        {data.title}
      </h3>
      {/* NO lang="en" here: buildFinding localizes the body — an English
          scope would strip :lang() font stacks and Nastaliq leading from
          the card's main reading surface (DESIGN-AUDIT P1-2) */}
      <dl className="flex flex-col gap-3">
        <div>
          <dt className={labelClass} lang={lang === 'en' ? undefined : lang}>
            {tr('findingWhatHappened')}
          </dt>
          <dd className="mt-1 text-sm-plus text-fg-primary">{data.whatHappened}</dd>
        </div>
        <div>
          <dt className={labelClass} lang={lang === 'en' ? undefined : lang}>
            {tr('findingLawSays')}
          </dt>
          <dd className="mt-1 text-sm-plus text-fg-primary">
            <LegalText text={data.lawSays} />
          </dd>
        </div>
        <div>
          <dt className={labelClass} lang={lang === 'en' ? undefined : lang}>
            {tr('findingMeans')}
          </dt>
          <dd className="mt-1 text-sm-plus text-fg-primary">{data.means}</dd>
        </div>
      </dl>

      {/* the trust well — confidence, verification and reasoning tucked UNDER
          the answer (calm authority: headline & plain law first) */}
      <div className="mt-1 flex flex-col gap-2.5 rounded-2xl bg-sunken px-3.5 py-3">
        {/* M5: the cited source as a quantified pill — trust shows work */}
        {legal && (
          <span
            className="inline-flex max-w-full items-center gap-1.5 self-start rounded-full bg-card px-2.5 py-1 text-2xs text-fg-secondary"
            lang="en"
          >
            <IconDoc className="size-3.5 shrink-0 text-fg-tertiary" />
            <span className="min-w-0 truncate">Cited source 1 of 1 · {legal.source}</span>
          </span>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <ConfidenceIndicator level={data.confidence} />
          {legal && <VerificationBadge verified={legal.verified} />}
          <ReasoningPill steps={data.reasoningSteps} />
        </div>
      </div>

      {/* M2: the action plan docks INSIDE the artifact — the finding is an
          actionable document, not a report with a floating tag */}
      {onShowLadder && !ladderShown && (
        <div className="mt-3.5 border-t border-line-subtle pt-3.5">
          <Button variant="primary" size="md" block leadingIcon={<IconSparkle className="size-4" />} onClick={onShowLadder}>
            {tr('showPlanCta')}
          </Button>
        </div>
      )}
    </div>
  )
}
