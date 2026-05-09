import { AttributeLevel } from './constants'

function getAttributeLevel(value: number): AttributeLevel {
  if (value <= 3) return 'Poor'
  if (value <= 6) return 'Average'
  return 'Excellent'
}

function getLevelClass(level: AttributeLevel) {
  if (level === 'Excellent') return 'bg-[#97a06f] text-[#fff8df]'
  if (level === 'Poor') return 'bg-[#b66a5c] text-[#fff8df]'
  return 'bg-[#f3cd77] text-[#6b3f22]'
}

export function AttributeRow({
  label,
  value,
  mobile = false,
}: {
  label: string
  value: number
  mobile?: boolean
}) {
  const level = getAttributeLevel(value)

  return (
    <div
      className={`flex items-center justify-between border-b border-[#e7c99c] last:border-b-0 ${
        mobile ? 'h-[40px] px-[12px]' : 'h-[45px] px-[15px]'
      }`}
    >
      <span
        className={`text-left font-bold tracking-[0.08em] text-[#7a4a27] ${
          mobile ? 'w-[125px] text-[11px]' : 'w-[135px] text-[13px]'
        }`}
      >
        {label}
      </span>

      <span
        className={`flex items-center justify-center rounded-full border border-[#cfa15d] px-[10px] font-bold shadow-inner ${getLevelClass(
          level,
        )} ${mobile ? 'h-[27px] w-[88px] text-[11px]' : 'h-[29px] w-[96px] text-[12px]'}`}
      >
        {level}
      </span>
    </div>
  )
}
