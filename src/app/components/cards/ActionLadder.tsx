import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useApp } from '../../lib/app-context'
import { cn } from '../../lib/cn'
import { copyText } from '../../lib/format'
import { legalById } from '../../data/legal-content'
import { buildDrafts } from '../../lib/matter-facts'
import type { FactRecord } from '../../lib/matter-facts'
import { Badge } from '../ui/Badge'
import { Banner } from '../ui/Banner'
import { Button } from '../ui/Button'
import { Disclosure } from '../ui/Disclosure'
import { IconCheck, IconPhone } from '../ui/icons'
import { VerificationBadge } from '../trust/VerificationBadge'
import { IconPencil, IconRefresh } from '../ui/icons'

export interface ActionLadderProps {
  /** full = all three steps; free = steps 1-2 + human help (caution branch) */
  mode?: 'full' | 'free'
  onOpenNotice?: () => void
  /** the signed matter record — every draft is built from it, never hardcoded */
  facts?: FactRecord
  className?: string
}

function StepNumber({ n, tone = 'brand' }: { n: number; tone?: 'brand' | 'positive' | 'warning' }) {
  return (
    <span
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-2xs font-semibold',
        tone === 'brand' && 'bg-brand-subtle text-on-brand-subtle',
        tone === 'positive' && 'bg-positive-subtle text-on-positive-subtle',
        tone === 'warning' && 'bg-warning-subtle text-on-warning-subtle',
      )}
      aria-hidden="true"
    >
      {n}
    </span>
  )
}

/** Step 1: editable, copyable WhatsApp draft — built from the signed facts. */
function WhatsAppStep({ facts }: { facts?: FactRecord }) {
  const { tr, lang } = useApp()
  const [text, setText] = useState('')
  const [idx, setIdx] = useState(0)

  const drafts = buildDrafts(facts ?? { item: '', seller: '', amount: '', issue: '', ask: '', when: '' }, lang)

  useEffect(() => {
    setText(drafts.drafts[idx] ?? '')
    // re-build whenever the signed facts, language or variant change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facts, lang, idx])

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-2xs text-fg-tertiary">{tr('whatsappHint')}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={9}
        aria-label="WhatsApp draft"
        className="scroll-calm w-full resize-y rounded-xl border border-line-default bg-container p-3 font-sans text-sm leading-relaxed text-fg-primary focus-visible:border-brand-line focus-visible:outline-none"
      />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          size="sm"
          leadingIcon={<IconPencil className="size-3.5" />}
          onClick={async () => {
            const ok = await copyText(text)
            if (ok) toast.success(tr('copied'))
            else toast.error(tr('errorTitle'))
          }}
        >
          {tr('copy')}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          leadingIcon={<IconRefresh className="size-3.5" />}
          onClick={() => setIdx((i) => (i + 1) % drafts.drafts.length)}
        >
          {tr('regenerate')}
        </Button>
      </div>
    </div>
  )
}

/** Step 2: free national helpline with prep list. */
function HelplineStep() {
  const { tr } = useApp()
  const legal = legalById('national-consumer-helpline')
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-brand-line-subtle bg-brand-subtle px-3.5 py-3">
        <div className="flex items-baseline gap-2">
          <IconPhone className="size-4 translate-y-0.5 text-on-brand-subtle" />
          <span className="font-mono text-2xl font-semibold text-on-brand-subtle" lang="en">
            1915
          </span>
          <Badge tone="positive" variant="subtle">{tr('badgeFree')}</Badge>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="text-2xs text-on-brand-subtle">{legal?.source}</span>
          <VerificationBadge verified={legal?.verified ?? false} />
        </div>
      </div>
      <div>
        <p className="text-2xs font-semibold text-fg-secondary">{tr('haveReady')}</p>
        <ul className="mt-1.5 flex flex-col gap-1.5">
          {(['prepItem1', 'prepItem2', 'prepItem3', 'prepItem4'] as const).map((key) => (
            <li key={key} className="flex items-start gap-2 text-sm text-fg-primary">
              <IconCheck className="mt-1 size-3.5 shrink-0 text-positive-fg" />
              {tr(key)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function ActionLadder({ mode = 'full', onOpenNotice, facts, className }: ActionLadderProps) {
  const { tr } = useApp()
  return (
    <section className={cn('flex flex-col gap-2.5', className)} aria-label={tr('ladderTitle')}>
      <p className="text-2xs font-medium text-fg-tertiary">{tr('ladderTitle')}</p>
      <Disclosure
        leading={<StepNumber n={1} tone="positive" />}
        title={tr('step1Title')}
        subtitle={tr('step1Sub')}
      >
        <WhatsAppStep facts={facts} />
      </Disclosure>
      <Disclosure
        leading={<StepNumber n={2} />}
        title={tr('step2Title')}
        subtitle={tr('step2Sub')}
      >
        <HelplineStep />
      </Disclosure>
      {mode === 'full' && (
        <Disclosure
          leading={<StepNumber n={3} tone="warning" />}
          title={tr('step3Title')}
          subtitle={tr('step3Sub')}
        >
          <div className="flex flex-col gap-2.5">
            <Banner tone="warning">{tr('ladderBanner')}</Banner>
            <Button variant="secondary" size="sm" onClick={onOpenNotice}>
              {tr('openNotice')}
            </Button>
          </div>
        </Disclosure>
      )}
      {mode === 'free' && (
        <p className="px-1 text-2xs text-fg-tertiary">{tr('ladderPausedNote')}</p>
      )}
    </section>
  )
}
