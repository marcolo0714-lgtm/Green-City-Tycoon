# Green City Tycoon — Game Stats Reference

## Grid

- **9×9** square grid (81 tiles)
- Tiles are 1.6×1.6 units, spaced 2.6 apart (1.0-unit road gaps)

---

## Events System (Progression)

Events are one-time purchases that provide **permanent compounding multipliers** to all meters. Each event has conditions and takes 2–8 days to organize. Events unlock new buildings and are the primary progression mechanic.

### 10 Events

| # | Event | Cost | Days | Pop Req | Conditions | Key Effects |
|---|---|---|---|---|---|---|
| 1 | Community Green Day 🌱 | $500 | 2 | 50 | — | Inc ×2.0, Hap ×1.5, Cap ×1.5, Grow ×2.0 |
| 2 | Clean Energy Kickstart ⚡ | $3K | 3 | 200 | Ren≥10% | Inc ×2.0, **Poll ×0.5**, Res ×1.5, Cap ×1.5, Grow ×2.0 |
| 3 | Coastal Shield Program 🛡️ | $8K | 3 | 500 | — | Inc ×2.0, Res ×2.0, Cap ×2.0, Grow ×2.5 |
| 4 | Solar City Initiative ☀️ | $20K | 4 | 1,500 | Ren≥20% | Inc ×2.5, Ren ×2.0, Hap ×1.3, Cap ×2.0, Grow ×2.5 |
| 5 | Metro Transit Network 🚇 | $50K | 4 | 5K | Hap≥40% | Inc ×2.5, **Poll ×0.5**, Cap ×2.5, Grow ×3.0 |
| 6 | Urban Forest Program 🌳 | $120K | 5 | 15K | — | Inc ×2.5, Hap ×2.0, Cap ×3.0, Grow ×3.0 |
| 7 | Water Renaissance 💧 | $300K | 5 | 50K | Ren≥40% | Inc ×3.0, Res ×2.5, Hap ×1.5, Cap ×3.0, Grow ×3.5 |
| 8 | Climate Innovation District 🔬 | $800K | 6 | 150K | $≥$100K | Inc ×3.0, Ren ×2.5, **Poll ×0.4**, Cap ×3.5, Grow ×4.0 |
| 9 | Smart Resilient City 🏙️ | $2M | 7 | 500K | Res≥30% | Inc ×3.5, Res ×3.0, Cap ×4.0, Grow ×4.0 |
| 10 | World Sustainability Summit 🕊️ | $5M | 8 | 2M | Hap≥70% | Inc ×4.0, Hap ×2.0, Res ×2.0, Ren ×2.0, **Poll ×0.4**, Cap ×5.0, Grow ×5.0 |

All multipliers stack **multiplicatively** (cumulative). Events have **no prerequisite event requirements**.

### Cumulative Multipliers After Events

| After Event | Income | Pollution | Resilience | Happiness | Pop Cap | Pop Growth |
|---|---|---|---|---|---|---|
| 0 (start) | ×1 | ×1 | ×1 | ×1 | ×1 | ×1 |
| 2 | ×4.0 | ×0.5 | ×1.5 | ×1.5 | ×2.25 | ×4.0 |
| 4 | ×20 | ×0.5 | ×3.0 | ×1.95 | ×9.0 | ×25 |
| 6 | ×125 | ×0.25 | ×3.0 | ×3.9 | ×67.5 | ×225 |
| 8 | ×1,125 | ×0.1 | ×7.5 | ×5.85 | ×709 | ×3,150 |
| 10 | ×15,750 | **×0.04** | ×45 | ×11.7 | ×14,175 | ×63,000 |

### Progression Example

Using a sample city with 5 Houses, 3 Shops, 2 Parks, 1 Solar Panel, and 1 Bike Lane:

