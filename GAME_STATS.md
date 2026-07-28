# Green City Tycoon — Game Stats Reference

## Grid

- **8×8** square grid (64 tiles)
- Tiles are 1.6×1.6 units, spaced 2.6 apart (1.0-unit road gaps)

---

## Building Stats

| Building | Cost | Income/day | Pollution | Happiness | Resilience | Renewable | Category |
|---|---|---|---|---|---|---|---|
| House | $100 | +60 | +4 | +5 | — | — | Economic |
| Shop | $160 | +108 | +7 | +3 | — | — | Economic |
| Office Tower | $240 | +180 | +10 | +2 | — | — | Economic |
| Factory | $300 | +270 | +18 | -5 | — | — | Economic |
| Park | $60 | 0 | -5 | +12 | — | — | Green |
| Green Roof | $80 | 0 | -3 | +8 | — | — | Green |
| Vertical Farm | $160 | +48 | -2 | +8 | — | — | Green |
| Water Purifier | $120 | 0 | -4 | +8 | — | — | Water |
| Desalination | $220 | +12 | -7 | +10 | +5 | — | Water |
| Solar Panel | $140 | +30 | -3 | +4 | — | +7 | Energy |
| Wind Turbine | $180 | +42 | -5 | +3 | — | +10 | Energy |
| Wave Converter | $200 | +36 | -4 | +2 | +8 | +8 | Energy |
| Wave Absorber | $200 | 0 | 0 | +5 | +15 | — | Coastal |
| Seawall | $150 | 0 | 0 | +3 | +10 | — | Coastal |
| Observatory | $200 | 0 | -2 | +6 | +8 | — | Science |
| Research Lab | $260 | +24 | -6 | +4 | +10 | +5 | Science |
| Recycling Center | $170 | +36 | -7 | +3 | — | — | Waste |
| Composting Hub | $120 | +12 | -4 | +2 | — | — | Waste |
| Bike Lane | $90 | 0 | -3 | +5 | — | +2 | Transport |
| Transit Hub | $190 | +60 | -5 | +4 | — | +3 | Transport |
| Emergency Center | $400 | 0 | 0 | +2 | +10 | — | Science |

---

## Meter Formulas

### Money
```
money += sum of all completed buildings' income per day
Starting: $1,000
```

### Population
```
housingCapacity = ecoCount × 250 + greenCount × 50
popChange = housingCapacity > 0
  ? (happiness / 100) × 25   (with housing, happiness ≥ 30)
  : -5                        (no housing or happiness < 30)
overcrowdCap = housingCapacity × 1.2
population = clamp(pop + popChange, 0, overcrowdCap)
```
Without housing, declines by 5/day. Overcrowding (pop > housing capacity) allowed up to 20% but causes happiness penalty (-2 per 10% over).

### Pollution
```
pollution = clamp(0, 100, sum of all pollution stats)
```
Negative stats reduce pollution. Positive stats increase it.

### Happiness
```
base = 40
penalty = pollution × 0.5 + overcrowdingPenalty
happiness = clamp(0, 100, base + happinessBoosts - penalty)
```

### Renewable Energy %
```
if totalBuildings > 0:
  renewable = clamp(0, 100, (energyCount / total) × 65 + renewableBoosts)
else:
  renewable = 0
```

