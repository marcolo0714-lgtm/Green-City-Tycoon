export type Category = 'economic' | 'water' | 'energy' | 'coastal' | 'green' | 'science' | 'waste';

export type Shape = 'house' | 'shop' | 'tower' | 'factory' | 'park' | 'green_roof' | 'stepped'
  | 'cylinder' | 'turbine' | 'solar' | 'block' | 'wall' | 'sloped' | 'observatory'
  | 'dome' | 'chimney' | 'flat'
  | 'solar_farm' | 'station' | 'forest_tower' | 'water_plant'
  | 'lab_complex' | 'grid_center' | 'trade_center' | 'peace_garden'
  | 'charging_station' | 'geothermal' | 'lab'
  | 'rainwater' | 'aquifer' | 'wetland';

export interface Building {
  id: string; name: string; shortName: string; emoji: string;
  cost: number; category: Category; description?: string;
  income: number; pollution: number; happinessBoost: number;
  resilienceBoost: number; renewableBoost: number;
  height: number; shape: Shape;
  coastalOnly?: boolean;
  unlockEvent?: string;
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
export interface TerrainTile { type: TerrainType; clearing: number; blockId: number; }

export type DisasterType = 'tsunami' | 'earthquake' | 'drought' | 'smog';
export interface DisasterWarning { type: DisasterType; message: string; daysLeft: number; isDev?: boolean; devLevel?: number; maxDays: number; }

export interface Question {
  id: string;
  type: DisasterType | 'general';
  question: string;
  answers: string[];
  correctIndex: number;
  explanation: string;
}

export interface MinigameState {
  type: DisasterType;
  phase: 'intro' | 'quiz' | 'results';
  questions: { id: string; question: string; answers: string[]; correctIndex: number; explanation: string }[];
  currentIndex: number;
  score: number;
  answered: boolean;
  chosenIndex: number;
}

export interface EventConditions {
  population?: number;
  happiness?: number;
  pollution?: number;
  renewablePct?: number;
  resilience?: number;
  money?: number;
  requiredEvent?: string;
}

export interface EventEffects {
  incomeMultiplier?: number;
  happinessMultiplier?: number;
  resilienceMultiplier?: number;
  renewableMultiplier?: number;
  pollutionMultiplier?: number;
  popCapMultiplier?: number;
  popGrowthMultiplier?: number;
}

export interface GameEvent {
  id: string; name: string; emoji: string; color: string;
  cost: number; duration: number;
  description: string; popupDescription?: string;
  conditions: EventConditions;
  effects: EventEffects;
  unlocksBuildings: string[];
}

export interface EventPopupData {
  id: string; name: string; emoji: string; color: string;
  description: string; effects: string[];
}

export interface ActiveBuffs {
  incomeMultiplier: number;
  happinessMultiplier: number;
  resilienceMultiplier: number;
  renewableMultiplier: number;
  pollutionMultiplier: number;
  popCapMultiplier: number;
  popGrowthMultiplier: number;
}

export const DEFAULT_BUFFS: ActiveBuffs = {
  incomeMultiplier: 1,
  happinessMultiplier: 1,
  resilienceMultiplier: 1,
  renewableMultiplier: 1,
  pollutionMultiplier: 1,
  popCapMultiplier: 1,
  popGrowthMultiplier: 1,
};

export type MeterDeltas = {
  money?: number; population?: number; pollution?: number;
  happiness?: number; renewablePct?: number; resilience?: number;
};

export interface GameState extends GameMeters {
  grid: Grid; gridSize: number;
  selectedBuilding: Building | null;
  tickCount: number; gameSpeed: GameSpeed;
  warnings: Warning[];   gameResult: GameResult;
  tutorialComplete: boolean;
  hasWon: boolean;
  tutorialReplay: boolean;
  tutorialStep: number;
  constructionMap: Record<string, number>;
  pendingRemoval: { row: number; col: number; name: string; emoji: string; refund: number } | null;
  terrainMap: Record<string, TerrainTile>;
  terrainClearing: Record<string, number>;
  disasterWarning: DisasterWarning | null;
  disasterActive: { type: DisasterType; daysLeft: number } | null;
  disasterLevels: Record<DisasterType, number>;
  disasterMinigame: MinigameState | null;
  minigameScore: number;
  minigamePlayed: boolean;
  minigameStats: { score: number; pct: number } | null;
  damageReport: { destroyed: number; money: number; population: number; happiness: number; resilience: number; pollution: number } | null;
  resilienceDecay: number;
  pollutionStreak: number;
  overcrowdStreak: number;
  meterOffsets: { pollution: number; happiness: number; renewablePct: number; resilience: number };
  meterDeltas: MeterDeltas; justCompleted: string[];
  destroyedTiles: string[];
  completedObjectives: string[];
  seenAdvisories: { id: string; message: string }[];
  repeatableAdvisories: { id: string; message: string }[];
  eventsOrganized: string[];
  eventTimers: Record<string, number>;
  activeBuffs: ActiveBuffs;
  devDisasterLevel: number;
  devRevealAll: boolean;
  eventPopups: EventPopupData[];
  seenAdjacencyPairs: string[];
  prePopupSpeed: GameSpeed;
  selectBuilding: (building: Building | null) => void;
  placeBuilding: (row: number, col: number) => void;
  removeBuilding: (row: number, col: number) => void;
  clearTerrain: (row: number, col: number) => void;
  organizeEvent: (eventId: string) => void;
  tick: () => void; setGameSpeed: (speed: GameSpeed) => void;
  dismissWarning: (type: Warning['type']) => void;
  completeTutorial: () => void;   restartTutorial: () => void;
  setTutorialStep: (step: number) => void;
  resetGame: () => void; continueGame: () => void;
  clearMeterDeltas: () => void; clearJustCompleted: () => void;
  toggleDevGrid: () => void;
  cancelDisaster: () => void;
  startDisaster: (type: DisasterType) => void;
  instantComplete: () => void;
  setDevDisasterLevel: (level: number) => void;
  toggleDevReveal: () => void;
  dismissEventPopup: () => void;
  showEventPopup: (eventId: string) => void;
  adjustMeter: (meter: keyof GameMeters, amount: number) => void;
  confirmRemoval: () => void;
  cancelRemoval: () => void;
  startMinigame: () => void;
  answerMinigame: (index: number) => void;
  closeMinigame: () => void;
  nextMinigamePhase: () => void;
}
