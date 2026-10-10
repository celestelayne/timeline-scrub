import { describe, expect, it } from 'vitest'
import events from './events.json'

// Guards the committed output of `npm run sync`.
describe('events.json', () => {
  it('has events', () => {
    expect(events.length).toBeGreaterThan(0)
  })

  it('has unique ids', () => {
    expect(new Set(events.map((e) => e.id)).size).toBe(events.length)
  })

  it('is sorted by year', () => {
    events.slice(1).forEach((e, i) => expect(e.year).toBeGreaterThanOrEqual(events[i].year))
  })

  it('gives every event a numeric year and a title', () => {
    events.forEach((e) => {
      expect(Number.isInteger(e.year)).toBe(true)
      expect(e.title.trim()).not.toBe('')
    })
  })
})