### Resilience
```
resilience = clamp(0, 100, sum of resilienceBoosts)
decay: -1 every 3 days
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
- Terrain tiles show **brown** ground; roads between same terrain pair are red (#7f1d1d)
- Click terrain to see cost; click again to start clearing
- During clearing: "🚧 Nd" label, tile remains unbuildable

---

## Disasters

Each disaster has **5 levels**. Level +1 each time that type fires (cap 5). Reset on game restart.

Random: **30% chance per day** (no active warning/disaster).

### Warning Phase (2-5 days)
Base 2 days, +1 per science building (max 5). Shows "⚠️ Level N [Type]".

### Active Phase (3 days)
Destroyed buildings flash red. Recovery toasts shown.

### 🌊 Tsunami

| Level | Edge range | Cost/bldg | Resilience | Seawall blocks |
|---|---|---|---|---|
| 1 | 1 tile | -$500 | -25 | Yes |
| 2 | 1 tile | -$750 | -30 | Yes |
| 3 | 2 tiles | -$1,000 | -35 | Yes |
| 4 | 2 tiles | -$1,500 | -40 | Yes |
| 5 | 3 tiles | -$2,000 | -50 | **No** |

Happiness: -(8 + level). Seawall/Wave Absorber within 1 tile protects unless bypassed.

### 🔥 Earthquake

| Level | Max destroy | Cost/bldg | Resilience |
|---|---|---|---|
| 1 | 2 | -$800 | -15 |
| 2 | 3 | -$1,000 | -20 |
| 3 | 4 | -$1,200 | -25 |
| 4 | 5 | -$1,500 | -30 |
| 5 | 7 | -$2,000 | -40 |

Happiness: -(6 + level). **Defenses reduce destruction:**
- Emergency Center: -1 destroyed
- Every 2 Parks: -1 destroyed
- Every 20 resilience: -1 destroyed (minimum 1)

### ☀️ Drought

| Level | Pop loss | Happiness | Money |
|---|---|---|---|
| 1 | 0-5 | -8 | -$400 |
| 2 | 0-8 | -10 | -$700 |
| 3 | 0-10 | -12 | -$1,000 |
| 4 | 0-12 | -14 | -$1,300 |
| 5 | 0-15 | -20 | -$2,000 |

Defense: each Park saves 1 population (max 5).

### 💨 Smog

| Level | Pollution | Pop loss | Happiness |
|---|---|---|---|
| 1 | +15-20 | -1-3 | -1-3 |
| 2 | +15-25 | -1-5 | -1-5 |
| 3 | +15-30 | -1-6 | -1-6 |
| 4 | +15-35 | -1-7 | -1-7 |
| 5 | +15-40 | -1-8 | -1-8 |

Defense: each clean-energy building (renewableBoost > 0 or pollution < -3) reduces pollution hit by 2 and pop/happiness loss.

---

## Win / Lose

### Win Condition (all simultaneously)
| Meter | Target |
|---|---|
| Money | ≥ $100,000 |
| Population | ≥ 1,000 |
| Happiness | ≥ 90% |
| Air Quality (100 - pollution) | ≥ 90% |
| Renewable % | ≥ 80% |
| Resilience | ≥ 90% |

### Lose Conditions (5-day countdown)
| Warning | Trigger |
|---|---|
| "City is nearly bankrupt!" | Money < $200 |
| "Citizens are leaving!" | Population < 50 |
| "Pollution is choking the city!" | Pollution > 80% |
| "Citizens are rioting!" | Happiness < 20% |

Countdown hits 0 → **game over**.

---

## Educational Minigame (Disaster Preparation)

When a disaster warning appears, a blue **📚 Prepare (5 Qs)** button pulses next to the warning toast. Tapping it opens a chalkboard-themed overlay with a 🧑‍🏫 teacher character.

### Gameplay

- **5 multiple-choice questions** are randomly selected per minigame
- **2 questions** are guaranteed from the occurring disaster type
- **3 questions** are drawn randomly from all other pools (other disasters + general sustainability)
- Each question has **4 answer choices** (A, B, C, D)
- Correct answers flash **green**, wrong answers flash **red** with the correct one highlighted
- A brief **explanation** appears below each question after answering
- The game **pauses** (speed = 0) during the minigame and **resumes** afterward

### Question Pools (110 total)

| Pool | Count | Topics |
|---|---|---|
| 🌊 Tsunami | 15 | Tectonics, wave physics, warning systems, historical events, coastal defense |
| 🔥 Earthquake | 15 | Seismology, building codes, fault lines, preparedness, historical quakes |
| ☀️ Drought | 15 | Water conservation, agriculture, desertification, SDG 6, climate impact |
| 💨 Smog | 15 | Air pollution, PM2.5, ozone, clean energy, public health |
| 🌍 General | 50 | SDGs, climate change, biodiversity, renewable energy, waste, green cities, carbon footprint, ocean health, deforestation |

### Damage Reduction

Score (0-5 correct answers) reduces the disaster's impact when it strikes:

| Score | Tsunami | Earthquake | Drought | Smog |
|---|---|---|---|---|
| 0 | no reduction | no reduction | no reduction | no reduction |
| 1-2 | -$150/building | -0.5 destroyed (floor) | -1 pop loss | -3 pollution |
| 3-4 | -$150/building | -1 destroyed | -2 pop loss | -6 pollution |
| 5 | -$150/building | -2 destroyed | -5 pop loss | -15 pollution |

- Scores **stack multiplicatively** with building-based defenses (seawalls, parks, emergency centers)
- Score resets to 0 after the disaster fires
- The minigame is **optional** — skipping it means facing the disaster at full strength

### Advisory Hint

First time a disaster warning appears, a 💡 advisory fires: *"A disaster is coming! Tap 📚 Prepare to answer 5 questions and reduce the damage."*

---

## Speed Controls

| Speed | Interval | Label |
|---|---|---|
| 0× | Paused | ⏸ |
| 1× | 5 seconds | ▶ 1× |
| 2× | 2.5 seconds | ⏩ 2× |

1 tick = 1 day. Display shows "Day N".

---

## Special Rules

- **Coastal buildings** (Seawall, Wave Absorber) can only be placed on edge tiles (row/col 0 or 7)
- **Happiness base** = 40
- **Starting population** = 100, **starting money** = $1,000
- Overcrowding allows population up to 120% of housing capacity with happiness penalty
- Resilience decays by 1 every 3 days
- Renewable ratio: (energy buildings / total) × 65 + boosts
