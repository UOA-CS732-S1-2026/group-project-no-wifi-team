import { motion } from 'motion/react'
import { type Task } from './types'

interface Props {
  task: Task
  selected: boolean
  disabled: boolean
  onToggle: () => void
}

export function TaskCard({ task, selected, disabled, onToggle }: Props) {
  return (
    <motion.button
      onClick={onToggle}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.015 } : {}}
      whileTap={!disabled ? { scale: 0.985 } : {}}
      className={[
        'flex w-full items-stretch overflow-hidden rounded border text-left transition-all duration-150',
        selected
          ? 'border-desk-dark bg-btn shadow-md'
          : disabled
          ? 'cursor-not-allowed border-desk-light bg-paper/70 opacity-40'
          : 'cursor-pointer border-desk-light bg-paper/70 hover:border-desk-mid hover:bg-paper/90 hover:shadow-sm',
      ].join(' ')}
      style={{ minHeight: '72px' }}
    >
      {/* Illustration thumbnail */}
      <div
        className={[
          'flex w-20 shrink-0 items-center justify-center text-3xl',
          selected ? 'bg-desk-dark/20' : 'bg-binding/60',
        ].join(' ')}
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(180,155,110,0.3) 0%, rgba(210,185,140,0.1) 100%)',
        }}
      >
        {task.illustration}
      </div>

      {/* Task name */}
      <div className="flex flex-1 items-center px-4 py-2">
        <p
          className={[
            'font-serif text-sm font-semibold leading-snug',
            selected ? 'text-btn-text' : 'text-desk-dark',
          ].join(' ')}
        >
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
