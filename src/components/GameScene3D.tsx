import { useMemo, Suspense, useCallback, memo } from 'react';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import BuildingModel3D from './BuildingModel3D';
import type { Building } from '../types';

const TILE_SIZE = 2;

function tileToWorld(col: number, row: number): [number, number, number] {
  return [(col - row) * TILE_SIZE, 0, (col + row) * TILE_SIZE * 0.5];
}

const GroundTile = memo(function GroundTile({ col, row, occupied }: { col: number; row: number; occupied: boolean }) {
  const [x, , z] = tileToWorld(col, row);
  return (
    <mesh position={[x, -0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[TILE_SIZE * 0.95, TILE_SIZE * 0.95]} />
      <meshStandardMaterial color={occupied ? '#4a5e2a' : '#374a1e'} side={THREE.DoubleSide} />
    </mesh>
  );
});

const BuildingOnTile = memo(function BuildingOnTile({
  building, col, row, onClick,
}: {
  building: Building;
  col: number; row: number;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}) {
  const [x, , z] = tileToWorld(col, row);
  return (
    <group position={[x, 0, z]} onClick={onClick}>
      <BuildingModel3D building={building} />
    </group>
  );
});

const PlaceholderTile = memo(function PlaceholderTile({ col, row, onClick }: {
  col: number; row: number;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}) {
  const [x, , z] = tileToWorld(col, row);
  return (
    <mesh position={[x, 0.15, z]} onClick={onClick}>
      <boxGeometry args={[TILE_SIZE * 0.6, 0.1, TILE_SIZE * 0.6]} />
      <meshStandardMaterial color="#88cc88" transparent opacity={0.35} />
    </mesh>
  );
});

function GridContent() {
  const grid = useGameStore((s) => s.grid);
  const gridSize = useGameStore((s) => s.gridSize);
  const selectedBuilding = useGameStore((s) => s.selectedBuilding);
  const money = useGameStore((s) => s.money);
  const placeBuilding = useGameStore((s) => s.placeBuilding);
  const removeBuilding = useGameStore((s) => s.removeBuilding);

  const tiles = useMemo(() => {
    const arr: Array<{ ri: number; ci: number; building: Building | null }> = [];
    for (let ri = 0; ri < gridSize; ri++) {
      for (let ci = 0; ci < gridSize; ci++) {
        arr.push({ ri, ci, building: grid[ri][ci] });
      }
    }
    arr.sort((a, b) => (a.ri + a.ci) - (b.ri + b.ci));
    return arr;
  }, [grid, gridSize]);

  const handlePlace = useCallback((_e: ThreeEvent<MouseEvent>, ri: number, ci: number) => {
    _e.stopPropagation();
    if (selectedBuilding && money >= selectedBuilding.cost) {
      placeBuilding(ri, ci);
    }
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

      {tiles.map(({ ri, ci, building }) => (
        <GroundTile key={`g-${ri}-${ci}`} col={ci} row={ri} occupied={!!building} />
      ))}

      {tiles.map(({ ri, ci, building }) => {
        if (!building) {
          if (selectedBuilding && canAfford) {
            return <PlaceholderTile key={`ph-${ri}-${ci}`} col={ci} row={ri} onClick={(e) => handlePlace(e, ri, ci)} />;
          }
          return null;
        }
        return (
          <BuildingOnTile
            key={`b-${ri}-${ci}`}
            building={building}
            col={ci} row={ri}
            onClick={(e) => handleRemove(e, ri, ci)}
          />
        );
      })}
    </>
  );
}

export default function GameScene3D() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [14, 10, 14], fov: 35, near: 0.1, far: 100 }}
        style={{ background: 'radial-gradient(ellipse at center, #0e7490 0%, #155e75 30%, #1e3a5f 60%, #0f172a 100%)' }}
      >
        <Suspense fallback={null}>
          <GridContent />
        </Suspense>
        <OrbitControls
          enableDamping
          dampingFactor={0.1}
          target={[0, 0, 3.5]}
          minDistance={10}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2.3}
          enablePan={true}
        />
      </Canvas>
    </div>
  );
}
