import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useApp } from '../../lib/app-context'
import { cn } from '../../lib/cn'
import { copyText } from '../../lib/format'
import { legalById } from '../../data/legal-content'
import { buildDrafts } from '../../lib/matter-facts'
import type { FactRecord } from '../../lib/matter-facts'
import type { DomainChannel } from '../../data/domain-playbooks'
import { Badge } from '../ui/Badge'
import { Banner } from '../ui/Banner'
import { Button } from '../ui/Button'
import { Disclosure } from '../ui/Disclosure'
import { IconCheck, IconCopy, IconPhone } from '../ui/icons'
import { VerificationBadge } from '../trust/VerificationBadge'
import { IconPencil, IconRefresh } from '../ui/icons'

export interface ActionLadderProps {
  /** full = all three steps; free = steps 1-2 + human help (caution branch) */
  mode?: 'full' | 'free'
  onOpenNotice?: () => void
  /** the signed matter record — every draft is built from it, never hardcoded */
  facts?: FactRecord
  /** domain playbook overrides (master spec Part 1): when present the ladder
      speaks the domain's own drafts, prep list, step titles and channel */
  drafts?: string[]
  prep?: string[]
  stepTitles?: [string, string, string]
  channel?: DomainChannel
  className?: string
  initialExpandedStep?: 1 | 2 | 3 | 4
}

