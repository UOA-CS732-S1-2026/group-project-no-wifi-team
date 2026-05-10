import { get } from '../utils/request'

export interface BackendAchievement {
  _id?: string
  achievementKey: string
  title: string
  description: string
  category: 'Study' | 'Health' | 'Wealth' | 'Crown'
  conditionText?: string
  badgeImage?: string
}

interface AchievementsApiResponse {
  success: boolean
  total: number
  data: BackendAchievement[]
}

let cached: BackendAchievement[] | null = null
let pending: Promise<BackendAchievement[]> | null = null

export function fetchAchievements(): Promise<BackendAchievement[]> {
  if (cached) return Promise.resolve(cached)
  if (pending) return pending

  pending = get<AchievementsApiResponse>('/achievements')
    .then((res) => {
      cached = res.data
      pending = null
      return cached
    })
    .catch((err) => {
      pending = null
      throw err
    })

  return pending
}

// Offline fallback: achievementKey → category. Used when the backend is unreachable.
// Keep in sync with backend/src/data/achievementData.js.
const FALLBACK_CATEGORIES: Record<string, string> = {
  'i-love-8-am-classes': 'Study',
  'terminal-procrastination': 'Study',
  'file-cleanup-master': 'Study',
  'pre-stress-specialist': 'Study',
  'cross-that-bridge': 'Study',
  'anti-exam-strategist': 'Study',
  'wait-am-i-actually-a-genius': 'Study',
  'benefits-first': 'Wealth',
  'are-you-a-ghostwriter': 'Wealth',
  'paid-to-chill': 'Wealth',
  'chief-price-detective': 'Wealth',
  'freebie-hunter': 'Wealth',
  'its-fine-i-still-have-money': 'Wealth',
  'surprise-came-fast-gone-fast': 'Wealth',
  'budget-master': 'Wealth',
  'future-forbes-list-candidate': 'Wealth',
  'lone-wolf': 'Health',
  'social-menace': 'Health',
  'never-betray-your-stomach': 'Health',
  'stillness-is-fitness': 'Health',
  'social-anxiety-mode': 'Health',
  'high-quality-sleep': 'Health',
  'one-chip-for-you-one-chip-for-me': 'Health',
  'questionable-asmr-taste': 'Health',
  'cultural-ambassador': 'Health',
  'just-a-bit-of-smoke': 'Health',
  'sleeping-over-at-school': 'Health',
  'if-its-not-mouldy-its-edible': 'Health',
  'plenty-of-fish-in-the-sea': 'Health',
  'avada-kedavra': 'Health',
  'doing-great': 'Health',
  'hexagon-international-student': 'Crown',
}

export function getAchievementByKey(key: string): BackendAchievement | undefined {
  return cached?.find((a) => a.achievementKey === key)
}

export function getCategoryForAchievementKey(key: string): string | undefined {
  return cached?.find((a) => a.achievementKey === key)?.category
    ?? FALLBACK_CATEGORIES[key]
}

export function getEarnedCategories(earnedKeys: string[]): string[] {
  const cats = new Set<string>()
  for (const key of earnedKeys) {
    const cat = getCategoryForAchievementKey(key)
    if (cat) cats.add(cat)
  }
  return Array.from(cats)
}
