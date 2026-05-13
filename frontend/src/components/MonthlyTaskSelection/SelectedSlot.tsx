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
  const baseStyle = {
    height: '68px',
    backgroundImage: `url(${task ? availableTasks : selectedTaskBg})`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
  }

  if (task) {
    return (
      <button
        type="button"
        onClick={onRemove}
        className="flex w-full items-center rounded transition-all duration-200 cursor-pointer hover:brightness-95 active:scale-[0.98]"
        style={baseStyle}
        aria-label={`Remove ${task.name}`}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={task.id}
            layoutId={task.id}
            className="flex w-full items-center gap-2 px-3 pointer-events-none"
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <img
              src={task.illustration}
              alt=""
              className="shrink-0 object-contain"
              style={{ width: 72, height: 72 }}
            />
            <p className="flex-1 font-serif text-xs font-bold leading-snug text-desk-dark text-left">
              {task.name}
            </p>
            <span className="shrink-0 text-sm font-bold text-desk-dark/50">×</span>
          </motion.div>
        </AnimatePresence>
      </button>
    )
  }

  return (
    <div
      className="flex w-full items-center rounded transition-all duration-200"
      style={baseStyle}
    >
      <AnimatePresence mode="popLayout">
        <motion.p
          key="placeholder"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full text-center font-serif text-xs font-bold leading-2xl text-desk-dark"
        >
          {placeholder === 'Random Task' && <span className="text-2xl">🎲 </span>}
          {placeholder}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
