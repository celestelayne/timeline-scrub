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

  return (
    <div className={`track${dragging ? ' track--dragging' : ''}`} {...trackProps}>
      <div className="playhead" />
      <div className="strip" style={{ transform: `translateX(${scale.posToPx(pos)}px)` }}>
        {events.map((event, i) => (
          <button
            key={event.id}
            type="button"
            className={`dot${i === active ? ' dot--active' : ''}`}
            style={{ left: i * config.eventSpacing }}
            aria-label={`${eventLabel(event)}: ${event.title}`}
            aria-current={i === active ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  )
}
