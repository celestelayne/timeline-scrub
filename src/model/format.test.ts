import { describe, expect, it } from 'vitest'
import { eventLabel, yearLabel, yearParts } from './format'

describe('yearParts', () => {
  it('marks negative years BC without the sign', () => {
    expect(yearParts(-4000)).toEqual({ value: '4000', era: 'BC' })
    expect(yearParts(-250)).toEqual({ value: '250', era: 'BC' })
  })

  it('marks years below 1000 AD', () => {
    expect(yearParts(250)).toEqual({ value: '250', era: 'AD' })
    expect(yearParts(999)).toEqual({ value: '999', era: 'AD' })
  })

  it('leaves years from 1000 bare', () => {
    expect(yearParts(1000)).toEqual({ value: '1000', era: '' })
    expect(yearParts(1498)).toEqual({ value: '1498', era: '' })
  })

  it('rounds interpolated years', () => {
    expect(yearParts(1497.6)).toEqual({ value: '1498', era: '' })
    expect(yearParts(-249.6)).toEqual({ value: '250', era: 'BC' })
  })
})

describe('yearLabel', () => {
  it('puts BC after and AD before the number', () => {
    expect(yearLabel(-250)).toBe('250 BC')
    expect(yearLabel(250)).toBe('AD 250')
    expect(yearLabel(1498)).toBe('1498')
  })
})

describe('eventLabel', () => {
  it('generates a label when there is no typed date', () => {
    expect(eventLabel({ year: -4000 })).toBe('4000 BC')
  })

  it('prefers the typed date', () => {
    expect(eventLabel({ year: 650, date: 'c. AD 650' })).toBe('c. AD 650')
  })
})
