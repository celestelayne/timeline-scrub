// Gaps between consecutive Timeline Events, in years. Pure: depends only on years.
import { config } from '../config'

export interface Gap {
  index: number // gap sits between event `index` and `index + 1`
  years: number
  label: string | null // null when below the threshold
}

export function formatGap(years: number): string {
  return `${years.toLocaleString('en-US')} yrs`
}

export function computeGaps(years: readonly number[], threshold = config.gapThreshold): Gap[] {
  return years.slice(1).map((next, index) => {
    const gap = next - years[index]
    return { index, years: gap, label: gap >= threshold ? formatGap(gap) : null }
  })
}
