// pos <-> year. `pos` is a float index into the event list (0 … N-1).
// Linear interpolation between neighbouring event years; knows nothing about pixels.

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export function posToYear(pos: number, years: readonly number[]): number {
  const last = years.length - 1
  const p = clamp(pos, 0, last)
  const i = Math.min(Math.floor(p), last - 1)
  if (i < 0) return years[0] // single-event list
  const t = p - i
  return years[i] + (years[i + 1] - years[i]) * t
}

export function yearToPos(year: number, years: readonly number[]): number {
  const last = years.length - 1
  if (last <= 0 || year <= years[0]) return 0
  if (year >= years[last]) return last
  let i = 0
  while (years[i + 1] < year) i++
  return i + (year - years[i]) / (years[i + 1] - years[i])
}
