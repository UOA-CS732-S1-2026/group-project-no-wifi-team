import { useEffect, useState } from 'react'

import { MOBILE_BREAKPOINT, STAGE_WIDTH } from './constants'

export function useResponsiveStageScale() {
  const [layout, setLayout] = useState({
    scale: 1,
    isMobile: false,
  })

  useEffect(() => {
    function updateLayout() {
      const viewportWidth = window.innerWidth
      const isMobile = viewportWidth < MOBILE_BREAKPOINT

      if (!isMobile) {
        setLayout({
          scale: 1,
          isMobile: false,
        })
        return
      }

      const safePadding = 8
      const scale = Math.min((viewportWidth - safePadding) / STAGE_WIDTH, 1)

      setLayout({
        scale,
        isMobile: true,
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
