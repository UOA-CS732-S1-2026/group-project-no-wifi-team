import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QuarterlySummary } from './QuarterSummary'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('QuarterlySummary Screen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    })
  })

  it('fetches and displays quarterly summary data', async () => {
    const mockSummary = {
      quarterName: 'Spring Quarter',
      quarterIndex: 2,
      tasksCompleted: 8,
      totalTasks: 12,
      stats: [
        { label: 'Intelligence', value: 85, delta: 10 },
        { label: 'Health', value: 70, delta: -5 }
      ]
    }

    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockSummary,
    })

    render(
      <MemoryRouter>
        <QuarterlySummary />
      </MemoryRouter>
    )

    expect(await screen.findByText('Spring Quarter')).toBeInTheDocument()
    expect(screen.getAllByText('2').length).toBeGreaterThan(0)
    expect(screen.getByText('Intelligence')).toBeInTheDocument()
    expect(screen.getByText('Health')).toBeInTheDocument()
    
    expect(screen.getByText(/Graduation in/i)).toHaveTextContent('2')
  })

  it('navigates to next-quarter when the button is clicked', async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    })

    render(
      <MemoryRouter>
        <QuarterlySummary />
      </MemoryRouter>
    )

    const nextBtn = screen.getByRole('button', { name: /next quarter/i })
    fireEvent.click(nextBtn)

    expect(mockNavigate).toHaveBeenCalledWith('/next-quarter')
  })

  it('renders default fallback values when data is empty', async () => {
    render(
      <MemoryRouter>
        <QuarterlySummary />
      </MemoryRouter>
    )
    expect(screen.getByText(/Tasks completed/i)).toBeInTheDocument()
  })
})