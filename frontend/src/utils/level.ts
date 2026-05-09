export type AttributeLevel = 'Poor' | 'Average' | 'Excellent'

export const LEVEL_THRESHOLDS = {
  excellent: 7,
  average: 4,
} as const

export function getAttributeLevel(value: number): AttributeLevel {
  if (value >= LEVEL_THRESHOLDS.excellent) return 'Excellent'
  if (value >= LEVEL_THRESHOLDS.average) return 'Average'
  return 'Poor'
}

export function clamp01to100(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.max(0, Math.min(100, Math.round(value)))
}
