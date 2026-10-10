import { useMemo, useReducer } from 'react'
import { Track } from './components/Track'
import { TuningPanel } from './components/TuningPanel'
import { YEARS } from './data/events'
import { useInput } from './hooks/useInput'
import { usePosition } from './hooks/usePosition'
import { useViewportWidth } from './hooks/useViewportWidth'
import { posToYear } from './model/coordinates'
import { config } from './config'
import { createPxScale } from './model/scale'

function formatYear(year: number): { value: string; era: string } {
  const y = Math.round(year)
  if (y < 0) return { value: String(-y), era: 'BC' }
  if (y < 1000) return { value: String(y), era: 'AD' }
  return { value: String(y), era: '' }
}

export default function App() {
  const [, rerender] = useReducer((n: number) => n + 1, 0)
  const { eventSpacing } = config
  const { pos, target, setTarget } = usePosition(YEARS.length)
  const { interaction, trackProps } = useInput({ target, setTarget, spacing: eventSpacing })
  const width = useViewportWidth()
  const scale = useMemo(() => createPxScale(width, eventSpacing), [width, eventSpacing])

  const { value, era } = formatYear(posToYear(pos, YEARS))

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
      <Track pos={pos} count={YEARS.length} scale={scale} dragging={interaction === 'drag'} trackProps={trackProps} />
    </div>
  )
}
