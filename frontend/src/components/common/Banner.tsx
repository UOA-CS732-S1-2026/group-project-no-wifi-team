import type { ReactNode } from 'react'

type BannerTone = 'default' | 'happy' | 'bad'

interface BannerProps {
  tone?: BannerTone
  className?: string
  children: ReactNode
}

const TONE_BG: Record<BannerTone, string> = {
  default: 'bg-banner',
  happy: 'bg-[#a5763e]',
  bad: 'bg-[#5e493b]',
}

/**
 * Hexagonally clipped label banner used for screen titles. Three tones map to
 * the game's mood states; "default" matches the existing TitleScreen.
 */
export function Banner({ tone = 'default', className = '', children }: BannerProps) {
  return (
    <div className={`relative inline-flex items-center justify-center px-8 py-4 ${className}`}>
      <div
        className={`
          absolute inset-0 shadow-[0_3px_10px_rgba(0,0,0,0.3)]
          [clip-path:polygon(5%_0%,95%_0%,100%_50%,95%_100%,5%_100%,0%_50%)]
          ${TONE_BG[tone]}
        `}
      />
      <div className="relative z-10 text-center font-serif font-bold text-btn-text">
        {children}
      </div>
    </div>
  )
}
