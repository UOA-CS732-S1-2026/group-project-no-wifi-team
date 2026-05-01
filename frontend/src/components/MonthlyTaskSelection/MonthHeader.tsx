import { CalendarIcon } from './Icons'

interface Props {
  month: number
  monthsUntilGraduation: number
}

export function MonthHeader({ month, monthsUntilGraduation }: Props) {
  return (
    <div
      className="flex shrink-0 items-center justify-center gap-4 border-b px-6 py-3"
      style={{ borderColor: 'rgba(160,120,60,0.3)', background: 'rgba(237,228,200,0.45)' }}
    >
      <CalendarIcon />
      <div className="text-center font-serif">
        <p className="text-base font-bold text-desk-dark">
          current month: <span className="text-desk-mid">Month {month}</span>
        </p>
        <p className="text-sm text-desk-dark">
          Distance to graduate:{' '}
          <span className="font-bold">{monthsUntilGraduation}</span> month
          {monthsUntilGraduation !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
