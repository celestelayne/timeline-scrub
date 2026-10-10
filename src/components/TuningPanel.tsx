import { config, resetConfig, setConfig } from '../config'

type Key = 'ease' | 'wheelDivisor' | 'eventSpacing'

const SLIDERS: { key: Key; label: string; min: number; max: number; step: number }[] = [
  { key: 'ease', label: 'ease', min: 0.02, max: 0.5, step: 0.01 },
  { key: 'wheelDivisor', label: 'wheelDivisor', min: 60, max: 600, step: 10 },
  { key: 'eventSpacing', label: 'eventSpacing', min: 60, max: 300, step: 10 },
]

// Temporary: live-tune motion, then copy the values into config.ts.
export function TuningPanel({ onChange }: { onChange: () => void }) {
  const set = (key: Key, value: number) => {
    setConfig(key, value)
    onChange()
  }
  const reset = () => {
    resetConfig()
    onChange()
  }

  return (
    <div className="tuning">
      {SLIDERS.map(({ key, label, min, max, step }) => (
        <label key={key}>
          <span>{label}</span>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={config[key]}
            onChange={(e) => set(key, Number(e.target.value))}
          />
          <output>{config[key]}</output>
        </label>
      ))}
      <button type="button" onClick={reset}>
        reset
      </button>
    </div>
  )
}
