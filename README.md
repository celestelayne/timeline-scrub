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

## Structure

```
src/
  data/        events.ts
  model/       coordinates.ts, scale.ts   (pure: no React, no DOM)
  hooks/       usePosition.ts, useInput.ts, useViewportWidth.ts
  components/  Track.tsx
  App.tsx, main.tsx
```

Rule: nothing in `model/` imports React. Tests sit beside the code they cover (`model/coordinates.test.ts`).

## Coordinate model

One source of truth, `pos`: a float index into the event list (`0 … N-1`). Everything else is derived from it.

```
input → target → (ease each frame) → pos → scale → px / year → render
```

| Module | Responsibility |
| --- | --- |
| `src/data/events.ts` | Event ids and years (negative = BC). Placeholder data for now. |
| `src/model/coordinates.ts` | `pos ↔ year`, linear interpolation between neighbouring events. Knows nothing about pixels. |
| `src/model/scale.ts` | `pos ↔ px` via `d3-scale`. Events are equally spaced (150px) by index, playhead at viewport centre. Knows nothing about time. |
| `src/hooks/usePosition.ts` | `target → eased pos`. Inputs only write `target`; `pos` chases it by 0.18 per frame. No snapping yet. |

Equal index spacing is deliberate: time-proportional spacing would crush everything after 1498. Spacing lives behind `scale.ts`, so changing it is a one-function swap.

## Status

- [x] Setup
- [x] `coordinates.ts`
- [x] `scale.ts`
- [x] `usePosition.ts`
- [x] `useInput.ts` — wheel, pointer drag, arrows
- [x] `Track.tsx` — track, event ticks, fixed playhead
- [x] `App.tsx` — year readout, debug panel (`pos` / `target` / interaction state)
- [ ] Tests — coordinate and scale math
- [ ] Tune motion
- [ ] Experiment with snapping

Event content, images, categories, fonts, persistence, and responsive layout come in later milestones.
