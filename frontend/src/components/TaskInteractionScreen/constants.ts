import playGameImage from '../../assets/TaskInteraction/PlayGame.png'
import socialImage from '../../assets/TaskInteraction/Social.png'
import studyImage from '../../assets/TaskInteraction/Study.png'
import travelImage from '../../assets/TaskInteraction/Travel.png'
import type { AttributeKey, TaskInteractionContent } from './types'

export const baseStats: Record<AttributeKey, number> = {
  intelligence: 55,
  health: 60,
  money: 50,
}

export const attributeLabels: Record<AttributeKey, string> = {
  intelligence: 'Intelligence',
  health: 'Health',
  money: 'Wealth',
}

export const taskLibrary: TaskInteractionContent[] = [
  {
    taskId: 'study-plan',
    title: 'First Week Study Plan',
    category: 'Study',
    description:
      'You sit down with your notes and plan the first week carefully. A clearer routine may help you keep up with lectures, but it costs time and energy.',
    image: studyImage,
    options: [
      {
        id: 'focus',
        text: 'Make a detailed plan',
        resultText: 'You feel more prepared for the semester.',
        effects: { intelligence: 8, health: -2, money: 0 },
      },
      {
        id: 'relax',
        text: 'Keep it simple',
        resultText: 'You save some energy, but your study routine stays loose.',
        effects: { intelligence: 3, health: 2, money: 0 },
      },
    ],
  },
  {
    taskId: 'orientation-party',
    title: 'Orientation Party',
    category: 'Social',
    description:
      'A student event is happening tonight. It could be a good chance to meet people, but you still have reading to finish.',
    image: socialImage,
    options: [
      {
        id: 'join',
        text: 'Go and talk to people',
        resultText: 'You meet new classmates and feel less alone.',
        effects: { intelligence: -2, health: 4, money: -4 },
      },
      {
        id: 'skip',
        text: 'Stay home and rest',
        resultText: 'You recover some energy, but miss a social opening.',
        effects: { intelligence: 1, health: 3, money: 0 },
      },
    ],
  },
  {
    taskId: 'gaming-break',
    title: 'Gaming Break',
    category: 'Entertainment',
    description:
      'After a long day, your console looks very tempting. A short break may refresh you, but it can easily stretch into the whole evening.',
    image: playGameImage,
    options: [
      {
        id: 'short-break',
        text: 'Play for one hour',
        resultText: 'A controlled break helps you reset.',
        effects: { intelligence: 0, health: 4, money: 0 },
      },
      {
        id: 'long-session',
        text: 'Keep playing late',
        resultText: 'It is fun, but tomorrow morning may be rough.',
        effects: { intelligence: -5, health: -6, money: 0 },
      },
    ],
  },
  {
    taskId: 'city-exploration',
    title: 'Explore the City',
    category: 'Travel',
    description:
      'You have a free afternoon to explore somewhere new. It may become a good memory, but transport and food will cost money.',
    image: travelImage,
    options: [
      {
        id: 'explore',
        text: 'Take the trip',
        resultText: 'The city starts to feel more familiar.',
        effects: { intelligence: 1, health: 5, money: -8 },
      },
      {
        id: 'save-money',
        text: 'Save money today',
        resultText: 'Your budget feels safer, though the day is quieter.',
        effects: { intelligence: 0, health: -1, money: 5 },
      },
    ],
  },
]

export const defaultContent = taskLibrary[0]
