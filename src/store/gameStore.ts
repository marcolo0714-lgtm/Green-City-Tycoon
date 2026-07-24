import { create } from 'zustand';
import type { Building, GameMeters, GameState, Grid, Warning, TerrainType, TerrainTile, DisasterType } from '../types';
import { BUILDINGS } from '../data/buildings';

const GRID_SIZE = 8;
const STARTING_MONEY = 600;
const BUILD_TICKS = 2;
const TERRAIN_CLEAR_COST: Record<TerrainType, number> = { mountain: 8000, lake: 4000, forest: 2000 };
const TERRAIN_CLEAR_TIME: Record<TerrainType, number> = { mountain: 6, lake: 4, forest: 2 };

function createEmptyGrid(size: number): Grid {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

function countBuildings(grid: Grid, category: string): number {
  let count = 0;
  for (const row of grid) for (const cell of row) if (cell && cell.category === category) count++;
  return count;
}

function totalBuildings(grid: Grid): number {
  let count = 0;
  for (const row of grid) for (const cell of row) if (cell) count++;
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
  const used = new Set<string>();
  const types: TerrainType[] = ['mountain', 'mountain', 'lake', 'lake', 'forest', 'forest', 'forest', 'forest'];

  for (const type of shuffle(types)) {
    let placed = false;
    const isEdge = type === 'mountain' || type === 'lake';
    for (let attempt = 0; attempt < 200 && !placed; attempt++) {
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      if (isEdge && (r <= 0 || r >= GRID_SIZE - 1 || c <= 0 || c >= GRID_SIZE - 1)) continue;
      const dirs = [[0, 1], [1, 0]];
      for (const [dr, dc] of shuffle(dirs)) {
        const r2 = r + dr, c2 = c + dc;
        if (r2 < 0 || r2 >= GRID_SIZE || c2 < 0 || c2 >= GRID_SIZE) continue;
        if (isEdge && (r2 <= 0 || r2 >= GRID_SIZE - 1 || c2 <= 0 || c2 >= GRID_SIZE - 1)) continue;
        const k1 = `${r},${c}`, k2 = `${r2},${c2}`;
        if (used.has(k1) || used.has(k2)) continue;
        used.add(k1); used.add(k2);
        map[k1] = { type, clearing: 0 };
        map[k2] = { type, clearing: 0 };
        placed = true;
        break;
      }
    }
    if (!placed) break;
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

function gridWithoutConstruction(grid: Grid, constructionMap: Record<string, number>): Grid {
  return grid.map((row, ri) =>
    row.map((cell, ci) => cell && (constructionMap[`${ri},${ci}`] ?? 0) > 0 ? null : cell)
  );
}

function recalculateMeters(grid: Grid, currentMeters: GameMeters): GameMeters {
  const ecoCount = countBuildings(grid, 'economic');
  const greenCount = countBuildings(grid, 'green');
  const energyCount = countBuildings(grid, 'energy');
  const total = totalBuildings(grid);

  const rawPollution = sumBuildingStat(grid, 'pollution');
  const pollution = Math.max(0, Math.min(100, rawPollution));

  const happinessBase = 50;
  const happinessFromBuildings = sumBuildingStat(grid, 'happinessBoost');
  const happinessFromPollution = -pollution * 0.3;
  const happiness = Math.max(0, Math.min(100, happinessBase + happinessFromBuildings + happinessFromPollution));

  const renewable = total > 0 ? Math.min(100, (energyCount / total) * 60 + sumBuildingStat(grid, 'renewableBoost')) : 0;
  const resilience = Math.min(100, sumBuildingStat(grid, 'resilienceBoost'));

  const housingCapacity = ecoCount * 25 + greenCount * 5;
  const popChange = housingCapacity > 0
    ? currentMeters.happiness >= 30 ? (currentMeters.happiness / 100) * 2 : -0.5
    : -1;
  const rawPop = currentMeters.population + popChange;
  const newPopulation = housingCapacity > 0
    ? Math.min(housingCapacity, rawPop)
    : Math.max(0, rawPop);

  return {
    money: currentMeters.money + sumBuildingStat(grid, 'income'),
    population: Math.floor(newPopulation),
    pollution: Math.round(pollution),
    happiness: Math.round(happiness),
    renewablePct: Math.round(renewable),
    resilience: Math.round(resilience),
  };
}

function recalculateGrid(grid: Grid, currentMeters: GameMeters): GameMeters {
  return recalculateMeters(grid, currentMeters);
}

function checkWarnings(meters: GameMeters, existing: Warning[]): Warning[] {
  const next: Warning[] = [];
  const add = (type: Warning['type'], msg: string, thresh: boolean) => {
    const prev = existing.find(w => w.type === type);
    if (thresh) next.push({ type, message: msg, countdown: prev ? prev.countdown - 1 : 5 });
  };
  add('money', 'City is nearly bankrupt!', meters.money < 200);
  add('population', 'Citizens are leaving!', meters.population < 5);
  add('pollution', 'Pollution is choking the city!', meters.pollution > 80);
  add('happiness', 'Citizens are rioting!', meters.happiness < 20);
  return next;
}

function checkGameOver(warnings: Warning[]): 'lose' | null {
  for (const w of warnings) if (w.countdown <= 0) return 'lose';
  return null;
}

function checkWin(meters: GameMeters): boolean {
  return meters.money >= 100000 && meters.population >= 100 && meters.happiness >= 90
    && meters.resilience >= 90 && meters.renewablePct >= 80 && meters.pollution <= 10;
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
): { grid: Grid; meters: GameMeters; destroyed: string[] } {
  const grid = state.grid.map(r => [...r]);
  let m = { ...state.meters };
  const destroyed: string[] = [];
  const L = level;

  if (type === 'tsunami') {
    let destCount = 0;
    const range = L <= 2 ? 1 : L <= 4 ? 2 : 3;
    const costPer = 500 + (L - 1) * 250;
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
    m.resilience = Math.max(0, m.resilience - (25 + L * 5));
    m.happiness = Math.max(0, m.happiness - (8 + L));
  } else if (type === 'earthquake') {
    const maxDestroy = L + 1;
    const emergencyCount = countSpecific(grid, b => b.id === 'emergency_center');
    const parkCount = countSpecific(grid, b => b.shape === 'park');
    const resilienceBlock = Math.floor(m.resilience / 20);
    const blocked = emergencyCount + Math.floor(parkCount / 2) + resilienceBlock;
    const toDestroy = Math.max(1, maxDestroy - blocked);
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
    const costPer = 700 + (L - 1) * 300;
    m.money -= destCount * costPer;
    m.resilience = Math.max(0, m.resilience - (15 + L * 5));
    m.happiness = Math.max(0, m.happiness - (6 + L));
  } else if (type === 'drought') {
    const parkDefense = Math.min(countSpecific(grid, b => b.shape === 'park'), 5);
    const popLoss = Math.max(0, (3 + L * 2) - parkDefense);
    const happLoss = Math.max(0, (8 + L * 2) - parkDefense);
    const moneyLoss = 400 + (L - 1) * 300;
    m.population = Math.max(0, m.population - popLoss);
    m.happiness = Math.max(0, m.happiness - happLoss);
    m.money -= moneyLoss;
    if (L >= 5) m.happiness = Math.max(0, m.happiness - 5); // extra: halved growth simulated as extra unhappiness
  } else if (type === 'smog') {
    const cleanCount = countSpecific(grid, b => b.renewableBoost > 0 || b.pollution < -3);
    const polExtra = Math.max(0, (15 + L * 5) - cleanCount * 2);
    const popLoss = Math.max(0, (3 + L) - Math.floor(cleanCount / 2));
    const happLoss = Math.max(0, (3 + L) - Math.floor(cleanCount / 2));
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
  { id: 'money_1k', text: 'Reach $1,000', check: (s) => s.money >= 1000, requires: 'first_build' },
  { id: 'pop_20', text: 'Reach 20 population', check: (s) => s.population >= 20, requires: 'first_build' },
  { id: 'park_built', text: 'Build a Park or Green Roof', check: (s) => s.grid.some(r => r.some(c => c && (c.id === 'park' || c.id === 'green_roof'))), requires: 'pop_20' },
  { id: 'happiness_50', text: 'Reach 50% happiness', check: (s) => s.happiness >= 50, requires: 'park_built' },
  { id: 'renewable_built', text: 'Build a renewable energy building', check: (s) => s.grid.some(r => r.some(c => c && c.renewableBoost > 0)), requires: 'money_1k' },
  { id: 'money_50k', text: 'Reach $50,000', check: (s) => s.money >= 50000, requires: 'money_1k' },
  { id: 'renewable_80', text: 'Reach 80%+ renewable energy', check: (s) => s.renewablePct >= 80, requires: 'renewable_built' },
  { id: 'survive_disaster', text: 'Survive a natural disaster', check: (s) => Object.values(s.disasterLevels).some(l => l > 1), requires: 'money_1k' },
];

const ADVISORY_TRIGGERS: Array<{ id: string; check: (state: GameState, prev: GameMeters) => boolean; message: string }> = [
  { id: 'first_done', check: (s) => s.grid.some(r => r.some(c => c !== null)) && s.justCompleted.length > 0, message: 'Income is now active! Check your money meter.' },
  { id: 'terrain_info', check: (s) => Object.keys(s.terrainClearing).length > 0, message: 'Clearing terrain costs money and time. Buildings can be placed after clearing completes.' },
  { id: 'tsunami_hint', check: (s) => s.disasterLevels.tsunami > 1, message: '🌊 Tsunami hit! Build Seawalls (edge tiles) and Wave Absorbers to protect your coast.' },
  { id: 'quake_hint', check: (s) => s.disasterLevels.earthquake > 1, message: '🔥 Earthquake struck! Emergency Centers, Parks, and Resilience reduce building destruction.' },
  { id: 'drought_hint', check: (s) => s.disasterLevels.drought > 1, message: '☀️ Drought! Parks save population. Build more green spaces.' },
  { id: 'smog_hint', check: (s) => s.disasterLevels.smog > 1, message: '💨 Smog! Build clean energy (Solar, Wind) and Recycling Centers.' },
  { id: 'money_warn', check: (s) => s.warnings.some(w => w.type === 'money'), message: '⚠️ Money low! Build economic buildings (House, Shop) to earn income.' },
  { id: 'pop_warn', check: (s) => s.warnings.some(w => w.type === 'population'), message: '⚠️ Population dropping! Provide more housing — build Houses or Shops.' },
  { id: 'pollution_warn', check: (s) => s.warnings.some(w => w.type === 'pollution'), message: '⚠️ Pollution critical! Build Parks, Green Roofs, or Renewable energy.' },
  { id: 'happiness_warn', check: (s) => s.warnings.some(w => w.type === 'happiness'), message: '⚠️ Citizens unhappy! Add Parks, Green Roofs, and reduce pollution.' },
];

export const useGameStore = create<GameState>((set) => ({
  grid: createEmptyGrid(GRID_SIZE),
  gridSize: GRID_SIZE,
  money: STARTING_MONEY,
  population: 10, pollution: 0, happiness: 50, renewablePct: 0, resilience: 0,
  selectedBuilding: null, tickCount: 0, gameSpeed: 1,
  warnings: [], gameResult: null, tutorialComplete: false,
  constructionMap: {}, terrainMap: generateTerrain(), terrainClearing: {},
  disasterWarning: null, disasterActive: null,
  disasterLevels: { tsunami: 1, earthquake: 1, drought: 1, smog: 1 },
  meterDeltas: {}, justCompleted: [], destroyedTiles: [],
  completedObjectives: [], seenAdvisories: [] as { id: string; message: string }[],

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
    });
    return { grid: newGrid, constructionMap: newCMap, selectedBuilding: null, ...m };
  }),

  removeBuilding: (row, col) => set((state) => {
    if (state.grid[row][col] === null || state.gameResult) return state;
    const newGrid = state.grid.map((r, ri) => r.map((c, ci) => ri === row && ci === col ? null : c));
    const newCMap = { ...state.constructionMap }; delete newCMap[`${row},${col}`];
    const active = gridWithoutConstruction(newGrid, newCMap);
    return { grid: newGrid, constructionMap: newCMap, ...recalculateGrid(active, {
      money: state.money, population: state.population, pollution: state.pollution,
      happiness: state.happiness, renewablePct: state.renewablePct, resilience: state.resilience,
    }) };
  }),

  clearTerrain: (row, col) => set((state) => {
    const key = `${row},${col}`;
    const t = state.terrainMap[key];
    if (!t || state.gameResult) return state;
    if (state.terrainClearing[key] > 0) return state;
    const cost = TERRAIN_CLEAR_COST[t.type];
    if (state.money < cost) return state;
    return {
      money: state.money - cost,
      terrainClearing: { ...state.terrainClearing, [key]: TERRAIN_CLEAR_TIME[t.type] },
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

    // Disaster logic
    let disasterWarning = state.disasterWarning;
    let disasterActive = state.disasterActive;
    let disasterLevels = { ...state.disasterLevels };
    let gridAfterDisaster = state.grid.map(r => [...r]);
    let extraMeters: Partial<GameMeters> = {};
    let destroyedTiles: string[] = [];

    // Process active disaster
    if (disasterActive) {
      const remaining = disasterActive.daysLeft - 1;
      if (remaining <= 0) disasterActive = null;
      else disasterActive = { ...disasterActive, daysLeft: remaining };
    }

    // Generate or tick warning
    const scienceCount = countBuildings(gridAfterDisaster, 'science');
    const maxWarning = Math.min(2 + scienceCount, 5);

    if (!disasterWarning && !disasterActive && state.tickCount > 0 && Math.random() < 0.3) {
      const types: DisasterType[] = ['tsunami', 'earthquake', 'drought', 'smog'];
      const type = types[Math.floor(Math.random() * types.length)];
      const lvl = disasterLevels[type];
      disasterWarning = { type, message: `⚠️ Level ${lvl} ${DISASTER_MESSAGES[type]}`, daysLeft: maxWarning };
    } else if (disasterWarning) {
      const remaining = disasterWarning.daysLeft - 1;
      if (remaining <= 0) {
        const dw = disasterWarning!;
        const lvl = disasterLevels[dw.type];
        const result = applyDisaster({ grid: gridAfterDisaster, meters: state }, dw.type, lvl);
        gridAfterDisaster = result.grid;
        extraMeters = result.meters;
        destroyedTiles = result.destroyed;
        disasterLevels[dw.type] = Math.min(lvl + 1, 5);
        disasterWarning = null;
        disasterActive = { type: dw.type, daysLeft: 3 };
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
    });

    const warnings = checkWarnings(meters, state.warnings);
    const gameOver = checkGameOver(warnings);
    const won = gameOver ? false : checkWin(meters);

    // Check objectives
    const completedObjectives = [...state.completedObjectives];
    const postTickState = { ...state, ...meters, grid: gridAfterDisaster, terrainMap: newTM, disasterLevels, disasterWarning, warnings, justCompleted };
    for (const obj of OBJECTIVES) {
      if (completedObjectives.includes(obj.id)) continue;
      if (obj.requires && !completedObjectives.includes(obj.requires)) continue;
      if (obj.check(postTickState as GameState)) completedObjectives.push(obj.id);
    }

    // Check advisories (first time only)
    const seenAdvisories = state.seenAdvisories.map(a => ({...a}));
    for (const adv of ADVISORY_TRIGGERS) {
      if (seenAdvisories.some(a => a.id === adv.id)) continue;
      if (adv.check(postTickState as GameState, state)) seenAdvisories.push({ id: adv.id, message: adv.message });
    }

    return {
      ...meters, grid: gridAfterDisaster, terrainMap: newTM,
      terrainClearing: newTClear, tickCount: state.tickCount + 1,
      constructionMap: newCMap, warnings,
      disasterWarning, disasterActive,
      disasterLevels, destroyedTiles,
      completedObjectives, seenAdvisories,
      gameResult: gameOver || (won ? 'win' : null),
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

  setGameSpeed: (s) => set({ gameSpeed: s }),
  dismissWarning: (type) => set((s) => ({ warnings: s.warnings.filter(w => w.type !== type) })),
  clearMeterDeltas: () => set({ meterDeltas: {} }),
  clearJustCompleted: () => set({ justCompleted: [] }),

  completeTutorial: () => set({ tutorialComplete: true, gameSpeed: 1 }),
  restartTutorial: () => set({ tutorialComplete: false, gameSpeed: 0 }),
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
      const lvl = state.disasterLevels[type];
      return {
        disasterWarning: { type, message: `⚠️ Dev: Level ${lvl} ${type}`, daysLeft: 2 },
        disasterActive: null,
      };
    }),

  adjustMeter: (meter, amount) =>
    set((state) => {
      const current = state[meter] as number;
      const clamped = meter === 'money' ? Math.max(0, current + amount)
        : meter === 'population' ? Math.max(0, current + amount)
        : Math.max(0, Math.min(100, current + amount));
      return { [meter]: clamped } as Partial<GameState>;
    }),

  resetGame: () => set({
    grid: createEmptyGrid(GRID_SIZE), money: STARTING_MONEY,
    population: 10, pollution: 0, happiness: 50, renewablePct: 0, resilience: 0,
    selectedBuilding: null, tickCount: 0, gameSpeed: 0,
    warnings: [], gameResult: null, tutorialComplete: false,
    constructionMap: {}, terrainMap: generateTerrain(), terrainClearing: {},
    disasterWarning: null, disasterActive: null,
    disasterLevels: { tsunami: 1, earthquake: 1, drought: 1, smog: 1 },
    meterDeltas: {}, justCompleted: [], destroyedTiles: [],
  completedObjectives: [], seenAdvisories: [] as { id: string; message: string }[],
  }),

  continueGame: () => set({ gameResult: null, gameSpeed: 1 }),
}));
