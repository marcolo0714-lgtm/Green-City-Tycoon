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
| 1 | Community Green Day 🌱 | $500 | 2 | 50 | — | Inc ×2.0, Cap ×1.5, Grow ×2.0 |
| 2 | Clean Energy Kickstart ⚡ | $3K | 3 | 200 | **Ren≥10%** | Inc ×2.0, Poll ×0.5, Res ×1.5, Cap ×1.5 |
| 3 | Coastal Shield Program 🛡️ | $8K | 3 | 500 | **Hap≥35%** | Inc ×2.0, Res ×1.5, Cap ×2.0, Grow ×2.5 |
| 4 | Solar City Initiative ☀️ | $20K | 4 | 1,500 | **Ren≥20%** | Inc ×2.5, Ren ×2.0, Cap ×2.0, Grow ×2.5 |
| 5 | Water Security Initiative 🚰 | $50K | 4 | 5K | **Hap≥65%** | Inc ×2.5, Poll ×0.5, Cap ×2.5, Grow ×3.0 |
| 6 | Green Architecture Expo 🏛️ | $120K | 5 | 15K | **Res≥25%** | Inc ×2.5, Cap ×3.0, Grow ×3.0 |
| 7 | Water Renaissance 💧 | $300K | 5 | 50K | **Ren≥40%** | Inc ×3.0, Res ×2.0, Ren ×1.7, Grow ×3.0 |
| 8 | Climate Innovation District 🔬 | $800K | 6 | 150K | **Res≥35%** | Inc ×3.0, Ren ×2.5, Poll ×0.4, Cap ×3.5 |
| 9 | Smart Resilient City 🏙️ | $2M | 7 | 500K | **Res≥30%** | Inc ×3.5, Cap ×4.0, Grow ×4.0 |
| 10 | World Sustainability Summit 🕊️ | $5M | 8 | 2M | **Hap≥70%** | Inc ×4.0, Res ×2.0, Ren ×2.0, Poll ×0.4, Cap ×5.0, Grow ×5.0 |

All multipliers stack **multiplicatively** (cumulative). Events have **no prerequisite event requirements**.

### Cumulative Multipliers After Events

| After Event | Income | Pollution | Resilience | Pop Cap | Pop Growth |
|---|---|---|---|---|---|
| 0 (start) | ×1 | ×1 | ×1 | ×1 | ×1 |
| 2 | ×4.0 | ×0.5 | ×1.5 | ×2.25 | ×2.0 |
| 4 | ×20 | ×0.5 | ×2.25 | ×9.0 | ×12.5 |
| 6 | ×125 | ×0.25 | ×2.25 | ×67.5 | ×112.5 |
| 8 | ×1,125 | ×0.1 | ×2.25 | ×236 | ×337.5 |
| 10 | ×18,000 | **×0.04** | ×9.0 | ×5,906 | ×1,687.5 |

### Progression Example

Using a sample city with 5 Houses, 3 Shops, 2 Parks, 1 Solar Panel, and 1 Rainwater Harvester:

| | 0 events | After 2 | After 4 | After 6 | After 8 | After 10 |
|---|---|---|---|---|---|---|
| **Income mult** | ×1 | ×4 | ×20 | ×125 | ×1,125 | ×18,000 |
| **House income** (base $10) | $10 | $40 | $200 | $1,250 | $11,250 | $180,000 |
| **Pollution mult** | ×1 | ×0.5 | ×0.5 | ×0.25 | ×0.1 | ×0.04 |
| **Shop pollution** (base 15) | 15 | 7.5 | 7.5 | 3.75 | 1.5 | 0.6 |
| **Resilience mult** | ×1 | ×1.5 | ×2.25 | ×2.25 | ×2.25 | ×9.0 |
| **Green Roof resilience** (base 3) | 3 | 4.5 | 6.75 | 6.75 | 6.75 | 27 |
| **Pop Growth mult** | ×1 | ×2 | ×12.5 | ×112.5 | ×112.5 | ×562.5 |
| **Pop growth/day** (at 80% hap) | 20 | 40 | 250 | 2,250 | 2,250 | 11,250 |

### Unlocked Buildings by Event

| Event | Unlocks |
|---|---|
| #1 | Solar Panel |
| #2 | Wind Turbine, Recycling Center, Composting Hub |
| #3 | Seawall, Wave Absorber |
| #4 | Geothermal Plant, Office Tower |
| #5 | Aquifer Recharge, Wetland Restoration |
| #6 | Vertical Farm, Vertical Forest Tower |
| #7 | Desalination, Wave Converter |
| #8 | Research Lab, Observatory, Emergency Center |
| #9 | Factory, Smart Grid Center, Global Trade Hub |
| #10 | World Peace Garden |

