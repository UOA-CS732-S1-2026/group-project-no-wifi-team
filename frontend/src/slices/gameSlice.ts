import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Character, CharacterStats } from '../components/CharacterSelectScreen/constants'
import type { Task } from '../components/MonthlyTaskSelection/types'

interface QuarterTasks {
  selectedTasks: Task[]   // 3 player-chosen tasks
  randomTask: Task | null // 1 system-assigned random task
}

const DEFAULT_STATS: CharacterStats = { intelligence: 55, health: 60, wealth: 50 }

interface GameState {
  selectedCharacter: Character | null
  currentStats: CharacterStats
  currentQuarter: number
  quarters: Partial<Record<1 | 2 | 3 | 4, QuarterTasks>>
}

function readStoredCharacter(): Character | null {
  if (typeof localStorage === 'undefined') return null

  try {
    return JSON.parse(localStorage.getItem('selectedCharacter') ?? 'null') as Character | null
  } catch {
    return null
  }
}

const storedCharacter = readStoredCharacter()

const initialState: GameState = {
  selectedCharacter: storedCharacter,
  currentStats: storedCharacter?.stats ?? DEFAULT_STATS,
  currentQuarter: 1,
  quarters: {},
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    selectCharacter(state, action: PayloadAction<Character>) {
      state.selectedCharacter = action.payload
      state.currentStats = action.payload.stats
    },
    confirmQuarterTasks(
      state,
      action: PayloadAction<{ quarter: 1 | 2 | 3 | 4; selectedTasks: Task[]; randomTask: Task }>
    ) {
      const { quarter, selectedTasks, randomTask } = action.payload
      state.quarters[quarter] = { selectedTasks, randomTask }
    },
    advanceQuarter(state) {
      if (state.currentQuarter < 4) state.currentQuarter++
    },
    setQuarter(state, action: PayloadAction<1 | 2 | 3 | 4>) {
      state.currentQuarter = action.payload
    },
    resetGame(state) {
      state.selectedCharacter = null
      state.currentStats = DEFAULT_STATS
      state.currentQuarter = 1
      state.quarters = {}
    },
  },
})

export const { selectCharacter, confirmQuarterTasks, advanceQuarter, setQuarter, resetGame } =
  gameSlice.actions
export default gameSlice.reducer
