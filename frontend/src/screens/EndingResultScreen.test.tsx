import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import gameReducer, { earnAchievement } from '../slices/gameSlice'
import gameHistoryReducer, { LAST_RESULT_KEY } from '../store/gameHistorySlice'
import authReducer, { loginSuccess } from '../slices/authSlice'
import { EndingResultScreen } from './EndingResultScreen'
import { AchievementCategoryModal } from '../components/EndingResultScreen/AchievementCategoryModal'

// Prevent real HTTP calls from the fire-and-forget POST
const mockPost = vi.fn().mockResolvedValue({})
vi.mock('../utils/request', () => ({
  post: (...args: unknown[]) => mockPost(...args),
  get: vi.fn().mockResolvedValue({}),
  default: {},
}))

// Mock achievements API with realistic data across all 4 categories
const MOCK_ACHIEVEMENTS = vi.hoisted(() => [
  // Study (2)
  { _id: 'a1', achievementKey: 'study-master', title: 'Study Master', description: 'Got straight A+ grades', category: 'Study' as const, conditionText: 'Reach intelligence 90+' },
  { _id: 'a2', achievementKey: 'bookworm', title: 'Bookworm', description: 'Read every book in the library', category: 'Study' as const, conditionText: 'Complete all study tasks' },
  // Health (2, one without conditionText)
  { _id: 'a3', achievementKey: 'health-guru', title: 'Health Guru', description: 'Peak physical condition', category: 'Health' as const, conditionText: 'Reach health 90+' },
  { _id: 'a4', achievementKey: 'marathoner', title: 'Marathoner', description: 'Ran a full marathon', category: 'Health' as const },
  // Wealth (1)
  { _id: 'a5', achievementKey: 'wealth-king', title: 'Wealth King', description: 'Financial independence', category: 'Wealth' as const, conditionText: 'Reach wealth 90+' },
  // Crown (1)
  { _id: 'a6', achievementKey: 'legendary-crown', title: 'Legendary Crown', description: 'The ultimate achievement', category: 'Crown' as const, conditionText: 'Unlock all endings' },
])

vi.mock('../api/achievements', () => ({
  fetchAchievements: vi.fn().mockResolvedValue(MOCK_ACHIEVEMENTS),
  getAchievementByKey: vi.fn((key: string) => MOCK_ACHIEVEMENTS.find(a => a.achievementKey === key)),
  getCategoryForAchievementKey: vi.fn((key: string) => MOCK_ACHIEVEMENTS.find(a => a.achievementKey === key)?.category),
  getEarnedCategories: vi.fn((keys: string[]) => {
    const cats = new Set<string>()
    for (const key of keys) {
      const cat = MOCK_ACHIEVEMENTS.find(a => a.achievementKey === key)?.category
      if (cat) cats.add(cat)
    }
    return Array.from(cats)
  }),
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
      auth: authReducer,
    },
  })
}

