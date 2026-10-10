import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { config } from '../config'

export type Interaction = 'idle' | 'wheel' | 'drag' | 'key'

type SetTarget = (update: number | ((prev: number) => number)) => void

interface Options {
  target: number
  setTarget: SetTarget
  spacing: number // px per event index, for drag
}

// Every input only writes `target`. Wheel and arrows listen on window;
// drag is bound to the track via the returned `trackProps`.
export function useInput({ target, setTarget, spacing }: Options) {
  const [interaction, setInteraction] = useState<Interaction>('idle')

  const targetRef = useRef(target)
  useEffect(() => {
    targetRef.current = target
  }, [target])
  const drag = useRef<{ id: number; startX: number; startTarget: number; active: boolean } | null>(null)

  useEffect(() => {
    let timer = 0
    const settle = (ms: number) => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        if (!drag.current?.active) setInteraction('idle')
      }, ms)
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      setTarget((t) => t + delta / config.wheelDivisor)
      if (!drag.current?.active) {
        setInteraction('wheel')
        settle(config.wheelIdleMs)
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
      if (!dir) return
      e.preventDefault()
      setTarget((t) => Math.round(t) + dir)
      if (!drag.current?.active) {
        setInteraction('key')
        settle(config.keyIdleMs)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [setTarget])

  const onPointerDown = useCallback((e: PointerEvent<HTMLElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { id: e.pointerId, startX: e.clientX, startTarget: targetRef.current, active: false }
  }, [])

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      const d = drag.current
      if (!d || d.id !== e.pointerId) return
      const dx = e.clientX - d.startX
      if (!d.active) {
        if (Math.abs(dx) <= config.dragThreshold) return
        d.active = true
        setInteraction('drag')
      }
      setTarget(d.startTarget - dx / spacing)
    },
    [setTarget, spacing],
  )

  const endDrag = useCallback((e: PointerEvent<HTMLElement>) => {
    if (drag.current?.id !== e.pointerId) return
    drag.current = null
    setInteraction('idle')
  }, [])

  return {
    interaction,
    trackProps: { onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag },
  }
}
