import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import gameReducer from '../slices/gameSlice'
import authReducer from '../slices/authSlice'
import gameHistoryReducer from '../store/gameHistorySlice'
import { CharacterSelectScreen } from './CharacterSelectScreen'

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
}))

vi.mock('../utils/preloadImages', () => ({
  usePreloadImages: vi.fn(),
  preloadImages: vi.fn(),
}))

// Force mobile layout for simpler testing (no scroll/stage scaling)
vi.mock('../components/CharacterSelectScreen/hooks', () => ({
  useIsMobile: () => true,
  useResponsiveStageScale: () => 1,
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

function makeStore() {
  return configureStore({
    reducer: { game: gameReducer, auth: authReducer, gameHistory: gameHistoryReducer },
  })
}

function renderScreen() {
  return render(
    <Provider store={makeStore()}>
      <MemoryRouter>
        <CharacterSelectScreen />
      </MemoryRouter>
    </Provider>
  )
}

describe('CharacterSelectScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    const store: Record<string, string> = {}
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => { store[k] = v },
        removeItem: (k: string) => { delete store[k] },
        clear: () => Object.keys(store).forEach(k => delete store[k]),
      },
      writable: true,
      configurable: true,
    })
  })

  it('renders all six character titles', () => {
    renderScreen()
    expect(screen.getByText('Academic Achiever')).toBeInTheDocument()
    expect(screen.getByText('Rich Kid')).toBeInTheDocument()
    expect(screen.getByText('Fitness Enthusiast')).toBeInTheDocument()
    expect(screen.getByText('Ordinary Student')).toBeInTheDocument()
    expect(screen.getByText('Hard-core Worker')).toBeInTheDocument()
    expect(screen.getByText('Heavenly Dragon')).toBeInTheDocument()
  })

  it('renders the CHARACTER LIST heading', () => {
    renderScreen()
    expect(screen.getByText('CHARACTER LIST')).toBeInTheDocument()
  })

  it('navigates to /monthly-task-selection when a character is selected', () => {
    renderScreen()
    fireEvent.click(screen.getByRole('button', { name: /Select Academic Achiever/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/monthly-task-selection')
  })

  it('navigates to / when Back to Home is clicked', () => {
    renderScreen()
    fireEvent.click(screen.getByRole('button', { name: /back to home/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('saves selected character to localStorage', () => {
    renderScreen()
    fireEvent.click(screen.getByRole('button', { name: /Select Rich Kid/i }))
    const stored = JSON.parse(localStorage.getItem('selectedCharacter') ?? '{}')
    expect(stored.title).toBe('Rich Kid')
  })

  it('opens Settings modal when Settings button is clicked', () => {
    renderScreen()
    fireEvent.click(screen.getByRole('button', { name: /settings/i }))
    expect(screen.getByText(/music/i)).toBeInTheDocument()
  })
})
