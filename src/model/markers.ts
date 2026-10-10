// Group Timeline Events into Markers: one Marker per distinct year, holding every event at that year.
// Generic over the event type so it only depends on `year` and the optional typed `date`.
import { yearLabel } from './format'

export interface Marker<E> {
  year: number
  label: string
  events: E[]
}

interface Dated {
  year: number
  date?: string
}

// A Marker shows the typed date when every event in the year agrees on it;
// otherwise the plain year. Each card keeps its own date.
function markerLabel(year: number, events: readonly Dated[]): string {
  const first = events[0].date
  return first && events.every((e) => e.date === first) ? first : yearLabel(year)
}

export function groupMarkers<E extends Dated>(events: readonly E[]): Marker<E>[] {
  // Array.prototype.sort is stable, so events keep their sheet order within a year.
  const sorted = [...events].sort((a, b) => a.year - b.year)
  const markers: Marker<E>[] = []
  for (const event of sorted) {
    const last = markers[markers.length - 1]
    if (last?.year === event.year) last.events.push(event)
    else markers.push({ year: event.year, label: '', events: [event] })
  }
  for (const marker of markers) marker.label = markerLabel(marker.year, marker.events)
  return markers
}
