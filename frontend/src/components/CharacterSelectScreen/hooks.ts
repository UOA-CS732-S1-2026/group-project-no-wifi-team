import { useEffect, useState } from 'react'
import { DESIGN_WIDTH, MOBILE_BREAKPOINT } from './constants'

export function useResponsiveStageScale() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    function updateScale() {
      const widthScale = window.innerWidth / DESIGN_WIDTH

      /* On the computer end, it only scales by width. If the height is insufficient,
      scroll up and down.*/
      const nextScale = Math.min(widthScale, 1)

      setScale(nextScale)
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
