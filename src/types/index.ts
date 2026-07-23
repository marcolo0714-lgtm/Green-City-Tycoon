export type Category = 'economic' | 'water' | 'energy' | 'coastal' | 'green' | 'science' | 'waste' | 'transport';

export type Shape = 'house' | 'shop' | 'tower' | 'factory' | 'park' | 'green_roof' | 'stepped'
  | 'cylinder' | 'turbine' | 'solar' | 'block' | 'wall' | 'sloped' | 'observatory'
  | 'dome' | 'chimney' | 'flat';

export interface Building {
  id: string;
  name: string;
  shortName: string;
  emoji: string;
  cost: number;
  category: Category;
  income: number;
  pollution: number;
  happinessBoost: number;
  resilienceBoost: number;
  renewableBoost: number;
  height: number;
  shape: Shape;
}

export type GridCell = Building | null;
export type Grid = GridCell[][];

export interface GameMeters {
  money: number;
  population: number;
  pollution: number;
  happiness: number;
  renewablePct: number;
  resilience: number;
}

export type GameSpeed = 0 | 1 | 2;

export interface GameState extends GameMeters {
  grid: Grid;
  gridSize: number;
  selectedBuilding: Building | null;
  tickCount: number;
  gameSpeed: GameSpeed;
  selectBuilding: (building: Building | null) => void;
  placeBuilding: (row: number, col: number) => void;
  removeBuilding: (row: number, col: number) => void;
  tick: () => void;
  setGameSpeed: (speed: GameSpeed) => void;
}
