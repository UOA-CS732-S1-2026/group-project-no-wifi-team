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
      layout
      layoutId={task.id}
      exit={{ opacity: 0, scale: 0.9 }}
      // Ensure moving cards are always on top
      style={{
        zIndex: selected ? 50 : 1,
        position: 'relative',
        ...{
          width: '380px',
          height: '110px',
          backgroundImage: `url(${availableTasks})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          outline: selected ? '2px solid #7a5c3a' : '2px solid transparent',
          filter: selected ? 'brightness(0.93)' : 'none',
        }
      }}
      onClick={onToggle}
      data-sfx="task-select"
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className="flex items-stretch rounded text-left cursor-pointer"
    >
      {/* Left icon */}
      <div className="flex shrink-0 items-center justify-center p-2" style={{ width: 190, height: 110 }}>
        <img src={task.illustration} alt="" className="h-full w-full object-contain" />
      </div>

      {/* Title */}
      <div className="flex flex-1 flex-col justify-center px-3 py-2 pr-6">
        <p className="font-serif text-sm font-semibold leading-snug text-desk-dark">
          {task.name}
        </p>
      </div>

    </motion.button>
  )
}
