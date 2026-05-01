import { BrainIcon, HeartIcon, MoneyIcon } from './Icons'
import { getLevel } from './types'

interface Props {
  intelligence: number
  health: number
  wealth: number
}

export function AttributeBar({ intelligence, health, wealth }: Props) {
  const attrs = [
    { label: 'intelligence', icon: <BrainIcon />, value: intelligence },
    { label: 'health', icon: <HeartIcon />, value: health },
    { label: 'wealth', icon: <MoneyIcon />, value: wealth },
  ]

  return (
    <div className="mb-2 flex items-center justify-center gap-5 sm:gap-10">
      {attrs.map(({ label, icon, value }) => (
        <div
          key={label}
          className="flex items-center gap-1.5 font-serif text-xs text-desk-dark sm:text-sm"
        >
          <span className="opacity-80">{icon}</span>
          <span>
            {label}: <span className="font-bold">{getLevel(value)}</span>
          </span>
        </div>
      ))}
    </div>
  )
}
