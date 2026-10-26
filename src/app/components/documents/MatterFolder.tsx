import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useApp } from '../../lib/app-context'
import { ExhibitPaper } from './ExhibitPaper'

/**
 * The documents-vault hero, ported from v1's MatterFolder and reskinned:
 * a folder whose flap swings open on a tap, fanning three exhibit cards
 * (3D bottom-origin rotation, staggered springs, tap-driven not hover).
 */
export function MatterFolder({
  exhibits,
}: {
  exhibits: { id: string; name: string }[]
}) {
  const { tr } = useApp()
  const [open, setOpen] = useState(false)
  const fans = [-7, 0, 7]

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`${tr('exhibitsLabel')} — ${open ? 'close' : 'open'}`}
        className="pressable relative block h-[150px] w-full max-w-[300px]"
        style={{ perspective: '700px' }}
      >
        {/* fanned exhibits, revealed as the flap opens */}
        <div className="absolute inset-x-6 top-3 h-[104px]">
          {exhibits.slice(0, 3).map((ex, i) => (
            <AnimatePresence key={ex.id}>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 14, rotate: 0 }}
                  animate={{ opacity: 1, y: -6 - i * 8, rotate: fans[i] }}
                  exit={{ opacity: 0, y: 14, rotate: 0 }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.42, delay: i * 0.05 }}
                  className="absolute inset-x-0 top-2"
                >
                  <ExhibitPaper name={ex.name} />
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* folder back */}
        <div className="absolute inset-x-0 bottom-4 top-9 rounded-2xl bg-brand-subtle" aria-hidden="true" />
        {/* flap — swings open on 3D bottom-origin rotation */}
        <motion.div
          animate={{ rotateX: open ? -104 : 0 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.45 }}
          style={{ transformOrigin: 'bottom', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
          className="absolute inset-x-0 bottom-4 top-9 rounded-2xl border border-brand-line-subtle bg-brand-solid"
          aria-hidden="true"
        >
          <span className="absolute inset-x-0 top-0 h-1.5 rounded-t-2xl bg-black/10" />
          {!open && (
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-serif text-base font-semibold text-on-brand-solid">
              {tr('exhibitsLabel')}
            </span>
          )}
        </motion.div>
        {/* folder front pocket */}
        <div
          className="absolute inset-x-0 bottom-0 h-12 rounded-2xl bg-brand-solid/85"
          aria-hidden="true"
        />
      </button>
    </div>
  )
}
