// Every tunable number for how the timeline moves and feels.

export const defaults = {
  // geometry
  eventSpacing: 150, // px between events on the track

  gapThreshold: 100, // years between consecutive events before a gap label shows

  // motion: pos chases target by this fraction of the remaining distance per frame
  ease: 0.18, // 0 = frozen, 1 = instant
  settleEpsilon: 0.001, // stop animating when closer than this (in index units)

  // input
  wheelDivisor: 220, // wheel delta px per event index (lower = more sensitive)
  dragThreshold: 4, // px of movement before a press becomes a drag
  wheelIdleMs: 150, // wheel -> idle (debug state only)
  keyIdleMs: 200, // key -> idle (debug state only)
}

// Live values. The tuning panel mutates this; everything reads it at use time.
export const config = { ...defaults }

export type Config = typeof config

export function setConfig<K extends keyof Config>(key: K, value: Config[K]) {
  config[key] = value
}

export function resetConfig() {
  Object.assign(config, defaults)
}
