export type Category = 'economic' | 'water' | 'energy' | 'coastal' | 'green' | 'science' | 'waste' | 'transport';

export type Shape = 'house' | 'shop' | 'tower' | 'factory' | 'park' | 'green_roof' | 'stepped'
  | 'cylinder' | 'turbine' | 'solar' | 'block' | 'wall' | 'sloped' | 'observatory'
  | 'dome' | 'chimney' | 'flat';

export interface Building {
  id: string; name: string; shortName: string; emoji: string;
  cost: number; category: Category; description?: string;
  income: number; pollution: number; happinessBoost: number;
  resilienceBoost: number; renewableBoost: number;
  height: number; shape: Shape;
  coastalOnly?: boolean;
}

export type GridCell = Building | null;
export type Grid = GridCell[][];

export interface GameMeters {
  money: number; population: number; pollution: number;
  happiness: number; renewablePct: number; resilience: number;
}

export type GameSpeed = 0 | 1 | 2;

export interface Warning {
  type: 'money' | 'population' | 'pollution' | 'happiness';
  message: string; countdown: number;
}

export type GameResult = 'win' | 'lose' | null;

export type TerrainType = 'mountain' | 'lake' | 'forest';
export interface TerrainTile { type: TerrainType; clearing: number; }

export type DisasterType = 'tsunami' | 'earthquake' | 'drought' | 'smog';
export interface DisasterWarning { type: DisasterType; message: string; daysLeft: number; }

export type MeterDeltas = {
  money?: number; population?: number; pollution?: number;
  happiness?: number; renewablePct?: number; resilience?: number;
};

export interface GameState extends GameMeters {
  grid: Grid; gridSize: number;
  selectedBuilding: Building | null;
  tickCount: number; gameSpeed: GameSpeed;
  warnings: Warning[]; gameResult: GameResult;
  tutorialComplete: boolean;
  constructionMap: Record<string, number>;
  terrainMap: Record<string, TerrainTile>;
  terrainClearing: Record<string, number>;
  disasterWarning: DisasterWarning | null;
  disasterActive: { type: DisasterType; daysLeft: number } | null;
  disasterLevels: Record<DisasterType, number>;
  resilienceDecay: number;
  meterDeltas: MeterDeltas; justCompleted: string[];
  destroyedTiles: string[];
  completedObjectives: string[];
  seenAdvisories: { id: string; message: string }[];
  repeatableAdvisories: { id: string; message: string }[];
  selectBuilding: (building: Building | null) => void;
  placeBuilding: (row: number, col: number) => void;
  removeBuilding: (row: number, col: number) => void;
  clearTerrain: (row: number, col: number) => void;
  tick: () => void; setGameSpeed: (speed: GameSpeed) => void;
  dismissWarning: (type: Warning['type']) => void;
  completeTutorial: () => void; restartTutorial: () => void;
  resetGame: () => void; continueGame: () => void;
  clearMeterDeltas: () => void; clearJustCompleted: () => void;
  toggleDevGrid: () => void;
  cancelDisaster: () => void;
  startDisaster: (type: DisasterType) => void;
  adjustMeter: (meter: keyof GameMeters, amount: number) => void;
}
