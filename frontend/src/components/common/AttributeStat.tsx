import { getAttributeLevel, type AttributeLevel } from '../../utils/level'
import { BrainIcon, HeartIcon, MoneyIcon } from './AttributeIcons'

export type AttributeKind = 'intelligence' | 'health' | 'wealth'

const META: Record<AttributeKind, { label: string; Icon: typeof BrainIcon; accent: string }> = {
  intelligence: { label: 'Intelligence', Icon: BrainIcon, accent: 'text-[#9b6b8a]' },
  health: { label: 'Health', Icon: HeartIcon, accent: 'text-[#c25d57]' },
  wealth: { label: 'Wealth', Icon: MoneyIcon, accent: 'text-[#7c8d3c]' },
}

const LEVEL_TONE: Record<AttributeLevel, string> = {
  Excellent: 'text-emerald-700',
  Good: 'text-desk-dark',
  Poor: 'text-red-700',
}

interface AttributeStatProps {
  kind: AttributeKind
  value: number
  /** Card variant shows label + level prominently; compact is inline. */
  variant?: 'card' | 'compact'
  /** When true, hide the numeric value and show only the level. */
  hideValue?: boolean
}

/**
 * Single attribute display tile, used by ending screens and any future
 * summary surface that needs an icon + label + level + value layout.
 */
export function AttributeStat({
  kind,
  value,
  variant = 'card',
  hideValue = false,
}: AttributeStatProps) {
  const { label, Icon, accent } = META[kind]
  const level = getAttributeLevel(value)

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1.5 font-serif text-xs text-desk-dark sm:text-sm">
        <span className={`opacity-80 ${accent}`}>
          <Icon />
        </span>
        <span>
          {label}: <span className={`font-bold ${LEVEL_TONE[level]}`}>{level}</span>
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-desk-light/70 bg-paper/80 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <span className={`${accent}`}>
        <Icon className="h-7 w-7" />
      </span>
      <span className="font-serif text-xs uppercase tracking-wider text-desk-mid">
        {label}
      </span>
      <span className={`font-serif text-lg font-bold ${LEVEL_TONE[level]}`}>{level}</span>
      {hideValue ? null : (
        <span className="font-mono text-xs text-desk-dark/70">{value}/100</span>
      )}
    </div>
  )
}
