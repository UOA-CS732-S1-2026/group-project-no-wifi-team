import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import gameReducer from '../slices/gameSlice'
import authReducer from '../slices/authSlice'
import gameHistoryReducer from '../store/gameHistorySlice'
import { MonthlyTaskSelection } from './MonthlyTaskSelection'

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>()
  const { forwardRef, createElement } = await import('react')
  const noAnim = (tag: string) =>
    forwardRef(({ children, initial: _i, animate: _a, exit: _e, transition: _t,
      whileHover: _wh, whileTap: _wt, layout: _l, layoutId: _li, variants: _v, ...rest }: any, ref: any) =>
      createElement(tag, { ...rest, ref }, children)
    )
  return {
    ...actual,
    motion: new Proxy(actual.motion, { get: (_t, key: string) => noAnim(key) }),
    AnimatePresence: ({ children }: any) => children,
    LayoutGroup: ({ children }: any) => children,
  }
})

vi.mock('../contexts/MusicContext', () => ({
  useMusicContext: () => ({
    musicEnabled: false, setMusicEnabled: vi.fn(),
    sfxEnabled: false, setSfxEnabled: vi.fn(),
    setCustomBgm: vi.fn(),
  }),
}))

const MOCK_EVENTS = [
  { _id: '1', eventKey: 'study-001', title: 'Go to Lecture', category: 'study' as const, quarter: 1, description: '', options: [], achievementKey: null },
  { _id: '2', eventKey: 'study-002', title: 'Study Group', category: 'study' as const, quarter: 1, description: '', options: [], achievementKey: null },
  { _id: '3', eventKey: 'social-001', title: 'Join a Club', category: 'social' as const, quarter: 1, description: '', options: [], achievementKey: null },
]

vi.mock('../api/events', () => ({
  fetchEventsByQuarter: vi.fn(),
  fetchRandomEvent: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

import { fetchEventsByQuarter } from '../api/events'

function makeStore() {
  return configureStore({
    reducer: { game: gameReducer, auth: authReducer, gameHistory: gameHistoryReducer },
  })
}

function renderScreen() {
  return render(
    <Provider store={makeStore()}>
      <MemoryRouter>
        <MonthlyTaskSelection />
      </MemoryRouter>
    </Provider>
  )
}

describe('MonthlyTaskSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fetchEventsByQuarter).mockResolvedValue({ quarter: 1, events: MOCK_EVENTS })
  })

  it('shows loading state before API responds', () => {
    vi.mocked(fetchEventsByQuarter).mockReturnValue(new Promise(() => {}))
    renderScreen()
    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument()
  })

  it('shows tasks after API responds', async () => {
    renderScreen()
    await waitFor(() => expect(screen.getByText('Go to Lecture')).toBeInTheDocument())
    expect(screen.getByText('Study Group')).toBeInTheDocument()
  })

  it('renders Available Tasks panel', async () => {
    renderScreen()
    await waitFor(() => expect(screen.getByText('Available Tasks')).toBeInTheDocument())
  })

  it('renders Selected This Quarter panel', async () => {
    renderScreen()
    await waitFor(() => expect(screen.getByText('Selected This Quarter')).toBeInTheDocument())
  })

  it('shows tasks for the active category only', async () => {
    renderScreen()
    await waitFor(() => expect(screen.getByText('Go to Lecture')).toBeInTheDocument())
    // Study is the default active category — social task should not be visible
    expect(screen.queryByText('Join a Club')).not.toBeInTheDocument()
  })

  it('removes task from available list when selected', async () => {
    renderScreen()
    // Wait for tasks to load
    const taskBtn = await screen.findByText('Go to Lecture')
    // The task card button is the closest button ancestor
    fireEvent.click(taskBtn.closest('button')!)
    // Task moves to selected panel — queryByRole restricts to the available list area
    await waitFor(() => {
      const allButtons = screen.queryAllByRole('button')
      const availableTaskBtns = allButtons.filter(
        (b) => b.getAttribute('data-sfx') === 'task-select'
      )
      expect(availableTaskBtns.every(b => !b.textContent?.includes('Go to Lecture'))).toBe(true)
    })
  })

  it('shows no tasks when API returns empty events', async () => {
    vi.mocked(fetchEventsByQuarter).mockResolvedValue({ quarter: 1, events: [] })
    renderScreen()
    await waitFor(() => expect(screen.queryByText(/loading tasks/i)).not.toBeInTheDocument())
    expect(screen.queryByText('Go to Lecture')).not.toBeInTheDocument()
  })
})
