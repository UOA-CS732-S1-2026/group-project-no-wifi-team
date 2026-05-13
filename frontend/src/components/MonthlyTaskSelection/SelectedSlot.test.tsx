import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SelectedSlot } from './SelectedSlot'
import type { Task } from './types'

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>()
  const { forwardRef, createElement } = await import('react')
  const noAnim = (tag: string) =>
    forwardRef(({ children, initial: _i, animate: _a, exit: _e, transition: _t,
      whileHover: _wh, whileTap: _wt, layout: _l, layoutId: _li, ...rest }: any, ref: any) =>
      createElement(tag, { ...rest, ref }, children)
    )
  return {
    ...actual,
    motion: new Proxy(actual.motion, { get: (_t, key: string) => noAnim(key) }),
    AnimatePresence: ({ children }: any) => children,
  }
})

const TASK: Task = {
  id: 'study-001',
  category: 'Study',
  name: 'Study at the Library',
  illustration: '/icon.png',
}

describe('SelectedSlot', () => {
  it('shows default placeholder when no task', () => {
    render(<SelectedSlot task={undefined} onRemove={vi.fn()} />)
    expect(screen.getByText('— Pending —')).toBeInTheDocument()
  })

  it('shows custom placeholder text', () => {
    render(<SelectedSlot task={undefined} onRemove={vi.fn()} placeholder="Waiting..." />)
    expect(screen.getByText('Waiting...')).toBeInTheDocument()
  })

  it('renders task name when task is provided', () => {
    render(<SelectedSlot task={TASK} onRemove={vi.fn()} />)
    expect(screen.getByText('Study at the Library')).toBeInTheDocument()
  })

  it('calls onRemove when × button is clicked', () => {
    const onRemove = vi.fn()
    render(<SelectedSlot task={TASK} onRemove={onRemove} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('does not show remove button when no task', () => {
    render(<SelectedSlot task={undefined} onRemove={vi.fn()} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders task illustration when task is provided', () => {
    const { container } = render(<SelectedSlot task={TASK} onRemove={vi.fn()} />)
    const img = container.querySelector('img')!
    expect(img).toHaveAttribute('src', '/icon.png')
  })
})
