import { useApp } from '../../lib/app-context'
import { cn } from '../../lib/cn'
import { Badge } from '../ui/Badge'
import { IconCheck, IconInfo } from '../ui/icons'

export interface VerificationBadgeProps {
  verified: boolean
  className?: string
}

/** Two states (A5): verified against source / prototype content. */
export function VerificationBadge({ verified, className }: VerificationBadgeProps) {
  const { tr } = useApp()
  return (
    <Badge
      tone={verified ? 'positive' : 'neutral'}
      variant={verified ? 'subtle' : 'outline'}
      leadingIcon={verified ? <IconCheck className="size-3" /> : <IconInfo className="size-3" />}
      className={cn(className)}
      title={verified ? tr('badgeVerified') : tr('badgePrototype')}
    >
      {verified ? tr('badgeVerified') : tr('badgePrototype')}
    </Badge>
  )
}