---

## Building Stats

### Starter (always available)

| Building | Cost | Inc | Poll | Hap | Res | Ren | Category |
|---|---|---|---|---|---|---|---|
| House | $20 | +10 | +10 | +1 | — | — | Economic |
| Shop | $45 | +22 | +15 | — | — | — | Economic |
| Park | $18 | 0 | -4 | +3 | — | — | Green |
| Green Roof | $40 | 0 | -2 | +1 | +3 | — | Green |
| Water Purifier | $60 | 0 | -5 | — | +2 | — | Water |
| Rainwater Harvester | $55 | +6 | -1 | — | +1 | — | Water |

### Unlockable Buildings

| Building | Cost | Inc | Poll | Hap | Res | Ren | Category | Unlock |
|---|---|---|---|---|---|---|---|---|
| Solar Panel | $150 | +14 | -3 | — | — | +6 | Energy | #1 |
| Wind Turbine | $220 | +20 | -4 | — | — | +7 | Energy | #2 |
| Recycling Center | $100 | +16 | -6 | — | — | — | Waste | #2 |
| Composting Hub | $70 | +8 | -3 | — | — | +2 | Waste | #2 |
| Seawall | $500 | 0 | 0 | — | +12 | — | Coastal | #3 |
| Wave Absorber | $700 | 0 | 0 | — | +18 | — | Coastal | #3 |
| Geothermal Plant | $450 | +26 | -5 | — | +2 | +8 | Energy | #4 |
| Office Tower | $350 | +35 | +5 | — | — | — | Economic | #4 |
| Aquifer Recharge | $320 | +10 | -3 | — | +3 | — | Water | #5 |
| Wetland Restoration | $580 | +15 | -7 | +2 | +1 | — | Water | #5 |
| Vertical Farm | $450 | +16 | -4 | +4 | — | — | Green | #6 |
| Vertical Forest | $800 | +24 | -9 | +6 | — | — | Green | #6 |
| Desalination | $650 | +20 | -4 | +2 | +4 | — | Water | #7 |
| Wave Converter | $550 | +18 | -2 | — | +2 | +5 | Energy | #7 |
| Research Lab | $1000 | +24 | -4 | — | +5 | +4 | Science | #8 |
| Observatory | $800 | 0 | -2 | +3 | +7 | — | Science | #8 |
| Emergency Center | $1400 | 0 | 0 | — | +16 | — | Science | #8 |
| Factory | $1800 | +50 | +15 | -2 | — | — | Economic | #9 |
| Smart Grid Center | $3500 | +55 | -5 | — | +7 | +7 | Energy | #9 |
| Global Trade Hub | $6000 | +110 | 0 | +5 | +4 | — | Economic | #9 |
| World Peace Garden | $12000 | 0 | -14 | +14 | — | — | Green | #10 |

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
  : -round(population × 0.2)
