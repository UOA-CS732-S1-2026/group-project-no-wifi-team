export type Category = 'Study' | 'Entertainment' | 'Social'

export interface Task {
  id: string
  category: Category
  name: string
  illustration: string
}

export const MAX_PLAYER_SELECTIONS = 3

export const QUARTER_INFO = {
  number: 1,
  theme: 'Orientation & Settling In',
  month: 1,
  monthsUntilGraduation: 11,
}

export const BASE_STATS = { intelligence: 55, health: 60, wealth: 50 }

export const CATEGORIES: Category[] = ['Entertainment', 'Study', 'Social']

export const TASKS: Task[] = [
  // Study
  { id: 'study-1', category: 'Study', name: 'Campus Orientation Tour', illustration: '🏫' },
  { id: 'study-2', category: 'Study', name: 'First Week Study Plan', illustration: '📋' },
  { id: 'study-3', category: 'Study', name: 'Library Card Setup', illustration: '📚' },
  // Entertainment
  { id: 'ent-1', category: 'Entertainment', name: 'Explore the City', illustration: '🏙️' },
  { id: 'ent-2', category: 'Entertainment', name: 'Cooking Starter Challenge', illustration: '🍳' },
  { id: 'ent-3', category: 'Entertainment', name: 'Room Decoration', illustration: '🪴' },
  // Social
  { id: 'social-1', category: 'Social', name: 'Orientation Party', illustration: '🎉' },
  { id: 'social-2', category: 'Social', name: 'Join a Campus Club', illustration: '🤝' },
  { id: 'social-3', category: 'Social', name: 'Flatmate Introduction', illustration: '🏠' },
]

export { getAttributeLevel as getLevel } from '../../utils/level'
