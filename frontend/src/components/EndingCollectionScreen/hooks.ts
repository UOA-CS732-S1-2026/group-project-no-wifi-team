import { useEffect, useState } from 'react'

import { MOBILE_BREAKPOINT, STAGE_HEIGHT, STAGE_WIDTH } from './constants'

export function useResponsiveStageScale() {
  const [layout, setLayout] = useState({
    scale: 1,
    isMobile: false,
  })

  useEffect(() => {
    function updateLayout() {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const isMobile = viewportWidth < MOBILE_BREAKPOINT
      const widthScale = viewportWidth / STAGE_WIDTH
      const heightScale = viewportHeight / STAGE_HEIGHT
      const scale = Math.max(widthScale, heightScale)
      const roundedScale = Math.round(scale * 1000) / 1000

      setLayout((previous) => {
        if (previous.scale === roundedScale && previous.isMobile === isMobile) {
          return previous
        }

        return {
          scale: roundedScale,
          isMobile,
        }
      })
    }

    updateLayout()
    window.addEventListener('resize', updateLayout)
    window.addEventListener('orientationchange', updateLayout)

    return () => {
      window.removeEventListener('resize', updateLayout)
      window.removeEventListener('orientationchange', updateLayout)
    }
  }, [])

  return layout
}
