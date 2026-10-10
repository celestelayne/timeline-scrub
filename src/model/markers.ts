// Group Timeline Events into Markers: one Marker per distinct year, holding every event at that year.
// Generic over the event type so it only depends on `year`.

export interface Marker<E> {
  year: number
  events: E[]
}

export function groupMarkers<E extends { year: number }>(events: readonly E[]): Marker<E>[] {
  // Array.prototype.sort is stable, so events keep their sheet order within a year.
  const sorted = [...events].sort((a, b) => a.year - b.year)
  const markers: Marker<E>[] = []
  for (const event of sorted) {
    const last = markers[markers.length - 1]
    if (last?.year === event.year) last.events.push(event)
    else markers.push({ year: event.year, events: [event] })
  }
  return markers
}
