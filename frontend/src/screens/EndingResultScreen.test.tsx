import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import gameReducer from '../slices/gameSlice'
import gameHistoryReducer, { LAST_RESULT_KEY } from '../store/gameHistorySlice'
import { EndingResultScreen } from './EndingResultScreen'

// Prevent real HTTP calls from the fire-and-forget POST
const mockPost = vi.fn().mockResolvedValue({})
vi.mock('../utils/request', () => ({
  post: (...args: unknown[]) => mockPost(...args),
  get: vi.fn().mockResolvedValue({}),
  default: {},
}))

const makeLocalStorageMock = () => {
  const store: Record<string, string> = {}
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v },
    removeItem: (k: string) => { delete store[k] },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]) },
    key: (i: number) => Object.keys(store)[i] ?? null,
    get length() { return Object.keys(store).length },
  }
}

function makeStore() {
  return configureStore({
    reducer: {
      game: gameReducer,
      gameHistory: gameHistoryReducer,
    },
  })
}

function renderAt(initial: { pathname: string; state?: unknown }) {
  return render(
    <Provider store={makeStore()}>
      <MemoryRouter initialEntries={[initial]}>
        <EndingResultScreen />
      </MemoryRouter>
    </Provider>,
  )
}

/** Returns the store so callers can inspect Redux state after render. */
function renderWithStore(initial: { pathname: string; state?: unknown }) {
  const store = makeStore()
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initial]}>
        <EndingResultScreen />
      </MemoryRouter>
    </Provider>,
  )
  return store
}

