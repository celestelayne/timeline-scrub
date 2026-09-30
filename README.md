# Trinidad & Tobago Timeline — Scrub

A full-viewport, scrubbable timeline of the cultural history of Trinidad & Tobago (4000 BC → 1940). Built from the coordinate system outward: position first, then motion, input, and rendering.

Stack: React, TypeScript, Vite, `d3-scale`. Tests with Vitest.

## Scripts

```bash
npm run dev     # start the dev server
npm run build   # typecheck and build
npm run lint    # oxlint
npm test        # vitest (once)
```

## Coordinate model

One source of truth, `pos`: a float index into the event list (`0 … N-1`). Everything else is derived from it.

```
input → target → (ease each frame) → pos → scale → px / year → render
```

| Module | Responsibility |
| --- | --- |
| `src/events.ts` | Event ids and years (negative = BC). Placeholder data for now. |
| `src/coordinates.ts` | `pos ↔ year`, linear interpolation between neighbouring events. Knows nothing about pixels. |
| `src/scale.ts` | `pos ↔ px` via `d3-scale`. Events are equally spaced (150px) by index, playhead at viewport centre. Knows nothing about time. |
| `src/usePosition.ts` | `target → eased pos`. Inputs only write `target`; `pos` chases it by 0.18 per frame. No snapping yet. |

Equal index spacing is deliberate: time-proportional spacing would crush everything after 1498. Spacing lives behind `scale.ts`, so changing it is a one-function swap.

## Status

- [x] Setup
- [x] `coordinates.ts`
- [x] `scale.ts`
- [x] `usePosition.ts`
- [ ] `useInput.ts` — wheel, pointer drag, arrows
- [ ] `Track.tsx` — track, event ticks, fixed playhead
- [ ] `App.tsx` — year readout, debug panel (`pos` / `target` / interaction state)
- [ ] Tests — coordinate and scale math
- [ ] Tune motion
- [ ] Experiment with snapping

Event content, images, categories, fonts, persistence, and responsive layout come in later milestones.
