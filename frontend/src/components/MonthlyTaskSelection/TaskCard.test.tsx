import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskCard } from './TaskCard'
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

describe('TaskCard', () => {
  it('renders the task name', () => {
    render(<TaskCard task={TASK} selected={false} onToggle={vi.fn()} />)
    expect(screen.getByText('Study at the Library')).toBeInTheDocument()
  })

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<TaskCard task={TASK} selected={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('shows selection outline when selected', () => {
    const { container } = render(<TaskCard task={TASK} selected={true} onToggle={vi.fn()} />)
    const btn = container.querySelector('button')!
    expect(btn.style.outline).toContain('#7a5c3a')
  })

  it('shows transparent outline when not selected', () => {
    const { container } = render(<TaskCard task={TASK} selected={false} onToggle={vi.fn()} />)
    const btn = container.querySelector('button')!
    expect(btn.style.outline).toContain('transparent')
  })

  it('renders the task illustration', () => {
    const { container } = render(<TaskCard task={TASK} selected={false} onToggle={vi.fn()} />)
    const img = container.querySelector('img')!
    expect(img).toHaveAttribute('src', '/icon.png')
  })
})