| | 0 events | After 2 | After 4 | After 6 | After 8 | After 10 |
|---|---|---|---|---|---|---|
| **Income mult** | ×1 | ×4 | ×20 | ×125 | ×1,125 | ×15,750 |
| **House income** (base $10) | $10 | $40 | $200 | $1,250 | $11,250 | $157,500 |
| **Pollution mult** | ×1 | ×0.5 | ×0.5 | ×0.25 | ×0.1 | ×0.04 |
| **Shop pollution** (base 20) | 20 | 10 | 10 | 5 | 2 | 1 |
| **Resilience mult** | ×1 | ×1.5 | ×3.0 | ×3.0 | ×7.5 | ×45 |
| **Solar resilience** (base 1) | 1 | 1.5 | 3 | 3 | 7.5 | 45 |
| **Pop Growth mult** | ×1 | ×4 | ×25 | ×225 | ×3,150 | ×63,000 |
| **Pop growth/day** (at 80% hap) | 20 | 80 | 500 | 4,500 | 63,000 | 1.26M |

### Unlocked Buildings by Event

| Event | Unlocks |
|---|---|
| #1 | Solar Panel |
| #2 | Wind Turbine, Recycling Center, Composting Hub |
| #3 | Seawall, Wave Absorber |
| #4 | Solar Mega-Farm, Office Tower |
| #5 | Transit Hub, Metro Hub |
| #6 | Vertical Farm, Vertical Forest Tower |
| #7 | Desalination, Wave Converter, Water Reclamation |
| #8 | Research Lab, Observatory, Emergency Center, Research Hub |
| #9 | Factory, Smart Grid Center, Global Trade Hub |
| #10 | World Peace Garden |

---

## Building Stats

### Starter (always available)

| Building | Cost | Inc | Poll | Hap | Res | Ren | Category |
|---|---|---|---|---|---|---|---|
| House | $20 | +10 | **+10** | +1 | — | — | Economic |
| Shop | $40 | +20 | **+20** | +1 | — | — | Economic |
| Park | $15 | 0 | -3 | +3 | — | — | Green |
| Green Roof | $25 | 0 | -2 | +2 | — | — | Green |
| Water Purifier | $35 | 0 | -3 | +2 | — | — | Water |
| Bike Lane | $25 | 0 | -2 | +2 | — | +1 | Transport |

### Unlockable Buildings

| Building | Cost | Inc | Poll | Hap | Res | Ren | Category | Unlock |
|---|---|---|---|---|---|---|---|---|
| Solar Panel | $80 | +10 | -3 | +1 | +1 | +4 | Energy | #1 |
| Wind Turbine | $120 | +15 | -4 | +1 | +1 | +5 | Energy | #2 |
| Recycling Center | $50 | +12 | -5 | +1 | — | — | Waste | #2 |
| Composting Hub | $35 | +8 | -3 | +1 | — | — | Waste | #2 |
| Seawall | $300 | 0 | 0 | +1 | +8 | — | Coastal | #3 |
| Wave Absorber | $350 | 0 | 0 | +2 | +10 | — | Coastal | #3 |
| Solar Mega-Farm | $200 | +20 | -5 | — | +2 | +6 | Energy | #4 |
| Office Tower | $150 | +25 | **+6** | +2 | — | — | Economic | #4 |
| Transit Hub | $120 | +15 | -3 | +2 | +1 | +2 | Transport | #5 |
| Metro Hub | $250 | +30 | -4 | — | +2 | — | Transport | #5 |
| Vertical Farm | $180 | +15 | -4 | +3 | — | — | Green | #6 |
| Vertical Forest | $350 | +20 | -8 | +5 | +1 | — | Green | #6 |
| Desalination | $300 | +18 | -5 | +2 | +3 | — | Water | #7 |
| Wave Converter | $280 | +15 | -3 | — | +2 | +4 | Energy | #7 |
| Water Reclamation | $450 | +25 | -6 | — | +5 | — | Water | #7 |
| Research Lab | $400 | +18 | -4 | +1 | +3 | +3 | Science | #8 |
| Observatory | $350 | 0 | -2 | +2 | +5 | — | Science | #8 |
| Emergency Center | $500 | 0 | 0 | +1 | +10 | — | Science | #8 |
| Research Hub | $600 | +30 | -6 | — | +5 | +5 | Science | #8 |
| Factory | $400 | +35 | **+15** | -2 | — | — | Economic | #9 |
| Smart Grid Center | $800 | +40 | -4 | — | +5 | +5 | Energy | #9 |
| Global Trade Hub | $1,500 | +80 | 0 | +5 | +3 | — | Economic | #9 |
| World Peace Garden | $2,000 | 0 | -10 | +10 | +10 | — | Green | #10 |

