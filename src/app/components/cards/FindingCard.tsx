import { useState } from 'react'
import { toast } from 'sonner'
import { useApp } from '../../lib/app-context'
import { cn } from '../../lib/cn'
import { legalById } from '../../data/legal-content'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { Textarea } from '../ui/Field'
import { ConfidenceIndicator, type ConfidenceLevel } from '../trust/ConfidenceIndicator'
import { VerificationBadge } from '../trust/VerificationBadge'
import { ReasoningPill } from '../trust/ReasoningPill'
import { CardActions } from './CardActions'

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
}

/**
 * The generative finding card: serif heading (the "law register" is a READING
 * surface, allowed), three zones, verified-or-not citation, confidence in
 * plain words, reasoning pill, and full user control.
 */
export function FindingCard({ data, stale, onUpdate, onDiscard }: FindingCardProps) {
  const { tr, lang } = useApp()
  const legal = legalById(data.legalId)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(data)
  const [variantIdx, setVariantIdx] = useState(0)
  /** A4b: uppercase + tracking are Latin-only niceties */
  const labelClass = cn(
    'text-2xs font-semibold text-fg-tertiary',
    lang === 'en' && 'uppercase tracking-wide',
  )

  const variants = data.variants ?? []
  const regenerate = () => {
    if (variants.length === 0) {
      toast('No alternate draft prepared for this card')
      return
    }
    const next = (variantIdx + 1) % (variants.length + 1)
    setVariantIdx(next)
    const v = next === 0 ? data : variants[next - 1]!
    const merged = { ...draft, ...v }
    setDraft(merged)
    onUpdate?.(merged)
  }

  const save = () => {
    setEditing(false)
    onUpdate?.(draft)
    toast.success(tr('saveChanges'))
  }

  return (
    <Card className={cn('flex flex-col gap-3.5', stale && 'opacity-70')}>
      {stale && (
        <div className="-mb-1 flex items-center justify-between">
          <Badge tone="warning" variant="subtle">{tr('stale')}</Badge>
        </div>
      )}
      {editing ? (
        <div className="flex flex-col gap-2">
          <Textarea value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} rows={2} aria-label="title" />
          <Textarea value={draft.whatHappened} onChange={(e) => setDraft({ ...draft, whatHappened: e.target.value })} aria-label="what happened" />
          <Textarea value={draft.means} onChange={(e) => setDraft({ ...draft, means: e.target.value })} aria-label="what this means" />
        </div>
      ) : (
        <>
          <h3 className="font-serif text-lg font-semibold leading-snug text-fg-primary">
            {draft.title}
          </h3>
          <dl className="flex flex-col gap-3" lang="en">
            <div>
              <dt className={labelClass} lang={lang === 'en' ? undefined : lang}>
                {tr('findingWhatHappened')}
              </dt>
              <dd className="mt-1 text-sm text-fg-primary">{draft.whatHappened}</dd>
            </div>
            <div>
              <dt className={labelClass} lang={lang === 'en' ? undefined : lang}>
                {tr('findingLawSays')}
              </dt>
              <dd className="mt-1 text-sm text-fg-primary">{draft.lawSays}</dd>
              {legal && (
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-2xs text-fg-secondary">
                    {legal.source} · {legal.sectionRef}
                  </span>
                  <VerificationBadge verified={legal.verified} />
                </div>
              )}
            </div>
            <div>
              <dt className={labelClass} lang={lang === 'en' ? undefined : lang}>
                {tr('findingMeans')}
              </dt>
              <dd className="mt-1 text-sm text-fg-primary">{draft.means}</dd>
            </div>
          </dl>
        </>
      )}

      <ConfidenceIndicator level={draft.confidence} />
      <ReasoningPill steps={draft.reasoningSteps} />

      <CardActions
        editing={editing}
        onEdit={() => (editing ? save() : setEditing(true))}
        onRegenerate={regenerate}
        onDiscard={onDiscard}
      />
    </Card>
  )
}
