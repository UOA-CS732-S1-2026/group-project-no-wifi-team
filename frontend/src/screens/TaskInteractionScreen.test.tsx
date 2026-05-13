import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import gameReducer from '../slices/gameSlice'
import authReducer from '../slices/authSlice'
import gameHistoryReducer from '../store/gameHistorySlice'
import { TaskInteractionScreen } from './TaskInteractionScreen'
import type { TaskInteractionContent } from '../components/TaskInteractionScreen'

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>()
  const { forwardRef, createElement } = await import('react')
  const noAnim = (tag: string) =>
    forwardRef(({ children, initial: _i, animate: _a, exit: _e, transition: _t,
      whileHover: _wh, whileTap: _wt, variants: _v, ...rest }: any, ref: any) =>
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
  coinSfx: '',
  endingBgm: '',
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../utils/request', () => ({
  post: vi.fn().mockResolvedValue({}),
  get: vi.fn().mockResolvedValue({}),
  default: {},
}))

const TASK: TaskInteractionContent = {
  taskId: 'test-study-001',
  title: 'Library Research Session',
  category: 'Study',
  description: 'Spend the afternoon at the library doing research.',
  image: '/images/study.png',
  options: [
    {
      id: 'opt-a',
      text: 'Study hard',
      resultText: 'You studied hard and gained intelligence!',
      effects: { intelligence: 2, health: -1, money: 0 },
    },
    {
      id: 'opt-b',
      text: 'Take it easy',
      resultText: 'You took it easy and felt refreshed.',
      effects: { intelligence: 0, health: 1, money: 0 },
    },
  ],
}

function makeStore() {
  return configureStore({
    reducer: { game: gameReducer, auth: authReducer, gameHistory: gameHistoryReducer },
  })
}

function renderScreen(content = TASK) {
  return render(
    <Provider store={makeStore()}>
      <MemoryRouter>
        <TaskInteractionScreen content={content} />
      </MemoryRouter>
    </Provider>
  )
}

describe('TaskInteractionScreen', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the task title', () => {
    renderScreen()
    expect(screen.getByText('Library Research Session')).toBeInTheDocument()
  })

  it('renders the task description', () => {
    renderScreen()
    expect(screen.getByText(/spend the afternoon at the library/i)).toBeInTheDocument()
  })

  it('renders all choice options', () => {
    renderScreen()
    expect(screen.getByText('Study hard')).toBeInTheDocument()
    expect(screen.getByText('Take it easy')).toBeInTheDocument()
  })

  it('shows result text after selecting a choice', () => {
    renderScreen()
    fireEvent.click(screen.getByText('Study hard'))
    expect(screen.getByText('You studied hard and gained intelligence!')).toBeInTheDocument()
  })

  it('hides option buttons after a choice is made', () => {
    renderScreen()
    fireEvent.click(screen.getByText('Study hard'))
    // Choice buttons become hidden after selection
    expect(screen.getByText('Take it easy').closest('button')).toHaveStyle({ visibility: 'hidden' })
  })

  it('navigates to quarterly-summary when View Summary is clicked after final task', () => {
    renderScreen()
    fireEvent.click(screen.getByText('Study hard'))
    // Single task → isLastTask=true → button shows "View Summary"
    fireEvent.click(screen.getByText('View Summary'))
    expect(mockNavigate).toHaveBeenCalledWith('/quarterly-summary', expect.anything())
  })
})