overcrowdCap = floor(housingCapacity × 1.2)
population = clamp(pop + popChange, 0, overcrowdCap)
```
Without housing, declines by **20% of current population per day**. Overcrowding (pop > housing capacity) causes happiness penalty (-2 per 10% over).

### Pollution
```
rawPollution = sum of all buildings' pollution stats
scaledPollution = round(rawPollution × activeBuffs.pollutionMultiplier)
pollution = clamp(0, 100, scaledPollution)
```

### Happiness
```
base = 400 (starting value, ×10 scale)
perTick += sum of all completed buildings' happinessBoost (integer values at ×10)
perTick -= min(150, overcrowdPct × 20)          // -2 per 10% over cap, max 15%/day
perTick -= min(150, (pollution - 50) × 10)       // if pollution > 50, max 15%/day
disaster -= one-off deduction from applyDisaster (at ×10 scale)
clamp(0, 1000)
display = floor(internal / 10)
```
Happiness is stored internally at **×10 integer scale** (0-1000) for exact accumulation. Buildings add integer amounts (e.g. Park +3 = +0.3%/day displayed). Penalties are capped at 150 internal (15% displayed). Displayed happiness = floor(internal / 10). Not affected by event multipliers.

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

| Type | Clear Cost | Clear Time | Size | Restrictions |
|---|---|---|---|---|
| 🏔️ Mountain | **$400,000** | 6 days | **3×3 block** (9 tiles) | Cannot spawn on edge tiles (row/col 0 or 8) |
| 🌊 Lake | **$30,000** | 4 days | **2×2 block** (4 tiles) | Cannot spawn on edge tiles (row/col 0 or 8) |
| 🌲 Forest | $2,000 | 2 days | 2-tile pair | Can spawn anywhere |

- **1 mountain, 2 lakes, 4 forests** generated per game (9 + 8 + 8 = 25 tiles ≈ 31% of grid)
- Mountain and lake are each a **single merged 3D block** — clearing any tile in the block clears the entire block
- Each terrain block has a unique `blockId` — adjacent blocks of the same type stay separate
- Terrain tiles show **brown** ground; roads between same terrain pair are red (#7f1d1d)

---

## Educational Minigame

When a disaster warning appears, a ⚠️ **Prepare (4 Qs)** button pulses in red. Tapping it opens a chalkboard-themed overlay with a 🧑‍🏫 teacher character.

### Flow
1. **Intro screen** — Teacher introduces the disaster type and explains reducing damage
2. **Quiz (4 questions)** — 2 disaster-specific + 2 random, 4 choices each
3. **Results screen** — Teacher shows score and damage reduction stats
4. Game **pauses** during minigame, **resumes** after closing

### Damage Reduction (Percentage-Based)

Score M (0-4) applies a multiplier to **all** disaster damage: `pct = 1 − M × 0.175`

| Minigame Score | 0 (skip) | 2 | 3 | 4 (perfect) |
|---|---|---|---|---|
| **Damage Taken** | 100% | 65% | 47.5% | **30%** |
| **Reduction** | 0% | 35% | 52.5% | **70%** |

Applies to: money loss, resilience loss, happiness loss, population loss, pollution increase.

### Preparedness Stats (on-screen)
After the quiz, a stats box shows during the warning phase:
```
📋 Preparedness Results
Correct           3 / 4
Damage Reduction  52%
```
After the disaster strikes, replaced by a **Damage Report** box showing actual impact (buildings lost, money, population, etc.).

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
Destroyed buildings flash red. Damage report box shown on screen.

### Minigame Damage Reduction
Score M (0-4) reduces all damage by `M × 17.5%` — max 70% at perfect score.

### 🌊 Tsunami

Base values (before minigame reduction):

| Level | Edge range | Cost/bldg | Resilience | Happiness | Seawall blocks |
|---|---|---|---|---|---|
| 1 | 1 tile | $500 | -15 | -5 | Yes |
| 2 | 1 tile | **$3,000** | **-30** | **-10** | Yes |
| 3 | 2 tiles | **$15,000** | **-50** | **-18** | Yes |
| 4 | 2 tiles | **$60,000** | **-75** | **-30** | Yes |
| 5 | 3 tiles | **$200,000** | -90 | **-45** | **No** |

Seawall/Wave Absorber within 1 tile protects unless bypassed (L5). M=4 → $60K/bldg at L5, ~$300K total for 5 buildings.

### 🔥 Earthquake

Base values:

| Level | Max destroy | Cost/bldg | Resilience | Happiness |
|---|---|---|---|---|
| 1 | **4** | $300 | **-10** | **-4** |
| 2 | **6** | **$2,000** | **-25** | **-8** |
| 3 | **9** | **$8,000** | **-45** | **-15** |
| 4 | **13** | **$30,000** | **-70** | **-25** |
| 5 | **20** | **$100,000** | -90 | **-40** |

**Defenses reduce destruction:**
- Emergency Center: -1 destroyed
- Every 20 resilience: -1 destroyed (minimum 1)

M=4 → L5: 6 buildings destroyed, $30K/bldg, ~$180K total.

### ☀️ Drought

Base values:

| Level | Pop loss | Happiness | Money |
|---|---|---|---|
| 1 | **5** | **-8** | **$500** |
| 2 | **30** | **-15** | **$5,000** |
| 3 | **200** | **-25** | **$30,000** |
| 4 | **2,000** | **-40** | **$150,000** |
| 5 | **100,000** | **-60** | **$500,000** |

Defense: each water building reduces population loss by 15% (max 90%). Water buildings also save 1 happiness each (max 5). M=4 (70% reduction) → L5 with 5 water buildings: pop loss = 30K × 0.25 = 7,500, money = $150K.

### 💨 Smog

Base values:

| Level | Pollution | Pop loss | Happiness |
|---|---|---|---|
| 1 | +15 | **3** | **-3** |
| 2 | **+30** | **10** | **-10** |
| 3 | **+50** | **30** | **-20** |
| 4 | **+75** | **100** | **-40** |
| 5 | **+95** | **500** | **-60** |

Defense: each green building reduces pollution and population loss by 15% (max 90%). M=4 → L5 with 5 green buildings: pollution = +29 × 0.25 = +7, pop loss = 150 × 0.25 = 38.

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
