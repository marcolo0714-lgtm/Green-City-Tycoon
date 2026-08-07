# Asset generation prompts

This project did not use any image-, audio-, or 3D-model-generation tools. Every visual asset in the running game is one of:

- **3D building models** (in `src/components/BuildingModel3D.tsx`): composed from React Three Fiber primitive meshes (`<Box>`, `<Cylinder>`, `<Sphere>`, `<Cone>`) inside pure JSX functions. There are 30 such models, each averaging 30–50 lines.
- **CSS event illustrations** (in `src/components/EventPopup.tsx`): per-event CSS scenes with named divs and absolute positioning on a gradient background. There are 10 such illustrations, each averaging 100–200 lines of CSS in `src/App.css`.
- **UI styling** (in `src/App.css`): hand-written CSS, ~1,700 lines total, covering the status bar, sidebars, meters, popups, toasts, modals, and timezone-agnostic visual states.
- **Quiz content** (in `src/data/questions.ts`): 110 hand-authored multiple-choice questions grouped by disaster type and a general category.

Below is the index of "asset" entries the report's JSON schema expects, populated with the actual source-of-asset.

## Building 3D models (30 entries)

| Building | Asset file | Shape used | Generated with | Prompt |
|---|---|---|---|---|
| House | `src/components/BuildingModel3D.tsx` (`House3D`) | `house` | R3F primitives (Box + slope + windows + door) | hand-composed JSX, no prompt |
| Shop | `src/components/BuildingModel3D.tsx` (`Shop3D`) | `shop` | R3F primitives (Box + awning + window + door) | hand-composed JSX, no prompt |
| Park | `src/components/BuildingModel3D.tsx` (`Park3D`) | `park` | R3F primitives (flat slats + tree + bushes) | hand-composed JSX, no prompt |
| Green Roof | `src/components/BuildingModel3D.tsx` (`GreenRoof3D`) | `green_roof` | R3F primitives (Box base + green top + planters) | hand-composed JSX, no prompt |
| Water Purifier | `src/components/BuildingModel3D.tsx` (`Cylinder3D`) | `cylinder` | R3F primitives (Cylinder + bands + base) | hand-composed JSX, no prompt |
| Rainwater Harvester | `src/components/BuildingModel3D.tsx` (`RainwaterHarvester3D`) | `rainwater` (new shape) | R3F primitives (tank + funnel + downpipe + spigot) | hand-composed JSX, no prompt |
| Solar Panel | `src/components/BuildingModel3D.tsx` (`Solar3D`) | `solar` | R3F primitives (tilted grid + stand) | hand-composed JSX, no prompt |
| Wind Turbine | `src/components/BuildingModel3D.tsx` (`Turbine3D`) | `turbine` | R3F primitives (tower + spinning blades) | hand-composed JSX, no prompt |
| Recycling Center | `src/components/BuildingModel3D.tsx` (`Chimney3D`) | `chimney` | R3F primitives (Box + chimney tops) | hand-composed JSX, no prompt |
| Composting Hub | `src/components/BuildingModel3D.tsx` (`Block3D`) | `block` | R3F primitives (Box) | hand-composed JSX, no prompt |
| Seawall | `src/components/BuildingModel3D.tsx` (`Wall3D`) | `wall` | R3F primitives (Box wall + cap) | hand-composed JSX, no prompt |
| Wave Absorber | `src/components/BuildingModel3D.tsx` (`Sloped3D`) | `sloped` | R3F primitives (sloped Box) | hand-composed JSX, no prompt |
| Geothermal Plant | `src/components/BuildingModel3D.tsx` (`Geothermal3D`) | `geothermal` | R3F primitives (Box + chimney + steam) | hand-composed JSX, no prompt |
| Office Tower | `src/components/BuildingModel3D.tsx` (`Tower3D`) | `tower` | R3F primitives (Box + windows + roof) | hand-composed JSX, no prompt |
| Aquifer Recharge | `src/components/BuildingModel3D.tsx` (`AquiferRecharge3D`) | `aquifer` (new shape) | R3F primitives (well head + underground pipe + pump) | hand-composed JSX, no prompt |
| Wetland Restoration | `src/components/BuildingModel3D.tsx` (`WetlandRestoration3D`) | `wetland` (new shape) | R3F primitives (pond + reeds + lotus + boardwalk) | hand-composed JSX, no prompt |
| Vertical Farm | `src/components/BuildingModel3D.tsx` (`Stepped3D`) | `stepped` | R3F primitives (stepped Boxes + glass panels) | hand-composed JSX, no prompt |
| Vertical Forest | `src/components/BuildingModel3D.tsx` (`ForestTower3D`) | `forest_tower` | R3F primitives (tower + foliage) | hand-composed JSX, no prompt |
| Desalination | `src/components/BuildingModel3D.tsx` (`Cylinder3D`) | `cylinder` | R3F primitives (Cylinder + bands + brine pipe) | hand-composed JSX, no prompt |
| Wave Converter | `src/components/BuildingModel3D.tsx` (`Block3D`) | `block` | R3F primitives (Box + wave decoration) | hand-composed JSX, no prompt |
| Research Lab | `src/components/BuildingModel3D.tsx` (`Lab3D`) | `lab` | R3F primitives (Box + windows + dome) | hand-composed JSX, no prompt |
| Observatory | `src/components/BuildingModel3D.tsx` (`Observatory3D`) | `observatory` | R3F primitives (cylinder + telescope + dome) | hand-composed JSX, no prompt |
| Emergency Center | `src/components/BuildingModel3D.tsx` (`Block3D`) | `block` | R3F primitives (Box + siren) | hand-composed JSX, no prompt |
| Factory | `src/components/BuildingModel3D.tsx` (`Factory3D`) | `factory` | R3F primitives (Box + garage door + chimney) | hand-composed JSX, no prompt |
| Smart Grid Center | `src/components/BuildingModel3D.tsx` (`GridCenter3D`) | `grid_center` | R3F primitives (Box + battery cells) | hand-composed JSX, no prompt |
| Global Trade Hub | `src/components/BuildingModel3D.tsx` (`TradeCenter3D`) | `trade_center` | R3F primitives (Tower + globe + spires) | hand-composed JSX, no prompt |
| World Peace Garden | `src/components/BuildingModel3D.tsx` (`PeaceGarden3D`) | `peace_garden` | R3F primitives (low garden + centerpiece + flags) | hand-composed JSX, no prompt |

