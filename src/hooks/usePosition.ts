import { useCallback, useEffect, useRef, useState } from 'react'
import { config } from '../config'

type Update = number | ((prev: number) => number)

// Inputs write `target`; `pos` chases it with exponential ease each frame.
export function usePosition(count: number, initial = 0) {
  const max = count - 1
  const clamp = (v: number) => Math.min(max, Math.max(0, v))

  const [pos, setPos] = useState(() => clamp(initial))
  const [target, setTargetState] = useState(() => clamp(initial))
  const posRef = useRef(pos)
  const targetRef = useRef(target)
  const raf = useRef(0)

  const tick = useCallback(function step() {
    const delta = targetRef.current - posRef.current
    posRef.current = Math.abs(delta) < config.settleEpsilon ? targetRef.current : posRef.current + delta * config.ease
    setPos(posRef.current)
    raf.current = posRef.current === targetRef.current ? 0 : requestAnimationFrame(step)
  }, [])

  const setTarget = useCallback(
    (update: Update) => {
      const next = Math.min(max, Math.max(0, typeof update === 'function' ? update(targetRef.current) : update))
      targetRef.current = next
      setTargetState(next)
      if (!raf.current) raf.current = requestAnimationFrame(tick)
    },
    [max, tick],
  )

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return { pos, target, setTarget }
}
