// Parse and validate the sheet's CSV into Timeline Events. Pure: no network, no file access.
import Papa from 'papaparse'
import type { TimelineEvent } from '../src/data/types.ts'

type Field =
  | 'date' | 'year' | 'period' | 'culturalSeries' | 'title'
  | 'description' | 'place' | 'site' | 'source' | 'media'

// Sheet header (lowercased) -> field. Unknown and blank headers are ignored.
const COLUMNS: Record<string, Field> = {
  'display date': 'date',
  'start year': 'year',
  'period': 'period',
  'cultural series': 'culturalSeries',
  'event title': 'title',
  'description': 'description',
  'related site': 'site',
  'place': 'place',
  'reference': 'source',
  'media': 'media',
}
const HEADER_NAME: Partial<Record<Field, string>> = { year: 'Start year', title: 'Event title' }
const REQUIRED: Field[] = ['year', 'title']

export interface SheetResult {
  events: TimelineEvent[]
  errors: string[] // any error means the sync should fail
  warnings: string[]
}

// Empty cells and the sheet's "--" placeholder both mean "no value".
function clean(cell: string | undefined): string | undefined {
  const v = cell?.trim()
  return v && v !== '--' ? v : undefined
}

export function slugify(text: string): string {
  const slug = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'event'
}

function uniqueId(base: string, used: Set<string>): string {
  let id = base
  for (let n = 2; used.has(id); n++) id = `${base}-${n}`
  used.add(id)
  return id
}

// A typed date should plausibly belong to its year. Warn, never fail: "Late 1800s" is legitimate.
function dateWarnings(row: number, year: number, date: string): string[] {
  const out: string[] = []
  const numbers = [...date.matchAll(/\d{3,4}/g)].map((m) => Number(m[0]))
  if (numbers.length > 0 && !numbers.some((n) => Math.abs(n - Math.abs(year)) <= 100)) {
    out.push(`Row ${row}: date "${date}" has no year near ${year}`)
  }
  const saysBC = /\bBCE?\b/.test(date)
  if (year < 0 && !saysBC) out.push(`Row ${row}: year ${year} is BC but date "${date}" does not say BC`)
  if (year >= 0 && saysBC) out.push(`Row ${row}: year ${year} is AD but date "${date}" says BC`)
  return out
}

function paragraphs(text: string | undefined): string[] {
  return (text ?? '')
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export function parseSheet(csv: string): SheetResult {
  const result: SheetResult = { events: [], errors: [], warnings: [] }
  const rows = Papa.parse<string[]>(csv.replace(/^﻿/, ''), { skipEmptyLines: false }).data
  const header = rows[0] ?? []

  const column = new Map<Field, number>()
  header.forEach((name, i) => {
    const field = COLUMNS[name.trim().toLowerCase()]
    if (field && !column.has(field)) column.set(field, i)
  })
  for (const field of REQUIRED) {
    if (!column.has(field)) result.errors.push(`Missing required column "${HEADER_NAME[field]}"`)
  }
  if (result.errors.length > 0) return result

  const used = new Set<string>()
  rows.slice(1).forEach((cells, i) => {
    const row = i + 2 // the row number as seen in the sheet
    const get = (field: Field) => {
      const index = column.get(field)
      return index === undefined ? undefined : clean(cells[index])
    }
    if ([...column.keys()].every((f) => get(f) === undefined)) return // blank row

    const rawYear = get('year')?.replace('−', '-')
    const title = get('title')
    let year: number | undefined
    if (rawYear === undefined) {
      result.errors.push(`Row ${row}: Start year is empty`)
    } else if (!/^-?\d+$/.test(rawYear)) {
      result.errors.push(`Row ${row}: Start year "${rawYear}" is not a whole number (digits only, negative for BC)`)
    } else {
      year = Number(rawYear)
    }
    if (!title) result.errors.push(`Row ${row}: Event title is empty`)
    if (year === undefined || !title) return

    const date = get('date')
    if (date) result.warnings.push(...dateWarnings(row, year, date))

    const optional = {
      date,
      period: get('period'),
      culturalSeries: get('culturalSeries'),
      place: get('place'),
      site: get('site'),
      source: get('source'),
      media: get('media'),
    }
    result.events.push({
      id: uniqueId(slugify(title), used),
      year,
      title,
      body: paragraphs(get('description')),
      ...Object.fromEntries(Object.entries(optional).filter(([, v]) => v !== undefined)),
    })
  })

  // Stable: events keep sheet order within a year.
  result.events.sort((a, b) => a.year - b.year)
  return result
}
