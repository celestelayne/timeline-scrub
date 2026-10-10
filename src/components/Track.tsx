import type { HTMLAttributes } from 'react'
import { config } from '../config'
import type { PxScale } from '../model/scale'

interface Props {
  pos: number
  count: number
  scale: PxScale
  dragging: boolean
  trackProps: HTMLAttributes<HTMLElement>
}

export function Track({ pos, count, scale, dragging, trackProps }: Props) {
  return (
    <div className={`track${dragging ? ' track--dragging' : ''}`} {...trackProps}>
      <div className="playhead" />
      <div className="strip" style={{ transform: `translateX(${scale.posToPx(pos)}px)` }}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="tick" style={{ left: i * config.eventSpacing }} />
        ))}
      </div>
    </div>
  )
}
