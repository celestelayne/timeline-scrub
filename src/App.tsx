import { useMemo, useReducer } from 'react'
import { Track } from './components/Track'
import { TuningPanel } from './components/TuningPanel'
import { EVENTS, YEARS } from './data/events'
import { useInput } from './hooks/useInput'
import { usePosition } from './hooks/usePosition'
import { useViewportWidth } from './hooks/useViewportWidth'
import { posToYear } from './model/coordinates'
import { yearParts } from './model/format'
import { config } from './config'
import { createPxScale } from './model/scale'

export default function App() {
  const [, rerender] = useReducer((n: number) => n + 1, 0)
  const { eventSpacing } = config
  const { pos, target, setTarget } = usePosition(YEARS.length)
  const { interaction, trackProps } = useInput({ target, setTarget, spacing: eventSpacing })
  const width = useViewportWidth()
  const scale = useMemo(() => createPxScale(width, eventSpacing), [width, eventSpacing])

  const { value, era } = yearParts(posToYear(pos, YEARS))

  return (
    <div className="app">
      <main className="main">
        <div className="year">
          <span>{value}</span>
          {era && <span className="era">{era}</span>}
        </div>
        <pre className="debug">
          {`pos         ${pos.toFixed(3)}
target      ${target.toFixed(3)}
active      ${Math.round(pos)} / ${YEARS.length - 1}
interaction ${interaction}`}
        </pre>
      </main>
      <TuningPanel onChange={rerender} />
      <Track
        pos={pos}
        events={EVENTS}
        scale={scale}
        dragging={interaction === 'drag'}
        onSelect={setTarget}
        trackProps={trackProps}
      />
    </div>
  )
}
