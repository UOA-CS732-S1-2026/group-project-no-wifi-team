import { useEffect, useRef } from 'react'
import { animate } from 'motion/react'

interface CountUpProps {
  to: number
  from?: number
  duration?: number
  delay?: number
  showSign?: boolean
}

/**
 * A utility component for numerical count-up/down animations.
 */
export function CountUp({
  to,
  from = 0,
  duration = 1.5,
  delay = 0,
  showSign = false,
}: CountUpProps) {
  const nodeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = nodeRef.current
    if (!node) return

    const controls = animate(from, to, {
      duration,
      delay,
      ease: 'easeOut',
      onUpdate(value) {
        const rounded = Math.round(value)
        const sign = showSign && rounded >= 0 ? '+' : ''
        node.textContent = sign + rounded.toLocaleString()
      },
    })

    return () => controls.stop()
  }, [from, to, duration, delay, showSign])

  return <span ref={nodeRef}>{showSign && from >= 0 ? `+${from}` : from}</span>
}