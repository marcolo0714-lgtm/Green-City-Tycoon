# Green City Tycoon — Game Statistics Reference

## Grid

- **9×9** square grid (81 tiles)
- Tiles are 1.6×1.6 units, spaced 2.6 apart (1.0-unit road gaps)

---

## Events System (Progression)

Events are one-time purchases that provide **permanent compounding multipliers** to all meters. Each event has conditions and takes 2–8 days to organize. Events unlock new buildings and are the primary progression mechanic.

### 10 Events

| # | Event | Cost | Days | Pop Req | Conditions | Key Effects |
|---|---|---|---|---|---|---|
| 1 | Community Green Day 🌱 | $500 | 2 | 50 | — | Inc ×2.0, Cap ×1.5, Grow ×2.0, Ren ×1.2 |
| 2 | Clean Energy Kickstart ⚡ | $3K | 3 | 200 | **Ren≥5%** | Inc ×2.0, Poll ×0.5, Res ×1.5, Cap ×1.5 |
| 3 | Coastal Shield Program 🛡️ | $8K | 3 | 500 | **Hap≥50%, Res≥8%** | Inc ×2.0, Res ×1.5, Cap ×2.0, Grow ×2.5 |
| 4 | Solar City Initiative ☀️ | $20K | 4 | 1,500 | **Ren≥20%** | Inc ×2.5, Ren ×1.7, Cap ×2.0, Grow ×2.5 |
| 5 | Water Security Initiative 🚰 | $50K | 4 | 5K | **Hap≥65%** | Inc ×2.5, Poll ×0.5, Cap ×2.5, Grow ×3.0 |
| 6 | Green Architecture Expo 🏛️ | $120K | 5 | 15K | **Res≥25%** | Inc ×2.5, Cap ×3.0, Grow ×3.0 |
| 7 | Water Renaissance 💧 | $300K | 5 | 50K | **Ren≥40%** | Inc ×3.0, Res ×2.0, Ren ×1.7, Grow ×3.0 |
| 8 | Climate Innovation District 🔬 | $800K | 6 | 150K | **Res≥35%** | Inc ×3.0, Grow ×3.0, Poll ×0.4, Cap ×3.5 |
| 9 | Smart Resilient City 🏙️ | $2M | 7 | 500K | **Res≥30%** | Inc ×3.5, Cap ×4.0, Grow ×4.0 |
| 10 | World Sustainability Summit 🕊️ | $5M | 8 | 2M | **Hap≥80%** | Inc ×4.0, Res ×2.0, Ren ×1.4, Poll ×0.4, Cap ×5.0, Grow ×5.0 |

All multipliers stack **multiplicatively** (cumulative). Events have **no prerequisite event requirements**.

### Cumulative Multipliers After Events

| After Event | Income | Pollution | Resilience | Pop Cap | Pop Growth |
|---|---|---|---|---|---|
| 0 (start) | ×1 | ×1 | ×1 | ×1 | ×1 |
| 2 | ×4.0 | ×0.5 | ×1.5 | ×2.25 | ×2.0 |
| 4 | ×20 | ×0.5 | ×2.25 | ×9.0 | ×12.5 |
| 6 | ×125 | ×0.25 | ×2.25 | ×67.5 | ×112.5 |
| 8 | ×1,125 | ×0.1 | ×2.25 | ×236 | ×1,013 |
| 10 | ×18,000 | **×0.04** | ×9.0 | ×4,725 | ×20,250 |

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
| **Pop Growth mult** | ×1 | ×2 | ×12.5 | ×112.5 | ×1,013 | ×20,250 |
| **Pop growth/day** (at 80% hap) | 48 | 96 | 600 | 5,400 | 48,624 | 972,000 |

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
| House | $20 | +10 | +10 | +0.2 | — | — | Economic |
| Shop | $45 | +22 | +15 | — | — | — | Economic |
| Park | $18 | 0 | -4 | +0.5 | — | — | Green |
| Green Roof | $40 | 0 | -2 | +0.2 | +3 | — | Green |
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
| Wetland Restoration | $580 | +15 | -7 | +0.3 | +1 | — | Water | #5 |
| Vertical Farm | $450 | +16 | -4 | +0.6 | — | — | Green | #6 |
| Vertical Forest | $800 | +24 | -9 | +0.9 | — | — | Green | #6 |
| Desalination | $650 | +20 | -4 | +0.3 | +4 | — | Water | #7 |
| Wave Converter | $550 | +18 | -2 | — | +2 | +5 | Energy | #7 |
| Research Lab | $1000 | +24 | -4 | — | +5 | +4 | Science | #8 |
| Observatory | $800 | 0 | -2 | +0.5 | +7 | — | Science | #8 |
| Emergency Center | $1400 | 0 | 0 | — | +16 | — | Science | #8 |
| Factory | $1800 | +50 | +15 | -0.3 | — | — | Economic | #9 |
| Smart Grid Center | $3500 | +55 | -5 | — | +7 | +7 | Energy | #9 |
| Global Trade Hub | $6000 | +110 | 0 | +0.8 | +4 | — | Economic | #9 |
| World Peace Garden | $12000 | 0 | -14 | +2.1 | — | — | Green | #10 |

