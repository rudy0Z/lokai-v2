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
    <div className="mx-auto flex w-full max-w-[380px] flex-col gap-1.5 px-0.5">
      <p className="px-1 text-2xs font-semibold text-fg-secondary">{label}</p>
      <div className="flex flex-col gap-1.5">
        {options.map((o, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPick(o)}
            className="pressable flex flex-col gap-1 rounded-xl bg-sunken px-3 py-2 text-start transition-colors hover:bg-component-hover active:scale-[0.98]"
          >
            <span className="text-sm leading-snug text-fg-primary">{o.text}</span>
            <span className="text-2xs text-fg-tertiary">{tr(o.meta as never)}</span>
          </button>
        ))}
      </div>
      {/* lang used only to tag the option language context for the tester */}
      <span className="sr-only" lang={lang} />
    </div>
  )
}
