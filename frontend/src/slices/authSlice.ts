import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_PROFILE_KEY = 'auth_profile'
const GUEST_ID_KEY = 'guest_id'

interface AuthState {
  token: string | null
  userId: string
  username: string | null
  email: string | null
  achievements: string[]
  endings: string[]
  totalPlays: number
}

function makeGuestId(): string {
  return crypto.randomUUID?.() ?? 'guest-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
}

function resolveGuestId(): string {
  try {
    const id = localStorage.getItem(GUEST_ID_KEY)
    if (id) return id
    const fresh = makeGuestId()
    localStorage.setItem(GUEST_ID_KEY, fresh)
    return fresh
  } catch {
    return makeGuestId()
  }
}

function loadInitialState(): AuthState {
  const empty = { achievements: [] as string[], endings: [] as string[], totalPlays: 0 }
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) {
      return { token: null, userId: resolveGuestId(), username: null, email: null, ...empty }
    }
    let profile: Partial<AuthState> | null = null
    try {
      profile = JSON.parse(localStorage.getItem(AUTH_PROFILE_KEY) ?? 'null') as Partial<AuthState> | null
    } catch { /* corrupted profile — recover with token only */ }
    return {
      token,
      userId: profile?.userId ?? resolveGuestId(),
      username: profile?.username ?? null,
      email: profile?.email ?? null,
      achievements: profile?.achievements ?? [],
      endings: profile?.endings ?? [],
      totalPlays: profile?.totalPlays ?? 0,
    }
  } catch { /* localStorage unavailable */ }
  return { token: null, userId: resolveGuestId(), username: null, email: null, ...empty }
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
      try {
        localStorage.setItem(AUTH_TOKEN_KEY, token)
        localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify({
          userId, username, email,
          achievements: state.achievements,
          endings: state.endings,
          totalPlays: state.totalPlays,
        }))
      } catch { /* quota exceeded or storage disabled */ }
    },
    logout(state) {
      state.token = null
      state.userId = resolveGuestId()
      state.username = null
      state.email = null
      state.achievements = []
      state.endings = []
      state.totalPlays = 0
      try { localStorage.removeItem(AUTH_TOKEN_KEY); localStorage.removeItem(AUTH_PROFILE_KEY) } catch { /* storage disabled */ }
    },
    setStats(state, action: PayloadAction<{ achievements?: string[]; endings?: string[]; totalPlays?: number }>) {
      if (action.payload.achievements) state.achievements = action.payload.achievements
      if (action.payload.endings) state.endings = action.payload.endings
      if (action.payload.totalPlays != null) state.totalPlays = action.payload.totalPlays
      try {
        localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify({
          userId: state.userId, username: state.username, email: state.email,
          achievements: state.achievements, endings: state.endings, totalPlays: state.totalPlays,
        }))
      } catch { /* storage disabled */ }
    },
  },
})

export const { loginSuccess, logout, setStats } = authSlice.actions
export default authSlice.reducer
