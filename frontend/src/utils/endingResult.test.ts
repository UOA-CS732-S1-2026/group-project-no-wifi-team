import { describe, expect, it } from 'vitest'
import {
  ENDINGS,
  TOTAL_SCORE,
  calculateScore,
  resolveEnding,
} from './endingResult'

describe('resolveEnding', () => {
  it('picks GPA: 4.0, Hairline: 0.4 when intelligence is high but health is low', () => {
    const ending = resolveEnding({ intelligence: 9, health: 3, wealth: 6 })
    expect(ending.id).toBe('gpa-4-hairline-04')
    expect(ending.theme).toBe('bad')
  })

  it('picks Speedrun to Early Retirement when any attribute hits zero', () => {
    const ending = resolveEnding({ intelligence: 5, health: 0, wealth: 5 })
    expect(ending.id).toBe('speedrun-early-retirement')
  })

  it('picks The Model Minority Myth: Real Version when every attribute is strong', () => {
    const ending = resolveEnding({ intelligence: 9, health: 9, wealth: 9 })
    expect(ending.id).toBe('model-minority-real-version')
    expect(ending.rank).toBe('S')
  })

  it('picks Library’s Resident Landlord for dominant intelligence', () => {
    const ending = resolveEnding({ intelligence: 9, health: 6, wealth: 5 })
    expect(ending.id).toBe('library-resident-landlord')
  })

  it('picks Part-time Tycoon for dominant wealth', () => {
    const ending = resolveEnding({ intelligence: 3, health: 7, wealth: 9 })
    expect(ending.id).toBe('part-time-tycoon')
  })

  it('picks The Main Character of Every Party for dominant health', () => {
    const ending = resolveEnding({ intelligence: 5, health: 9, wealth: 4 })
    expect(ending.id).toBe('main-character-party')
  })

  it('falls back to I Showed Up, I Survived for balanced average values', () => {
    const ending = resolveEnding({ intelligence: 6, health: 6, wealth: 6 })
    expect(ending.id).toBe('showed-up-survived')
  })

  it('clamps out-of-range values before evaluating predicates', () => {
    const ending = resolveEnding({ intelligence: 200, health: 200, wealth: 200 })
    expect(ending.id).toBe('model-minority-real-version')
  })

  it('treats negative or NaN values as zero (Speedrun to Early Retirement)', () => {
    const ending = resolveEnding({ intelligence: -10, health: NaN, wealth: -5 })
    expect(ending.id).toBe('speedrun-early-retirement')
  })

  it('returns a non-empty ending list', () => {
    expect(ENDINGS.length).toBeGreaterThanOrEqual(4)
  })

  it('always returns an ending (final entry is a catch-all)', () => {
    expect(resolveEnding({ intelligence: 5, health: 5, wealth: 5 })).toBeDefined()
  })
})

describe('calculateScore', () => {
  it('averages the three attributes', () => {
    expect(calculateScore({ intelligence: 6, health: 6, wealth: 6 })).toBe(60)
  })

  it('rounds to the nearest integer', () => {
    expect(calculateScore({ intelligence: 7, health: 7, wealth: 8 })).toBe(73)
  })

  it('clamps inputs to 0-10 before averaging', () => {
    expect(calculateScore({ intelligence: 20, health: -5, wealth: 5 })).toBe(50)
  })

  it('respects the 100-point total score scale', () => {
    expect(TOTAL_SCORE).toBe(100)
  })
})
