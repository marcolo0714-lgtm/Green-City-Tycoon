import { create } from 'zustand';
import type { Building, GameMeters, GameSpeed, GameState, Grid } from '../types';
import { BUILDINGS } from '../data/buildings';

const GRID_SIZE = 6;
const STARTING_MONEY = 600;

function createEmptyGrid(size: number): Grid {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

function createTestGrid(size: number): Grid {
  const grid = createEmptyGrid(size);
  const positions: Array<[number, number, string]> = [
    [0, 0, 'house'], [0, 2, 'shop'], [0, 4, 'office'],
    [1, 1, 'factory'], [1, 3, 'park'], [1, 5, 'green_roof'],
    [2, 0, 'vertical_farm'], [2, 2, 'purifier'], [2, 4, 'desalination'],
    [3, 1, 'solar'], [3, 3, 'wind_turbine'], [3, 5, 'wave_converter'],
    [4, 0, 'wave_absorber'], [4, 2, 'seawall'], [4, 4, 'observatory'],
    [5, 1, 'research_lab'], [5, 3, 'recycling'], [5, 5, 'composting'],
    [2, 5, 'bike_lane'], [0, 3, 'transit_hub'],
  ];
  for (const [r, c, id] of positions) {
    const b = BUILDINGS.find((x) => x.id === id);
    if (b) grid[r][c] = b;
  }
  return grid;
}

function countBuildings(grid: Grid, category: string): number {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell && cell.category === category) count++;
    }
  }
  return count;
}

function totalBuildings(grid: Grid): number {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell) count++;
    }
  }
  return count;
}

function sumBuildingStat(grid: Grid, stat: keyof Building): number {
  let sum = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell) sum += (cell[stat] as number) || 0;
    }
  }
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
  const growthRate = (happiness / 100) * 0.5;
  const popGrowth = housingCapacity > 0 ? growthRate : 0;
  const newPopulation = Math.min(housingCapacity, currentMeters.population + popGrowth);

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

export const useGameStore = create<GameState>((set) => ({
  grid: createTestGrid(GRID_SIZE),
  gridSize: GRID_SIZE,
  money: STARTING_MONEY,
  population: 0,
  pollution: 0,
  happiness: 50,
  renewablePct: 0,
  resilience: 0,
  selectedBuilding: null,
  tickCount: 0,
  gameSpeed: 1,

  selectBuilding: (building: Building | null) =>
    set({ selectedBuilding: building }),

  placeBuilding: (row: number, col: number) =>
    set((state) => {
      if (!state.selectedBuilding) return state;
      if (state.grid[row][col] !== null) return state;
      if (state.money < state.selectedBuilding.cost) return state;

      const building = state.selectedBuilding;
      const newGrid = state.grid.map((r, ri) =>
        r.map((cell, ci) =>
          ri === row && ci === col ? building : cell
        )
      );

      const meters = recalculateGrid(newGrid, {
        money: state.money - building.cost,
        population: state.population,
        pollution: state.pollution,
        happiness: state.happiness,
        renewablePct: state.renewablePct,
        resilience: state.resilience,
      });

      return {
        grid: newGrid,
        selectedBuilding: null,
        ...meters,
      };
    }),

  removeBuilding: (row: number, col: number) =>
    set((state) => {
      if (state.grid[row][col] === null) return state;

      const newGrid = state.grid.map((r, ri) =>
        r.map((cell, ci) => (ri === row && ci === col ? null : cell))
      );

      return {
        grid: newGrid,
        ...recalculateGrid(newGrid, {
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
      const meters = recalculateGrid(state.grid, {
        money: state.money,
        population: state.population,
        pollution: state.pollution,
        happiness: state.happiness,
        renewablePct: state.renewablePct,
        resilience: state.resilience,
      });

      return {
        ...meters,
        tickCount: state.tickCount + 1,
      };
    }),

  setGameSpeed: (speed: GameSpeed) => set({ gameSpeed: speed }),
}));
