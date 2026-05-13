import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import gameReducer from '../slices/gameSlice'
import authReducer, { loginSuccess } from '../slices/authSlice'
import gameHistoryReducer from '../store/gameHistorySlice'
import { TitleScreen } from './TitleScreen'

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>()
  const { forwardRef, createElement } = await import('react')
  const noAnim = (tag: string) =>
    forwardRef(({ children, initial: _i, animate: _a, exit: _e, transition: _t,
      whileHover: _wh, whileTap: _wt, ...rest }: any, ref: any) =>
      createElement(tag, { ...rest, ref }, children)
    )
  return {
    ...actual,
    motion: new Proxy(actual.motion, { get: (_t, key: string) => noAnim(key) }),
    AnimatePresence: ({ children }: any) => children,
  }
})

vi.mock('../contexts/MusicContext', () => ({
  useMusicContext: () => ({
    musicEnabled: false, setMusicEnabled: vi.fn(),
    sfxEnabled: false, setSfxEnabled: vi.fn(),
    setCustomBgm: vi.fn(),
  }),
  MusicProvider: ({ children }: any) => children,
}))

vi.mock('../utils/preloadImages', () => ({
  usePreloadImages: vi.fn(),
  preloadImages: vi.fn(),
}))

vi.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }: any) => children,
  useGoogleLogin: () => vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

function makeStore(loggedIn = false) {
  const store = configureStore({
    reducer: { game: gameReducer, auth: authReducer, gameHistory: gameHistoryReducer },
  })
  if (loggedIn) {
    store.dispatch(loginSuccess({ token: 'tok', userId: 'u1', username: 'Grace', email: 'g@g.com' }))
  }
  return store
}

function renderTitle(loggedIn = false) {
  return render(
    <Provider store={makeStore(loggedIn)}>
      <MemoryRouter>
        <TitleScreen />
      </MemoryRouter>
    </Provider>
  )
}

describe('TitleScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true })
  })

  it('renders the Start Game button', () => {
    renderTitle()
    expect(screen.getByRole('button', { name: /start game/i })).toBeInTheDocument()
  })

  it('renders the About Us button', () => {
    renderTitle()
    expect(screen.getByRole('button', { name: /about us/i })).toBeInTheDocument()
  })

  it('renders the Settings button', () => {
    renderTitle()
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument()
  })

  it('navigates to /characters when Start Game is clicked', () => {
    renderTitle()
    fireEvent.click(screen.getByRole('button', { name: /start game/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/characters')
  })

  it('shows welcome message when user is logged in', () => {
    renderTitle(true)
    expect(screen.getByText(/welcome, grace/i)).toBeInTheDocument()
  })

  it('does not show welcome message when guest', () => {
    renderTitle(false)
    expect(screen.queryByText(/welcome/i)).not.toBeInTheDocument()
  })

  it('opens About modal when About Us is clicked', () => {
    renderTitle()
    fireEvent.click(screen.getByRole('button', { name: /about us/i }))
    expect(screen.getByText('Team No WiFi')).toBeInTheDocument()
  })

  it('opens Settings modal when Settings button is clicked', () => {
    renderTitle()
    fireEvent.click(screen.getByRole('button', { name: /settings/i }))
    expect(screen.getByText(/music/i)).toBeInTheDocument()
  })
})
