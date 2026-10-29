import { useState } from 'react'
import { useApp } from '../lib/app-context'
import { navigate } from '../lib/router'
import { matterById, docsUpTo, DOC_KIND_LABEL, type CaseDay } from '../data/matters'
import { AppShell } from '../components/ui/shell'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { MessageBubble } from '../components/chat/MessageBubble'
import { ExhibitPaper } from '../components/documents/ExhibitPaper'
import { ThreadSummaryCard } from '../components/cases/ThreadSummaryCard'
import { FactCheckCard } from '../components/cards/FactCheckCard'
import { FindingCard } from '../components/cards/FindingCard'
import { ActionLadder } from '../components/cards/ActionLadder'
import { CloseOutCard } from '../components/cards/CloseOutCard'
import { StatutoryCounterCard } from '../components/cards/StatutoryCounterCard'
import { IconArrowLeft, IconFolder, IconPlus } from '../components/ui/icons'
import { cn } from '../lib/cn'

/**
 * The Case workspace (the "notebook"): the unified memory strip, the
 * chronological day chats, and the evidence vault that ACCUMULATES with the
 * selected day (Day 1 the invoice → Day 2 + the WhatsApp draft → Day 3 +
 * the formal demand notice). A day opens as a read-only scripted thread
 * with the Quick Summarise affordance — history you can read, never re-live
 * by accident.
 */
export default function CaseWorkspacePage({ id, dayParam }: { id: string; dayParam?: string }) {
  const { tr } = useApp()
  const matter = matterById(id)

  if (!matter) {
    return (
      <AppShell showTabs={false}>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <p className="text-sm text-fg-secondary">This case could not be found.</p>
          <Button variant="secondary" size="sm" onClick={() => navigate('/history')}>
            {tr('back')}
          </Button>
        </div>
      </AppShell>
    )
  }

  const dayIndex = dayParam !== undefined ? Math.max(0, Math.min(matter.days.length - 1, Number(dayParam) || 0)) : null
  const day = dayIndex !== null ? matter.days[dayIndex] : undefined

  return (
    <AppShell showTabs={false}>
      <CaseBody matterId={matter.id} dayIndex={dayIndex} day={day} />
    </AppShell>
  )
}

