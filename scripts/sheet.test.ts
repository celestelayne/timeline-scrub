import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { groupMarkers } from '../src/model/markers.ts'
import { parseSheet, slugify } from './sheet.ts'

const HEADER = 'Display date,Start year,Period,Cultural Series,Event title,Description'
const csv = (...rows: string[]) => [HEADER, ...rows].join('\n')

describe('parseSheet: mapping', () => {
  it('maps columns to fields', () => {
    const { events, errors } = parseSheet(csv('c. AD 650,650,Late Ceramic Age,Guayabitoid,Bontour complex,A new complex.'))
    expect(errors).toEqual([])
    expect(events).toEqual([
      {
        id: 'bontour-complex',
        year: 650,
        date: 'c. AD 650',
        title: 'Bontour complex',
        body: ['A new complex.'],
        period: 'Late Ceramic Age',
        culturalSeries: 'Guayabitoid',
      },
    ])
  })

  it('treats empty cells and "--" as no value, and omits them', () => {
    const [event] = parseSheet(csv(',1498,Contact period,--,Columbus encounters Trinidad,')).events
    expect(event).toEqual({ id: 'columbus-encounters-trinidad', year: 1498, title: 'Columbus encounters Trinidad', body: [], period: 'Contact period' })
    expect('culturalSeries' in event).toBe(false)
    expect('date' in event).toBe(false)
  })

  it('matches headers case-insensitively and ignores unknown or blank columns', () => {
    const { events, errors } = parseSheet('start year,EVENT TITLE,,Notes\n1498,Columbus,x,y')
    expect(errors).toEqual([])
    expect(events[0]).toMatchObject({ year: 1498, title: 'Columbus' })
  })

  it('reads quoted fields with commas, quotes, and line breaks', () => {
    const { events } = parseSheet(csv('1800,1800,P,,"Title, with ""quotes""","First para.\n\nSecond para.\r\n\r\nThird."'))
    expect(events[0].title).toBe('Title, with "quotes"')
    expect(events[0].body).toEqual(['First para.', 'Second para.', 'Third.'])
  })

  it('skips blank rows and tolerates a byte-order mark', () => {
    const { events, errors } = parseSheet('﻿' + csv('1498,1498,P,,A,d', ',,,,,', '', '1530,1530,P,,B,d'))
    expect(errors).toEqual([])
    expect(events.map((e) => e.title)).toEqual(['A', 'B'])
  })
})

describe('parseSheet: ids', () => {
  it('slugifies titles, removing accents', () => {
    expect(slugify('Antonio Sedeño appointed governor')).toBe('antonio-sedeno-appointed-governor')
    expect(slugify('Cédula of Population issued')).toBe('cedula-of-population-issued')
    expect(slugify('???')).toBe('event')
  })

  it('de-duplicates repeated titles in sheet order', () => {
    const { events } = parseSheet(csv('1,1900,P,,Same,d', '2,1901,P,,Same,d', '3,1902,P,,Same,d'))
    expect(events.map((e) => e.id)).toEqual(['same', 'same-2', 'same-3'])
  })
})

describe('parseSheet: ordering', () => {
  it('sorts by year and keeps sheet order within a year', () => {
    const { events } = parseSheet(csv('x,1900,P,,Late,d', 'x,-800,P,,Early,d', 'x,1900,P,,Late second,d'))
    expect(events.map((e) => e.title)).toEqual(['Early', 'Late', 'Late second'])
  })
})

describe('parseSheet: errors', () => {
  it('reports a missing required column and stops', () => {
    const { errors, events } = parseSheet('Display date,Description\nx,y')
    expect(errors).toEqual(['Missing required column "Start year"', 'Missing required column "Event title"'])
    expect(events).toEqual([])
  })

  it('reports a non-numeric year with its sheet row', () => {
    const { errors } = parseSheet(csv('x,1498,P,,A,d', 'x,"1,498",P,,B,d', 'x,c. 1500,P,,C,d'))
    expect(errors).toEqual([
      'Row 3: Start year "1,498" is not a whole number (digits only, negative for BC)',
      'Row 4: Start year "c. 1500" is not a whole number (digits only, negative for BC)',
    ])
  })

  it('accepts a unicode minus for BC', () => {
    expect(parseSheet(csv('x,−5900,P,,A,d')).events[0].year).toBe(-5900)
  })

  it('reports an empty year or title', () => {
    const { errors } = parseSheet(csv('x,,P,,A,d', 'x,1500,P,,,d'))
    expect(errors).toEqual(['Row 2: Start year is empty', 'Row 3: Event title is empty'])
  })

  it('keeps the valid rows when others fail', () => {
    const { events, errors } = parseSheet(csv('x,1498,P,,A,d', 'x,bad,P,,B,d'))
    expect(events).toHaveLength(1)
    expect(errors).toHaveLength(1)
  })
})

describe('parseSheet: warnings', () => {
  const warn = (date: string, year: number) => parseSheet(csv(`${date},${year},P,,A,d`)).warnings

  it('accepts approximate dates near the year', () => {
    expect(warn('Late 1700s–1800s', 1790)).toEqual([])
    expect(warn('Mid-1920s–1939', 1925)).toEqual([])
    expect(warn('After 1945', 1945)).toEqual([])
    expect(warn('Early 1939', 1939)).toEqual([])
  })

  it('warns when the date names a different century', () => {
    expect(warn('1783', 1583)).toEqual(['Row 2: date "1783" has no year near 1583'])
    expect(warn('1783', 1683)).toEqual([]) // within 100 years is accepted
  })

  it('warns when BC/AD disagrees with the sign of the year', () => {
    expect(warn('c. 5900', -5900)).toEqual(['Row 2: year -5900 is BC but date "c. 5900" does not say BC'])
    expect(warn('c. 500 BC', 500)).toEqual(['Row 2: year 500 is AD but date "c. 500 BC" says BC'])
  })

  it('does not warn on dates without numbers', () => {
    expect(warn('Late colonial period', 1950)).toEqual([])
  })
})

describe('the real sheet (fixture snapshot)', () => {
  const result = parseSheet(readFileSync(new URL('./fixtures/sheet.csv', import.meta.url), 'utf8'))

  it('parses cleanly', () => {
    expect(result.errors).toEqual([])
    expect(result.warnings).toEqual([])
    expect(result.events).toHaveLength(61)
  })

  it('has unique ids and ascending years', () => {
    expect(new Set(result.events.map((e) => e.id)).size).toBe(61)
    result.events.slice(1).forEach((e, i) => expect(e.year).toBeGreaterThanOrEqual(result.events[i].year))
  })

  it('groups into 49 Markers, with 1846 holding three events', () => {
    const markers = groupMarkers(result.events)
    expect(markers).toHaveLength(49)
    expect(markers.find((m) => m.year === 1846)?.events).toHaveLength(3)
  })

  it('labels Markers by the shared date, else the year', () => {
    const label = (year: number) => groupMarkers(result.events).find((m) => m.year === year)?.label
    expect(label(-5900)).toBe('c. 5900 BC')
    expect(label(1806)).toBe('1806')
    expect(label(1846)).toBe('1846')
    expect(label(650)).toBe('c. AD 650–800')
  })

  it('reads "--" as no Cultural Series', () => {
    const columbus = result.events.find((e) => e.year === 1498)
    expect(columbus && 'culturalSeries' in columbus).toBe(false)
  })
})
