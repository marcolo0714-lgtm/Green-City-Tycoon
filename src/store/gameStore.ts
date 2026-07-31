import { create } from 'zustand';
import type { Building, GameMeters, GameState, Grid, Warning, TerrainType, TerrainTile, DisasterType, MinigameState, ActiveBuffs } from '../types';
import { DEFAULT_BUFFS } from '../types';
import { BUILDINGS } from '../data/buildings';
import { EVENTS } from '../data/events';
import { QUESTIONS } from '../data/questions';

const GRID_SIZE = 9;
const STARTING_MONEY = 300;
const BUILD_TICKS = 2;
const TERRAIN_CLEAR_COST: Record<TerrainType, number> = { mountain: 400000, lake: 30000, forest: 2000 };
const TERRAIN_CLEAR_TIME: Record<TerrainType, number> = { mountain: 6, lake: 4, forest: 2 };

function createEmptyGrid(size: number): Grid {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

function countBuildings(grid: Grid, category: string): number {
  let count = 0;
  for (const row of grid) for (const cell of row) if (cell && cell.category === category) count++;
  return count;
}

function sumBuildingStat(grid: Grid, stat: keyof Building): number {
  let sum = 0;
  for (const row of grid) for (const cell of row) if (cell) sum += (cell[stat] as number) || 0;
  return sum;
}

function isOuter(row: number, col: number): boolean {
  return row === 0 || row === GRID_SIZE - 1 || col === 0 || col === GRID_SIZE - 1;
}

function generateTerrain(): Record<string, TerrainTile> {
  const map: Record<string, TerrainTile> = {};
  const occupied = new Set<string>(); // all tiles including border
  let blockId = 0;

  // 1 mountain: 3×3 block (9 tiles)
  {
    let placed = false;
    for (let attempt = 0; attempt < 200 && !placed; attempt++) {
      const tr = 1 + Math.floor(Math.random() * (GRID_SIZE - 1 - 3));
      const tc = 1 + Math.floor(Math.random() * (GRID_SIZE - 1 - 3));
      let ok = true;
      for (let dr = 0; dr < 3 && ok; dr++)
        for (let dc = 0; dc < 3 && ok; dc++) {
          const r = tr + dr, c = tc + dc;
          if (r <= 0 || r >= GRID_SIZE - 1 || c <= 0 || c >= GRID_SIZE - 1) ok = false;
          if (occupied.has(`${r},${c}`)) ok = false;
        }
      if (!ok) continue;
      for (let dr = 0; dr < 3; dr++)
        for (let dc = 0; dc < 3; dc++) {
          const key = `${tr + dr},${tc + dc}`;
          occupied.add(key);
          map[key] = { type: 'mountain', clearing: 0, blockId };
        }
      placed = true;
    }
    if (placed) blockId++;
  }

  // 2 lakes: 2×2 blocks (each block = 4 tiles)
  for (let l = 0; l < 2; l++) {
    let placed = false;
    for (let attempt = 0; attempt < 200 && !placed; attempt++) {
      const tr = 1 + Math.floor(Math.random() * (GRID_SIZE - 1 - 2));
      const tc = 1 + Math.floor(Math.random() * (GRID_SIZE - 1 - 2));
      let ok = true;
      for (let dr = 0; dr < 2 && ok; dr++)
        for (let dc = 0; dc < 2 && ok; dc++) {
          const r = tr + dr, c = tc + dc;
          if (r <= 0 || r >= GRID_SIZE - 1 || c <= 0 || c >= GRID_SIZE - 1) ok = false;
          if (occupied.has(`${r},${c}`)) ok = false;
        }
      if (!ok) continue;
      for (let dr = 0; dr < 2; dr++)
        for (let dc = 0; dc < 2; dc++) {
          const key = `${tr + dr},${tc + dc}`;
          occupied.add(key);
          map[key] = { type: 'lake', clearing: 0, blockId };
        }
      placed = true;
    }
    if (placed) blockId++;
  }

  // 4 forests: pairs (each pair = 2 tiles)
  for (let f = 0; f < 4; f++) {
    let placed = false;
    for (let attempt = 0; attempt < 200 && !placed; attempt++) {
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      const dirs = [[0, 1], [1, 0]];
      for (const [dr, dc] of shuffle(dirs)) {
        const r2 = r + dr, c2 = c + dc;
        if (r2 < 0 || r2 >= GRID_SIZE || c2 < 0 || c2 >= GRID_SIZE) continue;
        const k1 = `${r},${c}`, k2 = `${r2},${c2}`;
        if (occupied.has(k1) || occupied.has(k2)) continue;
        occupied.add(k1); occupied.add(k2);
        map[k1] = { type: 'forest', clearing: 0, blockId };
        map[k2] = { type: 'forest', clearing: 0, blockId };
        placed = true;
        break;
      }
    }
    if (placed) blockId++;
  }

  return map;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function deriveDisasterLevel(eventsOrganized: number): number {
  if (eventsOrganized <= 1) return 1;
  if (eventsOrganized <= 3) return 2;
  if (eventsOrganized <= 5) return 3;
  if (eventsOrganized <= 7) return 4;
  return 5;
}

function gridWithoutConstruction(grid: Grid, constructionMap: Record<string, number>): Grid {
  return grid.map((row, ri) =>
    row.map((cell, ci) => cell && (constructionMap[`${ri},${ci}`] ?? 0) > 0 ? null : cell)
  );
}

function recalculateMeters(grid: Grid, currentMeters: GameMeters, buffs: ActiveBuffs = DEFAULT_BUFFS, fullGrid?: Grid): GameMeters {
  const ecoCount = countBuildings(grid, 'economic');
  const greenCount = countBuildings(grid, 'green');

  let rawPollution = sumBuildingStat(grid, 'pollution');
  // Positive-pollution buildings apply immediately — include those still under construction
  if (fullGrid) {
    for (let ri = 0; ri < fullGrid.length; ri++) {
      for (let ci = 0; ci < fullGrid[ri].length; ci++) {
        const cell = fullGrid[ri][ci];
        if (cell && cell.pollution > 0 && !grid[ri][ci]) {
          rawPollution += cell.pollution;
        }
      }
    }
  }
  const scaledPollution = Math.round(rawPollution * buffs.pollutionMultiplier);
  const pollution = Math.max(0, Math.min(100, scaledPollution));

  const happinessBase = 40;
  const rawHappinessBoost = sumBuildingStat(grid, 'happinessBoost');
  const happinessFromPollution = pollution > 50 ? -(pollution - 50) * 1.0 : 0;
  const happiness = Math.max(0, Math.min(100, happinessBase + rawHappinessBoost + happinessFromPollution));

  const rawRenewable = sumBuildingStat(grid, 'renewableBoost');
  const scaledRenewable = Math.round(rawRenewable * buffs.renewableMultiplier);
  const renewable = Math.min(100, scaledRenewable);

  const rawResilience = sumBuildingStat(grid, 'resilienceBoost');
  const scaledResilience = Math.round(rawResilience * buffs.resilienceMultiplier);
  const resilience = Math.min(100, scaledResilience);

  const housingCapacity = Math.floor((ecoCount * 250 + greenCount * 50) * buffs.popCapMultiplier);
  const popChange = housingCapacity > 0
    ? Math.round(currentMeters.happiness >= 30 ? (currentMeters.happiness / 100) * 25 * buffs.popGrowthMultiplier : -5)
    : -Math.round(currentMeters.population * 0.2);
  const rawPop = currentMeters.population + popChange;
  const overcrowdCap = housingCapacity > 0 ? Math.floor(housingCapacity * 1.2) : 0;
  const newPopulation = housingCapacity > 0
    ? Math.min(overcrowdCap, rawPop)
    : Math.max(0, rawPop);

  return {
    money: currentMeters.money + Math.floor(sumBuildingStat(grid, 'income') * buffs.incomeMultiplier),
    population: Math.floor(newPopulation),
    pollution: Math.round(pollution),
    happiness: Math.round(happiness),
    renewablePct: Math.round(renewable),
    resilience: Math.round(resilience),
  };
}

function recalculateGrid(grid: Grid, currentMeters: GameMeters, buffs: ActiveBuffs = DEFAULT_BUFFS, fullGrid?: Grid): GameMeters {
  return recalculateMeters(grid, currentMeters, buffs, fullGrid);
}

function checkWarnings(meters: GameMeters, existing: Warning[]): Warning[] {
  const next: Warning[] = [];
  const add = (type: Warning['type'], msg: string, thresh: boolean) => {
    const prev = existing.find(w => w.type === type);
    if (thresh) next.push({ type, message: msg, countdown: prev ? prev.countdown - 1 : 5 });
  };
  add('money', 'City is nearly bankrupt!', meters.money < 200);
  add('population', 'Citizens are leaving!', meters.population < 50);
  add('pollution', 'Pollution is choking the city!', meters.pollution > 80);
  add('happiness', 'Citizens are rioting!', meters.happiness < 20);
  return next;
}

function checkGameOver(warnings: Warning[]): 'lose' | null {
  for (const w of warnings) if (w.countdown <= 0) return 'lose';
  return null;
}

function checkWin(meters: GameMeters): boolean {
  return meters.money >= 10000000 && meters.population >= 5000000 && meters.happiness >= 95
    && meters.resilience >= 95 && meters.renewablePct >= 95 && meters.pollution <= 5;
}

// ---- disaster logic ----
const DISASTER_MESSAGES: Record<DisasterType, string> = {
  tsunami: 'Tsunami',
  earthquake: 'Earthquake',
  drought: 'Drought',
  smog: 'Smog',
};

function countSpecific(grid: Grid, fn: (b: Building) => boolean): number {
  let count = 0;
  for (const row of grid) for (const cell of row) if (cell && fn(cell)) count++;
  return count;
}

function applyDisaster(
  state: { grid: Grid; meters: GameMeters },
  type: DisasterType,
  level: number,
  minigameScore: number,
): { grid: Grid; meters: GameMeters; destroyed: string[] } {
  const grid = state.grid.map(r => [...r]);
  let m = { ...state.meters };
  const destroyed: string[] = [];
  const L = level;
  const M = minigameScore;
  const pct = 1 - M * 0.175; // M=0 → 100%, M=4 → 30% damage

  const TSUNAMI_COST = [500, 3000, 15000, 60000, 200000];
  const EARTHQUAKE_COST = [300, 2000, 8000, 30000, 100000];
  const EARTHQUAKE_MAX = [4, 6, 9, 13, 20];
  const DROUGHT_MONEY = [500, 5000, 30000, 150000, 500000];
  const TSUNAMI_RES = [15, 30, 50, 75, 90];
  const TSUNAMI_HAP = [5, 10, 18, 30, 45];
  const EQ_RES = [10, 25, 45, 70, 90];
  const EQ_HAP = [4, 8, 15, 25, 40];
  const DROUGHT_POP = [5, 30, 200, 2000, 100000];
  const DROUGHT_HAP = [8, 15, 25, 40, 60];
  const SMOG_POL = [15, 30, 50, 75, 95];
  const SMOG_POP = [3, 10, 30, 100, 500];
  const SMOG_HAP = [3, 10, 20, 40, 60];

  if (type === 'tsunami') {
    let destCount = 0;
    const range = L <= 2 ? 1 : L <= 4 ? 2 : 3;
    const costPer = Math.max(0, Math.round(TSUNAMI_COST[L - 1] * pct));
    for (let ri = 0; ri < GRID_SIZE; ri++) {
      for (let ci = 0; ci < GRID_SIZE; ci++) {
        const dist = Math.min(ri, ci, GRID_SIZE - 1 - ri, GRID_SIZE - 1 - ci);
        if (dist < range && grid[ri][ci]) {
          let protected_ = false;
          if (L < 5) {
            for (let dr = -1; dr <= 1 && !protected_; dr++) {
              for (let dc = -1; dc <= 1 && !protected_; dc++) {
                const nr = ri + dr, nc = ci + dc;
                if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
                  const b = grid[nr][nc];
                  if (b && (b.id === 'seawall' || b.id === 'wave_absorber')) protected_ = true;
                }
              }
            }
          }
          if (!protected_) {
            destroyed.push(`${ri},${ci}`);
            grid[ri][ci] = null;
            destCount++;
          }
        }
      }
    }
    m.money -= destCount * costPer;
    m.resilience = Math.max(0, m.resilience - Math.round(TSUNAMI_RES[L - 1] * pct));
    m.happiness = Math.max(0, m.happiness - Math.round(TSUNAMI_HAP[L - 1] * pct));
  } else if (type === 'earthquake') {
    const maxDestroy = EARTHQUAKE_MAX[L - 1];
    const emergencyCount = countSpecific(grid, b => b.id === 'emergency_center');
    const parkCount = countSpecific(grid, b => b.shape === 'park');
    const resilienceBlock = Math.floor(m.resilience / 20);
    const blocked = emergencyCount + Math.floor(parkCount / 2) + resilienceBlock;
    const toDestroy = Math.max(1, maxDestroy - blocked - Math.floor(M / 2));
    let destCount = 0;
    const shuffled: Array<[number, number]> = [];
    for (let ri = 0; ri < GRID_SIZE; ri++) for (let ci = 0; ci < GRID_SIZE; ci++) if (grid[ri][ci]) shuffled.push([ri, ci]);
    for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
    for (const [ri, ci] of shuffled) {
      if (destCount >= toDestroy) break;
      destroyed.push(`${ri},${ci}`);
      grid[ri][ci] = null;
      destCount++;
    }
    const costPer = Math.max(0, Math.round(EARTHQUAKE_COST[L - 1] * pct));
    m.money -= destCount * costPer;
    m.resilience = Math.max(0, m.resilience - Math.round(EQ_RES[L - 1] * pct));
    m.happiness = Math.max(0, m.happiness - Math.round(EQ_HAP[L - 1] * pct));
  } else if (type === 'drought') {
    const parkDefense = Math.min(countSpecific(grid, b => b.shape === 'park'), 5);
    const popLoss = Math.max(0, Math.round(DROUGHT_POP[L - 1] * pct) - parkDefense);
    const happLoss = Math.max(0, Math.round(DROUGHT_HAP[L - 1] * pct) - parkDefense);
    const moneyLoss = Math.max(0, Math.round(DROUGHT_MONEY[L - 1] * pct));
    m.population = Math.max(0, m.population - popLoss);
    m.happiness = Math.max(0, m.happiness - happLoss);
    m.money -= moneyLoss;
    if (L >= 5) m.happiness = Math.max(0, m.happiness - Math.round(15 * pct));
  } else if (type === 'smog') {
    const cleanCount = countSpecific(grid, b => b.renewableBoost > 0 || b.pollution < -3);
    const polExtra = Math.max(0, Math.round(SMOG_POL[L - 1] * pct) - cleanCount * 2);
    const popLoss = Math.max(0, Math.round(SMOG_POP[L - 1] * pct) - Math.floor(cleanCount / 2));
    const happLoss = Math.max(0, Math.round(SMOG_HAP[L - 1] * pct) - Math.floor(cleanCount / 2));
    m.pollution = Math.min(100, m.pollution + polExtra);
    m.population = Math.max(0, m.population - popLoss);
    m.happiness = Math.max(0, m.happiness - happLoss);
  }
  return { grid, meters: m, destroyed };
}

// ---- objectives ----
interface Objective { id: string; text: string; check: (state: GameState) => boolean; requires?: string; }
const OBJECTIVES: Objective[] = [
  { id: 'first_build', text: 'Place your first building', check: (s) => s.grid.some(r => r.some(c => c !== null)) },
  { id: 'money_500', text: 'Earn $500', check: (s) => s.money >= 500, requires: 'first_build' },
  { id: 'pop_200', text: 'Reach 200 population', check: (s) => s.population >= 200, requires: 'first_build' },
  { id: 'park_built', text: 'Build a Park or Green Roof', check: (s) => s.grid.some(r => r.some(c => c && (c.id === 'park' || c.id === 'green_roof'))), requires: 'pop_200' },
  { id: 'first_event', text: 'Organize your first event', check: (s) => s.eventsOrganized.length >= 1, requires: 'money_500' },
  { id: 'money_5k', text: 'Save up $5,000', check: (s) => s.money >= 5000, requires: 'first_event' },
  { id: 'renewable_built', text: 'Build a renewable energy building', check: (s) => s.grid.some(r => r.some(c => c && c.renewableBoost > 0)), requires: 'first_event' },
  { id: 'happiness_60', text: 'Reach 60% happiness', check: (s) => s.happiness >= 60, requires: 'park_built' },
  { id: 'pop_5k', text: 'Reach 5,000 population', check: (s) => s.population >= 5000, requires: 'pop_200' },
  { id: 'survive_disaster', text: 'Survive a natural disaster', check: (s) => Object.values(s.disasterLevels).some(l => l >= 1), requires: 'money_500' },
  { id: 'money_50k', text: 'Amass $50,000', check: (s) => s.money >= 50000, requires: 'money_5k' },
  { id: 'terrain_cleared', text: 'Clear a terrain tile', check: (s) => Object.keys(s.terrainClearing).length === 0 && Object.keys(s.terrainMap).length < 16, requires: 'money_5k' },
  { id: 'event_5', text: 'Organize 5 events', check: (s) => s.eventsOrganized.length >= 5, requires: 'first_event' },
  { id: 'renewable_50', text: 'Reach 50% renewable energy', check: (s) => s.renewablePct >= 50, requires: 'renewable_built' },
  { id: 'money_500k', text: 'Grow treasury to $500,000', check: (s) => s.money >= 500000, requires: 'money_50k' },
  { id: 'pop_500k', text: 'Reach 500,000 population', check: (s) => s.population >= 500000, requires: 'pop_5k' },
  { id: 'resilience_50', text: 'Reach 50% resilience', check: (s) => s.resilience >= 50, requires: 'survive_disaster' },
  { id: 'event_10', text: 'Organize all 10 events', check: (s) => s.eventsOrganized.length >= 10, requires: 'event_5' },
  { id: 'renewable_95', text: 'Reach 95% renewable energy', check: (s) => s.renewablePct >= 95, requires: 'renewable_50' },
  { id: 'money_10M', text: 'Reach $10,000,000', check: (s) => s.money >= 10000000, requires: 'money_500k' },
];

const ADVISORY_TRIGGERS: Array<{ id: string; check: (state: GameState, prev: GameMeters) => boolean; message: string; canRepeat?: boolean }> = [
  { id: 'first_done', check: (s) => s.grid.some(r => r.some(c => c !== null)) && s.justCompleted.length > 0, message: 'Income is now active! Check your money meter.' },
  { id: 'tsunami_hint', check: (s) => s.disasterLevels.tsunami >= 1, message: '🌊 Tsunami hit! Build Seawalls (edge tiles) and Wave Absorbers to protect your coast.' },
  { id: 'quake_hint', check: (s) => s.disasterLevels.earthquake >= 1, message: '🔥 Earthquake struck! Emergency Centers, Parks, and Resilience reduce building destruction.' },
  { id: 'drought_hint', check: (s) => s.disasterLevels.drought >= 1, message: '☀️ Drought! Parks save population. Build more green spaces.' },
  { id: 'smog_hint', check: (s) => s.disasterLevels.smog >= 1, message: '💨 Smog! Build clean energy (Solar, Wind) and Recycling Centers.' },
  { id: 'money_warn', check: (s) => s.warnings.some(w => w.type === 'money'), message: '⚠️ Money low! Build economic buildings (House, Shop) to earn income.', canRepeat: true },
  { id: 'pop_warn', check: (s) => s.warnings.some(w => w.type === 'population'), message: '⚠️ Population dropping! Provide more housing — build Houses or Shops.', canRepeat: true },
  { id: 'pollution_warn', check: (s) => s.warnings.some(w => w.type === 'pollution'), message: '⚠️ Pollution critical! Build Parks, Green Roofs, or Renewable energy.', canRepeat: true },
  { id: 'happiness_warn', check: (s) => s.warnings.some(w => w.type === 'happiness'), message: '⚠️ Citizens unhappy! Add Parks, Green Roofs, and reduce pollution.', canRepeat: true },
  { id: 'overcrowding', check: (s) => { const ec = countBuildings(s.grid, 'economic'); const gc = countBuildings(s.grid, 'green'); const hc = Math.floor((ec * 250 + gc * 50) * s.activeBuffs.popCapMultiplier); return hc > 0 && s.population > hc; }, message: '🏘️ Overcrowding! Build more Houses or Shops to provide adequate housing.', canRepeat: true },
  { id: 'disaster_prepare', check: (s) => s.disasterWarning !== null, message: 'A disaster is coming! Tap 📚 Prepare to answer 4 questions and reduce the damage.' },
  { id: 'no_housing', check: (s) => { const ec = countBuildings(s.grid, 'economic'); const gc = countBuildings(s.grid, 'green'); const hc = Math.floor((ec * 250 + gc * 50) * s.activeBuffs.popCapMultiplier); return hc <= 0; }, message: '🏚️ No housing! Build Houses or Shops to provide homes for your citizens — without housing, population will rapidly decline.', canRepeat: true },
  { id: 'events_intro', check: (s) => s.money >= 500 && s.eventsOrganized.length === 0 && Object.keys(s.eventTimers).length === 0, message: '🎪 You can now organize events! Switch to the Events tab in the left sidebar to see available community events that permanently boost your meters.' },
];

function findTerrainBlock(tm: Record<string, TerrainTile>, r: number, c: number): string[] {
  const type = tm[`${r},${c}`]?.type;
  if (!type) return [];
  const keys: string[] = [];
  const visited = new Set<string>();
  const stack = [`${r},${c}`];
  while (stack.length > 0) {
    const key = stack.pop()!;
    if (visited.has(key)) continue;
    visited.add(key);
    if (tm[key]?.type === type) {
      keys.push(key);
      const [rr, cc] = key.split(',').map(Number);
      for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const nk = `${rr + dr},${cc + dc}`;
        if (!visited.has(nk)) stack.push(nk);
      }
    }
  }
  return keys;
}