---

## Meter Formulas (with Event Buffs)

```
activeBuffs = accumulated multiplicative buffs from all organized events

### Money
money += floor(sum of all completed buildings' income × activeBuffs.incomeMultiplier)
Starting: $300
```

### Population
```
housingCapacity = floor((ecoCount × 250 + greenCount × 50) × activeBuffs.popCapMultiplier)
popGrowthMultiplier = activeBuffs.popGrowthMultiplier
popChange = housingCapacity > 0
  ? round(happiness ≥ 30 ? (happiness / 100) × 25 × popGrowthMultiplier : -5)
  : -5
overcrowdCap = floor(housingCapacity × 1.2)
population = clamp(pop + popChange, 0, overcrowdCap)
```
Without housing, declines by 5/day. Overcrowding (pop > housing capacity) causes happiness penalty (-2 per 10% over).

### Pollution
```
rawPollution = sum of all buildings' pollution stats
scaledPollution = round(rawPollution × activeBuffs.pollutionMultiplier)
pollution = clamp(0, 100, scaledPollution)
```

### Happiness
```
base = 40
scaledBoost = round(sum(happinessBoost) × activeBuffs.happinessMultiplier)
penalty = pollution × 0.5 + overcrowdingPenalty
happiness = clamp(0, 100, base + scaledBoost - penalty)
```

### Renewable Energy %
```
scaledRenewable = round(sum(renewableBoost) × activeBuffs.renewableMultiplier)
if totalBuildings > 0: renewable = clamp(0, 100, (energyCount / total) × 65 + scaledRenewable)
else: renewable = 0
```