function StepNumber({ n, tone = 'brand' }: { n: number; tone?: 'brand' | 'positive' | 'warning' }) {
  return (
    <span
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-full text-2xs font-semibold tabular-nums',
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

/** Step 1: editable, copyable WhatsApp draft — built from the signed facts,
    or supplied verbatim by a domain playbook. */
function WhatsAppStep({ facts, drafts: draftsProp }: { facts?: FactRecord; drafts?: string[] }) {
  const { tr, lang } = useApp()
  const [text, setText] = useState('')
  const [idx, setIdx] = useState(0)
  const [copied, setCopied] = useState(false)
  /* overhaul Part 4: the draft previews at 3 lines so Step 2 stays in view;
     the full editable draft opens on demand — Copy is visible either way */
  const [expanded, setExpanded] = useState(false)

  const drafts = useMemo<string[]>(
    () =>
      draftsProp ??
      buildDrafts(facts ?? { item: '', seller: '', amount: '', issue: '', ask: '', when: '' }, lang).drafts,
    [facts, lang, draftsProp],
  )

  useEffect(() => {
    setText(drafts[idx] ?? '')
    // re-build whenever the signed facts, language or variant change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facts, lang, idx, drafts])

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-xs text-fg-tertiary">{tr('whatsappHint')}</p>
      {expanded ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={9}
          aria-label="WhatsApp draft"
          className="scroll-calm w-full resize-y rounded-xl border border-line-default bg-sunken p-3 font-sans text-sm leading-relaxed text-fg-primary focus-visible:border-brand-line focus-visible:outline-none"
        />
      ) : (
        <div className="relative rounded-xl border border-line-default bg-sunken p-3">
          <p className="line-clamp-3 whitespace-pre-line font-sans text-sm leading-relaxed text-fg-primary">
            {text}
          </p>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-7 rounded-b-xl bg-gradient-to-t from-sunken to-transparent"
            aria-hidden="true"
          />
        </div>
      )}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="pressable -mt-1.5 self-start rounded-full px-1.5 py-1 text-2xs font-medium text-brand-fg underline-offset-4 hover:underline"
      >
        {expanded ? tr('hideFullDraft') : tr('readFullDraft')}
      </button>
      {copied && (
        <p className="rounded-xl bg-positive-subtle px-3 py-2 text-2xs text-on-positive-subtle">
          {tr('ladderCopied')}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          size="sm"
          leadingIcon={<IconPencil className="size-3.5" />}
          onClick={async () => {
            const ok = await copyText(text)
            if (ok) {
              toast.success(tr('copied'))
              setCopied(true)
            } else toast.error(tr('errorTitle'))
          }}
        >
          {tr('copy')}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          leadingIcon={<IconRefresh className="size-3.5" />}
          onClick={() => setIdx((i) => (i + 1) % drafts.length)}
        >
          {tr('regenerate')}
        </Button>
      </div>
    </div>
  )
}

/** Step 2: the domain's escalation channel (1915 / 1930 / DLSA / SAMADHAN)
    with its prep list — tokens come only from legal-content-backed data. */
function ChannelStep({ prep, channel }: { prep?: string[]; channel?: DomainChannel }) {
  const { tr } = useApp()
  const legal = legalById(channel?.legalId ?? 'national-consumer-helpline')
  const prepItems = prep ?? (['prepItem1', 'prepItem2', 'prepItem3', 'prepItem4'] as const).map((k) => tr(k))
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-brand-line-subtle bg-brand-subtle px-3.5 py-3">
        <div className="flex items-baseline gap-2">
          <IconPhone className="size-4 translate-y-0.5 text-on-brand-subtle" />
          <span className="font-mono text-2xl font-semibold text-on-brand-subtle" lang="en">
            {channel?.token ?? '1915'}
          </span>
          <Badge tone="positive" variant="subtle">{tr('badgeFree')}</Badge>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-on-brand-subtle">{legal?.source}</span>
          <VerificationBadge verified={legal?.verified ?? false} />
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-fg-secondary">{tr('haveReady')}</p>
        <ul className="mt-1.5 flex flex-col gap-1.5">
          {prepItems.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-fg-primary">
              <IconCheck className="mt-1 size-3.5 shrink-0 text-positive-fg" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-2.5 text-2xs leading-relaxed text-fg-tertiary">
          {tr('step2ConciliationNote')}
        </p>
      </div>
    </div>
  )
}

/** Step 4: e-Jagriti consumer commission e-filing outline — copy-only structured format */
function EJagritiStep({ facts }: { facts?: FactRecord }) {
  const { tr } = useApp()
  const legal = legalById('cpa-e-jagriti')
  const [copied, setCopied] = useState(false)

  const item = facts?.item || 'Product'
  const seller = facts?.seller || 'Opposite Party / Seller'
  const amount = facts?.amount || 'claimed amount'
  const issue = facts?.issueRaw || facts?.issue || 'Defective goods delivered'

  const complaintDraft = `BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION
(Filed under Section 35 of the Consumer Protection Act, 2019)

IN THE MATTER OF:
Complainant: [Your Full Name, Address, Contact]
Versus
Opposite Party: ${seller} [Registered Office Address & GSTIN]

1. BRIEF STATEMENT OF FACTS:
a. The Complainant purchased ${item} from the Opposite Party for a consideration of ${amount}.
b. Upon receipt, the product was found to be defective/non-conforming (${issue}).
c. The Complainant raised a timely grievance with the Opposite Party, who failed/refused to provide replacement or refund.
d. A pre-litigation written demand was served on the Opposite Party, but no remedy was provided.

2. JURISDICTION:
a. Territorial: The Complainant resides/works within the jurisdiction of this Hon'ble Commission (Section 34(2)).
b. Pecuniary: The total claim value is ${amount}, which is well within the pecuniary limit of up to ₹50,00,000 (Section 34(1)). Court fee: Nil (claims up to ₹5 Lakhs).

3. PRAYER / RELIEF SOUGHT:
a. Direct the Opposite Party to refund the sum of ${amount} along with interest @ 9% p.a.
b. Direct the Opposite Party to pay reasonable compensation for mental agony and harassment.
c. Award litigation costs of ₹5,000.

LIST OF EXHIBITS:
- Exhibit C-1: Copy of Tax Invoice / Purchase Bill
- Exhibit C-2: Photographs / Video proof of defect
- Exhibit C-3: Copy of pre-litigation correspondence / WhatsApp transcript
- Exhibit C-4: Postal receipt & Tracking / Delivery confirmation`

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-line-default bg-sunken p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-semibold text-fg-primary" lang="en">
            edaakhil.nic.in
          </span>
          <Badge tone="positive" variant="subtle">Official Portal</Badge>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-fg-secondary">
          {tr('step4PortalDesc')}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-2xs text-fg-tertiary">{legal?.source} · {legal?.sectionRef}</span>
          <VerificationBadge verified={legal?.verified ?? false} />
        </div>
      </div>

      <div className="rounded-xl border border-line-default bg-card p-3">
        <p className="text-2xs font-semibold uppercase tracking-wider text-fg-tertiary">
          Structured Complaint Outline (Copy-only)
        </p>
        <pre className="mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-lg bg-sunken p-2.5 font-mono text-2xs leading-relaxed text-fg-primary">
          {complaintDraft}
        </pre>
      </div>

      {copied && (
        <p className="rounded-xl bg-positive-subtle px-3 py-2 text-2xs text-on-positive-subtle">
          {tr('ladderCopied')}
        </p>
      )}

      <Button
        variant="primary"
        size="sm"
        leadingIcon={<IconCopy className="size-3.5" />}
        onClick={async () => {
          const ok = await copyText(complaintDraft)
          if (ok) {
            toast.success(tr('copied'))
            setCopied(true)
          } else toast.error(tr('errorTitle'))
        }}
      >
        {tr('step4CopyComplaint')}
      </Button>
    </div>
  )
}

export function ActionLadder({
  mode = 'full',
  onOpenNotice,
  facts,
  drafts,
  prep,
  stepTitles,
  channel,
  className,
  initialExpandedStep,
}: ActionLadderProps) {
  const { tr } = useApp()
  const steps = [
    <Disclosure
      key="s1"
      bare
      leading={<StepNumber n={1} tone="positive" />}
      title={stepTitles?.[0] ?? tr('step1Title')}
      subtitle={tr('step1Sub')}
      defaultOpen={initialExpandedStep === 1 || initialExpandedStep === undefined}
    >
      <WhatsAppStep facts={facts} drafts={drafts} />
    </Disclosure>,
    <Disclosure
      key="s2"
      bare
      leading={<StepNumber n={2} />}
      title={stepTitles?.[1] ?? tr('step2Title')}
      subtitle={tr('step2Sub')}
      defaultOpen={initialExpandedStep === 2}
    >
      <ChannelStep prep={prep} channel={channel} />
    </Disclosure>,
    ...(mode === 'full'
      ? [
          <Disclosure
            key="s3"
            bare
            leading={<StepNumber n={3} tone="warning" />}
            title={stepTitles?.[2] ?? tr('step3Title')}
            subtitle={tr('step3Sub')}
            defaultOpen={initialExpandedStep === 3}
          >
            <div className="flex flex-col gap-2.5">
              <Banner tone="warning">{tr('ladderBanner')}</Banner>
              <Button variant="secondary" size="sm" onClick={onOpenNotice}>
                {tr('openNotice')}
              </Button>
            </div>
          </Disclosure>,
          <Disclosure
            key="s4"
            bare
            leading={<StepNumber n={4} tone="brand" />}
            title={tr('step4Title')}
            subtitle={tr('step4Sub')}
            defaultOpen={initialExpandedStep === 4}
          >
            <EJagritiStep facts={facts} />
          </Disclosure>,
        ]
      : []),
  ]
  return (
    <section className={cn('flex flex-col gap-2', className)} aria-label={tr('ladderTitle')}>
      <p className="px-1 text-2xs font-medium text-fg-tertiary">{tr('ladderTitle')}</p>
      {/* calm-authority 5c: each step is its own tonal card — separation by
          surface tone, not dividers */}
      <div className="flex flex-col gap-2">
        {steps.map((step, i) => (
          <div key={i} className="rounded-2xl bg-sunken/70">
            {step}
          </div>
        ))}
      </div>
      {mode === 'free' && (
        <p className="px-1 text-2xs text-fg-tertiary">{tr('ladderPausedNote')}</p>
      )}
    </section>
  )
}
