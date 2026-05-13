import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CountUp } from './CountUp'

// Mock motion/react 的 animate 函数，使其立即触发更新
vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>()
  return {
    ...actual,
    animate: vi.fn((_from: number, to: number, options: any) => {
      if (options?.onUpdate) {
        options.onUpdate(to)
      }
      return { stop: vi.fn() }
    }),
  }
})

describe('CountUp Component', () => {
  it('renders target value with optional sign', () => {
    render(<CountUp from={50} to={100} showSign={true} />)
    expect(screen.getByText('+100')).toBeInTheDocument()
  })

  it('updates textContent to target value after animation mock triggers', () => {
    const { container } = render(<CountUp from={0} to={100} />)
    const span = container.querySelector('span')
    expect(span?.textContent).toBe('100')
  })

  it('formats values using toLocaleString', () => {
    const { container } = render(<CountUp from={0} to={1234567} />)
    const span = container.querySelector('span')
    expect(span?.textContent).toBe('1,234,567')
  })
})