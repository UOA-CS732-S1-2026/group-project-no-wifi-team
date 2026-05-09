import {
  iconAcademic,
  iconRich,
  iconFitness,
  iconOrdinary,
  iconHeavenlyDragon,
  iconWorking,
  selectGreen,
  selectGold,
  selectBlue,
  selectRed,
  selectBrown,
} from '../../assets/CharacterSelect'

export type AttributeLevel = 'Excellent' | 'Average' | 'Poor'

export type CharacterStats = {
  intelligence: number
  health: number
  wealth: number
}

export type Character = {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  selectButton: string
  stats: CharacterStats
}

export const DESIGN_WIDTH = 1365
export const DESIGN_HEIGHT = 1160
export const MOBILE_BREAKPOINT = 768

export const characters: Character[] = [
  {
    id: 'academic-achiever',
    title: 'Academic Achiever',
    subtitle: 'STUDY-FOCUSED ROUTE',
    description:
      'A student with excellent academic ability, but poor health due to heavy pressure and long study hours.',
    icon: iconAcademic,
    selectButton: selectGreen,
    stats: {
      intelligence: 9,
      health: 2,
      wealth: 5,
    },
  },
  {
    id: 'rich-kid',
    title: 'Rich Kid',
    subtitle: 'MONEY ADVANTAGE ROUTE',
    description:
      'A student with strong financial support, but weak study habits and an unhealthy lifestyle.',
    icon: iconRich,
    selectButton: selectGold,
    stats: {
      intelligence: 2,
      health: 3,
      wealth: 9,
    },
  },
  {
    id: 'fitness-enthusiast',
    title: 'Fitness Enthusiast',
    subtitle: 'HEALTH-FOCUSED ROUTE',
    description:
      'A student with excellent energy and health, but limited savings and only average academic performance.',
    icon: iconFitness,
    selectButton: selectBlue,
    stats: {
      intelligence: 5,
      health: 9,
      wealth: 3,
    },
  },
  {
    id: 'ordinary-student',
    title: 'Ordinary Student',
    subtitle: 'BALANCED ROUTE',
    description:
      'A normal international student. Nothing is too strong or too weak at the beginning.',
    icon: iconOrdinary,
    selectButton: selectRed,
    stats: {
      intelligence: 5,
      health: 5,
      wealth: 5,
    },
  },
  {
    id: 'hard-core-worker',
    title: 'Hard-core Worker',
    subtitle: 'MONEY-ABOVE-ALL ROUTE',
    description:
      'An international student who works everywhere just to make a living, never forgetting to earn money even amid a hectic study schedule.',
    icon: iconWorking,
    selectButton: selectGold,
    stats: {
      intelligence: 7,
      health: 4,
      wealth: 3,
    },
  },
  {
    id: 'heavenly-dragon',
    title: 'Heavenly Dragon',
    subtitle: 'ALL-EXCELLENT ROUTE',
    description:
      'A privileged student with excellent intelligence and wealth, but very poor health from stress and pressure.',
    icon: iconHeavenlyDragon,
    selectButton: selectBrown,
    stats: {
      intelligence: 10,
      health: 2,
      wealth: 10,
    },
  },
]
