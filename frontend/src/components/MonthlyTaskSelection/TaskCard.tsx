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
      data-sfx="task-select"
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className={[
        'flex items-stretch rounded text-left transition-all duration-150 cursor-pointer',
        selected ? 'shadow-md' : 'hover:shadow-sm',
      ].join(' ')}
      style={{
        width: '380px',
        height: '110px',
        backgroundImage: `url(${availableTasks})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        outline: selected ? '2px solid #7a5c3a' : '2px solid transparent',
        filter: selected ? 'brightness(0.93)' : 'none',
      }}
    >
      {/* Left icon */}
      <div className="flex shrink-0 items-center justify-center p-2" style={{ width: 190, height: 110 }}>
        <img src={task.illustration} alt="" className="h-full w-full object-contain" />
      </div>

      {/* Title */}
      <div className="flex flex-1 flex-col justify-center px-3 py-2">
        <p className="font-serif text-sm font-semibold leading-snug text-desk-dark">
          {task.name}
        </p>
      </div>

    </motion.button>
  )
}
