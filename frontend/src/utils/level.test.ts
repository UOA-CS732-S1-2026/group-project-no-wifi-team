import { describe, expect, it } from 'vitest'
import { clamp0to10, getAttributeLevel } from './level'

describe('getAttributeLevel', () => {
  it('returns Excellent at the upper threshold', () => {
    expect(getAttributeLevel(7)).toBe('Excellent')
    expect(getAttributeLevel(10)).toBe('Excellent')
  })

  it('returns Average in the middle band', () => {
    expect(getAttributeLevel(4)).toBe('Average')
    expect(getAttributeLevel(6)).toBe('Average')
  })

  it('returns Poor below the Average threshold', () => {
    expect(getAttributeLevel(0)).toBe('Poor')
    expect(getAttributeLevel(3)).toBe('Poor')
  })
})

describe('clamp0to10', () => {
  it('clamps below zero to zero', () => {
    expect(clamp0to10(-5)).toBe(0)
  })

  it('clamps above 10 to 10', () => {
    expect(clamp0to10(150)).toBe(10)
  })

  it('rounds non-integer inputs', () => {
    expect(clamp0to10(4.7)).toBe(5)
  })

  it('coerces NaN to zero', () => {
    expect(clamp0to10(NaN)).toBe(0)
  })
})