### Resilience
```
scaledResilience = round(sum(resilienceBoost) × activeBuffs.resilienceMultiplier)
resilience = clamp(0, 100, scaledResilience)
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
| 🏔️ Mountain | $8,000 | 6 days | Cannot spawn on edge tiles (row/col 0 or 8) |
| 🌊 Lake | $4,000 | 4 days | Cannot spawn on edge tiles (row/col 0 or 8) |
| 🌲 Forest | $2,000 | 2 days | Can spawn anywhere |

- Each terrain occupies **2 adjacent tiles** + the road between them (road turns red)
- **2 mountains, 2 lakes, 4 forests** generated per game (8 pairs total = 16/81 tiles ≈ 20%)
- Terrain tiles show **brown** ground; roads between same terrain pair are red (#7f1d1d)

---

## Educational Minigame

When a disaster warning appears, a blue **📚 Prepare (5 Qs)** button appears. Tapping it opens a chalkboard-themed overlay with a 🧑‍🏫 teacher character.

### Gameplay
- **5 questions** (2 disaster-specific + 3 random), 4 choices each
- Game **pauses** during minigame, **resumes** afterward
- Each correct answer reduces disaster damage

### Question Pools (110 total)

| Pool | Count |
|---|---|
| 🌊 Tsunami | 15 |
| 🔥 Earthquake | 15 |
| ☀️ Drought | 15 |
| 💨 Smog | 15 |
| 🌍 General | 50 |

---

## Disasters

Disaster level is **derived from events organized**:

| Events Held | 0–1 | 2–3 | 4–5 | 6–7 | 8+ |
|---|---|---|---|---|---|
| **Disaster Level** | 1 | 2 | 3 | 4 | 5 |

Random: **30% chance per day** (no active warning/disaster).

### Warning Phase (2-5 days)
Base 2 days, +1 per science building (max 5). Shows "⚠️ Level N [Type]".

### Active Phase (3 days)
Destroyed buildings flash red.

### Minigame Damage Reduction (Percentage-Based)

Score M (0-5) applies a multiplier to **all** disaster damage: `pct = 1 − M × 0.14`

| Minigame Score | 0 (skip) | 2 | 3 | 5 (perfect) |
|---|---|---|---|---|
| **Damage Taken** | 100% | 72% | 58% | **30%** |
| **Reduction** | 0% | 28% | 42% | **70%** |

This applies to: money loss, resilience loss, happiness loss, population loss, and pollution increase.

### 🌊 Tsunami

Base values (before minigame reduction):

| Level | Edge range | Cost/bldg | Resilience | Happiness | Seawall blocks |
|---|---|---|---|---|---|
| 1 | 1 tile | $500 | -15 | -5 | Yes |
| 2 | 1 tile | $2,000 | -25 | -8 | Yes |
| 3 | 2 tiles | $8,000 | -40 | -12 | Yes |
| 4 | 2 tiles | $30,000 | -60 | -18 | Yes |
| 5 | 3 tiles | **$100,000** | -90 | -30 | **No** |

Seawall/Wave Absorber within 1 tile protects unless bypassed. M=5 → $30K/bldg at L5.

### 🔥 Earthquake

Base values:

| Level | Max destroy | Cost/bldg | Resilience | Happiness |
|---|---|---|---|---|
| 1 | 1 | $300 | -10 | -4 |
| 2 | 2 | $1,500 | -18 | -6 |
| 3 | 3 | $6,000 | -30 | -10 |
| 4 | 4 | $25,000 | -50 | -15 |
| 5 | 5 | **$80,000** | -80 | -25 |

**Defenses reduce destruction:**
- Emergency Center: -1 destroyed
- Every 2 Parks: -1 destroyed
- Every 20 resilience: -1 destroyed (minimum 1)

### ☀️ Drought

Base values:

| Level | Pop loss | Happiness | Money |
|---|---|---|---|
| 1 | 5 | -8 | $300 |
| 2 | 10 | -12 | $1,500 |
| 3 | 20 | -18 | $6,000 |
| 4 | 40 | -30 | $25,000 |
| 5 | **80** | **-50** | **$80,000** |

Defense: each Park saves 1 population (max 5). M=5 → L5 pop loss = 24 (80 × 0.3), money = $24K.

### 💨 Smog

Base values:

| Level | Pollution | Pop loss | Happiness |
|---|---|---|---|
| 1 | +15 | 3 | 3 |
| 2 | +28 | 6 | 6 |
| 3 | +45 | 12 | 12 |
| 4 | +65 | 25 | 25 |
| 5 | **+90** | **60** | **45** |

Defense: each clean-energy building reduces pollution hit by 2 and pop/happiness loss by 1. M=5 → L5 pollution = +27 (90 × 0.3).

---

## Win / Lose

### Win Condition (all simultaneously — harder than event 10)

| Meter | Target |
|---|---|
| Money | ≥ $10,000,000 |
| Population | ≥ 5,000,000 |
| Happiness | ≥ 95% |
| Air Quality (100 − pollution) | ≥ 95% (pollution ≤ 5) |
| Renewable % | ≥ 95% |
| Resilience | ≥ 95% |

### Lose Conditions (5-day countdown)
| Warning | Trigger |
|---|---|
| "City is nearly bankrupt!" | Money < $200 |
| "Citizens are leaving!" | Population < 50 |
| "Pollution is choking the city!" | Pollution > 80% |
| "Citizens are rioting!" | Happiness < 20% |

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

- **Coastal buildings** can only be placed on edge tiles (row/col 0 or 8)
- **Happiness base** = 40
- **Starting population** = 100, **starting money** = $300
- Overcrowding allows population up to 120% of housing capacity with happiness penalty
- Resilience decays by 1 every 3 days
- Renewable ratio: (energy buildings / total) × 65 + renewable boosts (× multiplier)
- **Events**: one-time purchases with compounding multiplier buffs. No prerequisite events.
- **Building unlock**: Most buildings require specific events to be organized
- **Population max display**: 10,000,000
