import quarterTitle from '../../assets/MonthlyTaskSelection/quarter-title.png'

// quarter-title.png: 1448×1086 (4:3). Displayed at 480×72px with objectFit:cover —
// no distortion, crops to show the center band of the illustrated header.

interface Props {
  month: number
  monthsUntilGraduation: number
}

export function MonthHeader({ month, monthsUntilGraduation }: Props) {
  return (
    <div className="relative shrink-0" style={{ width: '920px', height: '100px' }}>
      <img
        src={quarterTitle}
        alt="Current Quarter"
        className="absolute inset-0 h-full w-full"
        style={{ width: 'auto', height: 'auto' }}
      />
      <div className="relative flex h-full flex-col items-center justify-center gap-1" style={{ paddingTop: 36 }}>
        <p className="font-serif font-bold text-desk-dark drop-shadow" style={{ fontSize: 'xxx-large' }}>
          Current Quarter
        </p>
        <p className="font-serif font-bold text-desk-dark drop-shadow" style={{ fontSize: 'large' }}>
          Distance to Graduation:{' '}
          <span>{monthsUntilGraduation}</span>{' '}
          Quarter{monthsUntilGraduation !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