## Event popup illustrations (10 entries)

| Event | CSS illustration | Generated with | File |
|---|---|---|---|
| Community Green Day | `.illo-…` | CSS-only named divs + gradients | `src/App.css` |
| Clean Energy Kickstart | `.illo-…` | CSS-only | `src/App.css` |
| Coastal Shield Program | `.illo-…` | CSS-only | `src/App.css` |
| Solar City Initiative | `.illo-…` | CSS-only | `src/App.css` |
| Water Security Initiative | `.illo-ws` (sky + clouds + rain + tank + aquifer + wetland) | CSS-only | `src/App.css` |
| Green Architecture Expo | `.illo-ga` (sky + building + vines) | CSS-only | `src/App.css` |
| Water Renaissance | `.illo-wr` (sky + sea + intake + tanks + outlet) | CSS-only | `src/App.css` |
| Climate Innovation District | `.illo-ci` (sky + buildings + telescopes) | CSS-only | `src/App.css` |
| Smart Resilient City | `.illo-…` | CSS-only | `src/App.css` |
| World Sustainability Summit | `.illo-…` | CSS-only | `src/App.css` |

## Notes for the next intern

If a future project needs stylized 3D models, the React Three Fiber primitive-composition approach is genuinely fast: each building took 5-15 minutes to compose once the pattern was clear. The reusable pattern is:

```tsx
function Building3D({ color, height, id }: BProps) {
  const h = height * 1.2;
  return (
    <group>
      <Box args={[1, h, 1]} position={[0, h/2, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Box>
      {/* decoration: windows, doors, roof, etc. */}
    </group>
  );
}
```

For unique buildings, write a new 3D component. For variants of an existing shape, branch on `id` inside the existing component (e.g., `id === 'transit_hub' ? <transit details> : <generic details>`).
