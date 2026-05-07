import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Task } from '../components/MonthlyTaskSelection/types'

interface QuarterTasks {
  selectedTasks: Task[]   // 3 player-chosen tasks
  randomTask: Task | null // 1 system-assigned random task
}

interface GameState {
  currentQuarter: number
  quarters: Partial<Record<1 | 2 | 3 | 4, QuarterTasks>>
}

const initialState: GameState = {
  currentQuarter: 1,
  quarters: {},
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
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
      state.currentQuarter = 1
      state.quarters = {}
    },
  },
})

export const { confirmQuarterTasks, advanceQuarter, setQuarter, resetGame } = gameSlice.actions
export default gameSlice.reducer