---

## Building Adjacency Synergies

Placing specific buildings next to each other (N/S/E/W, no diagonals) grants a per-day happiness bonus or penalty. Both buildings must be fully constructed. Each adjacency instance contributes independently.

### Positive Pairs (+0.2–0.3%/day each)

| Pair | Effect |
|---|---|
| Park + House | +0.2%/day |
| Water Purifier + House | +0.2%/day |
| Vertical Forest + House | +0.3%/day |
| Recycling Center + Shop | +0.2%/day |
| Research Lab + Observatory | +0.3%/day |

### Negative Pairs (−0.5%/day each)

| Pair | Effect |
|---|---|
| Factory + House | −0.5%/day |
| Factory + Park | −0.5%/day |
| Wind Turbine + House | −0.5%/day |
| Factory + Vertical Farm | −0.5%/day |
| Office Tower + Green Roof | −0.5%/day |

An advisory hint appears on first discovery of each pair type.

---

## Meter Formulas

### Money
```
money += floor(sum of all completed buildings' income × activeBuffs.incomeMultiplier)
Starting: $300
```

### Population
```
housingCapacity = floor((ecoCount × 250 + greenCount × 50) × activeBuffs.popCapMultiplier)
popChange = housingCapacity > 0
  ? round(displayHappiness ≥ 30 ? (displayHappiness / 100) × 60 × popGrowthMultiplier : -5)
  : -round(population × 0.2)
overcrowdCap = floor(housingCapacity × 2.0)
population = clamp(pop + popChange, 0, overcrowdCap)
```
Without housing, population declines by **20% of current population per day**. Maximum population is twice the housing capacity. Base growth rate is 60 (× popGrowthMultiplier from events).

### Pollution
```
rawPollution = sum of all buildings' pollution stats
scaledPollution = round(rawPollution × activeBuffs.pollutionMultiplier)
pollution = clamp(0, 100, scaledPollution)
```

### Happiness
Happiness is stored internally at **×10 integer scale** (0–1000) for exact arithmetic with no floating-point drift. Displayed as integer with up to 1 decimal place: `display = Number((internal / 10).toFixed(1))`.

```
internalHappiness (0–1000) modified each day by:
  + sum of completed buildings' happinessBoost  (integer values, e.g. Park +5 = +0.5%/day)
  + adjacency synergy bonuses                    (sum of all active pair effects)
  − overcrowding streak penalty                  (see below)
  − pollution streak penalty                     (see below)
  − disaster one-off deductions                  (from applyDisaster, at ×10 scale)
  clamp(0, 1000)
```
Happiness is **not** affected by event multipliers — it serves as a punishment/consequence meter.

#### Pollution Streak Penalty (gradual escalation)
```
pollutionStreak = consecutive days pollution > 50
penalty = min(150, pollution × streak / 10)
```
Escalates with both pollution severity and duration. Example: pollution=100 gives −1.0%/day on day 1, −5.0%/day on day 5, −10.0%/day on day 10. Streak resets to 0 when pollution ≤ 50.

