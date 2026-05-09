import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AttributeBar } from './AttributeBar'

describe('AttributeBar (existing screen, post-refactor)', () => {
  it('renders all three attribute labels and their levels', () => {
    render(<AttributeBar intelligence={9} health={5} wealth={2} />)
    expect(screen.getByText(/intelligence/i)).toBeInTheDocument()
    expect(screen.getByText(/health/i)).toBeInTheDocument()
    expect(screen.getByText(/wealth/i)).toBeInTheDocument()
    expect(screen.getByText('Excellent')).toBeInTheDocument()
    expect(screen.getByText('Average')).toBeInTheDocument()
    expect(screen.getByText('Poor')).toBeInTheDocument()
  })
})
