import { useEffect, useRef, useState, type ReactNode } from 'react'

interface NotebookPanelProps {
  /** When true (default), renders a spiral binding strip across the top. */
  spiral?: boolean
  /** When true, the page is overlaid with a faint grid like ruled paper. */
  ruled?: boolean
  className?: string
  children: ReactNode
}

/**
 * Reusable notebook-paper panel: warm beige page, soft shadow, optional spiral
 * binding header. Designed as the canonical surface for screens that follow
 * the diary/notebook aesthetic (Title, Ending, etc.).
 */
export function NotebookPanel({
  spiral = true,
  ruled = true,
  className = '',
  children,
}: NotebookPanelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const spiralCount = useSpiralCount(ref)

  const ruledClasses = ruled
    ? 'bg-[image:linear-gradient(rgba(150,130,90,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(150,130,90,0.18)_1px,transparent_1px)] bg-[size:24px_24px]'
    : ''

  return (
    <div
      ref={ref}
      className={`
        relative flex flex-col overflow-hidden bg-paper
        shadow-[0_10px_40px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(160,130,80,0.25)]
        ${ruledClasses}
        ${className}
      `}
    >
      {spiral ? (
        <div className="flex items-center justify-evenly border-b border-binding-border bg-binding px-2 py-2">
          {Array.from({ length: spiralCount }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-3.5 shrink-0 rounded-full border-2 border-desk-dark bg-desk-light shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]"
            />
          ))}
        </div>
      ) : null}
      {children}
    </div>
  )
}

function useSpiralCount(ref: React.RefObject<HTMLDivElement | null>) {
  const [count, setCount] = useState(8)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setCount(Math.max(4, Math.floor(el.clientWidth / 28)))
    update()

    if (typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return count
}
