import { describe, expect, it } from 'vitest'
import { MARKERS } from '../data/markers'
import events from '../data/events.json'
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

describe('the synced Markers', () => {
  it('hold every event exactly once', () => {
    expect(MARKERS.flatMap((m) => m.events)).toHaveLength(events.length)
  })

  it('have strictly ascending years, and every event matches its Marker', () => {
    MARKERS.slice(1).forEach((m, i) => expect(m.year).toBeGreaterThan(MARKERS[i].year))
    MARKERS.forEach((m) => m.events.forEach((e) => expect(e.year).toBe(m.year)))
  })
})
