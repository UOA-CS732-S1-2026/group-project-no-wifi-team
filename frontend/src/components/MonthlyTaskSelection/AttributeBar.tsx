import { motion, AnimatePresence } from 'motion/react'
import { getLevel } from './types'
import { statusBar } from './images'

// status-bar.png: 2172×724 (3:1). Displayed at 1366×56px with objectFit:cover — no distortion, crops vertically.

interface Props {
  intelligence: number
  health: number
  wealth: number
}

export function AttributeBar({ intelligence, health, wealth }: Props) {
  const attrs = [
    { label: 'Intelligence', value: intelligence, centerOffset: -180 },
    { label: 'Health', value: health, centerOffset: 55 },
    { label: 'Wealth', value: wealth, centerOffset: 245 },
  ]

  return (
    <motion.div
      animate={{ scale: [1, 1.005, 1.005, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="relative w-full shrink-0"
      style={{ height: 74, margin: '26px' }}
    >
      <img
        src={statusBar}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full"
        style={{ objectFit: 'contain', objectPosition: 'center' }}
      />
      <div className="relative h-full">
        {attrs.map(({ label, value, centerOffset }) => (
          <div
            key={label}
            className="absolute top-1/2 w-42 whitespace-nowrap font-serif text-sm text-desk-dark"
            style={{
              left: `calc(50% + ${centerOffset}px)`,
              transform: 'translate(-50%, -50%)',
              letterSpacing: '0.04em',
            }}
          >
            <span>
              {label}:{' '}
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={value}
                  initial={{ opacity: 0, y: -12, scale: 2.5, filter: 'brightness(2)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'brightness(1)' }}
                  exit={{ opacity: 0, y: 12, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="font-bold inline-block"
                  style={{ display: 'inline-block', originX: 0.5 }}
                >
                  {getLevel(value)}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
