export type AttributeLevel = 'Poor' | 'Good' | 'Excellent'

export const LEVEL_THRESHOLDS = {
  excellent: 85,
  good: 45,
} as const

export function getAttributeLevel(value: number): AttributeLevel {
  if (value >= LEVEL_THRESHOLDS.excellent) return 'Excellent'
  if (value >= LEVEL_THRESHOLDS.good) return 'Good'
  return 'Poor'
}

export function clamp01to100(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.max(0, Math.min(100, Math.round(value)))
}
