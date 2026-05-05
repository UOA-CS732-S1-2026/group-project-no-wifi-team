import { BrainIcon, HeartIcon, MoneyIcon } from './Icons'
import { getLevel } from './types'
import statusBar from '../../assets/MonthlyTaskSelection/status-bar.png'

// status-bar.png: 2172×724 (3:1). Displayed at 1366×56px with objectFit:cover — no distortion, crops vertically.

interface Props {
  intelligence: number
  health: number
  wealth: number
}

export function AttributeBar({ intelligence, health, wealth }: Props) {
  const attrs = [
    { label: 'Intelligence', icon: <BrainIcon />, value: intelligence },
    { label: 'Health', icon: <HeartIcon />, value: health },
    { label: 'Wealth', icon: <MoneyIcon />, value: wealth },
  ]

  return (
    <div className="relative w-full shrink-0" style={{ height: 74, margin: '26px' }}>
      <img
        src={statusBar}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full"
        style={{ objectFit: 'contain', objectPosition: 'center' }}
      />
      <div className="relative flex h-full items-center justify-center gap-12">
        {attrs.map(({ label, icon, value }) => (
          <div key={label} className="flex items-center gap-2 font-serif text-sm text-desk-dark">
            <span>{icon}</span>
            <span>{label}: <span className="font-bold">{getLevel(value)}</span></span>
          </div>
        ))}
      </div>
    </div>
  )
}
