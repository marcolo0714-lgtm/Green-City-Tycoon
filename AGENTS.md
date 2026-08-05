# Green City Tycoon — Development Notes

## Tech Stack
- React 19 + TypeScript 6 + Vite 8
- Three.js + React Three Fiber + Drei (3D)
- Zustand (state)
- oxlint (lint), Vercel (deploy)

## Project Structure
```
src/
  components/
    App.tsx            — root (rAF game loop, tick, day progress)
    GameScene3D.tsx    — Three.js canvas, grid, terrain blocks, roads, buildings, people, destroyed overlays
    BuildingModel3D.tsx — 27+ building 3D shapes (all 4-sided decorated)
    BuildingMenu.tsx   — left sidebar (Buildings | Events | Goals tabs)
    MeterPanel.tsx     — right meter bars with delta popups, event boosts, dev options
    StatusBar.tsx      — top bar (day + progress, speed, money, tutorial/restart)
    SpeedControl.tsx   — pause/1x/2x buttons
    NotificationOverlay.tsx — warnings (with countdown bars), disaster alerts, win/lose, minigame stats
    TutorialOverlay.tsx — tutorial steps including events
    DisasterEffects3D.tsx — tsunami (square frame), smog particles, drought cracks
    DisasterMinigame.tsx — 4-question minigame with intro/quiz/results screens
    EventPopup.tsx     — event completion photo cards with 10 CSS illustrations
  store/
    gameStore.ts       — all game state + logic (Zustand)
  data/
    buildings.ts       — 27 building definitions (6 starter + 21 unlockable)
    events.ts          — 10 event definitions with multipliers
    questions.ts       — 110 educational questions
  types/
    index.ts           — TypeScript types
  util/
    iso.ts             — isometric helpers (unused, legacy)
GAME_STATS.md          — full game statistics reference
```

## Never Do
- **Never commit or push unless explicitly asked**
- **Never use `write` tool on BuildingModel3D.tsx** — always use `edit` for targeted changes. The file is too large and `write` replaces the entire file, losing all other models.
- **Update GAME_STATS.md** when any game stat changes

## Grid & Terrain
- **9×9** square grid (81 tiles), `SPACING = 2.6`, `TILE_SIZE = 1.6`
- `tileToWorld(col, row) = (col * SPACING, 0, row * SPACING)`
- **1 mountain** (3×3 block, $400K), **2 lakes** (2×2 blocks, $30K), **4 forests** (pairs, $2K)
- Each terrain block has a unique `blockId` — adjacent same-type blocks stay separate
- Clearing any tile in a block clears the entire block (flood-fill in clearTerrain)
- Mountains/lakes cannot spawn on outer edge tiles (row/col 0 or 8)
- Forest can spawn anywhere
- Terrain rendered as `TerrainBlock` (single merged entity per block), not per-tile
- Variable names: `gridSize = 9`, `gridCenter = (gridSize-1)*SPACING/2 = 10.4`, `gridExtent = gridCenter + SPACING/2 = 11.7`

## Building Conventions
- **27 total buildings**: 6 starter + 21 unlockable (tied to events)
- **Each building has at most 4 non-zero stat types** (displayed as pills in sidebar)
- **All buildings must be 4-sided decorated** — crops, windows, glass panels, etc. on all 4 faces. Simple buildings (House, Shop) can have 1-sided detail.
- **Costs scale exponentially with event tier**: Starter ~$20-60, early ~$70-700, mid ~$300-800, late ~$550-12,000
- **More expensive = better absolute stats** (higher cost must have higher total benefit)
- Placeholder tiles only show for affordable coastal buildings on valid tiles
- Buildings take 2 days to construct; positive-pollution buildings apply pollution immediately (before construction completes)
- Air Quality tabs show 🌿 with +N (clean) or -N (dirty) — inverted from raw pollution values

