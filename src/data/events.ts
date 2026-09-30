export interface TimelineEvent {
  id: string
  year: number // negative = BC
}

export const EVENTS: readonly TimelineEvent[] = [
  { id: 'archaic', year: -4000 },
  { id: 'saladoid', year: -250 },
  { id: 'barrancoid', year: 250 },
  { id: 'guayabitoid', year: 650 },
  { id: 'mayoid', year: 1300 },
  { id: 'columbus', year: 1498 },
  { id: 'colonial', year: 1510 },
  { id: 'sedeno', year: 1530 },
  { id: 'roume', year: 1777 },
  { id: 'cedula', year: 1783 },
  { id: 'invasion', year: 1797 },
  { id: 'amiens', year: 1802 },
  { id: 'chinese1', year: 1806 },
  { id: 'fire', year: 1808 },
  { id: 'abolition', year: 1838 },
  { id: 'indenture', year: 1844 },
  { id: 'indian', year: 1845 },
  { id: 'chinese2', year: 1853 },
  { id: 'union', year: 1887 },
  { id: 'chinese3', year: 1920 },
]

export const YEARS: readonly number[] = EVENTS.map((e) => e.year)
