import { describe, expect, it } from 'vitest'
import { EVENTS } from '../data/events'
import { groupMarkers } from './markers'

const ev = (year: number, date?: string, title = String(year)) => ({ year, date, title })

describe('groupMarkers', () => {
  it('returns nothing for no events', () => {
    expect(groupMarkers([])).toEqual([])
  })

  it('makes one Marker per distinct year', () => {
    const markers = groupMarkers([ev(1498), ev(1511), ev(1530)])
    expect(markers.map((m) => m.year)).toEqual([1498, 1511, 1530])
    expect(markers.every((m) => m.events.length === 1)).toBe(true)
  })

  it('groups events that share a year', () => {
    const markers = groupMarkers([ev(1846, 'a', 'x'), ev(1846, 'b', 'y'), ev(1846, 'c', 'z'), ev(1853)])
    expect(markers).toHaveLength(2)
    expect(markers[0].events.map((e) => e.title)).toEqual(['x', 'y', 'z'])
  })

  it('keeps input order within a year', () => {
    const [m] = groupMarkers([ev(1808, 'second', 'b'), ev(1808, 'first', 'a')])
    expect(m.events.map((e) => e.title)).toEqual(['b', 'a'])
  })

  it('sorts Markers by year even if input is unsorted', () => {
    expect(groupMarkers([ev(1900), ev(-5900), ev(1500)]).map((m) => m.year)).toEqual([-5900, 1500, 1900])
  })

  it('does not group years that merely look close', () => {
    expect(groupMarkers([ev(-5900), ev(-5800)])).toHaveLength(2)
  })

  it('does not mutate its input', () => {
    const input = [ev(2), ev(1)]
    groupMarkers(input)
    expect(input.map((e) => e.year)).toEqual([2, 1])
  })
})

describe('marker label', () => {
  it('uses the typed date when every event in the year agrees', () => {
    expect(groupMarkers([ev(-5900, 'c. 5900 BC'), ev(-5900, 'c. 5900 BC')])[0].label).toBe('c. 5900 BC')
  })

  it('uses the typed date for a single event', () => {
    expect(groupMarkers([ev(650, 'c. AD 650–800')])[0].label).toBe('c. AD 650–800')
  })

  it('falls back to the plain year when typed dates differ', () => {
    expect(groupMarkers([ev(1806, '12 October 1806'), ev(1806, '1 November 1806')])[0].label).toBe('1806')
    expect(groupMarkers([ev(1797, '1797'), ev(1797, '18 February 1797')])[0].label).toBe('1797')
  })

  it('falls back when only some events have a typed date', () => {
    expect(groupMarkers([ev(250, 'c. AD 250'), ev(250)])[0].label).toBe('AD 250')
  })

  it('generates the label when there is no typed date', () => {
    expect(groupMarkers([ev(-4000)])[0].label).toBe('4000 BC')
    expect(groupMarkers([ev(1498)])[0].label).toBe('1498')
  })
})

describe('with the current hand-typed events', () => {
  it('yields one Marker per event, since every year is distinct', () => {
    expect(groupMarkers(EVENTS)).toHaveLength(EVENTS.length)
  })
})