export const useGameStore = create<GameState>((set) => ({
  grid: createEmptyGrid(GRID_SIZE),
  gridSize: GRID_SIZE,
  money: STARTING_MONEY,
      population: 100, pollution: 0, happiness: 40, renewablePct: 0, resilience: 0,
  selectedBuilding: null, tickCount: 0, gameSpeed: 1,
  warnings: [], gameResult: null, tutorialComplete: false, hasWon: false, tutorialReplay: false, tutorialStep: 0,
  constructionMap: {}, terrainMap: generateTerrain(), terrainClearing: {},
  pendingRemoval: null,
  disasterWarning: null, disasterActive: null,
    disasterLevels: { tsunami: 0, earthquake: 0, drought: 0, smog: 0 },
  disasterMinigame: null, minigameScore: 0, minigamePlayed: false,
  minigameStats: null, damageReport: null, resilienceDecay: 0,
  meterOffsets: { pollution: 0, happiness: 0, renewablePct: 0, resilience: 0 },
  meterDeltas: {}, justCompleted: [], destroyedTiles: [],
  completedObjectives: [], seenAdvisories: [] as { id: string; message: string }[], repeatableAdvisories: [],
  eventsOrganized: [], eventTimers: {},
  activeBuffs: { ...DEFAULT_BUFFS },
  devDisasterLevel: 1,
  devRevealAll: false,
  eventPopups: [] as import('../types').EventPopupData[],
  prePopupSpeed: 1,

  selectBuilding: (b) => set({ selectedBuilding: b }),

  placeBuilding: (row, col) => set((state) => {
    if (!state.selectedBuilding || state.gameResult) return state;
    if (state.grid[row][col] !== null) return state;
    if (state.terrainMap[`${row},${col}`]) return state;
    if (state.terrainClearing[`${row},${col}`] > 0) return state;
    if (state.money < state.selectedBuilding.cost) return state;
    if (state.selectedBuilding.coastalOnly && !isOuter(row, col)) return state;

    const b = state.selectedBuilding;
    const newGrid = state.grid.map((r, ri) => r.map((c, ci) => ri === row && ci === col ? b : c));
    const newCMap = { ...state.constructionMap, [`${row},${col}`]: BUILD_TICKS };
    const active = gridWithoutConstruction(newGrid, newCMap);
    const m = recalculateGrid(active, {
      money: state.money - b.cost, population: state.population,
      pollution: state.pollution, happiness: state.happiness,
      renewablePct: state.renewablePct, resilience: state.resilience,
    }, state.activeBuffs, newGrid);
    return { grid: newGrid, constructionMap: newCMap, ...m };
  }),

  removeBuilding: (row, col) => set((state) => {
    if (state.grid[row][col] === null || state.gameResult) return state;
    const building = state.grid[row][col];
    const refund = Math.floor(building.cost * 0.2);
    const newGrid = state.grid.map((r, ri) => r.map((c, ci) => ri === row && ci === col ? null : c));
    const newCMap = { ...state.constructionMap }; delete newCMap[`${row},${col}`];
    const active = gridWithoutConstruction(newGrid, newCMap);
    const meters = recalculateMeters(active, {
      money: state.money, population: state.population, pollution: state.pollution,
      happiness: state.happiness, renewablePct: state.renewablePct, resilience: state.resilience,
    }, state.activeBuffs);
    return { grid: newGrid, constructionMap: newCMap,
      population: meters.population, pollution: meters.pollution,
      happiness: meters.happiness, renewablePct: meters.renewablePct, resilience: meters.resilience,
      money: state.money + refund,
    };
  }),

  clearTerrain: (row, col) => set((state) => {
    const key = `${row},${col}`;
    const t = state.terrainMap[key];
    if (!t || state.gameResult) return state;
    if (state.terrainClearing[key] > 0) return state;
    // Fire advisory on first terrain click regardless of affordability
    const seenAdvisories = state.seenAdvisories.some(a => a.id === 'terrain_info')
      ? state.seenAdvisories
      : [...state.seenAdvisories, { id: 'terrain_info', message: 'Terrain can be cleared to free up more buildable land.' }];
    const cost = TERRAIN_CLEAR_COST[t.type];
    if (state.money < cost) return { seenAdvisories };
    // Find and clear all tiles in this terrain block
    const blockKeys = findTerrainBlock(state.terrainMap, row, col);
    const newClearing = { ...state.terrainClearing };
    for (const bk of blockKeys) newClearing[bk] = TERRAIN_CLEAR_TIME[t.type];
    return {
      money: state.money - cost,
      terrainClearing: newClearing,
      seenAdvisories,
    };
  }),

  organizeEvent: (eventId) => set((state) => {
    if (state.gameResult) return state;
    const event = EVENTS.find(e => e.id === eventId);
    if (!event) return state;
    // Already organized or in progress
    if (state.eventsOrganized.includes(eventId)) return state;
    if (state.eventTimers[eventId] !== undefined) return state;
    // Can afford?
    if (state.money < event.cost) return state;
    // Check conditions
    const c = event.conditions;
    if (c.population !== undefined && state.population < c.population) return state;
    if (c.happiness !== undefined && state.happiness < c.happiness) return state;
    if (c.pollution !== undefined && state.pollution > c.pollution) return state;
    if (c.renewablePct !== undefined && state.renewablePct < c.renewablePct) return state;
    if (c.resilience !== undefined && state.resilience < c.resilience) return state;
    if (c.money !== undefined && state.money < c.money) return state;

    return {
      money: state.money - event.cost,
      eventTimers: { ...state.eventTimers, [eventId]: event.duration },
    };
  }),

  tick: () => set((state) => {
    if (state.gameResult) return state;

    // Decrement construction
    const justCompleted: string[] = [];
    const newCMap: Record<string, number> = {};
    for (const [k, v] of Object.entries(state.constructionMap)) {
      const r = v - 1; if (r === 0) justCompleted.push(k); else if (r > 0) newCMap[k] = r;
    }
    // Decrement terrain clearing
    const newTClear: Record<string, number> = {};
    for (const [k, v] of Object.entries(state.terrainClearing)) {
      const r = v - 1; if (r > 0) newTClear[k] = r;
    }

    // Process terrain clearing completions
    let newTM = state.terrainMap;
    for (const [k, v] of Object.entries(state.terrainClearing)) {
      if (v === 1) { const t2 = { ...newTM }; delete t2[k]; newTM = t2; }
    }

    // Process event timers
    let eventsOrganized = state.eventsOrganized;
    let activeBuffs = { ...state.activeBuffs };
    const newPopups: Array<{ id: string; name: string; emoji: string; color: string; description: string; effects: string[] }> = [];
    const newEventTimers: Record<string, number> = {};
    for (const [id, remaining] of Object.entries(state.eventTimers)) {
      if (remaining <= 1) {
        // Event completes
        eventsOrganized = [...eventsOrganized, id];
        const ev = EVENTS.find(e => e.id === id);
        if (ev) {
          // Stack multipliers
          if (ev.effects.incomeMultiplier) activeBuffs.incomeMultiplier *= ev.effects.incomeMultiplier;
          if (ev.effects.resilienceMultiplier) activeBuffs.resilienceMultiplier *= ev.effects.resilienceMultiplier;
          if (ev.effects.renewableMultiplier) activeBuffs.renewableMultiplier *= ev.effects.renewableMultiplier;
          if (ev.effects.pollutionMultiplier) activeBuffs.pollutionMultiplier *= ev.effects.pollutionMultiplier;
          if (ev.effects.popCapMultiplier) activeBuffs.popCapMultiplier *= ev.effects.popCapMultiplier;
          if (ev.effects.popGrowthMultiplier) activeBuffs.popGrowthMultiplier *= ev.effects.popGrowthMultiplier;
          // Build effects list for popup
          const effs: string[] = [];
          if (ev.effects.incomeMultiplier) effs.push(`💰 Income ×${ev.effects.incomeMultiplier}`);
          if (ev.effects.renewableMultiplier) effs.push(`⚡ Renewable ×${ev.effects.renewableMultiplier}`);
          if (ev.effects.popCapMultiplier) effs.push(`🏘️ Pop Cap ×${ev.effects.popCapMultiplier}`);
          if (ev.effects.popGrowthMultiplier) effs.push(`📈 Pop Growth ×${ev.effects.popGrowthMultiplier}`);
          if (ev.effects.pollutionMultiplier && ev.effects.pollutionMultiplier < 1) effs.push(`🌿 Pollution ×${ev.effects.pollutionMultiplier}`);
          newPopups.push({ id: ev.id, name: ev.name, emoji: ev.emoji, color: ev.color, description: ev.popupDescription || ev.description, effects: effs });
        }
      } else {
        newEventTimers[id] = remaining - 1;
      }
    }

    // Disaster logic
    let disasterWarning = state.disasterWarning;
    let disasterActive = state.disasterActive;
    let disasterLevels = { ...state.disasterLevels };
    const currentDisasterLevel = deriveDisasterLevel(eventsOrganized.length);
    let minigamePlayed = state.minigamePlayed;
    let minigameStats = state.minigameStats;
    let gridAfterDisaster = state.grid.map(r => [...r]);
    let extraMeters: Partial<GameMeters> = {};
    let destroyedTiles: string[] = [];
    let damageReport = state.damageReport;

    // Process active disaster
    if (disasterActive) {
      const remaining = disasterActive.daysLeft - 1;
      if (remaining <= 0) { disasterActive = null; damageReport = null; }
      else disasterActive = { ...disasterActive, daysLeft: remaining };
    }

    // Generate or tick warning
    const scienceCount = countBuildings(gridAfterDisaster, 'science');
    const maxWarning = Math.min(2 + scienceCount, 5);

    if (!disasterWarning && !disasterActive && state.tickCount > 0 && Math.random() < 0.3) {
      const types: DisasterType[] = ['tsunami', 'earthquake', 'drought', 'smog'];
      const type = types[Math.floor(Math.random() * types.length)];
      disasterWarning = { type, message: `⚠️ Level ${currentDisasterLevel} ${DISASTER_MESSAGES[type]}`, daysLeft: maxWarning };
      minigamePlayed = false;
      minigameStats = null;
    } else if (disasterWarning) {
      const remaining = disasterWarning.daysLeft - 1;
      if (remaining <= 0) {
        const dw = disasterWarning!;
        const lvl = dw.isDev && dw.devLevel ? dw.devLevel : currentDisasterLevel;
        const result = applyDisaster({ grid: gridAfterDisaster, meters: state }, dw.type, lvl, state.minigameScore);
        gridAfterDisaster = result.grid;
        extraMeters = result.meters;
        destroyedTiles = result.destroyed;
        if (!dw.isDev) disasterLevels[dw.type] = Math.max(disasterLevels[dw.type], currentDisasterLevel);
        disasterWarning = null;
        disasterActive = { type: dw.type, daysLeft: 3 };
        // Compute damage report
        damageReport = {
          destroyed: destroyedTiles.length,
          money: state.money - (extraMeters.money ?? state.money),
          population: state.population - (extraMeters.population ?? state.population),
          happiness: state.happiness - (extraMeters.happiness ?? state.happiness),
          resilience: state.resilience - (extraMeters.resilience ?? state.resilience),
          pollution: (extraMeters.pollution ?? state.pollution) - state.pollution,
        };
      } else {
        disasterWarning = { ...disasterWarning, daysLeft: remaining };
      }
    }

    const active = gridWithoutConstruction(gridAfterDisaster, newCMap);
    const meters = recalculateGrid(active, {
      money: (extraMeters.money ?? state.money),
      population: (extraMeters.population ?? state.population),
      pollution: (extraMeters.pollution ?? state.pollution),
      happiness: (extraMeters.happiness ?? state.happiness),
      renewablePct: (extraMeters.renewablePct ?? state.renewablePct),
      resilience: (extraMeters.resilience ?? state.resilience),
    }, activeBuffs, gridAfterDisaster);

    // Resilience decay: -1 every 3 days
    let resilienceDecay = (state.resilienceDecay ?? 0) + 1;
    if (resilienceDecay >= 3) {
      meters.resilience = Math.max(0, meters.resilience - 1);
      resilienceDecay = 0;
    }

    // Overcrowding happiness penalty: -2 per 10% over housing capacity
    const ecoC = countBuildings(active, 'economic');
    const greenC = countBuildings(active, 'green');
    const hCap = Math.floor((ecoC * 250 + greenC * 50) * activeBuffs.popCapMultiplier);
    if (hCap > 0 && meters.population > hCap) {
      const overPct = Math.floor((meters.population - hCap) / hCap * 10);
      meters.happiness = Math.max(0, meters.happiness - overPct * 2);
    }

    // Apply persistent manual meter offsets (for pollution, happiness, renewable, resilience)
    meters.pollution = Math.max(0, Math.min(100, meters.pollution + (state.meterOffsets?.pollution || 0)));
    meters.happiness = Math.max(0, Math.min(100, meters.happiness + (state.meterOffsets?.happiness || 0)));
    meters.renewablePct = Math.max(0, Math.min(100, meters.renewablePct + (state.meterOffsets?.renewablePct || 0)));
    meters.resilience = Math.max(0, Math.min(100, meters.resilience + (state.meterOffsets?.resilience || 0)));

    const warnings = checkWarnings(meters, state.warnings);
    const gameOver = checkGameOver(warnings);
    const won = gameOver ? false : state.hasWon ? false : checkWin(meters);

    // Check objectives
    const completedObjectives = [...state.completedObjectives];
    const postTickState = { ...state, ...meters, grid: gridAfterDisaster, terrainMap: newTM, disasterLevels, disasterWarning, warnings, justCompleted };
    for (const obj of OBJECTIVES) {
      if (completedObjectives.includes(obj.id)) continue;
      if (obj.requires && !completedObjectives.includes(obj.requires)) continue;
      if (obj.check(postTickState as GameState)) completedObjectives.push(obj.id);
    }

    // Check advisories (one-time: never repeat; repeatable: shows when condition is true)
    const seenAdvisories = state.seenAdvisories.map(a => ({...a}));
    const repeatableAdvisories: { id: string; message: string }[] = [];
    for (const adv of ADVISORY_TRIGGERS) {
      if (adv.canRepeat) {
        if (adv.check(postTickState as GameState, state)) repeatableAdvisories.push({ id: adv.id, message: adv.message });
      } else {
        if (!seenAdvisories.some(a => a.id === adv.id) && adv.check(postTickState as GameState, state))
          seenAdvisories.push({ id: adv.id, message: adv.message });
      }
    }

    // Pause if event popups are queued
    const popups = [...state.eventPopups, ...newPopups];
    let newGameSpeed = state.gameSpeed;
    let newPrePopupSpeed = state.prePopupSpeed;
    if (popups.length > 0) {
      if (state.gameSpeed > 0) {
        newPrePopupSpeed = state.gameSpeed;
        newGameSpeed = 0;
      }
    } else if (newGameSpeed === 0 && state.eventPopups.length > 0 && newPrePopupSpeed > 0) {
      // Just dismissed the last popup — restore speed
      newGameSpeed = newPrePopupSpeed;
    }

    return {
      ...meters, grid: gridAfterDisaster, terrainMap: newTM,
      terrainClearing: newTClear, tickCount: state.tickCount + 1,
      constructionMap: newCMap, warnings,
      disasterWarning, disasterActive,
      disasterLevels, destroyedTiles,
      damageReport, minigameStats,
      resilienceDecay, minigamePlayed,
      completedObjectives, seenAdvisories,
      repeatableAdvisories,
      eventsOrganized, eventTimers: newEventTimers, activeBuffs,
      eventPopups: popups, prePopupSpeed: newPrePopupSpeed,
      gameSpeed: newGameSpeed,
      gameResult: gameOver || (won ? 'win' : null),
      hasWon: state.hasWon || (won ? true : false),
      minigameScore: destroyedTiles.length > 0 ? 0 : state.minigameScore,
      meterDeltas: {
        money: meters.money - state.money,
        population: +(meters.population - state.population).toFixed(0),
        pollution: meters.pollution - state.pollution,
        happiness: meters.happiness - state.happiness,
        renewablePct: meters.renewablePct - state.renewablePct,
        resilience: meters.resilience - state.resilience,
      },
      justCompleted,
    };
  }),

  setGameSpeed: (s) => set(s > 0 ? { gameSpeed: s, prePopupSpeed: s } : { gameSpeed: s }),
  dismissWarning: (type) => set((s) => ({ warnings: s.warnings.filter(w => w.type !== type) })),
  clearMeterDeltas: () => set({ meterDeltas: {} }),
  clearJustCompleted: () => set({ justCompleted: [] }),

  completeTutorial: () => set({ tutorialComplete: true, gameSpeed: 1, tutorialReplay: false, tutorialStep: 0 }),
  restartTutorial: () => set({ tutorialComplete: false, gameSpeed: 0, tutorialReplay: true, tutorialStep: 0 }),
  setTutorialStep: (step: number) => set({ tutorialStep: step }),
  toggleDevGrid: () =>
    set((state) => {
      const hasB = state.grid.some(r => r.some(c => c !== null));
      if (hasB) return { grid: createEmptyGrid(GRID_SIZE), constructionMap: {} };
      const ng = createEmptyGrid(GRID_SIZE);
      let idx = 0;
      for (let ri = 0; ri < GRID_SIZE && idx < BUILDINGS.length; ri++) {
        const sc = ri % 2;
        for (let ci = sc; ci < GRID_SIZE && idx < BUILDINGS.length; ci += 2) {
          if (!state.terrainMap[`${ri},${ci}`]) { ng[ri][ci] = BUILDINGS[idx]; idx++; }
        }
      }
      return { grid: ng, constructionMap: {} };
    }),

  cancelDisaster: () => set({ disasterWarning: null, disasterActive: null }),

  startDisaster: (type) =>
    set((state) => {
      const lvl = state.devDisasterLevel;
      return {
        disasterWarning: { type, message: `⚠️ Dev: Level ${lvl} ${type}`, daysLeft: 2, isDev: true, devLevel: lvl },
        disasterActive: null,
      };
    }),

  setDevDisasterLevel: (level) => set({ devDisasterLevel: Math.max(1, Math.min(5, level)) }),

  toggleDevReveal: () => set((s) => ({ devRevealAll: !s.devRevealAll })),

  dismissEventPopup: () => set((s) => {
    const remaining = s.eventPopups.slice(1);
    return {
      eventPopups: remaining,
      gameSpeed: remaining.length === 0 ? s.prePopupSpeed : 0,
    };
  }),

  showEventPopup: (eventId) => set((s) => {
    const ev = EVENTS.find(e => e.id === eventId);
    if (!ev) return s;
    const effs: string[] = [];
    if (ev.effects.incomeMultiplier) effs.push(`💰 Income ×${ev.effects.incomeMultiplier}`);
    if (ev.effects.renewableMultiplier) effs.push(`⚡ Renewable ×${ev.effects.renewableMultiplier}`);
    if (ev.effects.popCapMultiplier) effs.push(`🏘️ Pop Cap ×${ev.effects.popCapMultiplier}`);
    if (ev.effects.popGrowthMultiplier) effs.push(`📈 Pop Growth ×${ev.effects.popGrowthMultiplier}`);
    if (ev.effects.pollutionMultiplier && ev.effects.pollutionMultiplier < 1) effs.push(`🌿 Pollution ×${ev.effects.pollutionMultiplier}`);
    return {
      eventPopups: [{ id: ev.id, name: ev.name, emoji: ev.emoji, color: ev.color, description: ev.popupDescription || ev.description, effects: effs }],
      prePopupSpeed: s.gameSpeed > 0 ? s.gameSpeed : s.prePopupSpeed,
      gameSpeed: 0,
    };
  }),

  adjustMeter: (meter, amount) =>
    set((state) => {
      const current = state[meter] as number;
      const clamped = Math.max(0, Math.min(meter === 'money' ? 99999999 : meter === 'population' ? 9999999 : 100, current + amount));
      // For formula-computed meters, store the offset so it persists across ticks
      if (meter === 'pollution' || meter === 'happiness' || meter === 'renewablePct' || meter === 'resilience') {
        const offsets = { ...state.meterOffsets, [meter]: (state.meterOffsets[meter] || 0) + amount };
        return { [meter]: clamped, meterOffsets: offsets } as Partial<GameState>;
      }
      return { [meter]: clamped } as Partial<GameState>;
    }),

  confirmRemoval: () =>
    set((state) => {
      const p = state.pendingRemoval;
      if (!p) return state;
      const building = state.grid[p.row][p.col];
      if (!building) return { pendingRemoval: null };
      const refund = Math.floor(building.cost * 0.2);
      const newGrid = state.grid.map((r, ri) => r.map((c, ci) => ri === p.row && ci === p.col ? null : c));
      const newCMap = { ...state.constructionMap }; delete newCMap[`${p.row},${p.col}`];
      const active = gridWithoutConstruction(newGrid, newCMap);
      // Recalculate non-money meters; money is just refund minus lost income
      const meters = recalculateMeters(active, {
        money: state.money, population: state.population, pollution: state.pollution,
        happiness: state.happiness, renewablePct: state.renewablePct, resilience: state.resilience,
      }, state.activeBuffs);
      return { grid: newGrid, constructionMap: newCMap, pendingRemoval: null,
        population: meters.population, pollution: meters.pollution,
        happiness: meters.happiness, renewablePct: meters.renewablePct, resilience: meters.resilience,
        money: state.money + refund,
      };
    }),

  cancelRemoval: () => set({ pendingRemoval: null }),

  instantComplete: () => set((state) => {
    if (state.gameResult) return state;
    // Clear in-progress terrain clearing — remove terrain from map
    let newTM = state.terrainMap;
    for (const [k, v] of Object.entries(state.terrainClearing)) {
      if (v > 0) { const t2 = { ...newTM }; delete t2[k]; newTM = t2; }
    }
    // Complete in-progress events
    let eventsOrganized = state.eventsOrganized;
    let activeBuffs = { ...state.activeBuffs };
    for (const id of Object.keys(state.eventTimers)) {
      eventsOrganized = [...eventsOrganized, id];
      const ev = EVENTS.find(e => e.id === id);
      if (ev) {
        if (ev.effects.incomeMultiplier) activeBuffs.incomeMultiplier *= ev.effects.incomeMultiplier;
        if (ev.effects.resilienceMultiplier) activeBuffs.resilienceMultiplier *= ev.effects.resilienceMultiplier;
        if (ev.effects.renewableMultiplier) activeBuffs.renewableMultiplier *= ev.effects.renewableMultiplier;
        if (ev.effects.pollutionMultiplier) activeBuffs.pollutionMultiplier *= ev.effects.pollutionMultiplier;
        if (ev.effects.popCapMultiplier) activeBuffs.popCapMultiplier *= ev.effects.popCapMultiplier;
        if (ev.effects.popGrowthMultiplier) activeBuffs.popGrowthMultiplier *= ev.effects.popGrowthMultiplier;
      }
    }
    // Clear construction and terrain timers
    const active = gridWithoutConstruction(state.grid, {});
    const meters = recalculateMeters(active, {
      money: state.money, population: state.population, pollution: state.pollution,
      happiness: state.happiness, renewablePct: state.renewablePct, resilience: state.resilience,
    }, activeBuffs);
    return { constructionMap: {}, terrainClearing: {}, terrainMap: newTM, eventTimers: {}, eventsOrganized, activeBuffs, ...meters };
  }),

  startMinigame: () => set((state) => {
    if (!state.disasterWarning || state.disasterMinigame) return state;
    const type = state.disasterWarning.type;
    // Pick 2 from disaster type + 2 random from all pools
    const typeQs = QUESTIONS.filter(q => q.type === type);
    const otherQs = QUESTIONS.filter(q => q.type !== type);
    const shuffled = [...typeQs].sort(() => Math.random() - 0.5);
    const shuffledOther = [...otherQs].sort(() => Math.random() - 0.5);
    const selected = [...shuffled.slice(0, 2), ...shuffledOther.slice(0, 2)]
      .sort(() => Math.random() - 0.5)
      .map(q => ({ id: q.id, question: q.question, answers: q.answers, correctIndex: q.correctIndex, explanation: q.explanation }));
    return {
      disasterMinigame: { type, phase: 'intro', questions: selected, currentIndex: 0, score: 0, answered: false, chosenIndex: -1 },
  minigameStats: null,
  damageReport: null,
      gameSpeed: 0, minigamePlayed: true,
    };
  }),

  nextMinigamePhase: () => set((state) => {
    if (!state.disasterMinigame) return state;
    const mg = { ...state.disasterMinigame };
    if (mg.phase === 'intro') {
      mg.phase = 'quiz';
    } else if (mg.phase === 'quiz') {
      mg.phase = 'results';
    }
    return { disasterMinigame: mg as MinigameState };
  }),

  answerMinigame: (answerIndex: number) => set((state) => {
    if (!state.disasterMinigame) return state;
    const mg = { ...state.disasterMinigame };
    const q = mg.questions[mg.currentIndex];
    if (!q || mg.answered) return state;
    mg.answered = true;
    mg.chosenIndex = answerIndex;
    if (answerIndex === q.correctIndex) mg.score++;
    return { disasterMinigame: mg as MinigameState };
  }),

  closeMinigame: () => set((state) => {
    if (!state.disasterMinigame) return state;
    const score = state.disasterMinigame.score;
    const pct = 1 - score * 0.175;
    return { disasterMinigame: null, minigameScore: score, minigameStats: { score, pct }, gameSpeed: 1 };
  }),

  resetGame: () => set({
    grid: createEmptyGrid(GRID_SIZE), money: STARTING_MONEY,
  population: 100, pollution: 0, happiness: 40, renewablePct: 0, resilience: 0,
    selectedBuilding: null, tickCount: 0, gameSpeed: 0,
  warnings: [], gameResult: null, tutorialComplete: false, hasWon: false, tutorialReplay: false, tutorialStep: 0,
  constructionMap: {}, terrainMap: generateTerrain(), terrainClearing: {},
  pendingRemoval: null,
    disasterWarning: null, disasterActive: null,
  disasterLevels: { tsunami: 0, earthquake: 0, drought: 0, smog: 0 },
  disasterMinigame: null, minigameScore: 0, minigamePlayed: false,
  minigameStats: null,
  damageReport: null,
    resilienceDecay: 0,
    meterOffsets: { pollution: 0, happiness: 0, renewablePct: 0, resilience: 0 },
    meterDeltas: {}, justCompleted: [], destroyedTiles: [],
  completedObjectives: [], seenAdvisories: [] as { id: string; message: string }[], repeatableAdvisories: [],
    eventsOrganized: [], eventTimers: {}, activeBuffs: { ...DEFAULT_BUFFS },
    devDisasterLevel: 1,
    devRevealAll: false,
    eventPopups: [] as import('../types').EventPopupData[],
    prePopupSpeed: 1,
  }),

  continueGame: () => set({ gameResult: null, gameSpeed: 1, hasWon: true }),
}));
