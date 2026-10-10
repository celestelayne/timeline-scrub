// Year formatting. Negative = BC; years below 1000 carry an AD era; later years are bare.

export interface YearParts {
  value: string
  era: 'BC' | 'AD' | ''
}

export function yearParts(year: number): YearParts {
  const y = Math.round(year)
  if (y < 0) return { value: String(-y), era: 'BC' }
  if (y < 1000) return { value: String(y), era: 'AD' }
  return { value: String(y), era: '' }
}

// Label form: "250 BC", "AD 250", "1498"
export function yearLabel(year: number): string {
  const { value, era } = yearParts(year)
  if (era === 'BC') return `${value} BC`
  if (era === 'AD') return `AD ${value}`
  return value
}

// A typed `date` wins; otherwise the label is generated from `year`.
export function eventLabel(event: { year: number; date?: string }): string {
  return event.date ?? yearLabel(event.year)
}
