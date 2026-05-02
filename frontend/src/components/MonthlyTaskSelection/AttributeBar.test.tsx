import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AttributeBar } from './AttributeBar'

describe('AttributeBar (existing screen, post-refactor)', () => {
  it('renders all three attribute labels and their levels', () => {
    render(<AttributeBar intelligence={90} health={50} wealth={20} />)
    expect(screen.getByText(/intelligence/i)).toBeInTheDocument()
    expect(screen.getByText(/health/i)).toBeInTheDocument()
    expect(screen.getByText(/wealth/i)).toBeInTheDocument()
    expect(screen.getByText('Excellent')).toBeInTheDocument()
    expect(screen.getByText('Good')).toBeInTheDocument()
    expect(screen.getByText('Poor')).toBeInTheDocument()
  })
})
