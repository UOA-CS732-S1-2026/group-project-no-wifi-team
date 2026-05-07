import { configureStore } from '@reduxjs/toolkit'
import gameHistoryReducer, { STORAGE_KEY } from './store/gameHistorySlice'

export const store = configureStore({
  reducer: {
    gameHistory: gameHistoryReducer,
  },
})

store.subscribe(() => {
  try {
    const { records } = store.getState().gameHistory
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch {
    // localStorage quota exceeded — silently degrade
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