#### Overcrowding Streak Penalty (gradual escalation)
```
overcrowdStreak = consecutive days population > housingCapacity
overPct = floor((pop - cap) / cap × 10)   // 1 = 10% over, 10 = 100% over
penalty = min(150, overPct × 2 × overcrowdStreak)
```
Escalates with both severity and duration. Example: 10% overcrowding gives −0.2%/day on day 1, −1.0%/day on day 5, −2.0%/day on day 10. 100% overcrowding gives −2.0%/day on day 1, reaching −15.0%/day (capped) by day 8. Streak resets to 0 when population ≤ capacity.

### Renewable Energy %
```
scaledRenewable = round(sum(renewableBoost) × activeBuffs.renewableMultiplier)
renewable = clamp(0, 100, scaledRenewable)
```

### Resilience
```
scaledResilience = round(sum(resilienceBoost) × activeBuffs.resilienceMultiplier)
resilience = clamp(0, 100, scaledResilience)
decay: -1 every 3 days
```

---

## Special Rules

- **Coastal buildings** can only be placed on edge tiles (row/col 0 or 8)
- **Happiness** internal scale: ×10 (0–1000), starting at 400 (40% displayed)
- **Starting population**: 100, **starting money**: $300
- **Overcrowding** allows population up to 200% of housing capacity; penalties escalate with severity and duration
- **Resilience** decays by 1 every 3 days
- **Events**: one-time purchases with compounding multiplier buffs; no prerequisite events
- **Building unlock**: most buildings require specific events to be organized
- **Adjacency synergies**: only count when both buildings are fully constructed
- **Construction**: buildings take 2 days, contribute nothing until completed (except positive-pollution buildings)

---

## Disasters

Disaster level is **derived from events organized**:

| Events Held | 0–1 | 2–3 | 4–5 | 6–7 | 8+ |
|---|---|---|---|---|---|
| **Disaster Level** | 1 | 2 | 3 | 4 | 5 |

Random: **30% chance per day** (no active warning/disaster). Warning phase lasts 2–5 days (base 2, +1 per science building). Active phase lasts 3 days.

### Minigame Damage Reduction
Score M (0-4) reduces all damage by `M × 17.5%` — max 70% at perfect score (M=4).

### 🌊 Tsunami

| Level | Edge range | Cost/bldg | Resilience | Happiness |
|---|---|---|---|---|
| 1 | 1 tile | $500 | -15 | -5 |
| 2 | 1 tile | $3,000 | -30 | -10 |
| 3 | 2 tiles | $15,000 | -50 | -18 |
| 4 | 2 tiles | $60,000 | -75 | -30 |
| 5 | 3 tiles | $200,000 | -90 | -45 |

Seawall/Wave Absorber within 1 tile protects adjacent buildings unless bypassed at Level 5. Values shown before minigame reduction.

### 🔥 Earthquake

| Level | Max destroy | Cost/bldg | Resilience | Happiness |
|---|---|---|---|---|
| 1 | 4 | $300 | -10 | -4 |
| 2 | 6 | $2,000 | -25 | -8 |
| 3 | 9 | $8,000 | -45 | -15 |
| 4 | 13 | $30,000 | -70 | -25 |
| 5 | 20 | $100,000 | -90 | -40 |

Defenses: Emergency Center (-1 destroyed), every 20 resilience (-1 destroyed). Minimum 1 building destroyed. Values before minigame reduction.

### ☀️ Drought

| Level | Pop loss | Happiness | Money |
|---|---|---|---|
| 1 | 5 | -8 | $500 |
| 2 | 30 | -15 | $5,000 |
| 3 | 200 | -25 | $30,000 |
| 4 | 2,000 | -40 | $150,000 |
| 5 | 100,000 | -60 | $500,000 |

Defense: each water building reduces population loss by 15% (max 90%). Water buildings also save 1 happiness each (max 5). Values before minigame reduction.

### 💨 Smog

| Level | Pollution | Pop loss | Happiness |
|---|---|---|---|
| 1 | +15 | 3 | -3 |
| 2 | +30 | 10 | -10 |
| 3 | +50 | 30 | -20 |
| 4 | +75 | 100 | -40 |
| 5 | +95 | 500 | -60 |

Defense: each green building reduces pollution and population loss by 15% (max 90%). Values before minigame reduction.

---

## Win / Lose

### Win Condition (all simultaneously)

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
