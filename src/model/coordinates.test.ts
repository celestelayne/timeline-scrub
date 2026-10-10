import { describe, expect, it } from 'vitest'
import { YEARS } from '../data/markers'
import { posToYear, yearToPos } from './coordinates'

const years = [-4000, -250, 250, 650]

describe('posToYear', () => {
  it('returns the event year at integer positions', () => {
    years.forEach((y, i) => expect(posToYear(i, years)).toBe(y))
  })

  it('interpolates linearly between neighbours', () => {
    expect(posToYear(0.5, years)).toBe(-2125)
    expect(posToYear(2.25, years)).toBe(350)
  })

  it('clamps outside [0, N-1]', () => {
    expect(posToYear(-3, years)).toBe(-4000)
    expect(posToYear(99, years)).toBe(650)
  })

  it('handles a single-event list', () => {
    expect(posToYear(0, [1500])).toBe(1500)
    expect(posToYear(2, [1500])).toBe(1500)
  })

  it('crosses BC to AD through zero without a discontinuity', () => {
    // -250 -> 250 spans pos 1..2; the midpoint is year 0
    expect(posToYear(1.5, years)).toBe(0)
    expect(posToYear(1.25, years)).toBeLessThan(0)
    expect(posToYear(1.75, years)).toBeGreaterThan(0)
  })

  it('covers the 3,750-year gap in one index step', () => {
    expect(posToYear(1, years) - posToYear(0, years)).toBe(3750)
    expect(posToYear(0.5, years)).toBe(-4000 + 3750 / 2)
  })

  it('is monotonic across the real event list', () => {
    let prev = posToYear(0, YEARS)
    for (let p = 0.05; p <= YEARS.length - 1; p += 0.05) {
      const y = posToYear(p, YEARS)
      expect(y).toBeGreaterThanOrEqual(prev)
      prev = y
    }
  })
})

describe('yearToPos', () => {
  it('returns the event index at event years', () => {
    years.forEach((y, i) => expect(yearToPos(y, years)).toBe(i))
  })

  it('clamps outside the range', () => {
    expect(yearToPos(-9000, years)).toBe(0)
    expect(yearToPos(3000, years)).toBe(years.length - 1)
  })

  it('places year 0 halfway between -250 and 250', () => {
    expect(yearToPos(0, years)).toBe(1.5)
  })

  it('handles a single-event list', () => {
    expect(yearToPos(1500, [1500])).toBe(0)
  })
})

describe('round-trip', () => {
  it('pos -> year -> pos on the real events', () => {
    for (let p = 0; p <= YEARS.length - 1; p += 0.1) {
      expect(yearToPos(posToYear(p, YEARS), YEARS)).toBeCloseTo(p, 9)
    }
  })

  it('year -> pos -> year on the real events', () => {
    for (const y of [-4000, -1000, 0, 400, 1499, 1805, 1920]) {
      expect(posToYear(yearToPos(y, YEARS), YEARS)).toBeCloseTo(y, 9)
    }
  })
})
