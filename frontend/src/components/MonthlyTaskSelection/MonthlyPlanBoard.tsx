import { AnimatePresence, motion } from 'motion/react'
import { type Task, MAX_PLAYER_SELECTIONS } from './types'
import { SelectedSlot } from './SelectedSlot'
import { selectedTasksTitle, selectedTasksBg, taskConfirmBottom } from './images'

// Panel: 360×340px. Slot cards: 300×68px (px-[30px] gives 300px inner width).
// selected-tasks-title.png: 2508×627 (4:1) — header at 360px wide → 90px tall naturally.
// selected-tasks.png: 2508×627 (4:1) — CSS background stretched.
// task-confirm-bottom.png: 1448×1086 (4:3) — confirm button image.

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
      className="relative flex shrink-0 flex-col overflow-hidden"
      style={{
        width: '360px',
        height: 'auto',
        backgroundImage: `url(${selectedTasksBg})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Header — title image with text overlaid */}
      <div className="relative shrink-0 flex items-center justify-center" style={{ height: '66px' }}>
        <img
          src={selectedTasksTitle}
          alt=""
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: 'contain', objectPosition: 'center' }}
        />
        <p className="relative font-serif font-bold text-desk-dark" style={{ marginTop: '-16px' }}>Selected This Quarter</p>
      </div>

      {/* Count label */}
      <p className="shrink-0 text-center font-serif text-xs text-desk-mid py-1">
        Selected {selectedCount}/{MAX_PLAYER_SELECTIONS}
      </p>

      {/* Slot cards + confirm button */}
      <div className="flex flex-col gap-2 px-[30px] pb-3">
        {Array.from({ length: MAX_PLAYER_SELECTIONS }).map((_, i) => (
          <SelectedSlot
            key={i}
            task={selectedTasks[i]}
            onRemove={() => selectedTasks[i] && onRemove(selectedTasks[i]!.id)}
          />
        ))}

        {/* Random event slot */}
        <SelectedSlot
          task={undefined}
          onRemove={() => {}}
          placeholder="🎲 Random Task"
        />

        {/* Confirm button — appears in flow after all slots when all selected */}
        <AnimatePresence>
          {allSelected && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onConfirm}
              className="w-full"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              <img src={taskConfirmBottom} alt="Start Month" className="w-full h-auto" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
