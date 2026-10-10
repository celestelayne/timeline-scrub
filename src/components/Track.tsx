import { useMemo } from 'react'
import type { HTMLAttributes } from 'react'
import { config } from '../config'
import type { TimelineEvent } from '../data/types'
import { yearLabel } from '../model/format'
import { computeGaps } from '../model/gaps'
import type { Marker } from '../model/markers'
import type { PxScale } from '../model/scale'

interface Props {
  pos: number
  markers: readonly Marker<TimelineEvent>[]
  scale: PxScale
  dragging: boolean
  onSelect: (index: number) => void
  trackProps: HTMLAttributes<HTMLElement>
}

export function Track({ pos, markers, scale, dragging, onSelect, trackProps }: Props) {
  const active = Math.round(pos)
  const { eventSpacing } = config
  const gaps = useMemo(() => computeGaps(markers.map((m) => m.year)), [markers])

  return (
    <div className={`track${dragging ? ' track--dragging' : ''}`} {...trackProps}>
      <div className="playhead" />
      <div className="strip" style={{ transform: `translateX(${scale.posToPx(pos)}px)` }}>
        <div className="bar" style={{ width: (markers.length - 1) * eventSpacing }} />
        {gaps.map(
          (gap) =>
            gap.label && (
              <span key={gap.index} className="gap" style={{ left: (gap.index + 0.5) * eventSpacing }}>
                {gap.label}
              </span>
            ),
        )}
        {markers.map((marker, i) => (
          <button
            key={marker.year}
            type="button"
            className={`event${i === active ? ' event--active' : ''}`}
            style={{ left: i * eventSpacing }}
            aria-label={`${yearLabel(marker.year)}: ${marker.events.map((e) => e.title).join('; ')}`}
            aria-current={i === active ? 'true' : undefined}
            onClick={() => onSelect(i)}
          >
            <span className="dot" />
            <span className="date">{yearLabel(marker.year)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
