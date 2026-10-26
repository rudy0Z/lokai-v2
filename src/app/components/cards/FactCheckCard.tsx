import { useState } from 'react'
import { useApp } from '../../lib/app-context'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Field'

export interface FactItem {
  key: string
  label: string
  value: string
}

/**
 * The verification gate inside the conversation (ported from v1's
 * InlineFactCheck): before any generative card, the user confirms or
 * corrects each fact. A2.7 made tangible — nothing is built on facts the
 * user hasn't signed.
 */
export function FactCheckCard({
  facts,
  onConfirm,
}: {
  facts: FactItem[]
  onConfirm: (values: Record<string, string>) => void
}) {
  const { tr } = useApp()
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(facts.map((f) => [f.key, f.value])),
  )
  const [editing, setEditing] = useState<string | null>(null)

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <h3 className="font-serif text-lg font-semibold text-fg-primary">{tr('factCheckTitle')}</h3>
        <p className="mt-1 text-2xs text-fg-tertiary">{tr('factCheckSub')}</p>
      </div>
      <div className="flex flex-col gap-1">
        {facts.map((f) => (
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
                <span className="min-w-0 flex-1 text-sm font-medium text-fg-primary">
                  {values[f.key]}
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
        ))}
      </div>
      <Button variant="primary" size="sm" className="self-start" onClick={() => onConfirm(values)}>
        {tr('factConfirm')}
      </Button>
    </Card>
  )
}
