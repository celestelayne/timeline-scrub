// pos <-> px. Events are spaced equally by index; the playhead sits at viewport centre.
import { scaleLinear } from 'd3-scale'
import { config } from '../config'

export interface PxScale {
  posToPx: (pos: number) => number // translateX for the track strip
  pxToPos: (px: number) => number // pos under a viewport-x coordinate
}

export function createPxScale(viewportWidth: number, spacing = config.eventSpacing): PxScale {
  // strip offset for a given pos: event i sits at i*spacing, playhead at width/2
  const strip = scaleLinear().domain([0, 1]).range([viewportWidth / 2, viewportWidth / 2 - spacing])
  return {
    posToPx: (pos) => strip(pos),
    pxToPos: (px) => strip.invert(px),
  }
}
