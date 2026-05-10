export type BackendEndingItem = {
  _id?: string
  endingId: string
  title: string
  status: 'Unlocked' | 'Locked'
  category?: string
  description?: string
  image?: string
}

export type AchievementItem = {
  id: string
  title: string
  description: string
  unlocked: boolean
}

export type EndingsApiResponse = {
  success: boolean
  total: number
  unlocked: number
  locked: number
  data: BackendEndingItem[]
  message?: string
}

export type LatestGameResult = {
  endingId: string
  achievements: string[]
}

export type LatestGameResultResponse = {
  success: boolean
  data: LatestGameResult
  message?: string
}
