# Green City Tycoon

A sustainability-themed city management game where you build a green city on a 6×6 isometric grid.

## Game Overview

Place 20 building types across 8 categories — Economic, Green, Water, Energy, Coastal, Waste, Transport, and Science. Balance income against pollution, manage population growth, and keep your citizens happy while pushing toward 100% renewable energy and full climate resilience.

Six real-time meters track your city's performance: **Money**, **Population**, **Pollution**, **Happiness**, **Renewable %**, and **Resilience**. Every building has trade-offs — factories earn well but pollute, parks reduce pollution but cost money with no income, and renewable energy plants improve your clean-energy share.

Speed controls let you play at 1×, 2×, or pause to strategize.

## Tech Stack

- **React 19** + **TypeScript 6**
- **Vite 8** (build & dev server)
- **Three.js** + **React Three Fiber** + **Drei** (3D rendering)
- **Zustand** (state management)
- **oxlint** (linting)
- Deployed on **Vercel**

## Building Categories

| Category | Buildings | Color |
|---|---|---|
| Economic | House, Shop, Office Tower, Factory | Amber |
| Green | Park, Green Roof, Vertical Farm | Green |
| Water | Water Purifier, Desalination | Blue |
| Energy | Solar Panel, Wind Turbine, Wave Converter | Cyan |
| Coastal | Wave Absorber, Seawall | Sky Blue |
| Science | Observatory, Research Lab | Purple |
| Waste | Recycling Center, Composting Hub | Brown |
| Transport | Bike Lane, Transit Hub | Red |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run oxlint |

## How to Play

1. **Select a building** from the left sidebar (only affordable buildings are enabled)
2. **Click an empty tile** on the grid to place it
3. **Click an existing building** to remove it
4. Use the **speed controls** to pause, play at 1×, or fast-forward at 2×
5. Watch the **meters** on the right panel to monitor your city's health
6. **Drag to pan** and **scroll to zoom** the 3D view
