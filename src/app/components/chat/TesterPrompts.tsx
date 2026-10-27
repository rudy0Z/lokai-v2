import { useApp } from '../../lib/app-context'
import type { TesterOption } from '../../data/interactive-scenarios'

/**
 * The branching-tester cards (master prompt Part 2): 3–4 selectable prompts
 * right above the composer, each declaring the path it stress-tests. Free
 * typing and voice remain untouched alongside.
 */
export function TesterPrompts({
  label,
  options,
  onPick,
}: {
  label: string
  options: TesterOption[]
  onPick: (o: TesterOption) => void
}) {
  const { tr, lang } = useApp()
  return (
    <div className="mx-auto flex w-full max-w-[380px] flex-col gap-1.5">
      <p className="px-1 text-2xs font-medium text-fg-tertiary">{label}</p>
      {options.map((o, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPick(o)}
          className="pressable-card flex flex-col gap-1 rounded-2xl border border-line-default bg-card px-3.5 py-2.5 text-start transition-colors hover:bg-component-hover"
        >
          <span className="text-sm leading-snug text-fg-primary">{o.text}</span>
          <span className="font-mono text-2xs text-brand-fg">{tr(o.meta as never)}</span>
        </button>
      ))}
      <p className="px-1 text-2xs text-fg-tertiary">{tr('testerHint')}</p>
      {/* lang used only to tag the option language context for the tester */}
      <span className="sr-only" lang={lang} />
    </div>
  )
}
