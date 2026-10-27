import { useApp } from '../lib/app-context'
import { navigate } from '../lib/router'
import { matterById } from '../data/matters'
import { getMatterLog } from '../lib/vault'
import { formatDate } from '../lib/format'
import { AppShell } from '../components/ui/shell'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { VerificationBadge } from '../components/trust/VerificationBadge'
import { SectionRef } from '../components/trust/SectionRef'
import { HandoverCard } from '../components/cards/HandoverCard'
import { IconArrowLeft, IconCheck } from '../components/ui/icons'

const tierBadge = { consumer: 'brand', notice: 'neutral', stop: 'warning' } as const
const tierLabelKey = { consumer: 'tierProceed', notice: 'chipNotice', stop: 'tierHardStop' } as const
const coverageTone = { direct: 'positive', related: 'warning', missing: 'danger' } as const

/**
 * Matter detail — v1's stage-driven case experience, condensed: the stage
 * spine (done/current/todo), the finding so far, source coverage, and the
 * handover receipt when LokAI stopped. Fictional mock data.
 *
 * The user's own closure log (deep-audit §6c) attaches to the matter the
 * live journey corresponds to (h1) — device-local, user-recorded, never an
 * invented legal outcome.
 */
export default function MatterDetailPage({ id }: { id: string }) {
  const { tr } = useApp()
  const matter = matterById(id)
  const log = matter?.id === 'h1' ? getMatterLog() : {}
  const hasLog = Boolean(log.step1SentAt || log.closedAt || log.saved?.length)

  if (!matter) {
    return (
      <AppShell activeTab="history" showTabs={false}>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <p className="text-sm text-fg-secondary">This matter could not be found.</p>
          <Button variant="secondary" size="sm" onClick={() => navigate('/history')}>
            {tr('back')}
          </Button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell activeTab="history" showTabs={false}>
      <div className="scroll-calm flex-1 overflow-y-auto px-4 pb-6 pt-4">
        <div className="mx-auto flex max-w-[340px] flex-col gap-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              leadingIcon={<IconArrowLeft className="size-4" />}
              onClick={() => navigate('/history')}
            >
              {tr('tabHistory')}
            </Button>
            <Badge tone={tierBadge[matter.tier]} variant="outline">
              {tr(tierLabelKey[matter.tier as keyof typeof tierLabelKey] as never)}
            </Badge>
          </div>

          <div>
            <h1 className="font-serif text-xl font-semibold leading-snug text-fg-primary" lang="en">
              {matter.title}
            </h1>
            <p className="mt-0.5 text-2xs text-fg-tertiary" lang="en">{matter.when}</p>
          </div>

          {/* stage spine */}
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-fg-primary">{tr('stagesLabel')}</h2>
            <ol className="flex flex-col gap-1.5">
              {matter.stages.map((s, i) => (
                <li
                  key={s.key}
                  className={
                    'flex min-h-11 items-center gap-3 rounded-[14px] px-3.5 ' +
                    (s.status === 'current' ? 'bg-brand-subtle' : 'bg-card')
                  }
                  lang="en"
                >
                  <span
                    className={
                      'flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-2xs font-semibold ' +
                      (s.status === 'done'
                        ? 'bg-positive-subtle text-on-positive-subtle'
                        : s.status === 'current'
                          ? 'bg-brand-solid text-on-brand-solid'
                          : 'bg-sunken text-fg-tertiary')
                    }
                    aria-hidden="true"
                  >
                    {s.status === 'done' ? <IconCheck className="size-3.5" /> : i + 1}
                  </span>
                  <span
                    className={
                      'text-sm ' +
                      (s.status === 'todo' ? 'text-fg-tertiary' : 'font-medium text-fg-primary')
                    }
                  >
                    {s.label}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* the user's own closure log (device-local, §6c) */}
          {hasLog && (
            <Card className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-fg-primary">{tr('matterLogTitle')}</h3>
              <ul className="flex flex-col gap-1.5">
                {log.step1SentAt && (
                  <li className="flex items-center gap-2 text-sm text-fg-primary">
                    <IconCheck className="size-3.5 shrink-0 text-positive-fg" />
                    {tr('matterLogStep1')} · {formatDate(log.step1SentAt)}
                  </li>
                )}
                {log.closedAt && (
                  <li className="flex items-center gap-2 text-sm text-fg-primary">
                    <IconCheck className="size-3.5 shrink-0 text-positive-fg" />
                    {tr('matterLogClosed')} · {formatDate(log.closedAt)}
                  </li>
                )}
              </ul>
            </Card>
          )}

          {/* finding so far */}
          {matter.finding && (
            <Card className="flex flex-col gap-2">
              <h3 className="font-serif text-base font-semibold text-fg-primary" lang="en">
                {matter.finding.title}
              </h3>
              <p className="text-sm leading-relaxed text-fg-primary" lang="en">
                {matter.finding.summary}
              </p>
            </Card>
          )}

          {/* sources */}
          {matter.sources.length > 0 && (
            <section className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold text-fg-primary">{tr('sourcesLabel')}</h2>
              {matter.sources.map((s, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-[14px] bg-card px-3.5 py-3" lang="en">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg-primary">{s.label}</p>
                    <SectionRef sectionRef={s.section} />
                  </div>
                  <Badge tone={coverageTone[s.coverage]} variant="subtle">
                    {s.coverage}
                  </Badge>
                  <VerificationBadge verified={false} />
                </div>
              ))}
            </section>
          )}

          {/* handover receipt */}
          {matter.receipt && (
            <HandoverCard tierLabel={matter.receipt.tierLabel} why={matter.receipt.why} />
          )}
        </div>
      </div>
    </AppShell>
  )
}
