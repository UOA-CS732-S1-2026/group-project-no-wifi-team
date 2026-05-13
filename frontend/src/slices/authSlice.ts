import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export const AUTH_TOKEN_KEY = 'auth_token'

interface AuthState {
  token: string | null
  userId: string | null
  username: string | null
  email: string | null
  achievements: string[]
  endings: string[]
  totalPlays: number
}

function loadInitialState(): AuthState {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (token) {
      return { token, userId: null, username: null, email: null, achievements: [], endings: [], totalPlays: 0 }
    }
  } catch { /* localStorage unavailable */ }
  return { token: null, userId: null, username: null, email: null, achievements: [], endings: [], totalPlays: 0 }
}

const initialState: AuthState = loadInitialState()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{
      token: string; userId: string; username: string; email: string;
      achievements?: string[]; endings?: string[]; totalPlays?: number;
    }>) {
      const { token, userId, username, email, achievements, endings, totalPlays } = action.payload
      state.token = token
      state.userId = userId
      state.username = username
      state.email = email
      state.achievements = achievements ?? []
      state.endings = endings ?? []
      state.totalPlays = totalPlays ?? 0
      try { localStorage.setItem(AUTH_TOKEN_KEY, token) } catch { /* quota exceeded or storage disabled */ }
    },
    logout(state) {
      state.token = null
      state.userId = null
      state.username = null
      state.email = null
      state.achievements = []
      state.endings = []
      state.totalPlays = 0
      try { localStorage.removeItem(AUTH_TOKEN_KEY) } catch { /* storage disabled */ }
    },
    setStats(state, action: PayloadAction<{ achievements?: string[]; endings?: string[]; totalPlays?: number }>) {
      if (action.payload.achievements) state.achievements = action.payload.achievements
      if (action.payload.endings) state.endings = action.payload.endings
      if (action.payload.totalPlays != null) state.totalPlays = action.payload.totalPlays
    },
  },
})

export const { loginSuccess, logout, setStats } = authSlice.actions
export default authSlice.reducer
