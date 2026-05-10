import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './slices/gameSlice'
import gameHistoryReducer, { STORAGE_KEY } from './store/gameHistorySlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    game: gameReducer,
    gameHistory: gameHistoryReducer,
    auth: authReducer,
  },
})

let previousRecords = store.getState().gameHistory.records
store.subscribe(() => {
  try {
    const { records } = store.getState().gameHistory
    if (records !== previousRecords) {
      previousRecords = records
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    }
  } catch {
    // localStorage quota exceeded — silently degrade
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
