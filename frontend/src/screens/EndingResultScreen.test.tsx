import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import gameHistoryReducer from '../store/gameHistorySlice'
import { EndingResultScreen } from './EndingResultScreen'

function makeStore() {
  return configureStore({
    reducer: { gameHistory: gameHistoryReducer },
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

describe('EndingResultScreen', () => {
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

  it('falls back to Steady Graduate when no state is supplied', () => {
    renderAt({ pathname: '/ending-result' })
    expect(screen.getByText('Steady Graduate')).toBeInTheDocument()
  })

  it('shows the Ranking List and Achievement Collection buttons', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 80, health: 80, wealth: 80 } },
    })
    expect(screen.getByRole('button', { name: /ranking list/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /achievement collection/i })).toBeInTheDocument()
  })

  it('shows achievement images for an S-rank ending', () => {
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 95, health: 95, wealth: 95 } },
    })
    const imgs = screen.getAllByRole('img', { name: /achievement/i })
    expect(imgs.length).toBe(3)
  })

  it('shows fewer achievements for lower ranks', () => {
    // B-rank (Steady Graduate) → 1 achievement
    renderAt({
      pathname: '/ending-result',
      state: { snapshot: { intelligence: 60, health: 60, wealth: 60 } },
    })
    const imgs = screen.getAllByRole('img', { name: /achievement/i })
    expect(imgs.length).toBe(1)
  })
})
