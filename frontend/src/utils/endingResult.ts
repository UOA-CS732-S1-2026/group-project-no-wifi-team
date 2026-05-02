import { clamp01to100 } from './level'

export type EndingTheme = 'happy' | 'bad'
export type EndingRank = 'S' | 'A' | 'B' | 'C'

export interface AttributeSnapshot {
  intelligence: number
  health: number
  wealth: number
}

export interface Ending {
  id: string
  title: string
  chineseName: string
  type: string
  theme: EndingTheme
  rank: EndingRank
  description: string
  unlockText: string
  predicate: (s: AttributeSnapshot) => boolean
}

const isHigh = (v: number) => v >= 85
const isLow = (v: number) => v < 45
const isCritical = (v: number) => v < 30

/**
 * Order matters — first match wins. Priority follows ending-design.md §3:
 * warning > bad > best > thematic > open fallback. The Burnout case
 * deliberately fires before "Perfect" so an exhausted student is never
 * mislabelled as a perfect run.
 */
export const ENDINGS: readonly Ending[] = [
  {
    id: 'burnout-student',
    title: 'Burnout Student',
    chineseName: '过劳留学生',
    type: 'Warning Ending',
    theme: 'bad',
    rank: 'A',
    description:
      'You pushed yourself too hard. Your grades were strong, but your body and mind could not keep up with the pressure.',
    unlockText:
      'You achieved strong results, but the cost was too high. The year ended with exhaustion instead of celebration.',
    predicate: ({ intelligence, health }) => isHigh(intelligence) && isLow(health),
  },
  {
    id: 'lost-year',
    title: 'Lost Year',
    chineseName: '迷失的一年',
    type: 'Bad Ending',
    theme: 'bad',
    rank: 'C',
    description:
      'The year slipped through your fingers. You ran out of energy, money, or focus before you could find your footing.',
    unlockText:
      'Not every year ends in triumph. Take a breath, rebuild your habits, and try again.',
    predicate: ({ intelligence, health, wealth }) =>
      isCritical(health) || isCritical(intelligence) || isCritical(wealth),
  },
  {
    id: 'perfect-all-rounder',
    title: 'Perfect All-Rounder',
    chineseName: '全能留学生',
    type: 'Best Ending',
    theme: 'happy',
    rank: 'S',
    description:
      'You managed to balance study, health, and money throughout the year. You did not just survive international student life — you mastered it.',
    unlockText:
      'You became the ideal international student: capable, healthy, and financially stable.',
    predicate: ({ intelligence, health, wealth }) =>
      isHigh(intelligence) && isHigh(health) && isHigh(wealth),
  },
  {
    id: 'academic-star',
    title: 'Academic Star',
    chineseName: '学术之星',
    type: 'Study Ending',
    theme: 'happy',
    rank: 'A',
    description:
      'Your hard work paid off. You achieved excellent academic results and became a reliable student in your course.',
    unlockText:
      'You became known as a hardworking student. Your academic performance opened more opportunities for your future.',
    predicate: ({ intelligence, health }) => isHigh(intelligence) && !isLow(health),
  },
  {
    id: 'part-time-hustler',
    title: 'Part-Time Hustler',
    chineseName: '兼职打工人',
    type: 'Wealth Ending',
    theme: 'happy',
    rank: 'B',
    description:
      'You spent the year stacking shifts and saving every dollar. You leave with a healthy bank balance — and a few regrets about the lectures you missed.',
    unlockText:
      'Your hustle kept the lights on. The grades suffered, but the wallet smiled.',
    predicate: ({ intelligence, wealth }) => isHigh(wealth) && isLow(intelligence),
  },
  {
    id: 'steady-graduate',
    title: 'Steady Graduate',
    chineseName: '稳健毕业生',
    type: 'Open Ending',
    theme: 'happy',
    rank: 'B',
    description:
      'No big triumphs, no big disasters — you kept things in balance and made it through the year on your own terms.',
    unlockText:
      'A quiet, honest finish. Sometimes that is exactly what international student life calls for.',
    predicate: () => true,
  },
] as const

export function resolveEnding(snapshot: AttributeSnapshot): Ending {
  const safe: AttributeSnapshot = {
    intelligence: clamp01to100(snapshot.intelligence),
    health: clamp01to100(snapshot.health),
    wealth: clamp01to100(snapshot.wealth),
  }

  const match = ENDINGS.find((e) => e.predicate(safe))
  // The final entry has predicate `() => true`, so this is unreachable — but the
  // non-null assertion keeps the return type clean for callers.
  return match ?? ENDINGS[ENDINGS.length - 1]!
}

/** Final score: average of the three attributes, on a 0–100 scale. */
export const TOTAL_SCORE = 100

export function calculateScore(snapshot: AttributeSnapshot): number {
  const sum =
    clamp01to100(snapshot.intelligence) +
    clamp01to100(snapshot.health) +
    clamp01to100(snapshot.wealth)
  return Math.round(sum / 3)
}
