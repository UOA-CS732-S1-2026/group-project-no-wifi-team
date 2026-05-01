import { type Task } from './types'

interface Props {
  task: Task | undefined
  onRemove: () => void
}

export function SelectedSlot({ task, onRemove }: Props) {
  return (
    <div
      className={[
        'flex items-center rounded border transition-all duration-200',
        task ? 'border-desk-dark bg-btn' : 'border-desk-mid/60 bg-paper/40',
      ].join(' ')}
      style={{ minHeight: '44px' }}
    >
      {task ? (
        <div className="flex w-full items-center gap-2 px-3 py-2">
          <span className="text-lg">{task.illustration}</span>
          <p className="flex-1 font-serif text-xs font-bold leading-snug text-btn-text">
            {task.name}
          </p>
          <button
            onClick={onRemove}
            className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-sm font-bold text-btn-text/70 transition-colors hover:bg-desk-dark/20 hover:text-btn-text"
          >
            ×
          </button>
        </div>
      ) : (
        <p className="w-full text-center font-serif text-xs text-desk-mid/80">— Pending —</p>
      )}
    </div>
  )
}
