import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Character, CharacterStats } from '../components/CharacterSelectScreen/constants'
import type { Task } from '../components/MonthlyTaskSelection/types'

interface QuarterTasks {
  selectedTasks: Task[]   // 3 player-chosen tasks
  randomTask: Task | null // 1 system-assigned random task
}

const DEFAULT_STATS: CharacterStats = { intelligence: 5, health: 5, wealth: 5 }
const ACHIEVEMENTS_KEY = 'earned_achievements'
const CHARACTER_KEY = 'selected_character'

interface GameState {
  selectedCharacter: Character | null
  currentStats: CharacterStats
  currentQuarter: number
  quarters: Partial<Record<1 | 2 | 3 | 4, QuarterTasks>>
  earnedAchievements: string[]
}

function readStoredCharacter(): Character | null {
  if (typeof localStorage === 'undefined') return null
  try {
    return JSON.parse(localStorage.getItem(CHARACTER_KEY) ?? 'null') as Character | null
  } catch {
    return null
  }
}

function readStoredAchievements(): string[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed as string[]
    }
  } catch { /* corrupted */ }
  return []
}

function persistAchievements(keys: string[]) {
  try { localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(keys)) } catch { /* quota */ }
}

const initialState: GameState = {
  selectedCharacter: readStoredCharacter(),
  currentStats: readStoredCharacter()?.stats ?? DEFAULT_STATS,
  currentQuarter: 1,
  quarters: {},
  earnedAchievements: readStoredAchievements(),
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    selectCharacter(state, action: PayloadAction<Character>) {
      state.selectedCharacter = action.payload
      state.currentStats = action.payload.stats
      try { localStorage.setItem(CHARACTER_KEY, JSON.stringify(action.payload)) } catch { /* quota */ }
    },
    confirmQuarterTasks(
      state,
      action: PayloadAction<{ quarter: 1 | 2 | 3 | 4; selectedTasks: Task[]; randomTask: Task }>
    ) {
      const { quarter, selectedTasks, randomTask } = action.payload
      state.quarters[quarter] = { selectedTasks, randomTask }
    },
    updateStats(state, action: PayloadAction<CharacterStats>) {
      state.currentStats = action.payload
    },
    advanceQuarter(state) {
      if (state.currentQuarter < 4) state.currentQuarter++
    },
    setQuarter(state, action: PayloadAction<1 | 2 | 3 | 4>) {
      state.currentQuarter = action.payload
    },
    earnAchievement(state, action: PayloadAction<string>) {
      if (!state.earnedAchievements.includes(action.payload)) {
        state.earnedAchievements.push(action.payload)
        persistAchievements(state.earnedAchievements)
      }
    },
    setInitialAchievements(state, action: PayloadAction<string[]>) {
      state.earnedAchievements = action.payload
      persistAchievements(state.earnedAchievements)
    },
    resetGame(state) {
      state.selectedCharacter = null
      state.currentStats = DEFAULT_STATS
      state.currentQuarter = 1
      state.quarters = {}
      state.earnedAchievements = []
      persistAchievements([])
      try { localStorage.removeItem(CHARACTER_KEY) } catch { /* quota */ }
    },
  },
})

export const {
  selectCharacter,
  confirmQuarterTasks,
  updateStats,
  advanceQuarter,
  setQuarter,
  earnAchievement,
  setInitialAchievements,
  resetGame,
} = gameSlice.actions
export default gameSlice.reducer
