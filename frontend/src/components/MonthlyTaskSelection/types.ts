import type { EventFromAPI } from '../../api/events'
import { TASK_ICONS } from './images'

function pickIcon(category: string, key: string): string {
  const pool = category === 'study' ? TASK_ICONS.study
    : category === 'social' ? TASK_ICONS.social
    : TASK_ICONS.play
  const hash = key.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return pool[hash % pool.length]
}

export type Category = 'Study' | 'Entertainment' | 'Social'

export interface Task {
  id: string
  category: Category
  name: string
  illustration: string
  participateEffects?: { intelligence: number; health: number; wealth: number }
  skipEffects?: { intelligence: number; health: number; wealth: number }
  participateStory?: string
  skipStory?: string
  description?: string
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

const CATEGORY_MAP: Record<string, Category> = {
  study: 'Study',
  entertainment: 'Entertainment',
  social: 'Social',
}

export function mapEventToTask(event: EventFromAPI): Task {
  return {
    id: event.eventKey,
    category: CATEGORY_MAP[event.category] ?? 'Study',
    name: event.title,
    illustration: pickIcon(event.category, event.eventKey),
    participateEffects: event.participateEffects,
    skipEffects: event.skipEffects,
    participateStory: event.participateStory,
    skipStory: event.skipStory,
    description: event.description,
  }
}

// Fallback static tasks used before API response arrives
export const TASKS: Task[] = [
  { id: 'q1-study-campus-orientation', category: 'Study', name: 'Campus Orientation Tour', illustration: pickIcon('study', 'q1-study-campus-orientation') },
  { id: 'q1-study-first-week-plan', category: 'Study', name: 'First Week Study Plan', illustration: pickIcon('study', 'q1-study-first-week-plan') },
  { id: 'q1-study-library-card', category: 'Study', name: 'Library Card Setup', illustration: pickIcon('study', 'q1-study-library-card') },
  { id: 'q1-entertainment-explore-city', category: 'Entertainment', name: 'Explore the City', illustration: pickIcon('entertainment', 'q1-entertainment-explore-city') },
  { id: 'q1-entertainment-cooking-challenge', category: 'Entertainment', name: 'Cooking Starter Challenge', illustration: pickIcon('entertainment', 'q1-entertainment-cooking-challenge') },
  { id: 'q1-entertainment-room-decoration', category: 'Entertainment', name: 'Room Decoration', illustration: pickIcon('entertainment', 'q1-entertainment-room-decoration') },
  { id: 'q1-social-orientation-party', category: 'Social', name: 'Orientation Party', illustration: pickIcon('social', 'q1-social-orientation-party') },
  { id: 'q1-social-campus-club', category: 'Social', name: 'Join a Campus Club', illustration: pickIcon('social', 'q1-social-campus-club') },
  { id: 'q1-social-flatmate-introduction', category: 'Social', name: 'Flatmate Introduction', illustration: pickIcon('social', 'q1-social-flatmate-introduction') },
]

export { getAttributeLevel as getLevel } from '../../utils/level'
