import { useEffect, useState } from 'react'
import { useApp } from '../../lib/app-context'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Chip } from '../ui/Chip'
import { Input } from '../ui/Field'
import { IconPencil } from '../ui/icons'

export interface FactItem {
  key: string
  label: string
  value: string
}

export interface WhenOption {
  key: string
  label: string
}

/** A4b guard: long or non-Latin (Indic/Nastaliq) values take the full row —
    half-width cells would wrap Devanagari/Tamil into ragged towers. */
function wideCell(value: string) {
  return value.length > 24 || /[\u0590-\u08FF\u0900-\u097F\u0980-\u09FF\u0B80-\u0BFF]/.test(value)
}

/**
 * The verification gate inside the conversation (ported from v1's
 * InlineFactCheck): before any generative card, the user confirms or
 * corrects each fact. A2.7 made tangible — nothing is built on facts the
 * user hasn't signed.
 *
 * Calm-authority Phase 5b: the facts read as a compact 2×2 tonal grid
 * (tap any cell to edit inline); the Proof chip (guardrail 2) and the When
 * chip stay 1-tap toggleable so reviewers can drive the live downgrade.
 * Once signed, the gate collapses to a quiet one-line confirmation.
 */
export function FactCheckCard({
  facts,
  onConfirm,
  whenOptions = [],
  proofOptions = [],
  signed = false,
  onEdit,
}: {
  facts: FactItem[]
  onConfirm: (values: Record<string, string>) => void
  whenOptions?: WhenOption[]
  proofOptions?: WhenOption[]
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
    const glance = ['item', 'amount']
      .map((k) => values[k])
      .filter(Boolean)
      .join(' · ')
    return (
      <div className="flex min-h-9 flex-wrap items-center gap-x-2 gap-y-1 px-1 py-1.5 text-xs text-fg-secondary">
        <span className="font-medium text-positive-fg">
          ✓ {tr('factSigned').replace('{n}', String(facts.length))}
        </span>
        {glance && <span className="min-w-0 truncate">{glance}</span>}
        <button
          type="button"
          onClick={() => {
            setExpanded(true)
            onEdit?.()
          }}
          className="ms-auto inline-flex min-h-9 items-center rounded-full px-2 text-xs font-medium text-fg-tertiary underline-offset-4 hover:text-fg-primary hover:underline"
        >
          {tr('edit')}
        </button>
      </div>
    )
  }

  const gridKeys = ['item', 'amount', 'seller', 'issue']
  const gridFacts = facts.filter((f) => gridKeys.includes(f.key))
  const extraRows = facts.filter((f) => !gridKeys.includes(f.key) && f.key !== 'proof' && f.key !== 'when')

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <h3 className="font-serif text-lg font-semibold text-fg-primary">{tr('factCheckTitle')}</h3>
        <p className="mt-1 text-xs text-fg-tertiary">{tr('factCheckSub')}</p>
      </div>

      {/* 2×2 tonal grid — tap a cell to edit inline */}
      <div className="grid grid-cols-2 gap-2">
        {gridFacts.map((f) => (
          <div
            key={f.key}
            className={cn('rounded-xl bg-sunken px-3 py-2', wideCell(values[f.key] ?? '') && 'col-span-2')}
          >
            <div className="flex items-center justify-between gap-1.5">
              <p className="text-xs text-fg-tertiary">{f.label}</p>
              {/* M5: the edit affordance is visible, not hidden behind a tap */}
              <IconPencil className="size-3 shrink-0 text-fg-tertiary/70" />
            </div>
            {editing === f.key ? (
              <Input
                autoFocus
                value={values[f.key] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                onBlur={() => setEditing(null)}
                onKeyDown={(e) => e.key === 'Enter' && setEditing(null)}
                className="mt-1 min-h-9 py-1"
                aria-label={f.label}
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditing(f.key)}
                className="mt-0.5 block w-full truncate rounded text-start text-sm font-medium text-fg-primary"
              >
                {values[f.key] || '—'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* remaining text rows (full width, tap-edit) */}
      {extraRows.map((f) => (
        <div key={f.key} className="flex min-h-9 items-center gap-3 py-0.5">
          <span className="w-24 shrink-0 text-xs text-fg-tertiary">{f.label}</span>
          {editing === f.key ? (
            <Input
              autoFocus
              value={values[f.key] ?? ''}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              onBlur={() => setEditing(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditing(null)}
              className="min-h-9 py-1"
              aria-label={f.label}
            />
          ) : (
            <>
              <span
                className={cn(
                  'min-w-0 flex-1 text-sm font-medium',
                  values[f.key] ? 'text-fg-primary' : 'text-fg-tertiary',
                )}
              >
                {values[f.key] || '—'}
              </span>
              <button
                type="button"
                onClick={() => setEditing(f.key)}
                className="min-h-9 shrink-0 rounded-full px-2.5 text-xs font-medium text-brand-fg"
              >
                {tr('factCorrect')}
              </button>
            </>
          )}
        </div>
      ))}

      {/* 1-tap Proof chips (guardrail 2) */}
      {facts.some((f) => f.key === 'proof') && proofOptions.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-fg-tertiary">{facts.find((f) => f.key === 'proof')?.label}</span>
          <div className="flex flex-wrap gap-1.5">
            {proofOptions.map((o) => (
              <Chip
                key={o.key}
                selected={values.proof === o.key}
                onClick={() => setValues((v) => ({ ...v, proof: v.proof === o.key ? '' : o.key }))}
              >
                {o.label}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* 1-tap When chips — the live downgrade lever (2yr+/not-sure → caution) */}
      {facts.some((f) => f.key === 'when') && whenOptions.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-fg-tertiary">{facts.find((f) => f.key === 'when')?.label}</span>
          <div className="flex flex-wrap gap-1.5">
            {whenOptions.map((o) => (
              <Chip
                key={o.key}
                selected={values.when === o.key}
                onClick={() => setValues((v) => ({ ...v, when: v.when === o.key ? '' : o.key }))}
              >
                {o.label}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* Intended purpose chips (CPA S. 2(7) B2B boundary check) */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-fg-tertiary">{tr('usageLabel')}</span>
        <div className="flex flex-wrap gap-1.5">
          <Chip
            selected={(values.usage ?? 'personal') === 'personal'}
            onClick={() => setValues((v) => ({ ...v, usage: 'personal' }))}
          >
            {tr('usagePersonal')}
          </Chip>
          <Chip
            selected={values.usage === 'business'}
            onClick={() => setValues((v) => ({ ...v, usage: 'business' }))}
          >
            {tr('usageBusiness')}
          </Chip>
        </div>
      </div>

      <Button
        variant="primary"
        size="md"
        block
        disabled={whenOptions.length > 0 && !whenChosen}
        onClick={() => onConfirm(values)}
      >
        {tr('factConfirm')}
      </Button>
    </Card>
  )
}
