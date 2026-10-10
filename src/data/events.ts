import type { TimelineEvent } from './types'

const LEGACY: Omit<TimelineEvent, 'body'>[] = [
  { id: 'archaic', year: -4000, title: 'Archaic or Ortoiroid' },
  { id: 'saladoid', year: -250, title: 'Saladoid' },
  { id: 'barrancoid', year: 250, title: 'Barrancoid' },
  { id: 'guayabitoid', year: 650, date: 'c. AD 650', title: 'Guayabitoid culture' },
  { id: 'mayoid', year: 1300, title: 'Mayoid' },
  { id: 'columbus', year: 1498, title: 'Christopher Columbus' },
  { id: 'colonial', year: 1510, title: 'Colonial settlement of Trinidad' },
  { id: 'sedeno', year: 1530, title: 'Antonio Sedeño appointed governor' },
  { id: 'roume', year: 1777, title: 'Roume de Saint-Laurent visits' },
  { id: 'cedula', year: 1783, title: 'Cedula of Population' },
  { id: 'invasion', year: 1797, title: 'British invasion' },
  { id: 'amiens', year: 1802, title: 'Treaty of Amiens' },
  { id: 'chinese1', year: 1806, title: '1st wave of Chinese' },
  { id: 'fire', year: 1808, title: 'Port-of-Spain destroyed by fire' },
  { id: 'abolition', year: 1838, title: 'Abolition of slavery' },
  { id: 'indenture', year: 1844, title: 'Indentured immigration allowed' },
  { id: 'indian', year: 1845, title: 'Indian immigrants arrive' },
  { id: 'chinese2', year: 1853, date: '1853–1866', title: '2nd wave of Chinese' },
  { id: 'union', year: 1887, title: 'Trinidad and Tobago Act' },
  { id: 'chinese3', year: 1920, date: '1920–1940', title: '3rd wave of Chinese' },
]

// Temporary hand-typed data; replaced by the synced sheet.
export const EVENTS: readonly TimelineEvent[] = LEGACY.map((e) => ({ ...e, body: [] }))

export const YEARS: readonly number[] = EVENTS.map((e) => e.year)
