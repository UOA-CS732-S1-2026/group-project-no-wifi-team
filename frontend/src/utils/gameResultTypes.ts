import type { AttributeSnapshot, EndingRank, EndingTheme } from './endingResult'

export interface GameResult {
  id: string
  characterId: string | null
  playerName: string
  score: number
  endingId: string
  endingTitle: string
  endingRank: EndingRank
  endingTheme: EndingTheme
  snapshot: AttributeSnapshot
  achievements: string[]
  timestamp: number
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
