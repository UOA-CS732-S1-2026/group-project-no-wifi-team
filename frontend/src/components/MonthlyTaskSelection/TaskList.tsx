import { AnimatePresence, motion } from 'motion/react'
import { type Category, type Task } from './types'
import { TaskCard } from './TaskCard'
import { availableTasksBg } from './images'

interface Props {
  activeCategory: Category
  tasks: Task[]
  selectedIds: string[]
  onToggle: (id: string) => void
  loading?: boolean
}

export function TaskList({ activeCategory, tasks, selectedIds, onToggle, loading }: Props) {
  return (
    <div
      className="flex shrink-0 flex-col overflow-hidden"
      style={{
        width: '440px',
        marginRight: 80,
        height: 'auto',
        backgroundImage: `url(${availableTasksBg})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Title */}
      <div className="shrink-0 flex items-center justify-center" style={{ padding: '30px 0 12px 0' }}>
        <p className="font-serif font-bold text-desk-dark">Available Tasks</p>
      </div>

      {/* Task cards */}
      <div
        className="overflow-y-auto hide-scrollbar"
        style={{
          height: '410px',
          padding: '8px 30px 24px',
          scrollbarWidth: 'none',
        }}
      >
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <p className="font-serif text-sm text-desk-mid animate-pulse">Loading tasks…</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-2"
            >
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    selected={selectedIds.includes(task.id)}
                    onToggle={() => onToggle(task.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