function CaseBody({
  matterId,
  dayIndex,
  day,
}: {
  matterId: string
  dayIndex: number | null
  day: CaseDay | undefined
}) {
  const { tr, setActiveCase } = useApp()
  const matter = matterById(matterId)!
  const [summaryOpen, setSummaryOpen] = useState(false)

  const backToCase = () => {
    navigate(`/case/${matter.id}`)
  }

  /* ── a single day, read-only, with Quick Summarise ── */
  if (day && dayIndex !== null) {
    return (
      <div
        className="scroll-calm flex-1 overflow-y-auto px-3.5 pb-8 pt-1"
        dir={matter.lang === 'ur' || matter.lang === 'ks' || matter.lang === 'sd' ? 'rtl' : undefined}
      >
        <div className="mx-auto flex max-w-[360px] flex-col gap-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" leadingIcon={<IconArrowLeft className="size-4" />} onClick={backToCase}>
              {tr('back')}
            </Button>
            <span className="text-2xs tabular-nums text-fg-tertiary" lang={matter.lang}>
              {day.dateLabel}
            </span>
          </div>

          <div>
            <h1 className="font-serif text-lg font-semibold leading-snug text-fg-primary" lang={matter.lang}>
              {day.title}
            </h1>
            <p className="mt-0.5 text-2xs text-fg-tertiary" lang={matter.lang}>
              {matter.titleNative} · {matter.amount}
            </p>
          </div>

          {day.turns.length >= 3 && (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setSummaryOpen((v) => !v)}
                aria-expanded={summaryOpen}
                className="pressable self-start rounded-full border border-line-default bg-card px-3 py-1.5 text-2xs font-medium text-fg-secondary transition-colors hover:bg-component-hover"
              >
                {tr('quickSummarise')}
              </button>
              {summaryOpen && day.summary && <ThreadSummaryCard summary={day.summary} lang={matter.lang} />}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {day.turns.map((t, i) => (
              <MessageBubble key={i} role={t.role} voiceMeta={t.voice ? { duration: '0:14', edited: true } : undefined}>
                <p className="whitespace-pre-line text-sm leading-relaxed" lang={matter.lang}>
                  {t.text}
                </p>
              </MessageBubble>
            ))}
          </div>

          {/* mounted structural cards from this historical session */}
          {day.cards?.includes('factcheck') && (
            <FactCheckCard
              signed={true}
              facts={matter.memory.map((m) => ({ key: m.label, label: m.label, value: m.value }))}
              onConfirm={() => {}}
            />
          )}

          {day.cards?.includes('finding') && matter.finding && (
            <FindingCard
              data={{
                title: matter.finding.title,
                whatHappened:
                  matter.memory.find((m) => m.label.toLowerCase().includes('matter') || m.label.toLowerCase().includes('विवाद'))
                    ?.value ?? '',
                lawSays: matter.finding.summary,
                means: matter.titleNative + ' — ' + matter.statusLine,
                legalId: 'cpa-defect-goods',
                confidence: 'clear',
                reasoningSteps: [matter.finding.summary],
              }}
            />
          )}

          {day.cards?.includes('counter') && (
            <StatutoryCounterCard
              title="Statutory Counter-Reply (WhatsApp)"
              statutoryBasis="Transfer of Property Act, 1882 · S. 108(m) [VERIFY]"
              replyText="Under Section 108(m) of the Transfer of Property Act, 1882 and Indian Contract Act, painting and regular wear-and-tear are the owner's responsibility. Deducting ₹35,000 without actual GST damage bills is legally unsustainable. Please transfer the remaining deposit."
            />
          )}

          {day.cards?.includes('ladder') && (
            <ActionLadder
              mode="full"
              initialExpandedStep={dayIndex === 0 ? 1 : 2}
            />
          )}

          {day.cards?.includes('closeout') && (
            <CloseOutCard findingTitle={matter.finding?.title} />
          )}

          {/* evidence accumulated BY this day */}
          {docsUpTo(matter, dayIndex).length > 0 && (
            <section className="flex flex-col gap-2 rounded-[22px] bg-sunken p-4">
              <h2 className="text-2xs font-semibold text-fg-secondary">{tr('exhibitsLabel')}</h2>
              <div className="stagger-in grid grid-cols-2 gap-2.5">
                {docsUpTo(matter, dayIndex).map((d) => (
                  <div key={d.id} className="flex flex-col gap-1">
                    <ExhibitPaper name={d.name} />
                    <span className="text-2xs text-fg-tertiary" lang="en">
                      {DOC_KIND_LABEL[d.kind]}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* interactive continuation bar (master spec Trap 2) */}
          <div className="flex flex-col gap-2 rounded-2xl border border-line-default bg-card p-3.5">
            <p className="text-2xs font-semibold text-fg-secondary">Continue this case</p>
            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setActiveCase(matter.id)
                  navigate('/')
                }}
              >
                Continue in this day chat
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leadingIcon={<IconPlus className="size-3.5" />}
                onClick={() => {
                  setActiveCase(matter.id)
                  navigate('/')
                }}
              >
                {tr('newDayChat')}
              </Button>
            </div>
          </div>

          <p className="text-center text-2xs text-fg-tertiary">{tr('caseSampleNote')}</p>
        </div>
      </div>
    )
  }

  /* ── the case overview: memory + days + the day-synced vault ── */
  const lastDay = matter.days.length - 1
  return (
    <div
      className="scroll-calm flex-1 overflow-y-auto px-3.5 pb-8 pt-1"
      dir={matter.lang === 'ur' || matter.lang === 'ks' || matter.lang === 'sd' ? 'rtl' : undefined}
    >
      <div className="mx-auto flex max-w-[360px] flex-col gap-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            leadingIcon={<IconArrowLeft className="size-4" />}
            onClick={() => {
              setActiveCase(matter.id)
              navigate('/')
            }}
          >
            {tr('tabHome')}
          </Button>
          {matter.resolved && (
            <Badge tone="positive" variant="subtle">
              ✓
            </Badge>
          )}
        </div>

        <div>
          <h1 className="font-serif text-xl font-semibold leading-snug text-fg-primary" lang={matter.lang}>
            {matter.titleNative}
          </h1>
          <p className="mt-1 text-2xs tabular-nums text-fg-tertiary" lang="en">
            {matter.amount} · {matter.statusLine}
          </p>
        </div>

        {/* unified memory quick glance */}
        <section className="rounded-[22px] bg-sunken p-4">
          <h2 className="text-2xs font-semibold text-fg-secondary">{tr('caseMemory')}</h2>
          <dl className="mt-2 flex flex-col gap-1.5">
            {matter.memory.map((row) => (
              <div key={row.label} className="flex items-baseline gap-2">
                <dt className="w-24 shrink-0 text-2xs text-fg-tertiary" lang={matter.lang}>
                  {row.label}
                </dt>
                <dd className="min-w-0 flex-1 text-sm text-fg-primary" lang={matter.lang}>
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* chronological day chats */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-fg-primary">{tr('caseDaysLabel')}</h2>
          {matter.days.map((d, i) => (
            <button
              key={d.id}
              type="button"
              onClick={() => navigate(`/case/${matter.id}/d/${i}`)}
              className={cn(
                'pressable flex items-center gap-3 rounded-[18px] px-3.5 py-3 text-start transition-colors',
                i === lastDay ? 'bg-brand-subtle' : 'bg-card hover:bg-component-hover',
              )}
            >
              <span className="w-16 shrink-0 text-2xs tabular-nums text-fg-tertiary" lang={matter.lang}>
                {d.dateLabel}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-fg-primary" lang={matter.lang}>
                {d.title}
              </span>
              <IconArrowRight />
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setActiveCase(matter.id)
              navigate('/')
            }}
            className="flex min-h-11 items-center gap-1.5 rounded-[18px] border border-dashed border-line-strong px-3.5 text-start text-sm font-medium text-brand-fg transition-colors hover:bg-hover-veil"
          >
            <IconPlus className="size-4" />
            {tr('newDayChat')}
          </button>
        </section>

        {/* the vault: everything the case holds, day-stamped */}
        <section className="flex flex-col gap-2">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-fg-primary">
            <IconFolder className="size-4 text-brand-fg" />
            {tr('exhibitsLabel')}
          </h2>
          <div className="stagger-in grid grid-cols-2 gap-2.5">
            {matter.docs.map((d) => (
              <div key={d.id} className="flex flex-col gap-1">
                <ExhibitPaper name={d.name} />
                <span className="text-2xs tabular-nums text-fg-tertiary" lang={matter.lang}>
                  {matter.days[d.dayIndex]?.dateLabel} · {DOC_KIND_LABEL[d.kind]}
                </span>
              </div>
            ))}
          </div>
        </section>

        <Card className="flex flex-col gap-1">
          <p className="text-2xs text-fg-tertiary">{tr('caseSampleNote')}</p>
        </Card>
      </div>
    </div>
  )
}

function IconArrowRight() {
  return (
    <span className="shrink-0 text-fg-tertiary" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="size-3.5 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </span>
  )
}
