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
    App.tsx            — root (game loop, tick interval, reset handler)
    GameScene3D.tsx    — Three.js canvas, grid, terrain, roads, buildings, people
    BuildingModel3D.tsx — 21 building 3D shapes (Three.js geometries)
    BuildingMenu.tsx   — left sidebar building selector
    MeterPanel.tsx     — right meter bars with delta popups
    StatusBar.tsx      — top bar (day, speed, money, restart/tutorial btn)
    SpeedControl.tsx   — pause/1x/2x buttons
    NotificationOverlay.tsx — warnings, disaster alerts, win/lose screens
    TutorialOverlay.tsx — 6-step interactive tutorial
  store/
    gameStore.ts       — all game state + logic (Zustand)
  data/
    buildings.ts       — 21 building definitions
  types/
    index.ts           — TypeScript types
  util/
    iso.ts             — isometric helpers (now unused, legacy)
GAME_STATS.md          — full game statistics reference
```

## Key Conventions
- **Never commit or push unless explicitly asked**
- **Update GAME_STATS.md** when any game stat changes
- **1 tick = 1 day** (displayed as "Day N" in StatusBar)
- Grid is square (not isometric) — `tileToWorld(col, row) = (col * SPACING, 0, row * SPACING)`
- `SPACING = 2.6`, `TILE_SIZE = 1.6`
- Money model extends to $100,000 (not $2,000)
- Building incomes are ×3 from original values
- Buildings take 2 days to construct (constructionMap)
- Terrain clears in 2-6 days (terrainClearing)
- Disasters fire ~15% per day with 5-day warnings

## Current Grid
- 8×8 (64 tiles)
- 8 terrain pairs (2 mountain, 2 lake, 4 forest) = 16 tiles obstructed
- Mountains and lakes cannot spawn on edge tiles (row/col 0 or 7)

## Store Re-renders
- `tick()` runs the full game loop (meters, warnings, disasters, construction)
- Every building/terrain has construction/clearing timers
- `constructionMap`, `terrainMap`, `terrainClearing` are all plain objects keyed by `"row,col"`
- `meterDeltas` computed each tick for the MeterPanel delta popups
- `justCompleted` tracks newly finished buildings for the completion popup

## Three.js Notes
- Canvas uses `gl={{ localClippingEnabled: true }}` for construction clipping planes
- Terrain rendered as TerrainPair (not per-tile) — groups adjacent same-type tiles
- Road color changes to red (`#7f1d1d`) when both adjacent tiles have terrain
- Walking people pause when gameSpeed=0 and walk 2× faster at gameSpeed=2
- CSS `animation-play-state: paused` freezes popups when paused
