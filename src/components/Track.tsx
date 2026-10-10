import { useMemo } from 'react'
import type { HTMLAttributes } from 'react'
import { config } from '../config'
import type { TimelineEvent } from '../data/events'
import { eventLabel } from '../model/format'
import { computeGaps } from '../model/gaps'
import type { PxScale } from '../model/scale'

interface Props {
  pos: number
  events: readonly TimelineEvent[]
  scale: PxScale
  dragging: boolean
  onSelect: (index: number) => void
  trackProps: HTMLAttributes<HTMLElement>
}

export function Track({ pos, events, scale, dragging, onSelect, trackProps }: Props) {
  const active = Math.round(pos)
  const { eventSpacing } = config
  const gaps = useMemo(() => computeGaps(events.map((e) => e.year)), [events])

  return (
    <div className={`track${dragging ? ' track--dragging' : ''}`} {...trackProps}>
      <div className="playhead" />
      <div className="strip" style={{ transform: `translateX(${scale.posToPx(pos)}px)` }}>
        <div className="bar" style={{ width: (events.length - 1) * eventSpacing }} />
        {gaps.map(
          (gap) =>
            gap.label && (
              <span key={gap.index} className="gap" style={{ left: (gap.index + 0.5) * eventSpacing }}>
                {gap.label}
              </span>
            ),
        )}
        {events.map((event, i) => (
          <button
            key={event.id}
            type="button"
            className={`event${i === active ? ' event--active' : ''}`}
            style={{ left: i * eventSpacing }}
            aria-label={`${eventLabel(event)}: ${event.title}`}
            aria-current={i === active ? 'true' : undefined}
            onClick={() => onSelect(i)}
          >
            <span className="dot" />
            <span className="date">{eventLabel(event)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
