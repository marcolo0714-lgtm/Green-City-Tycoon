# Green City Tycoon — Game Stats Reference

## Grid

- **8×8** square grid (64 tiles)
- Tiles are 1.6×1.6 units, spaced 2.6 apart (1.0-unit road gaps)

---

## Building Stats

| Building | Cost | Income/day | Pollution | Happiness | Resilience | Renewable | Category |
|---|---|---|---|---|---|---|---|
| House | $50 | +30 | +2 | +5 | — | — | Economic |
| Shop | $80 | +54 | +4 | +3 | — | — | Economic |
| Office Tower | $120 | +90 | +6 | +2 | — | — | Economic |
| Factory | $150 | +135 | +12 | -5 | — | — | Economic |
| Park | $30 | 0 | -5 | +10 | — | — | Green |
| Green Roof | $40 | 0 | -3 | +6 | — | — | Green |
| Vertical Farm | $80 | +24 | -2 | +8 | — | — | Green |
| Water Purifier | $60 | 0 | -4 | +8 | — | — | Water |
| Desalination | $110 | +6 | -7 | +10 | +5 | — | Water |
| Solar Panel | $70 | +15 | -3 | +4 | — | +7 | Energy |
| Wind Turbine | $90 | +21 | -5 | +3 | — | +10 | Energy |
| Wave Converter | $100 | +18 | -4 | +2 | +8 | +8 | Energy |
| Wave Absorber | $100 | 0 | 0 | +5 | +20 | — | Coastal |
| Seawall | $75 | 0 | 0 | +3 | +15 | — | Coastal |
| Observatory | $100 | 0 | -2 | +6 | +10 | — | Science |
| Research Lab | $130 | +12 | -6 | +4 | +12 | +5 | Science |
| Recycling Center | $85 | +18 | -7 | +3 | — | — | Waste |
| Composting Hub | $60 | +6 | -4 | +2 | — | — | Waste |
| Bike Lane | $45 | 0 | -3 | +5 | — | +2 | Transport |
| Transit Hub | $95 | +30 | -5 | +4 | — | +3 | Transport |
| Emergency Center | $200 | 0 | 0 | +2 | +15 | — | Science |

> Income in **bold** is the stat that contributes to the Money meter each day.

---

## Meter Formulas

### Money
```
money += sum of all completed buildings' income per day
```

### Population
```
housingCapacity = ecoCount * 25 + greenCount * 5
popChange = housingCapacity > 0 ? (happiness / 100) * 2 : -1
population = clamp(population + popChange, 0, housingCapacity)
```
Happiness scales birth rate. Without housing, population declines by 1/day.

### Pollution
```
pollution = clamp(0, 100, sum of all pollution stats)
```
Negative values reduce pollution. Positive values increase it.

### Happiness
```
base = 50
happiness = clamp(0, 100, base + happinessBoosts - pollution * 0.3)
```

### Renewable Energy %
```
if totalBuildings > 0:
    renewable = clamp(0, 100, (energyCount / totalBuildings) * 60 + renewableBoosts)
else:
    renewable = 0
```

### Resilience
```
resilience = clamp(0, 100, sum of resilienceBoosts)
```

---

## Construction

- Buildings take **2 days** to construct after placement
- Cost is paid upfront; building contributes **nothing** until construction completes
- During construction: model is clipped at 50% (day 1) or 75% (day 2) height
- Yellow tarp + "🚧 Nd" label shown

---

## Terrain

| Type | Clear Cost | Clear Time | Restrictions |
|---|---|---|---|
| 🏔️ Mountain | $8,000 | 6 days | Cannot spawn on edge tiles (row/col 0 or 7) |
| 🌊 Lake | $4,000 | 4 days | Cannot spawn on edge tiles (row/col 0 or 7) |
| 🌲 Forest | $2,000 | 2 days | Can spawn anywhere |

- Each terrain occupies **2 adjacent tiles** + the road between them (road turns red)
- **2 mountains, 2 lakes, 4 forests** generated per game (8 pairs total = 16/64 tiles = 25%)
- Terrain tiles show **red** ground; roads between same terrain pair are also red
- Click terrain to see cost; click again to start clearing
- During clearing: "🚧 Nd" label, tile remains unbuildable

---

## Disasters

Random check: **15% chance per day** (only when no warning or active disaster is ongoing).

### Warning Phase (5 days)
A toast appears: *"A tsunami is approaching the coast!"* (etc.)

### Active Phase (3 days)
A toast shows recovery time: *"tsunami aftermath (3d recovery)"*

| Disaster | Effect | Defense |
|---|---|---|
| 🌊 **Tsunami** | Destroys buildings within 1 tile of any edge. -$500 per destroyed building. -30 resilience, -10 happiness. | Seawall/Wave Absorber within 1 tile protects adjacent buildings |
| 🔥 **Earthquake** | Destroys ~15% of random buildings. -$800 per destroyed building. -20 resilience, -8 happiness. | Each science-category building absorbs 1 destruction |
| ☀️ **Drought** | +30 pollution, -15 happiness | Green buildings reduce penalty (not yet implemented per-building) |
| 💨 **Smog** | +20 pollution, -5 population, -5 happiness | Clean-energy/renewable buildings reduce penalty (not yet implemented per-building) |

---

## Win / Lose

### Win Condition (all must be true simultaneously)
| Meter | Target |
|---|---|
| Money | ≥ $100,000 |
| Population | ≥ 100 |
| Happiness | ≥ 90% |
| Air Quality (100 - pollution) | ≥ 90% |
| Renewable % | ≥ 80% |
| Resilience | ≥ 90% |

### Lose Conditions (5-day countdown)
| Warning | Trigger |
|---|---|
| "City is nearly bankrupt!" | Money < $200 |
| "Citizens are leaving!" | Population < 5 |
| "Pollution is choking the city!" | Pollution > 80% |
| "Citizens are rioting!" | Happiness < 20% |

When countdown hits 0 → **game over**.

---

## Speed Controls

| Speed | Tick interval | Label |
|---|---|---|
| 0× | Paused | ⏸ Paused |
| 1× | 5 seconds | ▶ 1× |
| 2× | 2.5 seconds | ⏩ 2× |

1 tick = 1 day. Display shows "Day N".

---

## Special Rules

- **Coastal buildings** (Seawall, Wave Absorber) can only be placed on edge tiles (row=0, row=7, col=0, col=7)
- **Happiness base** = 50 (starts at 50 even with no buildings)
- **Starting population** = 10, **starting money** = $600
