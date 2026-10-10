import { describe, expect, it } from 'vitest'
import { createPxScale, EVENT_SPACING } from './scale'

describe('createPxScale', () => {
  const width = 1000
  const scale = createPxScale(width)

  it('puts pos 0 under the playhead at viewport centre', () => {
    expect(scale.posToPx(0)).toBe(width / 2)
  })

  it('moves the strip left by one spacing per index', () => {
    expect(scale.posToPx(1)).toBe(width / 2 - EVENT_SPACING)
    expect(scale.posToPx(4)).toBe(width / 2 - 4 * EVENT_SPACING)
  })

  it('scales fractional positions linearly', () => {
    expect(scale.posToPx(0.5)).toBe(width / 2 - EVENT_SPACING / 2)
  })

  it('keeps event i under the playhead when pos = i', () => {
    // event i sits at i*spacing on the strip; strip offset + that = centre
    for (let i = 0; i < 20; i++) {
      expect(scale.posToPx(i) + i * EVENT_SPACING).toBe(width / 2)
    }
  })

  it('recentres when the viewport width changes', () => {
    expect(createPxScale(600).posToPx(0)).toBe(300)
    expect(createPxScale(1600).posToPx(3)).toBe(800 - 3 * EVENT_SPACING)
  })

  it('honours a custom spacing', () => {
    expect(createPxScale(1000, 80).posToPx(2)).toBe(500 - 160)
  })

  it('pxToPos inverts posToPx', () => {
    for (const p of [0, 0.25, 1, 7.5, 19]) {
      expect(scale.pxToPos(scale.posToPx(p))).toBeCloseTo(p, 9)
    }
  })

  it('pxToPos reads the pos under a viewport x', () => {
    expect(scale.pxToPos(width / 2)).toBe(0)
    expect(scale.pxToPos(width / 2 - EVENT_SPACING)).toBe(1)
  })

  it('does not clamp: bounds are the caller\'s job', () => {
    expect(scale.posToPx(-1)).toBe(width / 2 + EVENT_SPACING)
    expect(scale.posToPx(25)).toBe(width / 2 - 25 * EVENT_SPACING)
  })
})
