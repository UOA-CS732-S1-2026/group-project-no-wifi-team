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
    <div className="relative w-full shrink-0" style={{ height: 74, margin: '26px' }}>
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
              <AnimatePresence mode="wait">
                <motion.span
                  key={getLevel(value)}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold"
                >
                  {getLevel(value)}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
