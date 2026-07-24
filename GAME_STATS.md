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
- Terrain tiles show **brown** ground; roads between same terrain pair are red (`#7f1d1d`)
- Click terrain to see cost; click again to start clearing
- During clearing: "🚧 Nd" label, tile remains unbuildable

---

## Disasters

Each disaster has **5 levels of intensity**. Level increases by 1 every time that disaster fires, capping at 5. Reset on game restart.

Random check: **30% chance per day** (only when no warning or active disaster is ongoing).

### Warning Phase (variable, 2-5 days)
Base 2 days, +1 day per science building (max 5). Warning shows the upcoming level.

### Active Phase (3 days)
Recovery toast shows. Destroyed buildings show **red flashing overlays**.

### 🌊 Tsunami

| Level | Edge range | Cost/building | Resilience hit | Seawall protection |
|---|---|---|---|---|
| 1 | 1 tile | -$500 | -25 | Yes |
| 2 | 1 tile | -$750 | -30 | Yes |
| 3 | 2 tiles | -$1,000 | -35 | Yes |
| 4 | 2 tiles | -$1,500 | -40 | Yes |
| 5 | 3 tiles | -$2,000 | -50 | **No (bypassed)** |

Happiness hit: -(8 + level). Seawalls/Wave Absorbers within 1 tile protect adjacent buildings (except at level 5).

### 🔥 Earthquake

| Level | Max destroyed | Cost/building | Resilience hit |
|---|---|---|---|
| 1 | 2 | -$800 | -15 |
| 2 | 3 | -$1,000 | -20 |
| 3 | 4 | -$1,200 | -25 |
| 4 | 5 | -$1,500 | -30 |
| 5 | 7 | -$2,000 | -40 |

Happiness hit: -(6 + level). **Defenses reduce the number of destroyed buildings:**
- Each Emergency Center: -1 destroyed
- Every 2 Parks: -1 destroyed (open spaces = gathering areas)
- Every 20 resilience: -1 destroyed (minimum 1 destroyed always)

### ☀️ Drought (water shortage)

| Level | Pop loss | Happiness hit | Money cost | Extra |
|---|---|---|---|---|
| 1 | 0-5 | -8 | -$400 | — |
| 2 | 0-8 | -10 | -$700 | — |
| 3 | 0-10 | -12 | -$1,000 | — |
| 4 | 0-12 | -14 | -$1,300 | — |
| 5 | 0-15 | -20 | -$2,000 | Extra -5 happiness |

**Defense:** Each Park saves 1 population (max 5 saved). Green buildings don't directly block but contribute to happiness buffer.

### 💨 Smog (air pollution spike)

| Level | Pollution hit | Pop loss | Happiness hit |
|---|---|---|---|
| 1 | +15 to +20 | -1 to -3 | -1 to -3 |
| 2 | +15 to +25 | -1 to -5 | -1 to -5 |
| 3 | +15 to +30 | -1 to -6 | -1 to -6 |
| 4 | +15 to +35 | -1 to -7 | -1 to -7 |
| 5 | +15 to +40 | -1 to -8 | -1 to -8 |

**Defense:** Each clean-energy/renewable building (renewableBoost > 0 or pollution < -3) reduces pollution hit by 2 and reduces pop/happiness loss.

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
