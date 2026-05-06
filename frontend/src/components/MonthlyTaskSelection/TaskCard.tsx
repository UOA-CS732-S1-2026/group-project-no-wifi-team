import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { type Task } from './types'
import { availableTasks } from './images'

interface Props {
  task: Task
  selected: boolean
  onToggle: () => void
}

function DescriptionTooltip({ text, anchorRef }: { text: string; anchorRef: React.RefObject<HTMLDivElement | null> }) {
  if (!anchorRef.current) return null
  const rect = anchorRef.current.getBoundingClientRect()
  return createPortal(
    <div
      className="fixed z-[9999] w-64 rounded bg-desk-dark px-3 py-2 shadow-xl pointer-events-none"
      style={{ top: rect.top, left: rect.right + 8 }}
    >
      <p className="font-serif text-xs leading-relaxed text-btn-text">{text}</p>
    </div>,
    document.body
  )
}

export function TaskCard({ task, selected, onToggle }: Props) {
  const [hovered, setHovered] = useState(false)
  const descRef = useRef<HTMLDivElement>(null)

  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className={[
        'flex items-stretch rounded text-left transition-all duration-150 cursor-pointer',
        selected ? 'shadow-md' : 'hover:shadow-sm',
      ].join(' ')}
      style={{
        width: '380px',
        height: '80px',
        backgroundImage: `url(${availableTasks})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        outline: selected ? '2px solid #7a5c3a' : '2px solid transparent',
        filter: selected ? 'brightness(0.93)' : 'none',
      }}
    >
      {/* Left image placeholder */}
      <div className="flex w-20 shrink-0 items-center justify-center text-3xl">
        {task.illustration}
      </div>

      {/* Title + Description */}
      <div className="flex flex-1 flex-col justify-center gap-1 px-3 py-2">
        <p className="font-serif text-sm font-semibold leading-snug text-desk-dark">
          {task.name}
        </p>
        {task.description && (
          <div
            ref={descRef}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <p className="font-serif text-xs leading-snug text-desk-mid line-clamp-2">
              {task.description}
            </p>
            {hovered && <DescriptionTooltip text={task.description} anchorRef={descRef} />}
          </div>
        )}
      </div>

    </motion.button>
  )
}
