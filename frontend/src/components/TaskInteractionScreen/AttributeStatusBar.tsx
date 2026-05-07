import { BrainIcon, HeartIcon, MoneyIcon } from '../MonthlyTaskSelection/Icons'
import { statusBar } from '../MonthlyTaskSelection/images'
import { attributeLabels } from './constants'
import type { AttributeKey } from './types'
import { levelText } from './utils'

interface Props {
  stats: Record<AttributeKey, number>
}

export function AttributeStatusBar({ stats }: Props) {
  const attrs = [
    {
      key: 'intelligence' as const,
      icon: <BrainIcon className="h-6 w-6 text-[#9b5f6f]" />,
    },
    {
      key: 'health' as const,
      icon: <HeartIcon className="h-6 w-6 text-[#bb4e43]" />,
    },
    {
      key: 'money' as const,
      icon: <MoneyIcon className="h-6 w-6 text-[#4f7b38]" />,
    },
  ]

  return (
    <div className="relative mx-auto mt-[26px] h-[74px] w-[calc(100%-52px)] max-w-[1366px] shrink-0">
      <img
        src={statusBar}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain"
      />
      <div className="relative flex h-full items-center justify-center gap-10 font-serif text-sm text-desk-dark">
        {attrs.map(({ key, icon }) => (
          <div key={key} className="flex items-center gap-2 whitespace-nowrap">
            {icon}
            <span>
              {attributeLabels[key]}: <span className="font-bold">{levelText(stats[key])}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
