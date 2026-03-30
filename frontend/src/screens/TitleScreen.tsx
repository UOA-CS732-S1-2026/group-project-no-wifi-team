import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.3.07-.62.07-.94s-.03-.63-.07-.95l2.03-1.58c.18-.14.23-.41.12-.62l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.62l2.03 1.58c-.04.32-.07.64-.07.95s.03.66.07.96l-2.03 1.58c-.18.14-.23.41-.12.62l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.04.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.62l-2.03-1.58z" />
    </svg>
  )
}

// Dynamically calculate spiral count based on container width
function useSpiralCount(ref: React.RefObject<HTMLDivElement | null>) {
  const [count, setCount] = useState(8)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setCount(Math.max(4, Math.floor(el.clientWidth / 28)))
    // Compute initial value based on current width
    update()

    // In environments without ResizeObserver (e.g., Vitest's jsdom), skip observing
    if (typeof ResizeObserver === 'undefined') {
      return
    }
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return count
}

export function TitleScreen() {
  const notebookRef = useRef<HTMLDivElement>(null)
  const spiralCount = useSpiralCount(notebookRef)

  return (
    <div
      className="
        flex h-dvh w-full items-center justify-center overflow-hidden
        bg-[radial-gradient(ellipse_at_30%_60%,var(--color-desk-light)_0%,var(--color-desk-mid)_50%,var(--color-desk-dark)_100%)]
      "
    >
      {/* Mobile: full-screen notebook. Desktop (sm:): centered card with shadow */}
      <div
        ref={notebookRef}
        className="
          relative flex w-full flex-col overflow-hidden
          h-dvh rounded-none
          sm:h-auto sm:max-w-xl sm:rounded-sm sm:mx-4
          bg-paper
          bg-[image:linear-gradient(rgba(150,130,90,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(150,130,90,0.18)_1px,transparent_1px)]
          bg-[size:24px_24px]
          sm:shadow-[0_10px_40px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(160,130,80,0.25)]
        "
      >
        {/* Spiral binding — count adapts to actual width */}
        <div className="flex items-center justify-evenly border-b border-binding-border bg-binding px-2 py-2">
          {Array.from({ length: spiralCount }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-3.5 shrink-0 rounded-full border-2 border-desk-dark bg-desk-light shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]"
            />
          ))}
        </div>

        {/* Content — vertically centered, responsive spacing */}
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10 sm:gap-7 sm:px-10 sm:py-12">
          {/* Title banner */}
          <div className="relative flex w-64 items-center justify-center my-20 py-5 sm:w-72">
            <div className="absolute inset-0 bg-banner shadow-[0_3px_10px_rgba(0,0,0,0.3)] [clip-path:polygon(5%_0%,95%_0%,100%_50%,95%_100%,5%_100%,0%_50%)]" />
            <p className="relative z-10 text-center font-serif text-base font-bold leading-snug text-btn-text sm:text-lg">
              International Student
              <br />
              Simulator
            </p>
          </div>

          {/* Start button */}
          <motion.button
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="w-48 border border-desk-dark bg-btn py-3 font-serif text-sm text-btn-text shadow-[0_2px_6px_rgba(0,0,0,0.25)] sm:w-56 sm:text-base"
          >
            Start Game
          </motion.button>

          {/* About us + Sign in */}
          <div className="flex gap-4 sm:gap-5">
            <button className="rounded-full border border-desk-dark bg-btn px-6 py-2 font-serif text-xs text-btn-text shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-150 hover:brightness-110 active:scale-95 sm:px-7 sm:text-sm">
              about us
            </button>
            <button className="rounded-full border border-desk-dark bg-btn px-6 py-2 font-serif text-xs text-btn-text shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-150 hover:brightness-110 active:scale-95 sm:px-7 sm:text-sm">
              sign in
            </button>
          </div>
        </div>

        {/* Gear icon */}
        <button className="absolute right-3 bottom-3 text-desk-dark opacity-50 transition-opacity hover:opacity-80">
          <GearIcon />
        </button>
      </div>
    </div>
  )
}
