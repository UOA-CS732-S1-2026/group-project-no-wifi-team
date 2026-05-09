import { describe, expect, it } from 'vitest'
import { clamp01to100, getAttributeLevel } from './level'

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

describe('clamp01to100', () => {
  it('clamps below zero to zero', () => {
    expect(clamp01to100(-5)).toBe(0)
  })

  it('clamps above 100 to 100', () => {
    expect(clamp01to100(150)).toBe(100)
  })

  it('rounds non-integer inputs', () => {
    expect(clamp01to100(45.7)).toBe(46)
  })

  it('coerces NaN to zero', () => {
    expect(clamp01to100(NaN)).toBe(0)
  })
})
