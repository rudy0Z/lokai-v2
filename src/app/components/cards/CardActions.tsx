import { useApp } from '../../lib/app-context'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'

export interface CardActionsProps {
  onEdit?: () => void
  onRegenerate?: () => void
  onDiscard?: () => void
  editing?: boolean
  className?: string
}

/** Edit / Regenerate / Discard — the user-control affordance on every
 *  generative card (A2 rule 7, law 4). Text-only and quiet: control stays
 *  visible and labelled, without a three-icon chrome row under every card. */
export function CardActions({ onEdit, onRegenerate, onDiscard, editing, className }: CardActionsProps) {
  const { tr } = useApp()
  return (
    <div className={cn('flex flex-wrap items-center gap-0.5', className)}>
      {onEdit && (
        <Button variant="ghost" size="sm" onClick={onEdit}>
          {editing ? tr('saveChanges') : tr('edit')}
        </Button>
      )}
      {onRegenerate && (
        <Button variant="ghost" size="sm" onClick={onRegenerate}>
          {tr('regenerate')}
        </Button>
      )}
      {onDiscard && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDiscard}
          className="text-danger-fg hover:bg-danger-subtle"
        >
          {tr('discard')}
        </Button>
      )}
    </div>
  )
}
