import { useEffect, useState } from 'react'
import { useApp } from '../../lib/app-context'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Chip } from '../ui/Chip'
import { Input } from '../ui/Field'

export interface FactItem {
  key: string
  label: string
  value: string
}

export interface WhenOption {
  key: string
  label: string
}

/**
 * The verification gate inside the conversation (ported from v1's
 * InlineFactCheck): before any generative card, the user confirms or
 * corrects each fact. A2.7 made tangible — nothing is built on facts the
 * user hasn't signed.
 *
 * Deep-audit merge (PRODUCT.md Law #2): the purchase-window question is a
 * row INSIDE this gate — one consolidated confirmation, not two gates.
 * Empty slots render honestly as '—' and wait for the user to fill them;
 * the gate never asserts a fact the message did not supply.
 *
 * Craft law (master prompt Part 6): once signed, the gate collapses into a
 * one-line docket bar (`✓ n facts confirmed — item · seller · amount [Edit]`)
 * so the thread never becomes a wall of cards. [Edit] re-opens it inline.
 */
export function FactCheckCard({
  facts,
  onConfirm,
  whenOptions = [],
  signed = false,
  onEdit,
}: {
  facts: FactItem[]
  onConfirm: (values: Record<string, string>) => void
  whenOptions?: WhenOption[]
  signed?: boolean
  onEdit?: () => void
}) {
  const { tr } = useApp()
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(facts.map((f) => [f.key, f.value])),
  )
  const [editing, setEditing] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    if (signed) setExpanded(false)
  }, [signed])

  const whenChosen = whenOptions.find((o) => o.key === values.when)

  if (signed && !expanded) {
    const glance = ['item', 'seller', 'amount']
      .map((k) => values[k])
      .filter(Boolean)
      .join(' · ')
    return (
      <div className="flex min-h-11 flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl border border-positive-line bg-positive-subtle px-3.5 py-2.5">
        <span className="text-2xs font-medium text-on-positive-subtle">
          {tr('factSigned').replace('{n}', String(facts.length))}
          {glance && <span className="ms-1.5 font-mono tabular-nums">({glance})</span>}
        </span>
        <button
          type="button"
          onClick={() => {
            setExpanded(true)
            onEdit?.()
          }}
          className="ms-auto inline-flex min-h-9 items-center rounded-full px-2 text-2xs font-medium text-brand-fg underline-offset-4 hover:underline"
        >
          {tr('edit')}
        </button>
      </div>
    )
  }

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <h3 className="font-serif text-lg font-semibold text-fg-primary">{tr('factCheckTitle')}</h3>
        <p className="mt-1 text-2xs text-fg-tertiary">{tr('factCheckSub')}</p>
      </div>
      <div className="flex flex-col gap-1">
        {facts.map((f) => {
          if (f.key === 'when' && whenOptions.length > 0) {
            return (
              <div key={f.key} className="flex min-h-11 flex-col justify-center gap-1.5 rounded-xl px-1 py-1">
                <span className="text-2xs text-fg-tertiary">{f.label}</span>
                {whenChosen ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-fg-primary">{whenChosen.label}</span>
                    <button
                      type="button"
                      onClick={() => setValues((v) => ({ ...v, when: '' }))}
                      className="min-h-9 rounded-full px-2.5 text-2xs font-medium text-brand-fg"
                    >
                      {tr('factCorrect')}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {whenOptions.map((o) => (
                      <Chip
                        key={o.key}
                        onClick={() => setValues((v) => ({ ...v, when: o.key }))}
                      >
                        {o.label}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>
            )
          }
          return (
            <div key={f.key} className="flex min-h-11 items-center gap-2 rounded-xl px-1">
              <span className="w-24 shrink-0 text-2xs text-fg-tertiary">
                {f.label}
              </span>
              {editing === f.key ? (
                <Input
                  autoFocus
                  value={values[f.key] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  onBlur={() => setEditing(null)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditing(null)}
                  className="min-h-9 py-1.5"
                  aria-label={f.label}
                />
              ) : (
                <>
                  <span
                    className={
                      'min-w-0 flex-1 text-sm font-medium ' +
                      (values[f.key] ? 'text-fg-primary' : 'text-fg-tertiary')
                    }
                  >
                    {values[f.key] || '—'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditing(f.key)}
                    className="min-h-9 shrink-0 rounded-full px-2.5 text-2xs font-medium text-brand-fg"
                  >
                    {tr('factCorrect')}
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>
      <Button
        variant="primary"
        size="sm"
        className="self-start"
        disabled={whenOptions.length > 0 && !whenChosen}
        onClick={() => onConfirm(values)}
      >
        {tr('factConfirm')}
      </Button>
    </Card>
  )
}
