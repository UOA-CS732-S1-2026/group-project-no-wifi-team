export type AttributeKey = 'intelligence' | 'health' | 'money'
export type AttributeLevel = 'bad' | 'average' | 'good' | 'excellent'
export type TaskCategory = 'Study' | 'Social' | 'Entertainment' | 'Travel' | 'Random'

export interface ChoiceOption {
  id: string
  text: string
  resultText: string
  effects: Record<AttributeKey, number>
  achievementKey?: string | null
}

export interface TaskInteractionContent {
  taskId: string
  title: string
  category: TaskCategory
  description: string
  image: string
  options: ChoiceOption[]
  isRandomEvent?: boolean
  autoEffects?: Record<AttributeKey, number>
  achievementKey?: string | null
}

export interface RouteTask {
  id?: string
  name?: string
  category?: string
  options?: {
    label: string
    story: string
    effects: { intelligence: number; health: number; wealth: number }
    achievementKey?: string | null
  }[]
  participateEffects?: { intelligence: number; health: number; wealth: number }
  skipEffects?: { intelligence: number; health: number; wealth: number }
  participateStory?: string
  skipStory?: string
  description?: string
  isRandomEvent?: boolean
}

export interface RouteState {
  tasks?: RouteTask[]
}
