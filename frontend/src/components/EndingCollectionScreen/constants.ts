import type { AchievementItem } from './types'

export const API_BASE_URL = 'http://localhost:3000'

export const STAGE_WIDTH = 1500
export const STAGE_HEIGHT = 1060
export const MOBILE_BREAKPOINT = 900

export const achievements: AchievementItem[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Started your international student journey.',
    unlocked: true,
  },
  {
    id: 'study-hard',
    title: 'Study Hard',
    description: 'Improved your intelligence through study tasks.',
    unlocked: true,
  },
  {
    id: 'healthy-life',
    title: 'Healthy Life',
    description: 'Kept your health in a good condition.',
    unlocked: true,
  },
  {
    id: 'smart-budget',
    title: 'Smart Budget',
    description: 'Managed your wealth carefully.',
    unlocked: false,
  },
  {
    id: 'new-friends',
    title: 'New Friends',
    description: 'Built meaningful social connections.',
    unlocked: false,
  },
  {
    id: 'perfect-balance',
    title: 'Perfect Balance',
    description: 'Balanced intelligence, health, and wealth.',
    unlocked: false,
  },
]
