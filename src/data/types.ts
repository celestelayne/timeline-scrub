export interface TimelineEvent {
  id: string
  year: number // negative = BC
  date?: string // typed display date; omit to generate one from `year`
  title: string
  body: string[] // paragraphs
  period?: string
  culturalSeries?: string
  place?: string
  site?: string
  source?: string
  media?: string
}
