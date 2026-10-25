import { useState } from 'react'
import { toast } from 'sonner'
import { useApp } from '../../lib/app-context'
import { cn } from '../../lib/cn'
import { copyText } from '../../lib/format'
import { legalById } from '../../data/legal-content'
import { HELPLINE_PREP, WHATSAPP_DRAFTS } from '../../data/refund-journey'
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

/** Step 1: editable, copyable WhatsApp draft. */
function WhatsAppStep() {
  const { tr } = useApp()
  const [text, setText] = useState(WHATSAPP_DRAFTS[0]!)
  const [idx, setIdx] = useState(0)

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-2xs text-fg-tertiary">
        Edit anything before you send it. Nothing leaves your phone until you paste it into WhatsApp yourself.
      </p>
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
          onClick={() => {
            const next = (idx + 1) % WHATSAPP_DRAFTS.length
            setIdx(next)
            setText(WHATSAPP_DRAFTS[next]!)
          }}
        >
          {tr('regenerate')}
        </Button>
      </div>
    </div>
  )
}

/** Step 2: free national helpline with prep list. */
function HelplineStep() {
  const legal = legalById('national-consumer-helpline')
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-brand-line-subtle bg-brand-subtle px-3.5 py-3">
        <div className="flex items-baseline gap-2">
          <IconPhone className="size-4 translate-y-0.5 text-on-brand-subtle" />
          <span className="font-mono text-2xl font-semibold text-on-brand-subtle" lang="en">
            1915
          </span>
          <Badge tone="positive" variant="subtle">free</Badge>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="text-2xs text-on-brand-subtle">{legal?.source}</span>
          <VerificationBadge verified={legal?.verified ?? false} />
        </div>
      </div>
      <div>
        <p className="text-2xs font-semibold text-fg-secondary">Have this ready before you call:</p>
        <ul className="mt-1.5 flex flex-col gap-1.5" lang="en">
          {HELPLINE_PREP.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-fg-primary">
              <IconCheck className="mt-1 size-3.5 shrink-0 text-positive-fg" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function ActionLadder({ mode = 'full', onOpenNotice, className }: ActionLadderProps) {
  const { tr } = useApp()
  return (
    <section className={cn('flex flex-col gap-2.5', className)} aria-label={tr('ladderTitle')}>
      <p className="text-2xs font-medium text-fg-tertiary">{tr('ladderTitle')}</p>
      <Disclosure
        leading={<StepNumber n={1} tone="positive" />}
        title={tr('step1Title')}
        subtitle="₹0 · 10 minutes · lowest risk"
      >
        <WhatsAppStep />
      </Disclosure>
      <Disclosure leading={<StepNumber n={2} />} title={tr('step2Title')} subtitle="free · official channel">
        <HelplineStep />
      </Disclosure>
      {mode === 'full' && (
        <Disclosure
          leading={<StepNumber n={3} tone="warning" />}
          title={tr('step3Title')}
          subtitle="strongest step · mistakes cost most here"
        >
          <div className="flex flex-col gap-2.5">
            <Banner tone="warning">
              This is the step where mistakes cost most. Open the draft, check every detail, and only confirm when
              you are sure. A human helper can review it with you first.
            </Banner>
            <Button variant="secondary" size="sm" onClick={onOpenNotice}>
              {tr('openNotice')}
            </Button>
          </div>
        </Disclosure>
      )}
      {mode === 'free' && (
        <p className="px-1 text-2xs text-fg-tertiary">
          The formal notice step is paused until your dates are checked — it is the step where mistakes cost most.
        </p>
      )}
    </section>
  )
}
