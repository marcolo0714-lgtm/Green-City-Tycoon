import type { Building } from '../types';

export const BUILDINGS: Building[] = [
  {
    id: 'house', name: 'House', shortName: 'House', emoji: '🏠', cost: 50, category: 'economic',
    income: 10, pollution: 2, happinessBoost: 5, resilienceBoost: 0, renewableBoost: 0, height: 1,
    shape: 'house',
  },
  {
    id: 'shop', name: 'Shop', shortName: 'Shop', emoji: '🏪', cost: 80, category: 'economic',
    income: 18, pollution: 4, happinessBoost: 3, resilienceBoost: 0, renewableBoost: 0, height: 1,
    shape: 'shop',
  },
  {
    id: 'office', name: 'Office Tower', shortName: 'Office', emoji: '🏢', cost: 120, category: 'economic',
    income: 30, pollution: 6, happinessBoost: 2, resilienceBoost: 0, renewableBoost: 0, height: 2,
    shape: 'tower',
  },
  {
    id: 'factory', name: 'Factory', shortName: 'Factory', emoji: '🏭', cost: 150, category: 'economic',
    income: 45, pollution: 12, happinessBoost: -5, resilienceBoost: 0, renewableBoost: 0, height: 1,
    shape: 'factory',
  },
  {
    id: 'park', name: 'Park', shortName: 'Park', emoji: '🌳', cost: 30, category: 'green',
    income: 0, pollution: -5, happinessBoost: 10, resilienceBoost: 0, renewableBoost: 0, height: 1,
    shape: 'park',
  },
  {
    id: 'green_roof', name: 'Green Roof', shortName: 'G. Roof', emoji: '🌿', cost: 40, category: 'green',
    income: 0, pollution: -3, happinessBoost: 6, resilienceBoost: 0, renewableBoost: 0, height: 1,
    shape: 'green_roof',
  },
  {
    id: 'vertical_farm', name: 'Vertical Farm', shortName: 'V. Farm', emoji: '🌾', cost: 80, category: 'green',
    income: 8, pollution: -2, happinessBoost: 8, resilienceBoost: 0, renewableBoost: 0, height: 2,
    shape: 'stepped',
  },
  {
    id: 'purifier', name: 'Water Purifier', shortName: 'Purifier', emoji: '💧', cost: 60, category: 'water',
    income: 0, pollution: -4, happinessBoost: 8, resilienceBoost: 0, renewableBoost: 0, height: 1,
    shape: 'cylinder',
  },
  {
    id: 'desalination', name: 'Desalination', shortName: 'Desal.', emoji: '🌊', cost: 110, category: 'water',
    income: 2, pollution: -7, happinessBoost: 10, resilienceBoost: 5, renewableBoost: 0, height: 2,
    shape: 'cylinder',
  },
  {
    id: 'solar', name: 'Solar Panel', shortName: 'Solar', emoji: '☀️', cost: 70, category: 'energy',
    income: 5, pollution: -3, happinessBoost: 4, resilienceBoost: 0, renewableBoost: 7, height: 1,
    shape: 'solar',
  },
  {
    id: 'wind_turbine', name: 'Wind Turbine', shortName: 'Turbine', emoji: '🌬️', cost: 90, category: 'energy',
    income: 7, pollution: -5, happinessBoost: 3, resilienceBoost: 0, renewableBoost: 10, height: 2,
    shape: 'turbine',
  },
  {
    id: 'wave_converter', name: 'Wave Converter', shortName: 'W. Conv.', emoji: '〰️', cost: 100, category: 'energy',
    income: 6, pollution: -4, happinessBoost: 2, resilienceBoost: 8, renewableBoost: 8, height: 1,
    shape: 'block',
  },
  {
    id: 'wave_absorber', name: 'Wave Absorber', shortName: 'Absorber', emoji: '🛡️', cost: 100, category: 'coastal',
    income: 0, pollution: 0, happinessBoost: 5, resilienceBoost: 20, renewableBoost: 0, height: 1,
    shape: 'sloped',
  },
  {
    id: 'seawall', name: 'Seawall', shortName: 'Seawall', emoji: '🧱', cost: 75, category: 'coastal',
    income: 0, pollution: 0, happinessBoost: 3, resilienceBoost: 15, renewableBoost: 0, height: 1,
    shape: 'wall',
  },
  {
    id: 'observatory', name: 'Observatory', shortName: 'Observ.', emoji: '🔭', cost: 100, category: 'science',
    income: 0, pollution: -2, happinessBoost: 6, resilienceBoost: 10, renewableBoost: 0, height: 2,
    shape: 'observatory',
  },
  {
    id: 'research_lab', name: 'Research Lab', shortName: 'R. Lab', emoji: '🔬', cost: 130, category: 'science',
    income: 4, pollution: -6, happinessBoost: 4, resilienceBoost: 12, renewableBoost: 5, height: 2,
    shape: 'dome',
  },
  {
    id: 'recycling', name: 'Recycling Center', shortName: 'Recycle', emoji: '♻️', cost: 85, category: 'waste',
    income: 6, pollution: -7, happinessBoost: 3, resilienceBoost: 0, renewableBoost: 0, height: 1,
    shape: 'chimney',
  },
  {
    id: 'composting', name: 'Composting Hub', shortName: 'Compost', emoji: '🪱', cost: 60, category: 'waste',
    income: 2, pollution: -4, happinessBoost: 2, resilienceBoost: 0, renewableBoost: 0, height: 1,
    shape: 'block',
  },
  {
    id: 'bike_lane', name: 'Bike Lane', shortName: 'Bike', emoji: '🚲', cost: 45, category: 'transport',
    income: 0, pollution: -3, happinessBoost: 5, resilienceBoost: 0, renewableBoost: 2, height: 1,
    shape: 'flat',
  },
  {
    id: 'transit_hub', name: 'Transit Hub', shortName: 'Transit', emoji: '🚇', cost: 95, category: 'transport',
    income: 10, pollution: -5, happinessBoost: 4, resilienceBoost: 0, renewableBoost: 3, height: 2,
    shape: 'dome',
  },
];

export const CATEGORY_COLORS: Record<string, string> = {
  economic: '#f59e0b',
  water: '#3b82f6',
  energy: '#06b6d4',
  coastal: '#0ea5e9',
  green: '#22c55e',
  science: '#8b5cf6',
  waste: '#78716c',
  transport: '#ef4444',
};

export const CATEGORY_LABELS: Record<string, string> = {
  economic: 'Economic',
  water: 'Water',
  energy: 'Energy',
  coastal: 'Coastal',
  green: 'Green',
  science: 'Science',
  waste: 'Waste',
  transport: 'Transport',
};
