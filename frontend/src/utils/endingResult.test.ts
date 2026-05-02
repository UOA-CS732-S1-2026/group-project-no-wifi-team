import { describe, expect, it } from 'vitest'
import {
  ENDINGS,
  TOTAL_SCORE,
  calculateScore,
  resolveEnding,
} from './endingResult'

describe('resolveEnding', () => {
  it('picks Burnout Student when intelligence is high but health is low', () => {
    const ending = resolveEnding({ intelligence: 90, health: 30, wealth: 60 })
    expect(ending.id).toBe('burnout-student')
    expect(ending.theme).toBe('bad')
  })

  it('picks Lost Year when any attribute is critically low', () => {
    const ending = resolveEnding({ intelligence: 50, health: 20, wealth: 50 })
    expect(ending.id).toBe('lost-year')
  })

  it('picks Perfect All-Rounder when every attribute is excellent', () => {
    const ending = resolveEnding({ intelligence: 90, health: 90, wealth: 90 })
    expect(ending.id).toBe('perfect-all-rounder')
    expect(ending.rank).toBe('S')
  })

  it('picks Academic Star for high intelligence with okay health', () => {
    const ending = resolveEnding({ intelligence: 88, health: 60, wealth: 50 })
    expect(ending.id).toBe('academic-star')
  })

  it('picks Part-Time Hustler for high wealth, low intelligence', () => {
    const ending = resolveEnding({ intelligence: 30, health: 70, wealth: 90 })
    expect(ending.id).toBe('part-time-hustler')
  })

  it('falls back to Steady Graduate for balanced average values', () => {
    const ending = resolveEnding({ intelligence: 60, health: 60, wealth: 60 })
    expect(ending.id).toBe('steady-graduate')
  })

  it('clamps out-of-range values before evaluating predicates', () => {
    const ending = resolveEnding({ intelligence: 200, health: 200, wealth: 200 })
    expect(ending.id).toBe('perfect-all-rounder')
  })

  it('treats negative or NaN values as zero (Lost Year)', () => {
    const ending = resolveEnding({ intelligence: -10, health: NaN, wealth: -5 })
    expect(ending.id).toBe('lost-year')
  })

  it('returns a non-empty ending list', () => {
    expect(ENDINGS.length).toBeGreaterThanOrEqual(4)
  })

  it('always returns an ending (final entry is a catch-all)', () => {
    expect(resolveEnding({ intelligence: 50, health: 50, wealth: 50 })).toBeDefined()
  })
})

describe('calculateScore', () => {
  it('averages the three attributes', () => {
    expect(calculateScore({ intelligence: 60, health: 60, wealth: 60 })).toBe(60)
  })

  it('rounds to the nearest integer', () => {
    expect(calculateScore({ intelligence: 70, health: 70, wealth: 71 })).toBe(70)
  })

  it('clamps inputs to 0–100 before averaging', () => {
    expect(calculateScore({ intelligence: 200, health: -50, wealth: 50 })).toBe(50)
  })

  it('respects the 100-point total score scale', () => {
    expect(TOTAL_SCORE).toBe(100)
  })
})
