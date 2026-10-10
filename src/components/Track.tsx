import type { HTMLAttributes } from 'react'
import { config } from '../config'
import type { TimelineEvent } from '../data/events'
import { eventLabel } from '../model/format'
import type { PxScale } from '../model/scale'

interface Props {
  pos: number
  events: readonly TimelineEvent[]
  scale: PxScale
  dragging: boolean
  trackProps: HTMLAttributes<HTMLElement>
}

export function Track({ pos, events, scale, dragging, trackProps }: Props) {
  const active = Math.round(pos)
  const { eventSpacing } = config

  return (
    <div className={`track${dragging ? ' track--dragging' : ''}`} {...trackProps}>
      <div className="playhead" />
      <div className="strip" style={{ transform: `translateX(${scale.posToPx(pos)}px)` }}>
        <div className="bar" style={{ width: (events.length - 1) * eventSpacing }} />
        {events.map((event, i) => (
          <button
            key={event.id}
            type="button"
            className={`event${i === active ? ' event--active' : ''}`}
            style={{ left: i * eventSpacing }}
            aria-label={`${eventLabel(event)}: ${event.title}`}
            aria-current={i === active ? 'true' : undefined}
          >
            <span className="dot" />
            <span className="date">{eventLabel(event)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
