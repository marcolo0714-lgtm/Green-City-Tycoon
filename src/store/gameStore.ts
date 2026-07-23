import { create } from 'zustand';
import type { Building, GameMeters, GameSpeed, GameState, Grid, Warning } from '../types';

const GRID_SIZE = 6;
const STARTING_MONEY = 500;
const BUILD_TICKS = 2;

function createEmptyGrid(size: number): Grid {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

function countBuildings(grid: Grid, category: string): number {
  let count = 0;
  for (const row of grid)
    for (const cell of row)
      if (cell && cell.category === category) count++;
  return count;
}

function totalBuildings(grid: Grid): number {
  let count = 0;
  for (const row of grid)
    for (const cell of row)
      if (cell) count++;
  return count;
}

function sumBuildingStat(grid: Grid, stat: keyof Building): number {
  let sum = 0;
  for (const row of grid)
    for (const cell of row)
      if (cell) sum += (cell[stat] as number) || 0;
  return sum;
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

  const renewable = total > 0
    ? Math.min(100, (energyCount / total) * 60 + sumBuildingStat(grid, 'renewableBoost'))
    : 0;

  const resilienceRaw = sumBuildingStat(grid, 'resilienceBoost');
  const resilience = Math.min(100, resilienceRaw);

  const housingCapacity = ecoCount * 25 + greenCount * 5;
  const popChange = housingCapacity > 0
    ? (happiness / 100) * 0.5
    : -1;
  const rawPop = currentMeters.population + popChange;
  const newPopulation = housingCapacity > 0
    ? Math.min(housingCapacity, rawPop)
    : Math.max(0, rawPop);

  const income = sumBuildingStat(grid, 'income');

  return {
    money: currentMeters.money + income,
    population: Math.floor(newPopulation * 10) / 10,
    pollution: Math.round(pollution),
    happiness: Math.round(happiness),
    renewablePct: Math.round(renewable),
    resilience: Math.round(resilience),
  };
}

function recalculateGrid(grid: Grid, currentMeters: GameMeters): GameMeters {
  return recalculateMeters(grid, currentMeters);
}

/** Filter out buildings still under construction from the grid before meter calc */
function gridWithoutConstruction(grid: Grid, constructionMap: Record<string, number>): Grid {
  return grid.map((row, ri) =>
    row.map((cell, ci) =>
      cell && (constructionMap[`${ri},${ci}`] ?? 0) > 0 ? null : cell
    )
  );
}

function checkWarnings(meters: GameMeters, existing: Warning[]): Warning[] {
  const next: Warning[] = [];

  const addWarning = (type: Warning['type'], message: string, threshold: boolean) => {
    const prev = existing.find(w => w.type === type);
    if (threshold) {
      next.push({ type, message, countdown: prev ? prev.countdown - 1 : 5 });
    }
  };

  addWarning('money', 'City is nearly bankrupt!', meters.money < 50);
  addWarning('population', 'Citizens are leaving!', meters.population < 5);
  addWarning('pollution', 'Pollution is choking the city!', meters.pollution > 80);
  addWarning('happiness', 'Citizens are rioting!', meters.happiness < 20);

  return next;
}

function checkGameOver(warnings: Warning[]): 'lose' | null {
  for (const w of warnings) {
    if (w.countdown <= 0) return 'lose';
  }
  return null;
}

function checkWin(meters: GameMeters): boolean {
  return (
    meters.money >= 2000 &&
    meters.population >= 100 &&
    meters.happiness >= 90 &&
    meters.resilience >= 90 &&
    meters.renewablePct >= 80 &&
    meters.pollution <= 10
  );
}

export const useGameStore = create<GameState>((set) => ({
  grid: createEmptyGrid(GRID_SIZE),
  gridSize: GRID_SIZE,
  money: STARTING_MONEY,
  population: 10,
  pollution: 0,
  happiness: 50,
  renewablePct: 0,
  resilience: 0,
  selectedBuilding: null,
  tickCount: 0,
  gameSpeed: 1,
  warnings: [],
  gameResult: null,
  tutorialComplete: false,
  constructionMap: {},

  selectBuilding: (building: Building | null) =>
    set({ selectedBuilding: building }),

  placeBuilding: (row: number, col: number) =>
    set((state) => {
      if (!state.selectedBuilding || state.gameResult) return state;
      if (state.grid[row][col] !== null) return state;
      if (state.money < state.selectedBuilding.cost) return state;

      const building = state.selectedBuilding;
      const newGrid = state.grid.map((r, ri) =>
        r.map((cell, ci) => (ri === row && ci === col ? building : cell))
      );

      const newConstructionMap = { ...state.constructionMap, [`${row},${col}`]: BUILD_TICKS };

      // Use filtered grid (no construction buildings count) for meters
      const activeGrid = gridWithoutConstruction(newGrid, newConstructionMap);
      const meters = recalculateGrid(activeGrid, {
        money: state.money - building.cost,
        population: state.population,
        pollution: state.pollution,
        happiness: state.happiness,
        renewablePct: state.renewablePct,
        resilience: state.resilience,
      });

      return {
        grid: newGrid,
        constructionMap: newConstructionMap,
        selectedBuilding: null,
        ...meters,
      };
    }),

  removeBuilding: (row: number, col: number) =>
    set((state) => {
      if (state.grid[row][col] === null || state.gameResult) return state;

      const newGrid = state.grid.map((r, ri) =>
        r.map((cell, ci) => (ri === row && ci === col ? null : cell))
      );

      const newConstructionMap = { ...state.constructionMap };
      delete newConstructionMap[`${row},${col}`];

      const activeGrid = gridWithoutConstruction(newGrid, newConstructionMap);
      return {
        grid: newGrid,
        constructionMap: newConstructionMap,
        ...recalculateGrid(activeGrid, {
          money: state.money,
          population: state.population,
          pollution: state.pollution,
          happiness: state.happiness,
          renewablePct: state.renewablePct,
          resilience: state.resilience,
        }),
      };
    }),

  tick: () =>
    set((state) => {
      if (state.gameResult) return state;

      // Decrement construction timers
      const newConstructionMap: Record<string, number> = {};
      for (const [key, val] of Object.entries(state.constructionMap)) {
        const remaining = val - 1;
        if (remaining > 0) newConstructionMap[key] = remaining;
      }

      const activeGrid = gridWithoutConstruction(state.grid, newConstructionMap);
      const meters = recalculateGrid(activeGrid, {
        money: state.money,
        population: state.population,
        pollution: state.pollution,
        happiness: state.happiness,
        renewablePct: state.renewablePct,
        resilience: state.resilience,
      });

      const warnings = checkWarnings(meters, state.warnings);
      const gameOver = checkGameOver(warnings);
      const won = gameOver ? false : checkWin(meters);

      return {
        ...meters,
        tickCount: state.tickCount + 1,
        constructionMap: newConstructionMap,
        warnings,
        gameResult: gameOver || (won ? 'win' : null),
      };
    }),

  setGameSpeed: (speed: GameSpeed) => set({ gameSpeed: speed }),

  dismissWarning: (type: Warning['type']) =>
    set((state) => ({
      warnings: state.warnings.filter(w => w.type !== type),
    })),

  completeTutorial: () => set({ tutorialComplete: true }),

  resetGame: () =>
    set({
      grid: createEmptyGrid(GRID_SIZE),
      money: STARTING_MONEY,
      population: 10,
      pollution: 0,
      happiness: 50,
      renewablePct: 0,
      resilience: 0,
      selectedBuilding: null,
      tickCount: 0,
      gameSpeed: 1,
      warnings: [],
      gameResult: null,
      constructionMap: {},
    }),
}));
