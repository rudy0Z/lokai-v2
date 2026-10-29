import { cn } from '../../lib/cn'

/**
 * Small paper exhibit thumbnail (ported from v1's ExhibitPaper): accent edge
 * + a REAL two-line preview (visual report B7 — a skeleton in a finished
 * screen reads as a page that never loaded). The filename keeps the mono
 * docket register; the preview lines are the document's own mock content.
 */
const PREVIEW: { test: RegExp; lines: [string, string] }[] = [
  { test: /gst-invoice|invoice|mobile-14500/i, lines: ['HomeKart Retail · Tax invoice', 'Mixer Grinder 750W · UPI paid'] },
  { test: /whatsapp|deposit-demand/i, lines: ['Sent on WhatsApp', 'Refund demand, bills asked'] },
  { test: /demand-notice|objection/i, lines: ['Registered post · A/D', 'Objection enclosed'] },
  { test: /upi-log|upi/i, lines: ['Bank statement extract', '₹50,000 deposit · UTR cited'] },
  { test: /property-tax|electricity-bill/i, lines: ['Municipal demand', 'Amount disputed — hearing asked'] },
  { test: /closure/i, lines: ['Resolution record', 'Matter closed · user copy'] },
]

export function ExhibitPaper({ name, className }: { name: string; className?: string }) {
  const lines = PREVIEW.find((p) => p.test.test(name))?.lines
  return (
    <div className={cn('paper relative w-full overflow-hidden rounded-[10px] px-3 pb-3 pt-2', className)}>
      <span className="absolute inset-y-0 start-0 w-1 bg-brand-solid" aria-hidden="true" />
      <p className="truncate ps-1.5 font-mono text-2xs text-fg-secondary" lang="en">
        {name}
      </p>
      <div className="mt-1.5 flex flex-col gap-0.5 ps-1.5">
        {lines ? (
          <>
            <p className="truncate text-2xs font-medium text-fg-primary" lang="en">{lines[0]}</p>
            <p className="truncate text-2xs text-fg-tertiary" lang="en">{lines[1]}</p>
          </>
        ) : (
          <p className="truncate text-2xs text-fg-tertiary" lang="en">Mock exhibit · evidence preview</p>
        )}
      </div>
    </div>
  )
}
