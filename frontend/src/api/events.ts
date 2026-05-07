import { get } from '../utils/request'

export interface EventFromAPI {
  _id: string
  eventKey: string
  title: string
  description: string
  category: 'study' | 'entertainment' | 'social'
  quarter: number
  participateEffects: { intelligence: number; health: number; wealth: number }
  skipEffects: { intelligence: number; health: number; wealth: number }
  participateStory: string
  skipStory: string
}

export function fetchEventsByQuarter(quarter: number) {
  return get<{ quarter: number; events: EventFromAPI[] }>(`/game/events?quarter=${quarter}`)
}
