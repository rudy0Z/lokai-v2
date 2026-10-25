import { useApp } from '../../lib/app-context'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { IconPencil, IconRefresh, IconTrash } from '../ui/icons'

export interface CardActionsProps {
  onEdit?: () => void
  onRegenerate?: () => void
  onDiscard?: () => void
  editing?: boolean
  className?: string
}

/** Edit / Regenerate / Discard — the user-control affordance on every
 *  generative card (A2 rule 7). Quiet by design; one card, one row. */
export function CardActions({ onEdit, onRegenerate, onDiscard, editing, className }: CardActionsProps) {
  const { tr } = useApp()
  return (
    <div className={cn('flex flex-wrap items-center gap-1', className)}>
      {onEdit && (
        <Button variant="ghost" size="sm" leadingIcon={<IconPencil className="size-3.5" />} onClick={onEdit}>
          {editing ? tr('saveChanges') : tr('edit')}
        </Button>
      )}
      {onRegenerate && (
        <Button variant="ghost" size="sm" leadingIcon={<IconRefresh className="size-3.5" />} onClick={onRegenerate}>
          {tr('regenerate')}
        </Button>
      )}
      {onDiscard && (
        <Button
          variant="ghost"
          size="sm"
          leadingIcon={<IconTrash className="size-3.5" />}
          onClick={onDiscard}
          className="text-danger-fg hover:bg-danger-subtle"
        >
          {tr('discard')}
        </Button>
      )}
    </div>
  )
}