/** Adds a /endings sentinel route so navigation clicks can be asserted. */
function renderWithNavigation(initial: { pathname: string; state?: unknown }) {
  return render(
    <Provider store={makeStore()}>
      <MemoryRouter initialEntries={[initial]}>
        <Routes>
          <Route path="/ending-result" element={<EndingResultScreen />} />
          <Route path="/endings" element={<div data-testid="endings-page">Endings</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
}

describe('EndingResultScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'localStorage', {
      value: makeLocalStorageMock(),
      writable: true,
      configurable: true,
    })
  })

  // ── Ending resolution ─────────────────────────────────────────────────────────

  it('renders the "ENDING" label and the resolved ending title', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 95, health: 95, wealth: 95 } },
    })
    expect(screen.getByText('ENDING')).toBeInTheDocument()
    expect(screen.getByText('Perfect All-Rounder')).toBeInTheDocument()
  })

  it('renders the ending description', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 95, health: 95, wealth: 95 } },
    })
    expect(
      screen.getByText(/you did not just survive international student life/i),
    ).toBeInTheDocument()
  })

  it('renders the Burnout Student ending when health collapses despite high intelligence', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 92, health: 20, wealth: 60 } },
    })
    expect(screen.getByText('Burnout Student')).toBeInTheDocument()
    expect(screen.getByText(/pushed yourself too hard/i)).toBeInTheDocument()
  })

  it('renders the Academic Star ending for high intelligence with adequate health', () => {
    // intelligence=88 (>=85), health=60 (>=45) — Burnout fires first only when health<45
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 88, health: 60, wealth: 50 } },
    })
    expect(screen.getByText('Academic Star')).toBeInTheDocument()
  })

  it('renders the Part-Time Hustler ending for high wealth with low intelligence', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 30, health: 70, wealth: 90 } },
    })
    expect(screen.getByText('Part-Time Hustler')).toBeInTheDocument()
  })

  it('falls back to Steady Graduate when no state is supplied', () => {
    renderAt({ pathname: '/ending-result' })
    expect(screen.getByText('Steady Graduate')).toBeInTheDocument()
  })

  it('fills in per-field fallback values for a partial snapshot', () => {
    // Only intelligence provided; health defaults to 65 and wealth to 60 (FALLBACK_SNAPSHOT).
    // resolveEnding({95, 65, 60}) → Academic Star (isHigh(95) && !isLow(65))
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 95 } },
    })
    expect(screen.getByText('Academic Star')).toBeInTheDocument()
  })

  // ── Achievements ──────────────────────────────────────────────────────────────

  it('shows 3 achievement images for an S-rank ending', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 95, health: 95, wealth: 95 } },
    })
    expect(screen.getAllByRole('img', { name: /achievement/i })).toHaveLength(3)
  })

  it('shows 2 achievement images for an A-rank ending (Academic Star)', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 88, health: 60, wealth: 50 } },
    })
    expect(screen.getAllByRole('img', { name: /achievement/i })).toHaveLength(2)
  })

  it('shows 1 achievement image for a B-rank ending (Steady Graduate)', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 60, health: 60, wealth: 60 } },
    })
    expect(screen.getAllByRole('img', { name: /achievement/i })).toHaveLength(1)
  })

  it('shows no achievement images for a C-rank ending (Lost Year)', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 50, health: 20, wealth: 50 } },
    })
    expect(screen.queryAllByRole('img', { name: /achievement/i })).toHaveLength(0)
  })

  // ── UI buttons ────────────────────────────────────────────────────────────────

  it('renders the Ranking List and Achievement Collection buttons', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 80, health: 80, wealth: 80 } },
    })
    expect(screen.getByRole('button', { name: /ranking list/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /achievement collection/i })).toBeInTheDocument()
  })

  it('navigates to /endings when clicking Achievement Collection', () => {
    renderWithNavigation({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 80, health: 80, wealth: 80 } },
    })
    fireEvent.click(screen.getByRole('button', { name: /achievement collection/i }))
    expect(screen.getByTestId('endings-page')).toBeInTheDocument()
  })

  // ── Rankings "Coming Soon" popup ──────────────────────────────────────────────

  it('opens the Coming-Soon popup when clicking Ranking List', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 80, health: 80, wealth: 80 } },
    })
    fireEvent.click(screen.getByRole('button', { name: /ranking list/i }))
    expect(screen.getByText('Coming Soon')).toBeInTheDocument()
    expect(screen.getByText(/this feature is not available yet/i)).toBeInTheDocument()
  })

  it('closes the popup when clicking Close', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 80, health: 80, wealth: 80 } },
    })
    fireEvent.click(screen.getByRole('button', { name: /ranking list/i }))
    expect(screen.getByText('Coming Soon')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(screen.queryByText('Coming Soon')).not.toBeInTheDocument()
  })

  // ── Redux and localStorage side effects ───────────────────────────────────────

  it('dispatches addRecord to the Redux store after render', async () => {
    const store = renderWithStore({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 90, health: 90, wealth: 90 } },
    })
    await waitFor(() => expect(store.getState().gameHistory.records).toHaveLength(1))
    expect(store.getState().gameHistory.records[0].endingId).toBe('perfect-all-rounder')
  })

  it('writes the result id to localStorage under LAST_RESULT_KEY after render', async () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 80, health: 80, wealth: 80 } },
    })
    await waitFor(() =>
      expect(window.localStorage.getItem(LAST_RESULT_KEY)).not.toBeNull(),
    )
  })

  // ── Backend persistence ───────────────────────────────────────────────────────

  it('POSTs game result to /game/result after render', async () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 90, health: 90, wealth: 90 } },
    })
    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1))
    const [path, payload] = mockPost.mock.calls[0] as [string, Record<string, unknown>]
    expect(path).toBe('/game/result')
    expect(payload).toMatchObject({
      endingId: 'perfect-all-rounder',
      endingRank: 'S',
      endingTheme: 'happy',
      snapshot: { intelligence: 90, health: 90, wealth: 90 },
      achievements: expect.arrayContaining(['graduate', 'cultural-explorer', 'global-adventurer']),
    })
  })

  it('includes the correct score and endingTitle in the POST payload', async () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 90, health: 90, wealth: 90 } },
    })
    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1))
    const [, payload] = mockPost.mock.calls[0] as [string, Record<string, unknown>]
    expect(payload.score).toBe(90) // Math.round((90+90+90)/3)
    expect(payload.endingTitle).toBe('Perfect All-Rounder')
  })

  it('uses playerName from location.state when no character is selected', async () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 80, health: 80, wealth: 80 }, playerName: 'TestPlayer' },
    })
    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1))
    const [, payload] = mockPost.mock.calls[0] as [string, Record<string, unknown>]
    expect(payload.playerName).toBe('TestPlayer')
  })

  it("defaults playerName to 'Player' when neither character nor state provides a name", async () => {
    renderAt({ pathname: '/ending-result' })
    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1))
    const [, payload] = mockPost.mock.calls[0] as [string, Record<string, unknown>]
    expect(payload.playerName).toBe('Player')
  })

  it('reads userId from localStorage guestId and includes it in the POST', async () => {
    window.localStorage.setItem('guestId', 'test-guest-123')
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 80, health: 80, wealth: 80 } },
    })
    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1))
    const [, payload] = mockPost.mock.calls[0] as [string, Record<string, unknown>]
    expect(payload.userId).toBe('test-guest-123')
  })

  it('reads userId from legacy localStorage guest_id key as fallback', async () => {
    window.localStorage.setItem('guest_id', 'legacy-guest-456')
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 80, health: 80, wealth: 80 } },
    })
    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1))
    const [, payload] = mockPost.mock.calls[0] as [string, Record<string, unknown>]
    expect(payload.userId).toBe('legacy-guest-456')
  })

  it('sends null userId when no guest key is present in localStorage', async () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 80, health: 80, wealth: 80 } },
    })
    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1))
    const [, payload] = mockPost.mock.calls[0] as [string, Record<string, unknown>]
    expect(payload.userId).toBeNull()
  })

  it('sends exactly 3 achievements in the POST for an S-rank result', async () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 95, health: 95, wealth: 95 } },
    })
    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1))
    const payload = mockPost.mock.calls[0][1] as { achievements: string[] }
    expect(payload.achievements).toHaveLength(3)
  })

  it('sends 0 achievements in the POST for a C-rank result', async () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 50, health: 20, wealth: 50 } },
    })
    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1))
    const payload = mockPost.mock.calls[0][1] as { achievements: string[] }
    expect(payload.achievements).toHaveLength(0)
  })
})
