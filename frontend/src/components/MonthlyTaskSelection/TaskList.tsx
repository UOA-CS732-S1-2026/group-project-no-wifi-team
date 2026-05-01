import { AnimatePresence, motion } from 'motion/react'
import { type Category, type Task, MAX_PLAYER_SELECTIONS } from './types'
import { TaskCard } from './TaskCard'

interface Props {
  activeCategory: Category
  tasks: Task[]
  selectedIds: string[]
  onToggle: (id: string) => void
}

export function TaskList({ activeCategory, tasks, selectedIds, onToggle }: Props) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div
        className="shrink-0 border-b px-4 py-2 text-center"
        style={{ borderColor: 'rgba(160,120,60,0.3)', background: 'rgba(237,228,200,0.45)' }}
      >
        <p className="font-serif text-sm font-bold text-desk-dark">Choose Tasks</p>
      </div>

      {/* Scrollable task list */}
      <div className="relative flex-1 overflow-y-auto p-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-2.5"
          >
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                selected={selectedIds.includes(task.id)}
                disabled={
                  !selectedIds.includes(task.id) &&
                  selectedIds.length >= MAX_PLAYER_SELECTIONS
                }
                onToggle={() => onToggle(task.id)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Scroll hint */}
        <div className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 opacity-30">
          <span className="text-xs text-desk-dark">▲</span>
          <span className="text-xs text-desk-dark">▼</span>
        </div>
      </div>
    </div>
  )
}
