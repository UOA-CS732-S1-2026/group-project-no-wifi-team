interface IconProps {
  className?: string
}

const DEFAULT_CLASS = 'h-5 w-5'

export function BrainIcon({ className = DEFAULT_CLASS }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.33 12.91C21.42 12.61 21.5 12.31 21.5 12C21.5 10.74 20.88 9.63 19.95 8.91C19.96 8.78 20 8.65 20 8.5C20 7.12 18.88 6 17.5 6C17.26 6 17.04 6.05 16.82 6.12C16.32 5.14 15.26 4.5 14 4.5C13.37 4.5 12.78 4.7 12.28 5.04C11.78 4.7 11.19 4.5 10.56 4.5C9.29 4.5 8.23 5.14 7.73 6.12C7.5 6.05 7.26 6 7 6C5.62 6 4.5 7.12 4.5 8.5C4.5 8.65 4.54 8.78 4.56 8.91C3.63 9.63 3 10.74 3 12C3 12.31 3.08 12.61 3.17 12.91C2.47 13.57 2 14.5 2 15.5C2 17.43 3.57 19 5.5 19H6.3C6.9 19.63 7.7 20 8.5 20H11V17.72C10.37 17.39 10 16.72 10 16C10 14.9 10.9 14 12 14C13.1 14 14 14.9 14 16C14 16.72 13.63 17.39 13 17.72V20H15.5C16.3 20 17.1 19.63 17.7 19H18.5C20.43 19 22 17.43 22 15.5C22 14.5 21.53 13.57 20.83 12.91H21.33Z" />
    </svg>
  )
}

export function HeartIcon({ className = DEFAULT_CLASS }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z" />
    </svg>
  )
}

export function MoneyIcon({ className = DEFAULT_CLASS }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
    </svg>
  )
}

export function CalendarIcon({ className = 'h-10 w-10 text-[#4a7fc1]' }: IconProps = {}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
    </svg>
  )
}
