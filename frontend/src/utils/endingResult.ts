import { clamp0to10 } from './level'

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
  type: string
  theme: EndingTheme
  rank: EndingRank
  description: string
  unlockText: string
  predicate: (s: AttributeSnapshot) => boolean
}

const isHigh = (v: number) => v >= 8
const isStrong = (v: number) => v >= 7
const isLow = (v: number) => v <= 3
const isCritical = (v: number) => v <= 0

/**
 * Order matters: first match wins. Failure and warning routes are checked
 * before positive routes, then the strongest 0-10 attribute determines the
 * thematic ending. The final ending is the open fallback.
 */
export const ENDINGS: readonly Ending[] = [
  {
    id: 'speedrun-early-retirement',
    title: 'Speedrun to Early Retirement',
    type: 'Game Over',
    theme: 'bad',
    rank: 'C',
    description:
      'Everything collapsed. One of your attributes hit zero so hard that your life basically pressed the restart button by itself.',
    unlockText:
      'One of your key attributes dropped to zero, ending the run before graduation could become a victory lap.',
    predicate: ({ intelligence, health, wealth }) =>
      isCritical(health) || isCritical(intelligence) || isCritical(wealth),
  },
  {
    id: 'gpa-4-hairline-04',
    title: 'GPA: 4.0, Hairline: 0.4',
    type: 'Warning Ending',
    theme: 'bad',
    rank: 'A',
    description:
      'Your transcript is flawless, almost suspiciously so, but your eye bags have migrated all the way to your chin. You defeated academia, but your physical condition became fragile.',
    unlockText:
      'Your study stat soared, but your health fell too low to call the victory painless.',
    predicate: ({ intelligence, health }) => isHigh(intelligence) && isLow(health),
  },
  {
    id: 'smart-head-empty-pocket',
    title: 'Smart Head, Empty Pocket',
    type: 'Study Ending',
    theme: 'bad',
    rank: 'B',
    description:
      'Your brain is packed with cutting-edge theories, but your stomach is powered by discounted bread and emotional resilience. Spiritually, you are a billionaire. Financially, not so much.',
    unlockText:
      'Your study stat was excellent, but your wealth stat dropped too low to support the lifestyle.',
    predicate: ({ intelligence, wealth }) => isHigh(intelligence) && isLow(wealth),
  },
  {
    id: 'model-minority-real-version',
    title: 'The Model Minority Myth: Real Version',
    type: 'Balance Ending',
    theme: 'happy',
    rank: 'S',
    description:
      'You achieved the legendary balance: decent grades, decent health, and a bank account that has not completely hit rock bottom. You are not just studying abroad — you are accidentally writing the survival guide for future international students.',
    unlockText:
      'All three attributes stayed strong, creating the cleanest all-round finish.',
    predicate: ({ intelligence, health, wealth }) =>
      isStrong(intelligence) && isStrong(health) && isStrong(wealth),
  },
  {
    id: 'library-resident-landlord',
    title: 'Library’s Resident Landlord',
    type: 'Study Ending',
    theme: 'happy',
    rank: 'A',
    description:
      'Your Intelligence stat has officially overflowed. Every seat in the library has witnessed your academic suffering, and several of them may legally count as your second home.',
    unlockText:
      'Your intelligence stat became your strongest attribute without collapsing health or wealth.',
    predicate: ({ intelligence, health, wealth }) =>
      isHigh(intelligence) && intelligence >= health && intelligence >= wealth,
  },
  {
    id: 'part-time-tycoon',
    title: 'Part-time Tycoon',
    type: 'Wealth Ending',
    theme: 'happy',
    rank: 'B',
    description:
      'During your time abroad, you developed enough survival skills to run a profitable convenience store on a deserted island. You may be tired, but you are financially dangerous.',
    unlockText:
      'Your wealth stat became the dominant force of the year.',
    predicate: ({ intelligence, health, wealth }) =>
      isHigh(wealth) && wealth >= intelligence && wealth >= health,
  },
  {
    id: 'main-character-party',
    title: 'The Main Character of Every Party',
    type: 'Health Ending',
    theme: 'happy',
    rank: 'B',
    description:
      'Every student club has heard your name, and your contact list is longer than your course timetable. Somehow, you turned campus life into your personal reality show.',
    unlockText:
      'Your health and lifestyle stat became your strongest attribute, carrying the year through social energy.',
    predicate: ({ intelligence, health, wealth }) =>
      isHigh(health) && health >= intelligence && health >= wealth,
  },
  {
    id: 'showed-up-survived',
    title: 'I Showed Up, I Survived',
    type: 'Normal Ending',
    theme: 'happy',
    rank: 'B',
    description:
      'You did not become a legend, but you also did not become a cautionary tale. With your degree in hand, your life philosophy remains simple: go with the flow and act like this was the plan all along.',
    unlockText:
      'No single attribute created a specialized route, but you made it to the end.',
    predicate: () => true,
  },
] as const

export function resolveEnding(snapshot: AttributeSnapshot): Ending {
  const safe: AttributeSnapshot = {
    intelligence: clamp0to10(snapshot.intelligence),
    health: clamp0to10(snapshot.health),
    wealth: clamp0to10(snapshot.wealth),
  }

  const match = ENDINGS.find((e) => e.predicate(safe))
  // The final entry has predicate `() => true`, so this is unreachable — but the
  // non-null assertion keeps the return type clean for callers.
  return match ?? ENDINGS[ENDINGS.length - 1]!
}

/** Final score: average of the three 0-10 attributes, expressed on a 0-100 scale. */
export const TOTAL_SCORE = 100

export function calculateScore(snapshot: AttributeSnapshot): number {
  const sum =
    clamp0to10(snapshot.intelligence) +
    clamp0to10(snapshot.health) +
    clamp0to10(snapshot.wealth)
  return Math.round((sum / 3) * 10)
}
