import {
  iconAcademic,
  iconRich,
  iconFitness,
  iconOrdinary,
  iconHeavenlyDragon,
  selectGreen,
  selectGold,
  selectBlue,
  selectRed,
  selectBrown,
} from '../../assets/character-select'

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
      intelligence: 96,
      health: 30,
      wealth: 55,
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
      intelligence: 30,
      health: 35,
      wealth: 90,
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
      intelligence: 50,
      health: 95,
      wealth: 30,
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
      intelligence: 60,
      health: 60,
      wealth: 60,
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
      intelligence: 99,
      health: 25,
      wealth: 99,
    },
  },
]
