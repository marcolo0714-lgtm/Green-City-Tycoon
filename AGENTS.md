# Green City Tycoon — Project Reference

## Tech Stack
- React 19 + TypeScript 6 + Vite 8
- Three.js + React Three Fiber + Drei (3D rendering)
- Zustand 5 (global state management)
- oxlint (linting), Vercel (deployment)

## Project Structure
```
src/
  components/
    App.tsx            — root, rAF game loop, tick dispatch, day progress
    GameScene3D.tsx    — 3D scene: grid, terrain blocks, roads, buildings, people
    BuildingModel3D.tsx — 30 building 3D models (each uniquely designed)
    BuildingMenu.tsx   — left sidebar: Buildings | Events | Goals tabs
    MeterPanel.tsx     — right sidebar: six meter bars, delta popups, event boosts, dev tools
    StatusBar.tsx      — top bar: day counter, progress bar, speed badge, money
    SpeedControl.tsx   — pause / 1× / 2× speed buttons
    NotificationOverlay.tsx — warning toasts with countdown bars, disaster alerts, win/lose
    TutorialOverlay.tsx — interactive tutorial walkthrough
    DisasterEffects3D.tsx — tsunami frame, smog particles, drought cracks (3D)
    DisasterMinigame.tsx — 4-question educational quiz (intro → quiz → results)
    EventPopup.tsx     — event completion celebration cards with CSS illustrations
    BuildingShape.tsx  — 2D building shape renderer (building cards)
    ConfirmDialog.tsx  — confirmation dialog for destructive actions
    ObjectivesPanel.tsx — goals/achievement tracking panel
  store/
    gameStore.ts       — all game state, formulas, and actions (Zustand)
  data/
    buildings.ts       — 30 building definitions (6 starter + 24 unlockable)
    events.ts          — 10 event definitions with conditions and multiplier effects
    questions.ts       — 110 educational quiz questions across 5 categories
  types/
    index.ts           — TypeScript type definitions for the entire game
  util/
    iso.ts             — isometric coordinate helpers (legacy, unused)
GAME_STATS.md          — comprehensive game statistics and formula reference
```

## Grid & Terrain
- **9×9** grid (81 tiles), `SPACING = 2.6`, `TILE_SIZE = 1.6`
- World position: `tileToWorld(col, row) = (col × SPACING, 0, row × SPACING)`
- **1 mountain** (3×3 block, $400,000 clear cost), **2 lakes** (2×2 blocks, $30,000), **4 forests** (tile pairs, $2,000)
- Mountains and lakes cannot spawn on edge tiles (row/col 0 or 8)
- Each terrain block has a unique `blockId`; adjacent same-type blocks are separate entities
- Clearing any tile in a block clears the entire block (flood-fill)
- Terrain rendered as merged `TerrainBlock` entities, not per-tile

## Building System
- **30 buildings**: 6 starter + 24 unlockable (tied to events)
- Each building has ≤4 non-zero stats displayed as colored pills in the sidebar
- All 3D models are decorated on all 4 sides
- Costs scale with event tier: starter $18–60, early $70–700, mid $300–800, late $550–12,000
- Buildings take 2 days to construct; positive-pollution buildings apply pollution immediately
- Coastal-only buildings restricted to grid edge tiles

## Events System
- **10 events** with no prerequisite ordering (can organize in any sequence)
- Each event provides permanent multiplicative stat multipliers
- Event multipliers stack multiplicatively across all organized events
- Event requirements use three stats each: happiness, renewable energy, and resilience
- Happiness is **not** multiplied by events (it serves as a consequence/punishment meter)
- Event completion triggers a full-screen popup with a unique CSS illustration

## Meter Formulas
- **Money**: accumulates per-day income × income multiplier, starting at $300
- **Population**: grows by `(happiness / 100) × 60 × popGrowthMultiplier` per day with housing, capped at `housingCapacity × 2.0`
- **Pollution**: sum of building pollution × pollution multiplier, clamped 0–100
- **Happiness**: persistent accumulator at ×10 integer scale (0–1000), modified per day by building rates, adjacency bonuses, streak-based overcrowding/pollution penalties, and disaster deductions
- **Renewable**: sum of renewable boosts × renewable multiplier, clamped 0–100
- **Resilience**: sum of resilience boosts × resilience multiplier, decays -1 every 3 days

## Day Progression
- Single `requestAnimationFrame` loop in App.tsx drives all timing
- Accumulator-based: `accRef += dt × gameSpeed`, ticks fire when threshold (5000ms) is reached
- Speed changes do not reset accumulated progress
- Day progress bar updates continuously via React state, tick counter advances on each tick

## Performance Design
- Single rAF loop for all timing (no multiple loops)
- Disaster effects use `useFrame` + direct ref mutation, bypassing React re-renders
- Warning countdown bars use CSS transitions (width + transition), not per-frame rAF updates
- Terrain blocks use `React.memo` + `useMemo` for render optimization
- `BuildingModel3D.tsx` is ~1600 lines — must use targeted `edit` operations, never full-file `write`

## Development Guidelines
- Never commit or push unless explicitly requested
- Update `GAME_STATS.md` whenever game formulas, building stats, or disaster values change
- Use `edit` tool for targeted line changes, especially in large files
- Build and lint (`npm run build && npm run lint`) after every significant change
