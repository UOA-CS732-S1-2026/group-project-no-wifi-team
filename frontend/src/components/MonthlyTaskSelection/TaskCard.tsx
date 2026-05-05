import { motion } from 'motion/react'
import { type Task } from './types'
import { availableTasks } from './images'

interface Props {
  task: Task
  selected: boolean
  onToggle: () => void
}

export function TaskCard({ task, selected, onToggle }: Props) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className={[
        'flex w-full items-stretch overflow-hidden rounded text-left transition-all duration-150 cursor-pointer',
        selected ? 'shadow-md' : 'hover:shadow-sm',
      ].join(' ')}
      style={{
        width: '380px',
        height: '80px',
        backgroundImage: `url(${availableTasks})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Illustration thumbnail */}
      <div className="flex w-20 shrink-0 items-center justify-center text-3xl">
        {task.illustration}
      </div>

      {/* Task name */}
      <div className="flex flex-1 items-center px-4 py-2">
        <p className="font-serif text-sm font-semibold leading-snug text-desk-dark">
          {task.name}
        </p>
      </div>

      {selected && (
        <div className="flex items-center pr-3">
          <span className="font-bold text-btn-text">✓</span>
        </div>
      )}
    </motion.button>
  )
}
