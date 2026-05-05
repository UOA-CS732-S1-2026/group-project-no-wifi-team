import { type Task } from './types'
import selectedTaskBg from '../../assets/MonthlyTaskSelection/selected-tasks.png'
import availableTasks from '../../assets/MonthlyTaskSelection/available-tasks.png'

// Slot card: 300×68px (full width within the px-[30px] padded panel).
// selected-task-bg.png: 1086×1448 (portrait) — CSS background stretched to slot.

interface Props {
  task: Task | undefined
  onRemove: () => void
  placeholder?: string
}

export function SelectedSlot({ task, onRemove, placeholder = '— Pending —' }: Props) {
  return (
    <div
      className="flex w-full items-center rounded transition-all duration-200"
      style={{
        height: '68px',
        backgroundImage: `url(${task ? availableTasks : selectedTaskBg})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {task ? (
        <div className="flex w-full items-center gap-2 px-3">
          <span className="text-lg">{task.illustration}</span>
          <p className="flex-1 font-serif text-xs font-bold leading-snug text-desk-dark">
            {task.name}
          </p>
          <button
            onClick={onRemove}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-sm font-bold text-desk-dark/70 transition-colors hover:bg-desk-dark/20 hover:text-desk-dark"
          >
            ×
          </button>
        </div>
      ) : (
        <p className="w-full text-center font-serif text-xs font-bold leading-snug text-desk-dark">{placeholder}</p>
      )}
    </div>
  )
}
