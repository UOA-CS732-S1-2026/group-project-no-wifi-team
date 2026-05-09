import { get } from '../utils/request'

export interface EventOption {
  label: string
  story: string
  effects: { intelligence: number; health: number; wealth: number }
  achievementKey: string | null
}

export interface EventFromAPI {
  _id: string
  eventKey: string
  title: string
  description: string
  category: 'study' | 'entertainment' | 'social' | 'random'
  quarter: number
  options: EventOption[]
  achievementKey: string | null
}

export function fetchEventsByQuarter(quarter: number) {
  return get<{ quarter: number; events: EventFromAPI[] }>(`/game/events?quarter=${quarter}`)
}

export function fetchRandomEvent(quarter: number) {
  return get<{ event: EventFromAPI }>(`/game/events/random?quarter=${quarter}`)
}
