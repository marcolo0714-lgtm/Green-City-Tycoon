import { useMemo, Suspense, useCallback, memo, useState, useRef, useEffect } from 'react';
import { Canvas, type ThreeEvent, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import BuildingModel3D from './BuildingModel3D';
import type { Building } from '../types';

const TILE_SIZE = 1.6;
const SPACING = 2.6;
const ROAD_W = SPACING - TILE_SIZE + 0.05;

function tileToWorld(col: number, row: number): [number, number, number] {
  return [col * SPACING, 0, row * SPACING];
}

/* ---- road: full-length box from tile center to tile center ---- */
const RoadStrip = memo(function RoadStrip({ x0, z0, x1, z1, terrain }: {
  x0: number; z0: number; x1: number; z1: number; terrain?: boolean;
}) {
  const dx = x1 - x0, dz = z1 - z0;
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);
  const gapStart = -length * 0.3;
  const gapEnd = length * 0.3;
  const dashCount = Math.max(1, Math.floor((gapEnd - gapStart) / 0.6));
  const roadColor = terrain ? '#7f1d1d' : '#4a4a4a';
  return (
    <group position={[(x0 + x1) / 2, -0.04, (z0 + z1) / 2]} rotation={[0, -angle, 0]}>
      <mesh>
        <boxGeometry args={[length, 0.04, ROAD_W]} />
        <meshStandardMaterial color={roadColor} roughness={0.9} />
      </mesh>
      {Array.from({ length: dashCount }, (_, i) => {
        const cx = gapStart + 0.2 + i * 0.6;
        if (cx + 0.125 > gapEnd) return null;
        return (
          <mesh key={i} position={[cx, 0.025, 0]}>
            <boxGeometry args={[0.25, 0.005, 0.04]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        );
      })}
    </group>
  );
});

/* ---- ground tile ---- */
const GroundTile = memo(function GroundTile({ col, row, occupied, terrain }: {
  col: number; row: number; occupied: boolean; terrain: boolean;
}) {
  const [x, , z] = tileToWorld(col, row);
  const color = terrain ? '#8b4513' : occupied ? '#c4a562' : '#b8954a';
  return (
    <mesh position={[x, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[TILE_SIZE, TILE_SIZE]} />
      <meshStandardMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
});

/* ---- destroyed tile blink ---- */
const DestroyedOverlay = memo(function DestroyedOverlay({ col, row }: { col: number; row: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.3 + Math.sin(Date.now() * 0.01) * 0.25;
    }
  });
  const [x, , z] = tileToWorld(col, row);
  return (
    <mesh ref={ref} position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[TILE_SIZE, TILE_SIZE]} />
      <meshBasicMaterial color="#ef4444" transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
});

/* ---- terrain pair: connected obstacle spanning 2 tiles + road ---- */
const TerrainPair = memo(function TerrainPair({
  c1, r1, c2, r2, type, clearing,
  onClearTile,
}: {
  c1: number; r1: number; c2: number; r2: number;
  type: string; clearing: number;
  onClearTile: (e: ThreeEvent<MouseEvent>, ri: number, ci: number) => void;
}) {
  const [x1, , z1] = tileToWorld(c1, r1);
  const [x2, , z2] = tileToWorld(c2, r2);
  const mx = (x1 + x2) / 2, mz = (z1 + z2) / 2;
  const [hover, setHover] = useState(false);
  const clearCost = type === 'mountain' ? '$8,000' : type === 'lake' ? '$4,000' : '$2,000';
  const clearTime = type === 'mountain' ? '6d' : type === 'lake' ? '4d' : '2d';

  return (
    <group position={[mx, 0, mz]} onClick={(e) => onClearTile(e, r1, c1)}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
      onPointerOut={() => setHover(false)}>
      {type === 'mountain' && (
        <>
          {/* Wide base */}
          <mesh position={[0, 0.15, 0]}>
            <coneGeometry args={[1.8, 0.6, 8]} />
            <meshStandardMaterial color="#6b5b4f" roughness={0.85} />
          </mesh>
          {/* Tall peak */}
          <mesh position={[0, 0.6, 0]}>
            <coneGeometry args={[1.2, 2.2, 8]} />
            <meshStandardMaterial color="#8b7355" roughness={0.8} />
          </mesh>
          {/* Snow cap */}
          <mesh position={[0, 1.5, 0]}>
            <coneGeometry args={[0.4, 0.4, 6]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
          </mesh>
        </>
      )}
      {type === 'lake' && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.8, 24]} />
          <meshStandardMaterial color="#3b82f6" transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
      )}
      {type === 'forest' && (
        <>
          {[
            // Tile 1 trees (more dense)
            [x1 - mx - 0.3, z1 - mz - 0.3, 0.3],
            [x1 - mx + 0.3, z1 - mz - 0.2, 0.28],
            [x1 - mx + 0.1, z1 - mz + 0.3, 0.25],
            [x1 - mx - 0.2, z1 - mz + 0.1, 0.22],
            [x1 - mx + 0.25, z1 - mz + 0.15, 0.18],
            // Tile 2 trees (more dense)
            [x2 - mx - 0.2, z2 - mz - 0.2, 0.28],
            [x2 - mx + 0.35, z2 - mz - 0.1, 0.3],
            [x2 - mx, z2 - mz + 0.3, 0.25],
            [x2 - mx - 0.3, z2 - mz + 0.15, 0.2],
            [x2 - mx + 0.2, z2 - mz + 0.2, 0.18],
            // Road trees (sparser)
            [mx - mx - 0.15, mz - mz - 0.1, 0.2],
            [mx - mx + 0.2, mz - mz + 0.05, 0.18],
          ].map(([tx, tz, tr], i) => (
            <mesh key={i} position={[tx as number, 0.25, tz as number]}>
              <sphereGeometry args={[tr as number, 6, 6]} />
              <meshStandardMaterial color={i % 3 === 0 ? '#166534' : i % 3 === 1 ? '#15803d' : '#14532d'} roughness={1} />
            </mesh>
          ))}
        </>
      )}

      {/* Clearing indicator */}
      {clearing > 0 && (
        <Html position={[0, type === 'mountain' ? 1.8 : 0.6, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{
            background: '#fbbf24dd', color: '#1a1a1a', padding: '2px 8px', borderRadius: 4,
            fontSize: '0.55rem', fontWeight: 700, whiteSpace: 'nowrap', fontFamily: 'system-ui, sans-serif',
          }}>🚧 {clearing}d</div>
        </Html>
      )}

      {/* Hover tooltip */}
      {hover && clearing === 0 && (
        <Html position={[0, type === 'mountain' ? 2 : 0.8, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{
            background: '#111827ee', color: '#e2e8f0', padding: '4px 10px', borderRadius: 6,
            fontSize: '0.65rem', fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'system-ui, sans-serif',
            border: '1px solid #334155', textAlign: 'center',
          }}>
            <div style={{ textTransform: 'capitalize' }}>{type}</div>
            <div style={{ color: '#fbbf24', fontSize: '0.58rem' }}>Clear: {clearCost} ({clearTime})</div>
          </div>
        </Html>
      )}
    </group>
  );
});

/* ---- walking person ---- */
const PColors = ['#cbd5e1', '#94a3b8', '#fbbf24', '#f87171', '#60a5fa', '#a78bfa', '#34d399'];
function WalkingPerson({ sx, sz, ex, ez, speed }: {
  sx: number; sz: number; ex: number; ez: number; speed: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const tRef = useRef(Math.random());
  const color = useMemo(() => PColors[Math.floor(Math.random() * PColors.length)], []);
  const facingRight = useRef(Math.random() > 0.5);
  const gameSpeed = useGameStore((s) => s.gameSpeed);
  useFrame((_, delta) => {
    if (!ref.current || gameSpeed === 0) return;
    tRef.current += delta * speed * gameSpeed;
    if (tRef.current > 1) { tRef.current = 0; facingRight.current = !facingRight.current; }
    const t = facingRight.current ? tRef.current : 1 - tRef.current;
    ref.current.position.x = THREE.MathUtils.lerp(sx, ex, t);
    ref.current.position.z = THREE.MathUtils.lerp(sz, ez, t);
    ref.current.rotation.y = facingRight.current
      ? Math.atan2(ez - sz, ex - sx)
      : Math.atan2(sz - ez, sx - ex);
  });
  return (
    <group ref={ref} position={[sx, 0.03, sz]}>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.12, 6]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color="#fcd9b6" roughness={0.7} />
      </mesh>
    </group>
  );
}

/* ---- building on tile ---- */
const BuildingOnTile = memo(function BuildingOnTile({
  building, col, row, onClick, selectedBuilding, constructionRemaining, justCompleted,
}: {
  building: Building; col: number; row: number;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
  selectedBuilding: Building | null;
  constructionRemaining: number;
  justCompleted: boolean;
}) {
  const [hover, setHover] = useState(false);
  const [x, , z] = tileToWorld(col, row);
  const showLabel = hover && !selectedBuilding;
  const labelY = building.height * 1.2 * 1.5 + 0.5;
  const buildingH = building.height * 1.2;
  const cutY = constructionRemaining > 0 ? buildingH * (1 - constructionRemaining / 2) : buildingH;
  const bldRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const group = bldRef.current;
    if (!group || constructionRemaining === 0) return;
    const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), cutY);
    const materials: Array<{ mat: THREE.Material; oldSide: THREE.Side }> = [];
    group.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach(m => {
          materials.push({ mat: m, oldSide: m.side });
          m.clippingPlanes = [plane];
          m.clipShadows = true;
          m.side = THREE.DoubleSide;
          m.needsUpdate = true;
        });
      }
    });
    return () => {
      materials.forEach(({ mat, oldSide }) => {
        mat.clippingPlanes = null;
        mat.side = oldSide;
        mat.needsUpdate = true;
      });
    };
  }, [constructionRemaining, cutY]);

  return (
    <group position={[x, 0, z]} onClick={onClick}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
      onPointerOut={() => setHover(false)}>
      <group ref={bldRef}>
        <BuildingModel3D building={building} />
      </group>
      {constructionRemaining > 0 && (
        <group position={[0, cutY, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[TILE_SIZE * 0.85, TILE_SIZE * 0.85]} />
            <meshStandardMaterial color="#fbbf24" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
          <Html position={[0, 0.15, 0]} center style={{ pointerEvents: 'none' }}>
            <div style={{
              background: '#fbbf24dd', color: '#1a1a1a', padding: '2px 8px', borderRadius: 4,
              fontSize: '0.6rem', fontWeight: 700, whiteSpace: 'nowrap', fontFamily: 'system-ui, sans-serif',
            }}>🚧 {constructionRemaining === 2 ? '50%' : '75%'}</div>
          </Html>
        </group>
      )}
      {justCompleted && (
        <Html position={[0, buildingH + 0.5, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="build-popup">
            <div className="build-popup-title">{building.emoji} {building.name} Complete!</div>
            {building.income !== 0 && (
              <div className={`build-popup-stat ${building.income > 0 ? 'up' : 'down'}`}>
                {building.income > 0 ? '+' : ''}{building.income} $/mo
              </div>
            )}
            {building.pollution !== 0 && (
              <div className={`build-popup-stat ${building.pollution < 0 ? 'up' : 'down'}`}>
                {building.pollution < 0 ? '' : '+'}{building.pollution} pollution
              </div>
            )}
            {building.happinessBoost !== 0 && (
              <div className={`build-popup-stat ${building.happinessBoost > 0 ? 'up' : 'down'}`}>
                {building.happinessBoost > 0 ? '+' : ''}{building.happinessBoost} happiness
              </div>
            )}
          </div>
        </Html>
      )}
      {showLabel && (
        <Html position={[0, labelY, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{
            background: '#111827dd', color: '#e2e8f0', padding: '3px 10px', borderRadius: 6,
            fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'system-ui, sans-serif',
            backdropFilter: 'blur(4px)', border: '1px solid #334155',
          }}>{building.name}</div>
        </Html>
      )}
    </group>
  );
});

/* ---- placeholder ---- */
const PlaceholderTile = memo(function PlaceholderTile({ col, row, onClick, label }: {
  col: number; row: number; onClick: (e: ThreeEvent<MouseEvent>) => void; label?: string;
}) {
  const [hover, setHover] = useState(false);
  const [x, , z] = tileToWorld(col, row);
  return (
    <group onPointerOver={(e) => { e.stopPropagation(); setHover(true); }} onPointerOut={() => setHover(false)}>
      <mesh position={[x, 0.12, z]} onClick={onClick}>
        <boxGeometry args={[TILE_SIZE * 0.55, 0.08, TILE_SIZE * 0.55]} />
        <meshStandardMaterial color={hover ? '#88cc88' : '#66aa66'} transparent opacity={hover ? 0.5 : 0.3} />
      </mesh>
      {hover && label && (
        <Html position={[x, 0.4, z]} center style={{ pointerEvents: 'none' }}>
          <div style={{
            background: '#111827dd', color: '#86efac', padding: '3px 8px', borderRadius: 5,
            fontSize: '0.65rem', fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'system-ui, sans-serif',
          }}>Place {label}</div>
        </Html>
      )}
    </group>
  );
});

/* ---- grid content ---- */
function GridContent() {
  const grid = useGameStore((s) => s.grid);
  const gridSize = useGameStore((s) => s.gridSize);
  const selectedBuilding = useGameStore((s) => s.selectedBuilding);
  const money = useGameStore((s) => s.money);
  const population = useGameStore((s) => s.population);
  const constructionMap = useGameStore((s) => s.constructionMap);
  const terrainMap = useGameStore((s) => s.terrainMap);
  const terrainClearing = useGameStore((s) => s.terrainClearing);
  const clearTerrain = useGameStore((s) => s.clearTerrain);
  const destroyedTiles = useGameStore((s) => s.destroyedTiles);
  const justCompleted = useGameStore((s) => s.justCompleted);
  const clearJustCompleted = useGameStore((s) => s.clearJustCompleted);
  const gameSpeed = useGameStore((s) => s.gameSpeed);
  const gameSpeedRef = useRef(gameSpeed);
  gameSpeedRef.current = gameSpeed;
  const placeBuilding = useGameStore((s) => s.placeBuilding);
  const removeBuilding = useGameStore((s) => s.removeBuilding);

  const tiles = useMemo(() => {
    const arr: Array<{ ri: number; ci: number; building: Building | null }> = [];
    for (let ri = 0; ri < gridSize; ri++)
      for (let ci = 0; ci < gridSize; ci++)
        arr.push({ ri, ci, building: grid[ri][ci] });
    arr.sort((a, b) => (b.ri + b.ci) - (a.ri + a.ci));
    return arr;
  }, [grid, gridSize]);

  const roads = useMemo(() => {
    const segs: Array<{ x0: number; z0: number; x1: number; z1: number; terrain: boolean }> = [];
    for (let ri = 0; ri < gridSize; ri++) {
      for (let ci = 0; ci < gridSize; ci++) {
        const [x0, , z0] = tileToWorld(ci, ri);
        if (ci + 1 < gridSize) {
          const [x1, , z1] = tileToWorld(ci + 1, ri);
          const t = !!terrainMap[`${ri},${ci}`] && !!terrainMap[`${ri},${ci + 1}`];
          segs.push({ x0, z0, x1, z1, terrain: t });
        }
        if (ri + 1 < gridSize) {
          const [x1, , z1] = tileToWorld(ci, ri + 1);
          const t = !!terrainMap[`${ri},${ci}`] && !!terrainMap[`${ri + 1},${ci}`];
          segs.push({ x0, z0, x1, z1, terrain: t });
        }
      }
    }
    return segs;
  }, [gridSize, terrainMap]);

  const peopleCount = Math.min(Math.max(Math.round(population / 3), 2), 40);
  const people = useMemo(() => {
    if (roads.length === 0) return [];
    return Array.from({ length: peopleCount }, () => {
      const r = roads[Math.floor(Math.random() * roads.length)];
      return { sx: r.x0, sz: r.z0, ex: r.x1, ez: r.z1, speed: 0.06 + Math.random() * 0.1 };
    });
  }, [roads, peopleCount]);

  const handlePlace = useCallback((_e: ThreeEvent<MouseEvent>, ri: number, ci: number) => {
    _e.stopPropagation();
    if (selectedBuilding && money >= selectedBuilding.cost) placeBuilding(ri, ci);
  }, [selectedBuilding, money, placeBuilding]);

  const handleClearTerrain = useCallback((_e: ThreeEvent<MouseEvent>, ri: number, ci: number) => {
    _e.stopPropagation();
    clearTerrain(ri, ci);
  }, [clearTerrain]);

  const handleRemove = useCallback((_e: ThreeEvent<MouseEvent>, ri: number, ci: number) => {
    _e.stopPropagation();
    removeBuilding(ri, ci);
  }, [removeBuilding]);

  useEffect(() => {
    if (justCompleted.length > 0 && gameSpeedRef.current !== 0) {
      const t = setTimeout(() => clearJustCompleted(), 2500);
      return () => clearTimeout(t);
    }
  }, [justCompleted, clearJustCompleted]);

  const canAfford = selectedBuilding ? money >= selectedBuilding.cost : false;

  // Circular land under the square grid
  const gridCenter = (gridSize - 1) * SPACING * 0.5;
  const landSide = (gridSize - 1) * SPACING * 1.15;

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 10, 5]} intensity={0.85} castShadow />
      <directionalLight position={[-5, 4, -3]} intensity={0.25} />

      {/* Square land under the grid */}
      <mesh position={[gridCenter, -0.06, gridCenter]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[landSide, landSide]} />
        <meshStandardMaterial color="#4a6230" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>

      {roads.map((seg, i) => (
        <RoadStrip key={`r-${i}`} x0={seg.x0} z0={seg.z0} x1={seg.x1} z1={seg.z1} terrain={seg.terrain} />
      ))}

      {people.map((p, i) => (
        <WalkingPerson key={`wp-${i}`} sx={p.sx} sz={p.sz} ex={p.ex} ez={p.ez} speed={p.speed} />
      ))}

      {tiles.map(({ ri, ci, building }) => (
        <GroundTile key={`g-${ri}-${ci}`} col={ci} row={ri}
          occupied={!!building || !!terrainMap[`${ri},${ci}`]}
          terrain={!!terrainMap[`${ri},${ci}`]} />
      ))}

      {/* Terrain pairs: group adjacent same-type tiles */}
      {(() => {
        const seen = new Set<string>();
        const pairs: Array<{ c1: number; r1: number; c2: number; r2: number; type: string }> = [];
        for (const [key, t] of Object.entries(terrainMap)) {
          if (seen.has(key)) continue;
          const [r, c] = key.split(',').map(Number);
          // Check right neighbor
          const rightKey = `${r},${c + 1}`;
          if (terrainMap[rightKey]?.type === t.type && !seen.has(rightKey)) {
            seen.add(key); seen.add(rightKey);
            pairs.push({ c1: c, r1: r, c2: c + 1, r2: r, type: t.type });
            continue;
          }
          // Check bottom neighbor
          const bottomKey = `${r + 1},${c}`;
          if (terrainMap[bottomKey]?.type === t.type && !seen.has(bottomKey)) {
            seen.add(key); seen.add(bottomKey);
            pairs.push({ c1: c, r1: r, c2: c, r2: r + 1, type: t.type });
            continue;
          }
          // Solo terrain (shouldn't happen, but handle)
          seen.add(key);
        }
        return pairs.map((p) => {
          const clearing = terrainClearing[`${p.r1},${p.c1}`] || terrainClearing[`${p.r2},${p.c2}`] || 0;
          return (
            <TerrainPair key={`tp-${p.r1},${p.c1}`}
              c1={p.c1} r1={p.r1} c2={p.c2} r2={p.r2} type={p.type} clearing={clearing}
              onClearTile={handleClearTerrain} />
          );
        });
      })()}

      {/* Destroyed building overlays */}
      {destroyedTiles.map((key) => {
        const [r, c] = key.split(',').map(Number);
        return <DestroyedOverlay key={`destroy-${key}`} col={c} row={r} />;
      })}

      {tiles.map(({ ri, ci, building }) => {
        if (!building) {
          if (selectedBuilding && canAfford)
            return <PlaceholderTile key={`ph-${ri}-${ci}`} col={ci} row={ri} onClick={(e) => handlePlace(e, ri, ci)} label={selectedBuilding.name} />;
          return null;
        }
        return <BuildingOnTile key={`b-${ri}-${ci}`} building={building} col={ci} row={ri}
          onClick={(e) => handleRemove(e, ri, ci)} selectedBuilding={selectedBuilding}
          constructionRemaining={constructionMap[`${ri},${ci}`] ?? 0}
          justCompleted={justCompleted.includes(`${ri},${ci}`)} />;
      })}
    </>
  );
}

/* ---- scene ---- */
export default function GameScene3D() {
  const gridSize = useGameStore((s) => s.gridSize);
  const gridCenter = (gridSize - 1) * SPACING * 0.5;
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [gridCenter * 2, gridCenter, gridCenter * 2], fov: 35, near: 0.1, far: 120 }}
        gl={{ localClippingEnabled: true }}
        style={{ background: 'radial-gradient(ellipse at center, #0e7490 0%, #155e75 30%, #1e3a5f 60%, #0f172a 100%)' }}>
        <Suspense fallback={null}>
          <GridContent />
        </Suspense>
        <OrbitControls enableDamping dampingFactor={0.1} target={[gridCenter, 0, gridCenter]}
          minDistance={12} maxDistance={40} maxPolarAngle={Math.PI / 2.3} enablePan />
      </Canvas>
    </div>
  );
}