## Events System
- **10 events**, no prerequisites — can be organized in any order
- **≤4 multiplier effects per event** (except event 10 which can have more)
- Happiness multiplier removed from all events (happiness is punishment-only, not buffed)
- **Event requirements**: 3 each of happiness (50%/65%/80%), renewable (5%/20%/40%), resilience (8%/25%/35%)
- Event multipliers stack multiplicatively
- Event completion shows full-screen popup with unique CSS illustration
- Events sidebar shows **Requirements** and **Boosts** sections, one-per-line with emojis
- Completed events show "✓ Completed" + "🔍 View" button to reopen popup

## Meter Formulas
- **Money**: `money += floor(sum income × incomeMultiplier)`. Starting: $300
- **Population**: decline = `-round(pop × 0.2)` when no housing (was -5)
- **Happiness**: `40 + sum(happinessBoost) - penalty`. Pollution penalty only when pollution > 50: `-(pollution - 50) × 1.0`. **Not affected by event multipliers.**
- **Renewable**: `min(100, sum(renewableBoost) × multiplier)`. Cumulative multiplier ~5×. No energy ratio formula.
- **Resilience**: `min(100, sum(resilienceBoost) × multiplier)`. Cumulative multiplier ~9×. Decays -1 every 3 days.
- **Pollution**: `round(rawPollution × pollutionMultiplier)`, clamped 0-100. Cumulative multiplier after all events: 0.04

## Day Progress & Timers
- Game loop uses **rAF accumulator** (not setInterval) — `accRef += dt * gameSpeed`, ticks fire when accumulator passes threshold
- **Day progress bar**: continuous green bar under "Day N" in StatusBar, receives `dayProgress` prop from App
- **Warning countdown bars**: simple width-based with CSS transition (no per-bar rAF loops — causes lag)
- Speed changes don't reset day progress — accumulator is continuous

## Disaster Animations
- Use `src/components/DisasterEffects3D.tsx` — rendered inside the Canvas after GridContent
- **Tsunami**: shrinking square frame (4 walls), starts outside, moves inward during last warning day. Height/alpha decrease as it enters land. Recovery: holds position, fades.
- **Earthquake**: building wobble + tumble (handled in BuildingOnTile via useFrame + wobbleGroupRef)
- **Smog**: 1200 particles with bufferGeometry, drifting upward. Warning phase very subtle (5% opacity target).
- **Drought**: hexagonal crack web on green land (y=-0.03), land tint yellow (only active phase), lakes shrink (in TerrainBlock)
- All effects read store via `useFrame` + `useGameStore.getState()` — no React re-renders for animation
- Direct mesh ref mutation in useFrame for tsunami position/opacity

## Minigame
- **4 questions** (2 disaster-specific + 2 random)
- **3 screens**: Intro (teacher explains) → Quiz (4 Qs) → Results (score + damage reduction)
- Damage reduction: `pct = 1 − M × 0.175`, M=0-4, max 70% at M=4
- Stats box shows preparedness results during warning, damage report during active

## Dev Options
- Combined **👁 Reveal All** button — single flag `devRevealAll` controls:
  - Buildings tab: shows locked buildings with 🔒 prefix
  - Events tab: shows 🔍 Preview on all events
  - Goals tab: shows all 20 goals
- Disaster level slider: controls level for dev-triggered disasters
- Dev disasters tagged `isDev: true` — don't update disasterLevels tracking
- ⚡ Instant Complete: finishes construction + terrain clearing + event timers in one click

## File Size & Performance Notes
- `BuildingModel3D.tsx` is ~1500 lines — always use `edit`, never `write`
- `gameStore.ts` is ~900 lines with all game logic
- Only 1 rAF loop per app (in App.tsx) — drives tick timing + day progress
- Warning bars use CSS transitions, not rAF (multiple rAF loops cause lag)
- Disaster effects use direct ref mutation in useFrame, not React state
- All terrain/block rendering uses memo + useMemo

## Win/Lose
- **Win**: $10M, 5M pop, 95% happiness, ≤5% pollution, 95% renewable, 95% resilience
- **Lose**: 5-day countdown warnings (money < $200, pop < 50, pollution > 80%, happiness < 20%)
- Lose screen shows reason + actionable hint