function makeAuthedStore() {
  const store = makeStore()
  store.dispatch(loginSuccess({
    token: 'test-token',
    userId: 'user-test',
    username: 'tester',
    email: 'test@test.com',
  }))
  return store
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

function renderAuthed(initial: { pathname: string; state?: unknown }) {
  return render(
    <Provider store={makeAuthedStore()}>
      <MemoryRouter initialEntries={[initial]}>
        <EndingResultScreen />
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
    const { container } = renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 95, health: 95, wealth: 95 } },
    })
    // Click the description to skip the typewriter and reveal full text
    const cursor = container.querySelector('.animate-pulse')
    if (cursor?.parentElement) fireEvent.click(cursor.parentElement)
    expect(
      screen.getByText(/you did not just survive international student life/i),
    ).toBeInTheDocument()
  })

  it('renders the Burnout Student ending when health collapses despite high intelligence', () => {
    const { container } = renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 92, health: 20, wealth: 60 } },
    })
    expect(screen.getByText('Burnout Student')).toBeInTheDocument()
    const cursor = container.querySelector('.animate-pulse')
    if (cursor?.parentElement) fireEvent.click(cursor.parentElement)
    expect(screen.getByText(/pushed yourself too hard/i)).toBeInTheDocument()
  })

  it('renders the Academic Star ending for high intelligence with adequate health', () => {
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
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 95 } },
    })
    expect(screen.getByText('Academic Star')).toBeInTheDocument()
  })

  // ── Dynamic achievement category buttons ──────────────────────────────────────

  it('shows no category buttons when no achievements are earned', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 80, health: 80, wealth: 80 } },
    })
    // No category buttons should exist
    expect(screen.queryByRole('button', { name: /achievements/i })).not.toBeInTheDocument()
  })

  it('shows correct category buttons for earned achievements', async () => {
    const store = makeStore()
    store.dispatch(earnAchievement('study-master'))
    store.dispatch(earnAchievement('health-guru'))

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/ending-result', state: { snapshot: { intelligence: 80, health: 80, wealth: 80 } } }]}>
          <EndingResultScreen />
        </MemoryRouter>
      </Provider>,
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /study achievements/i })).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /health achievements/i })).toBeInTheDocument()
    })
    // Wealth and Crown should NOT appear
    expect(screen.queryByRole('button', { name: /wealth achievements/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /crown achievements/i })).not.toBeInTheDocument()
  })

  it('shows all 4 category buttons when achievements from all categories are earned', async () => {
    const store = makeStore()
    store.dispatch(earnAchievement('study-master'))
    store.dispatch(earnAchievement('health-guru'))
    store.dispatch(earnAchievement('wealth-king'))
    store.dispatch(earnAchievement('legendary-crown'))

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/ending-result', state: { snapshot: { intelligence: 90, health: 90, wealth: 90 } } }]}>
          <EndingResultScreen />
        </MemoryRouter>
      </Provider>,
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /study achievements/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /health achievements/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /wealth achievements/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /crown achievements/i })).toBeInTheDocument()
    })
  })

  it('shows only Wealth and Crown buttons for those categories', async () => {
    const store = makeStore()
    store.dispatch(earnAchievement('wealth-king'))
    store.dispatch(earnAchievement('legendary-crown'))

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/ending-result', state: { snapshot: { intelligence: 70, health: 70, wealth: 90 } } }]}>
          <EndingResultScreen />
        </MemoryRouter>
      </Provider>,
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /wealth achievements/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /crown achievements/i })).toBeInTheDocument()
    })
    expect(screen.queryByRole('button', { name: /study achievements/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /health achievements/i })).not.toBeInTheDocument()
  })

  // ── Achievement category modal: display ──────────────────────────────────────

  it('opens the modal and shows correct header with category name', async () => {
    const store = makeStore()
    store.dispatch(earnAchievement('study-master'))

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/ending-result', state: { snapshot: { intelligence: 90, health: 80, wealth: 80 } } }]}>
          <EndingResultScreen />
        </MemoryRouter>
      </Provider>,
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /study achievements/i }))
    })

    expect(screen.getByText('Achievement Details')).toBeInTheDocument()
    expect(screen.getByText('Study')).toBeInTheDocument()
  })

  it('shows the achievement title, description, and conditionText in the modal', async () => {
    const store = makeStore()
    store.dispatch(earnAchievement('study-master'))

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/ending-result', state: { snapshot: { intelligence: 90, health: 80, wealth: 80 } } }]}>
          <EndingResultScreen />
        </MemoryRouter>
      </Provider>,
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /study achievements/i }))
    })

    expect(screen.getByText('Study Master')).toBeInTheDocument()
    expect(screen.getByText('Got straight A+ grades')).toBeInTheDocument()
    expect(screen.getByText('Reach intelligence 90+')).toBeInTheDocument()
  })

  it('renders achievement card without conditionText gracefully', async () => {
    const store = makeStore()
    store.dispatch(earnAchievement('marathoner'))

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/ending-result', state: { snapshot: { intelligence: 70, health: 80, wealth: 70 } } }]}>
          <EndingResultScreen />
        </MemoryRouter>
      </Provider>,
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /health achievements/i }))
    })

    expect(screen.getByText('Marathoner')).toBeInTheDocument()
    expect(screen.getByText('Ran a full marathon')).toBeInTheDocument()
    // No conditionText element — the background badge should not render
    const descEl = screen.getByText('Ran a full marathon')
    const card = descEl.closest('article')!
    const conditionEls = card.querySelectorAll('p')
    // Only title+description paragraphs, no conditionText paragraph
    expect(conditionEls.length).toBe(1) // description only
  })

  it('shows "Earned: N" counter matching the number of earned achievements in that category', async () => {
    const store = makeStore()
    store.dispatch(earnAchievement('study-master'))
    store.dispatch(earnAchievement('bookworm'))

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/ending-result', state: { snapshot: { intelligence: 90, health: 80, wealth: 80 } } }]}>
          <EndingResultScreen />
        </MemoryRouter>
      </Provider>,
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /study achievements/i }))
    })

    expect(screen.getByText('Earned: 2')).toBeInTheDocument()
  })

  it('shows multiple achieved cards in 3-column grid layout', async () => {
    const store = makeStore()
    store.dispatch(earnAchievement('study-master'))
    store.dispatch(earnAchievement('bookworm'))

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/ending-result', state: { snapshot: { intelligence: 90, health: 80, wealth: 80 } } }]}>
          <EndingResultScreen />
        </MemoryRouter>
      </Provider>,
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /study achievements/i }))
    })

    // Both achievements should be visible
    expect(screen.getByText('Study Master')).toBeInTheDocument()
    expect(screen.getByText('Bookworm')).toBeInTheDocument()

    // The grid container should have the 3-column class
    const grid = screen.getByText('Study Master').closest('.grid')
    expect(grid).toBeInTheDocument()
    expect(grid!.className).toContain('grid-cols-3')
  })

  // ── Achievement category modal: interaction ───────────────────────────────────

  it('closes the modal when clicking the Close button', async () => {
    const store = makeStore()
    store.dispatch(earnAchievement('health-guru'))

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/ending-result', state: { snapshot: { intelligence: 80, health: 80, wealth: 80 } } }]}>
          <EndingResultScreen />
        </MemoryRouter>
      </Provider>,
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /health achievements/i }))
    })

    expect(screen.getByText('Achievement Details')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^close$/i }))
    expect(screen.queryByText('Achievement Details')).not.toBeInTheDocument()
  })

  it('closes the modal when clicking the backdrop overlay', async () => {
    const store = makeStore()
    store.dispatch(earnAchievement('wealth-king'))

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/ending-result', state: { snapshot: { intelligence: 70, health: 70, wealth: 90 } } }]}>
          <EndingResultScreen />
        </MemoryRouter>
      </Provider>,
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /wealth achievements/i }))
    })

    expect(screen.getByText('Achievement Details')).toBeInTheDocument()

    // Click the backdrop (the fixed overlay wrapping the section)
    const backdrop = screen.getByText('Achievement Details').closest('.fixed')!
    fireEvent.click(backdrop)
    expect(screen.queryByText('Achievement Details')).not.toBeInTheDocument()
  })

  it('does NOT close when clicking inside the modal content', async () => {
    const store = makeStore()
    store.dispatch(earnAchievement('wealth-king'))

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/ending-result', state: { snapshot: { intelligence: 70, health: 70, wealth: 90 } } }]}>
          <EndingResultScreen />
        </MemoryRouter>
      </Provider>,
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /wealth achievements/i }))
    })

    // Click on the section (inner content) — should NOT close
    const section = screen.getByText('Wealth King').closest('section')!
    fireEvent.click(section)
    expect(screen.getByText('Achievement Details')).toBeInTheDocument()
  })

  it('closes the modal when pressing Escape key', async () => {
    const store = makeStore()
    store.dispatch(earnAchievement('study-master'))

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/ending-result', state: { snapshot: { intelligence: 90, health: 80, wealth: 80 } } }]}>
          <EndingResultScreen />
        </MemoryRouter>
      </Provider>,
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /study achievements/i }))
    })

    expect(screen.getByText('Achievement Details')).toBeInTheDocument()

    const dialog = screen.getByRole('dialog')
    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(screen.queryByText('Achievement Details')).not.toBeInTheDocument()
  })

  it('switches between categories: opens Study then Health modal', async () => {
    const store = makeStore()
    store.dispatch(earnAchievement('study-master'))
    store.dispatch(earnAchievement('health-guru'))

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/ending-result', state: { snapshot: { intelligence: 80, health: 80, wealth: 80 } } }]}>
          <EndingResultScreen />
        </MemoryRouter>
      </Provider>,
    )

    // Open Study modal
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /study achievements/i }))
    })
    expect(screen.getByText('Study Master')).toBeInTheDocument()
    expect(screen.queryByText('Health Guru')).not.toBeInTheDocument()

    // Close it
    fireEvent.click(screen.getByRole('button', { name: /^close$/i }))

    // Open Health modal
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /health achievements/i }))
    })
    expect(screen.getByText('Health Guru')).toBeInTheDocument()
    expect(screen.queryByText('Study Master')).not.toBeInTheDocument()
  })

  // ── Achievement category modal: edge cases ────────────────────────────────────

  it('shows empty-state message when no achievements earned in the category', async () => {
    // Render modal directly with unmatched category to test the empty branch
    render(
      <AchievementCategoryModal
        category="Crown"
        earnedKeys={[]}
        onClose={vi.fn()}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText('Crown')).toBeInTheDocument()
    })

    expect(screen.getByText('Earned: 0')).toBeInTheDocument()
    expect(screen.getByText('No achievements earned in this category yet.')).toBeInTheDocument()
  })

  it('only shows achievements that match the category AND are in earnedKeys', async () => {
    // Render modal directly with an earned key that belongs to a different category
    render(
      <AchievementCategoryModal
        category="Study"
        earnedKeys={['study-master', 'health-guru']}
        onClose={vi.fn()}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText('Study Master')).toBeInTheDocument()
    })

    // Health achievement should NOT appear in Study modal even though it's earned
    expect(screen.queryByText('Health Guru')).not.toBeInTheDocument()
    expect(screen.getByText('Earned: 1')).toBeInTheDocument()
  })

  // ── UI buttons ────────────────────────────────────────────────────────────────

  it('renders the Ranking List button', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 80, health: 80, wealth: 80 } },
    })
    expect(screen.getByRole('button', { name: /ranking list/i })).toBeInTheDocument()
  })

  // ── Rankings modal ──────────────────────────────────────────────────────────

  it('opens the ranking list modal when clicking Ranking List', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 80, health: 80, wealth: 80 } },
    })
    fireEvent.click(screen.getByRole('button', { name: /ranking list/i }))
    expect(screen.getByText('Top 10 Players')).toBeInTheDocument()
    expect(screen.getByText(/guest mode/i)).toBeInTheDocument()
  })

  it('closes the ranking list modal when clicking Close', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 80, health: 80, wealth: 80 } },
    })
    fireEvent.click(screen.getByRole('button', { name: /ranking list/i }))
    expect(screen.getByText('Top 10 Players')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /^close$/i }))
    expect(screen.queryByText('Top 10 Players')).not.toBeInTheDocument()
  })

  // ── Redux and localStorage side effects ───────────────────────────────────────

  it('dispatches addRecord to the Redux store after render', async () => {
    const store = makeStore()
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/ending-result', state: { snapshot: { intelligence: 90, health: 90, wealth: 90 } } }]}>
          <EndingResultScreen />
        </MemoryRouter>
      </Provider>,
    )
    await waitFor(() => expect(store.getState().gameHistory.records).toHaveLength(1))
    expect(store.getState().gameHistory.records[0].endingId).toBe('model-minority-real-version')
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

  it('POSTs game result to /game/result with earned achievements from Redux', async () => {
    const store = makeAuthedStore()
    store.dispatch(earnAchievement('study-master'))
    store.dispatch(earnAchievement('health-guru'))

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/ending-result', state: { snapshot: { intelligence: 90, health: 90, wealth: 90 } } }]}>
          <EndingResultScreen />
        </MemoryRouter>
      </Provider>,
    )

    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1))
    const [path, payload] = mockPost.mock.calls[0] as [string, Record<string, unknown>]
    expect(path).toBe('/game/result')
    expect(payload).toMatchObject({
      endingId: 'model-minority-real-version',
      endingRank: 'S',
      endingTheme: 'happy',
      snapshot: { intelligence: 90, health: 90, wealth: 90 },
      achievements: ['study-master', 'health-guru'],
    })
  })

  it('POSTs empty achievements array when nothing is earned', async () => {
    renderAuthed({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 60, health: 60, wealth: 60 } },
    })
    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1))
    const payload = mockPost.mock.calls[0][1] as { achievements: string[] }
    expect(payload.achievements).toHaveLength(0)
  })

  it('includes the correct score and endingTitle in the POST payload', async () => {
    renderAuthed({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 90, health: 90, wealth: 90 } },
    })
    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1))
    const [, payload] = mockPost.mock.calls[0] as [string, Record<string, unknown>]
    expect(payload.score).toBe(100)
    expect(payload.endingTitle).toBe('The Model Minority Myth: Real Version')
  })

  it('uses playerName from location.state when no character is selected', async () => {
    renderAuthed({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 80, health: 80, wealth: 80 }, playerName: 'TestPlayer' },
    })
    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1))
    const [, payload] = mockPost.mock.calls[0] as [string, Record<string, unknown>]
    expect(payload.playerName).toBe('TestPlayer')
  })

  it("defaults playerName to 'Player' when neither character nor state provides a name", async () => {
    renderAuthed({ pathname: '/ending-result' })
    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1))
    const [, payload] = mockPost.mock.calls[0] as [string, Record<string, unknown>]
    expect(payload.playerName).toBe('Player')
  })

  it('does not POST to backend when guest (no auth token)', async () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 80, health: 80, wealth: 80 } },
    })
    // Wait for effects to settle — post should NOT be called for guests
    await waitFor(() => {
      const postCalls = mockPost.mock.calls.filter(
        (call: unknown[]) => call[0] === '/game/result',
      )
      expect(postCalls.length).toBe(0)
    })
  })

  it('POSTs to backend without userId when logged in (auth token present)', async () => {
    const store = configureStore({
      reducer: { game: gameReducer, gameHistory: gameHistoryReducer, auth: authReducer },
    })
    store.dispatch(loginSuccess({
      token: 'test-token',
      userId: 'user-abc',
      username: 'tester',
      email: 't@t.com',
    }))
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: '/ending-result', state: { snapshot: { intelligence: 80, health: 80, wealth: 80 } } }]}>
          <EndingResultScreen />
        </MemoryRouter>
      </Provider>,
    )
    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1))
    const calls = mockPost.mock.calls.filter(
      (call: unknown[]) => call[0] === '/game/result',
    )
    expect(calls.length).toBe(1)
    const [, payload] = calls[0] as [string, Record<string, unknown>]
    expect(payload.userId).toBeUndefined()
  })
})
