import { motion, AnimatePresence } from 'motion/react'
import { type Task } from './types'
import { selectedTasks as selectedTaskBg, availableTasks } from './images'

// Slot card: 300×68px (full width within the px-[30px] padded panel).
// selected-task-bg.png: 1086×1448 (portrait) — CSS background stretched to slot.

interface Props {
  task: Task | undefined
  onRemove: () => void
  placeholder?: string
}

export function SelectedSlot({ task, onRemove, placeholder = '— Pending —' }: Props) {
  return (
    <div className="flex w-full items-center rounded" style={{ height: '68px', position: 'static' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        {task ? (
          <motion.div
            key={task.id}
            layoutId={task.id}
            className="flex w-full items-center gap-2 px-3"
            style={{
              height: '68px',
              backgroundImage: `url(${availableTasks})`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          >
            <img
              src={task.illustration}
              alt=""
              className="shrink-0 object-contain"
              style={{ width: 72, height: 72 }}
            />
            <p className="flex-1 font-serif text-xs font-bold leading-snug text-desk-dark">
              {task.name}
            </p>
            <button
              onClick={onRemove}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-sm font-bold text-desk-dark/70 transition-colors hover:bg-desk-dark/20 hover:text-desk-dark cursor-pointer"
            >
              ×
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex w-full items-center justify-center font-serif text-xs font-bold leading-2xl text-desk-dark"
            style={{
              height: '68px',
              backgroundImage: `url(${selectedTaskBg})`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <p className="w-full text-center">
              {placeholder === 'Random Task' && <span className="text-2xl">🎲 </span>}
              {placeholder}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
