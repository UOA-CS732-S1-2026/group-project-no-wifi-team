import { motion } from 'motion/react'
import { type Task, MAX_PLAYER_SELECTIONS } from './types'
import { SelectedSlot } from './SelectedSlot'

interface Props {
  selectedTasks: (Task | undefined)[]
  selectedCount: number
  allSelected: boolean
  onRemove: (id: string) => void
  onConfirm: () => void
}

export function MonthlyPlanBoard({
  selectedTasks,
  selectedCount,
  allSelected,
  onRemove,
  onConfirm,
}: Props) {
  return (
    <div
      className="flex w-40 shrink-0 flex-col overflow-hidden sm:w-52"
      style={{ borderLeft: '1px solid rgba(160,120,60,0.35)' }}
    >
      {/* Ribbon / scroll header */}
      <div
        className="shrink-0 px-2 py-3 text-center"
        style={{
          background: '#c4a06a',
          clipPath: 'polygon(0% 0%, 100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%)',
        }}
      >
        <p className="font-serif text-xs font-bold leading-tight text-btn-text sm:text-sm">
          This Month's Tasks
        </p>
        <p className="mt-0.5 font-serif text-[10px] text-btn-text/80">
          Selected {selectedCount}/{MAX_PLAYER_SELECTIONS + 1}
        </p>
      </div>

      {/* Task slots */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
        {Array.from({ length: MAX_PLAYER_SELECTIONS }).map((_, i) => (
          <SelectedSlot
            key={i}
            task={selectedTasks[i]}
            onRemove={() => selectedTasks[i] && onRemove(selectedTasks[i]!.id)}
          />
        ))}

        {/* Random event slot */}
        <div
          className="flex items-center justify-center rounded border py-3"
          style={{
            borderColor: 'rgba(160,120,60,0.45)',
            borderStyle: 'dashed',
            background: 'rgba(210,185,140,0.2)',
          }}
        >
          <p
            className="font-serif text-lg font-bold text-desk-mid"
            title="Random event — added by the system"
          >
            +
          </p>
        </div>
      </div>

      {/* Confirm button */}
      <div
        className="shrink-0 border-t p-3"
        style={{ borderColor: 'rgba(160,120,60,0.3)' }}
      >
        <motion.button
          whileHover={allSelected ? { scale: 1.04 } : {}}
          whileTap={allSelected ? { scale: 0.96 } : {}}
          disabled={!allSelected}
          onClick={onConfirm}
          className={[
            'w-full rounded py-2 font-serif text-xs font-bold transition-all duration-150 sm:text-sm',
            allSelected
              ? 'cursor-pointer bg-desk-dark text-btn-text shadow-md hover:brightness-110'
              : 'cursor-not-allowed bg-binding text-desk-mid opacity-60',
          ].join(' ')}
        >
          {allSelected
            ? 'Start Month →'
            : `Pick ${MAX_PLAYER_SELECTIONS - selectedCount} more`}
        </motion.button>
      </div>
    </div>
  )
}
