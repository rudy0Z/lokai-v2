import { cn } from '../../lib/cn'
import { IconMic } from '../ui/icons'

export type OrbState = 'idle' | 'listening' | 'thinking'

export interface VoiceOrbProps {
  state?: OrbState
  size?: 'md' | 'lg'
  className?: string
}

/**
 * THE signature element (DESIGN.md): layered sage gradients that breathe
 * when idle and pulse when listening. The only gradient in the product.
 * Styles live in base.css (.voice-orb*) — reduced-motion collapses them.
 */
export function VoiceOrb({ state = 'idle', size = 'lg', className }: VoiceOrbProps) {
  return (
    <div
      className={cn(
        'voice-orb',
        `voice-orb--${size}`,
        `voice-orb--${state}`,
        className,
      )}
      role="img"
      aria-label={state === 'listening' ? 'Listening' : state === 'thinking' ? 'Thinking' : 'LokAI'}
    >
      <span className="orb-layer orb-outer" aria-hidden="true" />
      <span className="orb-layer orb-mid" aria-hidden="true" />
      {state === 'listening' && (
        <>
          <span className="orb-ring orb-ring--a" aria-hidden="true" />
          <span className="orb-ring orb-ring--b" aria-hidden="true" />
        </>
      )}
      <span className="orb-core" aria-hidden="true">
        <IconMic className="size-6 text-fg-on-inverted" />
      </span>
    </div>
  )
}
