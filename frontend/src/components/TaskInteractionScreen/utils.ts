import { attributeLabels, taskLibrary } from './constants'
import type { AttributeLevel, RouteTask, TaskInteractionContent } from './types'

export function clampStat(value: number) {
  return Math.max(0, Math.min(100, value))
}

export function getLevel(value: number): AttributeLevel {
  if (value <= 34) return 'bad'
  if (value <= 69) return 'average'
  if (value <= 89) return 'good'
  return 'excellent'
}

export function levelText(value: number) {
  const level = getLevel(value)
  if (level === 'bad') return 'Poor'
  if (level === 'average') return 'Average'
  if (level === 'good') return 'Good'
  return 'Excellent'
}

export function formatEffect(value: number) {
  return value > 0 ? `+${value}` : `${value}`
}

export function effectClass(value: number) {
  if (value > 0) return 'text-[#567b2c]'
  if (value < 0) return 'text-[#a24738]'
  return 'text-[#7b654b]'
}

function getVisualTask(task: RouteTask, index: number) {
  const keyText = `${task.id ?? ''} ${task.name ?? ''}`.toLowerCase()
  if (/(travel|trip|city|explore|campus|grocery)/.test(keyText)) return taskLibrary[3]
  if (/(party|club|flatmate|dinner|classmate|social)/.test(keyText)) return taskLibrary[1]
  if (/(study|library|revision|assignment|office|exam|midterm|plan)/.test(keyText)) {
    return taskLibrary[0]
  }

  const category = task.category?.toLowerCase()
  if (category === 'study') return taskLibrary[0]
  if (category === 'social') return taskLibrary[1]
  if (category === 'entertainment') return taskLibrary[2]

  return taskLibrary[index % taskLibrary.length]
}

export function taskFromRouteTask(
  task: RouteTask,
  index: number,
  isRandomEvent = false,
): TaskInteractionContent {
  const idMatch = taskLibrary.find((item) => item.taskId === task.id || item.title === task.name)
  const visualTask = idMatch ?? getVisualTask(task, index)

  const isRandom = isRandomEvent || !!task.isRandomEvent || task.category?.toLowerCase() === 'random'

  const base = {
    ...visualTask,
    taskId: task.id ?? visualTask.taskId,
    title: task.name ?? visualTask.title,
    description: task.description ?? visualTask.description,
    isRandomEvent: isRandom,
  }

  if (task.options && task.options.length > 0) {
    return {
      ...base,
      options: task.options.map((opt, i) => ({
        id: `option-${i}`,
        text: opt.label,
        resultText: opt.story,
        effects: {
          intelligence: opt.effects.intelligence,
          health: opt.effects.health,
          money: opt.effects.wealth,
        },
        achievementKey: opt.achievementKey ?? null,
      })),
    }
  }

  if (task.participateEffects && task.skipEffects) {
    return {
      ...base,
      options: [
        {
          id: 'participate',
          text: 'Participate',
          resultText: task.participateStory ?? visualTask.options[0]?.resultText ?? '',
          effects: {
            intelligence: task.participateEffects.intelligence,
            health: task.participateEffects.health,
            money: task.participateEffects.wealth,
          },
        },
        {
          id: 'skip',
          text: 'Skip',
          resultText: task.skipStory ?? visualTask.options[1]?.resultText ?? '',
          effects: {
            intelligence: task.skipEffects.intelligence,
            health: task.skipEffects.health,
            money: task.skipEffects.wealth,
          },
        },
      ],
    }
  }

  return base
}

export { attributeLabels }
