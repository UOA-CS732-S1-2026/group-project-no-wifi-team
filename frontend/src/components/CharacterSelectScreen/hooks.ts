import { useEffect, useState } from 'react'
import { DESIGN_WIDTH, DESIGN_HEIGHT, MOBILE_BREAKPOINT } from './constants'

export function useResponsiveStageScale() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    function updateScale() {
      const widthScale = window.innerWidth / DESIGN_WIDTH
      const heightScale = window.innerHeight / DESIGN_HEIGHT
      setScale(Math.min(widthScale, heightScale) * 1.05)
    }

    updateScale()
    window.addEventListener('resize', updateScale)

    return () => {
      window.removeEventListener('resize', updateScale)
    }
  }, [])

  return scale
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function updateIsMobile() {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    updateIsMobile()
    window.addEventListener('resize', updateIsMobile)

    return () => {
      window.removeEventListener('resize', updateIsMobile)
    }
  }, [])

  return isMobile
}
