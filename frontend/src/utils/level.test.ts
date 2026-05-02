import { describe, expect, it } from 'vitest'
import { clamp01to100, getAttributeLevel } from './level'

describe('getAttributeLevel', () => {
  it('returns Excellent at the upper threshold', () => {
    expect(getAttributeLevel(85)).toBe('Excellent')
    expect(getAttributeLevel(100)).toBe('Excellent')
  })

  it('returns Good in the middle band', () => {
    expect(getAttributeLevel(45)).toBe('Good')
    expect(getAttributeLevel(84)).toBe('Good')
  })

  it('returns Poor below the Good threshold', () => {
    expect(getAttributeLevel(0)).toBe('Poor')
    expect(getAttributeLevel(44)).toBe('Poor')
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
