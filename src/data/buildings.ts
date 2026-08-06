import type { Building } from '../types';

export const BUILDINGS: Building[] = [
  // === STARTER (always available) ===
  { id: 'house', name: 'House', shortName: 'House', emoji: '🏠', cost: 20, category: 'economic',
    income: 10, pollution: 10, happinessBoost: 1, resilienceBoost: 0, renewableBoost: 0, height: 1, shape: 'house' },
  { id: 'shop', name: 'Shop', shortName: 'Shop', emoji: '🏪', cost: 45, category: 'economic',
    income: 22, pollution: 15, happinessBoost: 0, resilienceBoost: 0, renewableBoost: 0, height: 1, shape: 'shop' },
  { id: 'park', name: 'Park', shortName: 'Park', emoji: '🌳', cost: 18, category: 'green',
    income: 0, pollution: -4, happinessBoost: 3, resilienceBoost: 0, renewableBoost: 0, height: 1, shape: 'park' },
  { id: 'green_roof', name: 'Green Roof', shortName: 'G. Roof', emoji: '🌿', cost: 40, category: 'green',
    income: 0, pollution: -2, happinessBoost: 1, resilienceBoost: 3, renewableBoost: 0, height: 1, shape: 'green_roof' },
  { id: 'water_purifier', name: 'Water Purifier', shortName: 'Purifier', emoji: '💧', cost: 60, category: 'water',
    income: 0, pollution: -5, happinessBoost: 0, resilienceBoost: 2, renewableBoost: 0, height: 1, shape: 'cylinder' },
  { id: 'rainwater_harvester', name: 'Rainwater Harvester', shortName: 'Harvest', emoji: '🌧️', cost: 55, category: 'water',
    income: 6, pollution: -1, happinessBoost: 0, resilienceBoost: 1, renewableBoost: 0, height: 1, shape: 'rainwater' },

  // === EVENT 1: Community Green Day ===
  { id: 'solar', name: 'Solar Panel', shortName: 'Solar', emoji: '☀️', cost: 150, category: 'energy',
    income: 14, pollution: -3, happinessBoost: 0, resilienceBoost: 0, renewableBoost: 2, height: 1, shape: 'solar', unlockEvent: 'event_1' },

  // === EVENT 2: Clean Energy Kickstart ===
  { id: 'wind_turbine', name: 'Wind Turbine', shortName: 'Turbine', emoji: '🌬️', cost: 220, category: 'energy',
    income: 20, pollution: -4, happinessBoost: 0, resilienceBoost: 0, renewableBoost: 3, height: 2, shape: 'turbine', unlockEvent: 'event_2' },
  { id: 'recycling', name: 'Recycling Center', shortName: 'Recycle', emoji: '♻️', cost: 100, category: 'waste',
    income: 16, pollution: -6, happinessBoost: 0, resilienceBoost: 0, renewableBoost: 0, height: 1, shape: 'chimney', unlockEvent: 'event_2' },
  { id: 'composting', name: 'Composting Hub', shortName: 'Compost', emoji: '🪱', cost: 70, category: 'waste',
    income: 8, pollution: -3, happinessBoost: 0, resilienceBoost: 0, renewableBoost: 1, height: 1, shape: 'block', unlockEvent: 'event_2' },

  // === EVENT 3: Coastal Shield Program ===
  { id: 'seawall', name: 'Seawall', shortName: 'Seawall', emoji: '🧱', cost: 500, category: 'coastal',
    income: 0, pollution: 0, happinessBoost: 0, resilienceBoost: 12, renewableBoost: 0, height: 1, shape: 'wall', coastalOnly: true, unlockEvent: 'event_3' },
  { id: 'wave_absorber', name: 'Wave Absorber', shortName: 'Absorber', emoji: '🛡️', cost: 700, category: 'coastal',
    income: 0, pollution: 0, happinessBoost: 0, resilienceBoost: 18, renewableBoost: 0, height: 1, shape: 'sloped', coastalOnly: true, unlockEvent: 'event_3' },

  // === EVENT 4: Solar City Initiative ===
  { id: 'geothermal', name: 'Geothermal Plant', shortName: 'Geotherm', emoji: '🌋', cost: 450, category: 'energy',
    income: 26, pollution: -5, happinessBoost: 0, resilienceBoost: 2, renewableBoost: 4, height: 1, shape: 'geothermal', unlockEvent: 'event_4' },
  { id: 'office', name: 'Office Tower', shortName: 'Office', emoji: '🏢', cost: 350, category: 'economic',
    income: 35, pollution: 5, happinessBoost: 0, resilienceBoost: 0, renewableBoost: 0, height: 2, shape: 'tower', unlockEvent: 'event_4' },

  // === EVENT 5: Water Security Initiative ===
  { id: 'aquifer_recharge', name: 'Aquifer Recharge', shortName: 'Aquifer', emoji: '⛲', cost: 320, category: 'water',
    income: 10, pollution: -3, happinessBoost: 0, resilienceBoost: 3, renewableBoost: 0, height: 1, shape: 'aquifer', unlockEvent: 'event_5' },
  { id: 'wetland_restoration', name: 'Wetland Restoration', shortName: 'Wetland', emoji: '🪷', cost: 580, category: 'water',
    income: 15, pollution: -7, happinessBoost: 2, resilienceBoost: 1, renewableBoost: 0, height: 1, shape: 'wetland', unlockEvent: 'event_5' },

  // === EVENT 6: Green Architecture Expo ===
  { id: 'vertical_farm', name: 'Vertical Farm', shortName: 'V. Farm', emoji: '🌾', cost: 450, category: 'green',
    income: 16, pollution: -4, happinessBoost: 4, resilienceBoost: 0, renewableBoost: 0, height: 2, shape: 'stepped', unlockEvent: 'event_6' },
  { id: 'vertical_forest', name: 'Vertical Forest Tower', shortName: 'V. Forest', emoji: '🏗️', cost: 800, category: 'green',
    income: 24, pollution: -9, happinessBoost: 6, resilienceBoost: 0, renewableBoost: 0, height: 2, shape: 'forest_tower', unlockEvent: 'event_6' },

  // === EVENT 7: Water Renaissance ===
  { id: 'desalination', name: 'Desalination', shortName: 'Desal.', emoji: '🌊', cost: 650, category: 'water',
    income: 20, pollution: -4, happinessBoost: 2, resilienceBoost: 4, renewableBoost: 0, height: 2, shape: 'cylinder', unlockEvent: 'event_7' },
  { id: 'wave_converter', name: 'Wave Converter', shortName: 'W. Conv.', emoji: '〰️', cost: 550, category: 'energy',
    income: 18, pollution: -2, happinessBoost: 0, resilienceBoost: 2, renewableBoost: 2, height: 1, shape: 'block', unlockEvent: 'event_7' },

  // === EVENT 8: Climate Innovation District ===
  { id: 'research_lab', name: 'Research Lab', shortName: 'R. Lab', emoji: '🔬', cost: 1000, category: 'science',
    income: 24, pollution: -4, happinessBoost: 0, resilienceBoost: 5, renewableBoost: 2, height: 2, shape: 'lab', unlockEvent: 'event_8' },
  { id: 'observatory', name: 'Observatory', shortName: 'Observ.', emoji: '🔭', cost: 800, category: 'science',
    income: 0, pollution: -2, happinessBoost: 3, resilienceBoost: 7, renewableBoost: 0, height: 2, shape: 'observatory', unlockEvent: 'event_8' },
  { id: 'emergency_center', name: 'Emergency Center', shortName: 'Emerg.', emoji: '🚨', cost: 1400, category: 'science',
    income: 0, pollution: 0, happinessBoost: 0, resilienceBoost: 16, renewableBoost: 0, height: 1, shape: 'block', unlockEvent: 'event_8' },

  // === EVENT 9: Smart Resilient City ===
  { id: 'factory', name: 'Factory', shortName: 'Factory', emoji: '🏭', cost: 1800, category: 'economic',
    income: 50, pollution: 15, happinessBoost: -2, resilienceBoost: 0, renewableBoost: 0, height: 1, shape: 'factory', unlockEvent: 'event_9' },
  { id: 'smart_grid', name: 'Smart Grid Center', shortName: 'S. Grid', emoji: '🔋', cost: 3500, category: 'energy',
    income: 55, pollution: -5, happinessBoost: 0, resilienceBoost: 7, renewableBoost: 5, height: 2, shape: 'grid_center', unlockEvent: 'event_9' },
  { id: 'global_trade', name: 'Global Trade Hub', shortName: 'Trade Hub', emoji: '🌐', cost: 6000, category: 'economic',
    income: 110, pollution: 0, happinessBoost: 5, resilienceBoost: 4, renewableBoost: 0, height: 2, shape: 'trade_center', unlockEvent: 'event_9' },

  // === EVENT 10: World Sustainability Summit ===
  { id: 'world_peace', name: 'World Peace Garden', shortName: 'Peace Gdn', emoji: '☮️', cost: 12000, category: 'green',
    income: 0, pollution: -14, happinessBoost: 14, resilienceBoost: 0, renewableBoost: 0, height: 1, shape: 'peace_garden', unlockEvent: 'event_10' },
];

export const CATEGORY_COLORS: Record<string, string> = {
  economic: '#f59e0b', water: '#3b82f6', energy: '#06b6d4', coastal: '#0ea5e9',
  green: '#22c55e', science: '#8b5cf6', waste: '#78716c',
};

export const CATEGORY_LABELS: Record<string, string> = {
  economic: 'Economic', water: 'Water', energy: 'Energy', coastal: 'Coastal',
  green: 'Green', science: 'Science', waste: 'Waste',
};
