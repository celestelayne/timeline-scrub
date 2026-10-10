import { describe, expect, it } from 'vitest'
import { YEARS } from '../data/markers'
import { computeGaps, formatGap } from './gaps'

describe('formatGap', () => {
  it('adds a thousands separator', () => {
    expect(formatGap(3750)).toBe('3,750 yrs')
    expect(formatGap(198)).toBe('198 yrs')
  })
})

describe('computeGaps', () => {
  it('returns one gap per consecutive pair', () => {
    expect(computeGaps([1, 2, 3], 100)).toHaveLength(2)
    expect(computeGaps([1], 100)).toEqual([])
    expect(computeGaps([], 100)).toEqual([])
  })

  it('measures from year to the next year', () => {
    expect(computeGaps([-4000, -250], 100)[0]).toEqual({ index: 0, years: 3750, label: '3,750 yrs' })
  })

  it('crosses BC to AD without an off-by-one', () => {
    expect(computeGaps([-250, 250], 100)[0].years).toBe(500)
  })

  it('labels a gap exactly at the threshold, not below it', () => {
    const [atThreshold, below] = computeGaps([0, 100, 199], 100)
    expect(atThreshold.label).toBe('100 yrs')
    expect(below.label).toBeNull()
  })

  it('reads the threshold from config by default', () => {
    expect(computeGaps([0, 99])[0].label).toBeNull()
    expect(computeGaps([0, 100])[0].label).toBe('100 yrs')
  })

  it('labels exactly the gaps at or above the threshold in the synced data', () => {
    const gaps = computeGaps(YEARS, 100)
    expect(gaps).toHaveLength(YEARS.length - 1)
    gaps.forEach((g) => expect(g.label !== null).toBe(g.years >= 100))
  })
})
