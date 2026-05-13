import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import gameReducer from '../slices/gameSlice'
import authReducer from '../slices/authSlice'
import gameHistoryReducer from '../store/gameHistorySlice'
import { EndingCollectionScreen } from './EndingCollectionScreen'

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
  endingBgm: '',
}))

vi.mock('../api/achievements', () => ({
  fetchAchievements: vi.fn().mockResolvedValue([]),
  getEarnedCategories: vi.fn().mockReturnValue([]),
}))

const mockGet = vi.fn()
vi.mock('../utils/request', () => ({
  get: (...args: unknown[]) => mockGet(...args),
  post: vi.fn().mockResolvedValue({}),
  default: {},
}))

vi.mock('../components/EndingCollectionScreen/hooks', () => ({
  useResponsiveStageScale: () => ({ scale: 1, isMobile: false }),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

const MOCK_ENDINGS = [
  { endingId: 'model-minority-real-version', title: 'The Model Minority Myth: Real Version', status: 'Unlocked' as const },
  { endingId: 'library-resident-landlord', title: "Library's Resident Landlord", status: 'Unlocked' as const },
  { endingId: 'showed-up-survived', title: 'I Showed Up, I Survived', status: 'Locked' as const },
]

const MOCK_ENDINGS_RESPONSE = {
  success: true, total: 3, unlocked: 2, locked: 1,
  data: MOCK_ENDINGS,
}

function makeStore() {
  return configureStore({
    reducer: { game: gameReducer, auth: authReducer, gameHistory: gameHistoryReducer },
  })
}

function renderScreen() {
  return render(
    <Provider store={makeStore()}>
      <MemoryRouter>
        <EndingCollectionScreen />
      </MemoryRouter>
    </Provider>
  )
}

describe('EndingCollectionScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGet.mockImplementation((url: string) => {
      if (url === '/endings') return Promise.resolve(MOCK_ENDINGS_RESPONSE)
      if (url === '/game/result/latest') return Promise.reject(new Error('no result'))
      return Promise.resolve({})
    })
  })

  it('shows loading state before data arrives', () => {
    mockGet.mockReturnValue(new Promise(() => {}))
    renderScreen()
    expect(screen.getByText(/loading ending collection/i)).toBeInTheDocument()
  })

  it('renders unlocked ending titles after data loads', async () => {
    renderScreen()
    await waitFor(() =>
      expect(screen.getByText('The Model Minority Myth: Real Version')).toBeInTheDocument()
    )
    expect(screen.getByText("Library's Resident Landlord")).toBeInTheDocument()
  })

  it('renders locked ending cards', async () => {
    renderScreen()
    await waitFor(() =>
      expect(screen.getByText('I Showed Up, I Survived')).toBeInTheDocument()
    )
  })

  it('shows error state when API fails', async () => {
    mockGet.mockRejectedValue(new Error('Server error'))
    renderScreen()
    await waitFor(() =>
      expect(screen.getByText(/failed to load data/i)).toBeInTheDocument()
    )
  })

  it('shows Try Again button on error', async () => {
    mockGet.mockRejectedValue(new Error('Server error'))
    renderScreen()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    )
  })

  it('renders the Replay Journey button after data loads', async () => {
    renderScreen()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /replay journey/i })).toBeInTheDocument()
    )
  })
})
