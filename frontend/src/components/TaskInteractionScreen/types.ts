export type AttributeKey = 'intelligence' | 'health' | 'money'
export type AttributeLevel = 'bad' | 'average' | 'good' | 'excellent'
export type TaskCategory = 'Study' | 'Social' | 'Entertainment' | 'Travel'

export interface ChoiceOption {
  id: string
  text: string
  resultText: string
  effects: Record<AttributeKey, number>
}

export interface TaskInteractionContent {
  taskId: string
  title: string
  category: TaskCategory
  description: string
  image: string
  options: [ChoiceOption, ChoiceOption]
}

export interface RouteTask {
  id?: string
  name?: string
  category?: string
  participateEffects?: { intelligence: number; health: number; wealth: number }
  skipEffects?: { intelligence: number; health: number; wealth: number }
  participateStory?: string
  skipStory?: string
  description?: string
}

export interface RouteState {
  tasks?: RouteTask[]
}
