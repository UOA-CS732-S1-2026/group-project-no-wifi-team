import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MobileCharacterCard } from './MobileCharacterCard'
import type { Character } from './constants'

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

const CHARACTER: Character = {
  id: 'academic',
  title: 'The Academic',
  subtitle: 'BORN TO STUDY',
  description: 'A natural scholar who thrives in academic environments.',
  icon: '/icons/academic.png',
  selectButton: '/buttons/select.png',
  stats: { intelligence: 9, health: 5, wealth: 4 },
}

describe('MobileCharacterCard', () => {
  it('renders character title', () => {
    render(<MobileCharacterCard character={CHARACTER} onSelect={vi.fn()} />)
    expect(screen.getByText('The Academic')).toBeInTheDocument()
  })

  it('renders character subtitle', () => {
    render(<MobileCharacterCard character={CHARACTER} onSelect={vi.fn()} />)
    expect(screen.getByText('BORN TO STUDY')).toBeInTheDocument()
  })

  it('renders character description', () => {
    render(<MobileCharacterCard character={CHARACTER} onSelect={vi.fn()} />)
    expect(screen.getByText(/natural scholar/i)).toBeInTheDocument()
  })

  it('renders attribute rows', () => {
    render(<MobileCharacterCard character={CHARACTER} onSelect={vi.fn()} />)
    expect(screen.getByText(/INTELLIGENCE/i)).toBeInTheDocument()
    expect(screen.getByText(/HEALTH/i)).toBeInTheDocument()
    expect(screen.getByText(/WEALTH/i)).toBeInTheDocument()
  })

  it('calls onSelect when card is clicked', () => {
    const onSelect = vi.fn()
    render(<MobileCharacterCard character={CHARACTER} onSelect={onSelect} />)
    // Click the card itself (the motion.div overlay button)
    const btn = screen.getByLabelText(`Select ${CHARACTER.title}`)
    fireEvent.click(btn)
    expect(onSelect).toHaveBeenCalledWith(CHARACTER)
  })
})
