import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { EndingResultScreen } from './EndingResultScreen'

function renderAt(initial: { pathname: string; state?: unknown }) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <EndingResultScreen />
    </MemoryRouter>,
  )
}

describe('EndingResultScreen', () => {
  it('renders the Perfect All-Rounder ending for an excellent run', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 95, health: 95, wealth: 95 } },
    })
    expect(screen.getByText('Perfect All-Rounder')).toBeInTheDocument()
    expect(screen.getByText('Best Ending')).toBeInTheDocument()
    expect(screen.getByText('Final Score')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /play again/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /view others/i })).toBeInTheDocument()
  })

  it('renders the Burnout Student ending when health collapses despite high intelligence', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 92, health: 20, wealth: 60 } },
    })
    expect(screen.getByText('Burnout Student')).toBeInTheDocument()
    expect(screen.getByText('Warning Ending')).toBeInTheDocument()
  })

  it('falls back to a default ending when no state is supplied', () => {
    renderAt({ pathname: '/ending-result' })
    // Default snapshot resolves to Steady Graduate (balanced mid values).
    expect(screen.getByText('Steady Graduate')).toBeInTheDocument()
  })

  it('shows the three attribute tiles with their level labels', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 90, health: 50, wealth: 30 } },
    })
    expect(screen.getByText('Intelligence')).toBeInTheDocument()
    expect(screen.getByText('Health')).toBeInTheDocument()
    expect(screen.getByText('Wealth')).toBeInTheDocument()
  })
})
