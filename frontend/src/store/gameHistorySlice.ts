import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { GameResult } from '../utils/gameResultTypes'

export const STORAGE_KEY = 'game_history'
export const LAST_RESULT_KEY = 'last_game_result_id'

function loadInitialState(): GameResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as unknown
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0] && typeof parsed[0] === 'object' && 'id' in parsed[0]) {
        return parsed as GameResult[]
      }
    }
  } catch {
    // corrupted data — discard
  }
  return []
}

interface GameHistoryState {
  records: GameResult[]
}

const initialState: GameHistoryState = {
  records: loadInitialState(),
}

const gameHistorySlice = createSlice({
  name: 'gameHistory',
  initialState,
  reducers: {
    addRecord(state, action: PayloadAction<GameResult>) {
      if (!state.records.some(r => r.id === action.payload.id)) {
        state.records.push(action.payload)
      }
    },
    clearHistory(state) {
      state.records = []
    },
    setRecords(state, action: PayloadAction<GameResult[]>) {
      state.records = action.payload
    },
  },
})

export const { addRecord, clearHistory, setRecords } = gameHistorySlice.actions
export default gameHistorySlice.reducer

