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
  return [(col - row) * SPACING, 0, (col + row) * SPACING * 0.5];
}

/* ---- road: full-length box from tile center to tile center ---- */
const RoadStrip = memo(function RoadStrip({ x0, z0, x1, z1 }: { x0: number; z0: number; x1: number; z1: number }) {
  const dx = x1 - x0, dz = z1 - z0;
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);
  // Only draw dashes in the gap between tiles (trim ~20% from each end)
  const gapStart = -length * 0.3;
  const gapEnd = length * 0.3;
  const dashCount = Math.max(1, Math.floor((gapEnd - gapStart) / 0.6));
  return (
    <group position={[(x0 + x1) / 2, -0.04, (z0 + z1) / 2]} rotation={[0, -angle, 0]}>
      {/* Road surface */}
      <mesh>
        <boxGeometry args={[length, 0.04, ROAD_W]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>
      {/* Dashed centre line — only in the gap */}
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
const GroundTile = memo(function GroundTile({ col, row, occupied }: { col: number; row: number; occupied: boolean }) {
  const [x, , z] = tileToWorld(col, row);
  return (
    <mesh position={[x, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[TILE_SIZE, TILE_SIZE]} />
      <meshStandardMaterial color={occupied ? '#4a5e2a' : '#374a1e'} side={THREE.DoubleSide} />
    </mesh>
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
  useFrame((_, delta) => {
    if (!ref.current) return;
    tRef.current += delta * speed;
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
  building, col, row, onClick, selectedBuilding, constructionRemaining,
}: {
  building: Building; col: number; row: number;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
  selectedBuilding: Building | null;
  constructionRemaining: number;
}) {
  const [hover, setHover] = useState(false);
  const [x, , z] = tileToWorld(col, row);
  const showLabel = hover && !selectedBuilding;
  const labelY = building.height * 1.2 * 1.5 + 0.5;
  const buildingH = building.height * 1.2;
  const cutY = constructionRemaining > 0 ? buildingH * (1 - constructionRemaining / 2) : buildingH;
  const bldRef = useRef<THREE.Group>(null);

  // Apply clipping plane to hide unbuilt portion (cuts from top)
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
      {/* Clipped building */}
      <group ref={bldRef}>
        <BuildingModel3D building={building} />
      </group>

      {/* Construction indicator */}
      {constructionRemaining > 0 && (
        <group position={[0, cutY, 0]}>
          {/* Yellow construction cap */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[TILE_SIZE * 0.85, TILE_SIZE * 0.85]} />
            <meshStandardMaterial color="#fbbf24" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
          {/* Construction label */}
          <Html position={[0, 0.15, 0]} center style={{ pointerEvents: 'none' }}>
            <div style={{
              background: '#fbbf24dd', color: '#1a1a1a', padding: '2px 8px', borderRadius: 4,
              fontSize: '0.6rem', fontWeight: 700, whiteSpace: 'nowrap', fontFamily: 'system-ui, sans-serif',
            }}>🚧 {constructionRemaining === 2 ? '50%' : '75%'}</div>
          </Html>
        </group>
      )}

      {/* Hover label (when no building selected) */}
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
  const placeBuilding = useGameStore((s) => s.placeBuilding);
  const removeBuilding = useGameStore((s) => s.removeBuilding);

  const tiles = useMemo(() => {
    const arr: Array<{ ri: number; ci: number; building: Building | null }> = [];
    for (let ri = 0; ri < gridSize; ri++)
      for (let ci = 0; ci < gridSize; ci++)
        arr.push({ ri, ci, building: grid[ri][ci] });
    arr.sort((a, b) => (a.ri + a.ci) - (b.ri + b.ci));
    return arr;
  }, [grid, gridSize]);

  // Road segments (only between direct tile neighbours, full length)
  const roads = useMemo(() => {
    const segs: Array<{ x0: number; z0: number; x1: number; z1: number }> = [];
    for (let ri = 0; ri < gridSize; ri++) {
      for (let ci = 0; ci < gridSize; ci++) {
        const [x0, , z0] = tileToWorld(ci, ri);
        if (ci + 1 < gridSize) { const [x1, , z1] = tileToWorld(ci + 1, ri); segs.push({ x0, z0, x1, z1 }); }
        if (ri + 1 < gridSize) { const [x1, , z1] = tileToWorld(ci, ri + 1); segs.push({ x0, z0, x1, z1 }); }
      }
    }
    return segs;
  }, [gridSize]);

  // Walking people — count tied to population (1 person per ~3 pop, max 40)
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

  const handleRemove = useCallback((_e: ThreeEvent<MouseEvent>, ri: number, ci: number) => {
    _e.stopPropagation();
    removeBuilding(ri, ci);
  }, [removeBuilding]);

  const canAfford = selectedBuilding ? money >= selectedBuilding.cost : false;

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 10, 5]} intensity={0.85} castShadow />
      <directionalLight position={[-5, 4, -3]} intensity={0.25} />

      {/* Roads (under tiles) */}
      {roads.map((seg, i) => (
        <RoadStrip key={`r-${i}`} x0={seg.x0} z0={seg.z0} x1={seg.x1} z1={seg.z1} />
      ))}

      {/* Walking people */}
      {people.map((p, i) => (
        <WalkingPerson key={`wp-${i}`} sx={p.sx} sz={p.sz} ex={p.ex} ez={p.ez} speed={p.speed} />
      ))}

      {/* Ground tiles (cover roads at centres) */}
      {tiles.map(({ ri, ci, building }) => (
        <GroundTile key={`g-${ri}-${ci}`} col={ci} row={ri} occupied={!!building} />
      ))}

      {/* Buildings & placeholders */}
      {tiles.map(({ ri, ci, building }) => {
        if (!building) {
          if (selectedBuilding && canAfford)
            return <PlaceholderTile key={`ph-${ri}-${ci}`} col={ci} row={ri} onClick={(e) => handlePlace(e, ri, ci)} label={selectedBuilding.name} />;
          return null;
        }
        return <BuildingOnTile key={`b-${ri}-${ci}`} building={building} col={ci} row={ri}
          onClick={(e) => handleRemove(e, ri, ci)} selectedBuilding={selectedBuilding}
          constructionRemaining={constructionMap[`${ri},${ci}`] ?? 0} />;
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
      <Canvas camera={{ position: [16, 11, 16], fov: 35, near: 0.1, far: 120 }}
        gl={{ localClippingEnabled: true }}
        style={{ background: 'radial-gradient(ellipse at center, #0e7490 0%, #155e75 30%, #1e3a5f 60%, #0f172a 100%)' }}>
        <Suspense fallback={null}>
          <GridContent />
        </Suspense>
        <OrbitControls enableDamping dampingFactor={0.1} target={[0, 0, gridCenter]}
          minDistance={12} maxDistance={40} maxPolarAngle={Math.PI / 2.3} enablePan />
      </Canvas>
    </div>
  );
}
