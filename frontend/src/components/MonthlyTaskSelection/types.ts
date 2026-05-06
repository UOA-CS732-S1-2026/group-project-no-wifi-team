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

const ILLUSTRATIONS: Record<string, string> = {
  // Q1 Study
  'q1-study-campus-orientation': '🏫',
  'q1-study-first-week-plan':    '📋',
  'q1-study-library-card':       '📚',
  // Q1 Entertainment
  'q1-entertainment-explore-city':      '🏙️',
  'q1-entertainment-cooking-challenge': '🍳',
  'q1-entertainment-room-decoration':   '🪴',
  // Q1 Social
  'q1-social-orientation-party':    '🎉',
  'q1-social-campus-club':          '🤝',
  'q1-social-flatmate-introduction': '🏠',
  // Q2 Study
  'q2-study-midterm-revision':  '📝',
  'q2-study-office-hours':      '🧑‍🏫',
  'q2-study-assignment-sprint': '⏰',
  // Q2 Entertainment
  'q2-entertainment-movie-night':    '🎬',
  'q2-entertainment-gym-relief':     '🏋️',
  'q2-entertainment-sleep-recovery': '😴',
  // Q2 Social
  'q2-social-study-group':    '👥',
  'q2-social-flatmate-dinner': '🍽️',
  'q2-social-help-classmate': '🤝',
  // Q3 Study
  'q3-study-group-leader':   '👔',
  'q3-study-extra-tutoring': '📖',
  'q3-study-online-course':  '💻',
  // Q3 Entertainment
  'q3-entertainment-weekend-trip': '🚗',
  'q3-entertainment-eat-out':      '🍜',
  'q3-entertainment-gaming-night': '🎮',
  // Q3 Social
  'q3-social-birthday-party':    '🎂',
  'q3-social-networking-event':  '💼',
  'q3-social-cultural-festival': '🎭',
  // Q4 Study
  'q4-study-final-exam-sprint':  '📑',
  'q4-study-academic-workshop':  '🎓',
  'q4-study-portfolio-polish':   '🗂️',
  // Q4 Entertainment
  'q4-entertainment-sleep-recovery': '😴',
  'q4-entertainment-semester-treat': '🎁',
  'q4-entertainment-long-walk':      '🚶',
  // Q4 Social
  'q4-social-internship-networking': '🤵',
  'q4-social-farewell-dinner':       '🥂',
  'q4-social-ask-senior':            '💬',
}

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
  { id: 'study-1', category: 'Study', name: 'Campus Orientation Tour', illustration: '🏫' },
  { id: 'study-2', category: 'Study', name: 'First Week Study Plan', illustration: '📋' },
  { id: 'study-3', category: 'Study', name: 'Library Card Setup', illustration: '📚' },
  { id: 'ent-1', category: 'Entertainment', name: 'Explore the City', illustration: '🏙️' },
  { id: 'ent-2', category: 'Entertainment', name: 'Cooking Starter Challenge', illustration: '🍳' },
  { id: 'ent-3', category: 'Entertainment', name: 'Room Decoration', illustration: '🪴' },
  { id: 'social-1', category: 'Social', name: 'Orientation Party', illustration: '🎉' },
  { id: 'social-2', category: 'Social', name: 'Join a Campus Club', illustration: '🤝' },
  { id: 'social-3', category: 'Social', name: 'Flatmate Introduction', illustration: '🏠' },
]

export { getAttributeLevel as getLevel } from '../../utils/level'
