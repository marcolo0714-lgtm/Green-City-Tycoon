import { useMemo } from 'react';
import * as THREE from 'three';
import { Box, Cylinder, Cone, Sphere } from '@react-three/drei';
import type { Building } from '../types';
import { CATEGORY_COLORS } from '../data/buildings';

interface BProps { color: string; height: number; emoji: string; category: string; id: string }

/* ====== HOUSE ====== */
function House3D({ color, height }: BProps) {
  const h = height;
  return (
    <group>
      <Box args={[2, h, 2]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Box>
      <Cone args={[1.55, 0.8, 4]} position={[0, h + 0.2, 0]} rotation={[0, Math.PI / 4, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.6).getStyle()} roughness={0.6} />
      </Cone>
      {/* chimney */}
      <Box args={[0.25, 0.5, 0.25]} position={[0.5, h + 0.5, 0.5]}>
        <meshStandardMaterial color="#78716c" roughness={0.8} />
      </Box>
      {/* door */}
      <Box args={[0.4, 1, 0.1]} position={[0, 0.45, 1.01]}>
        <meshStandardMaterial color="#3e1f0a" roughness={0.9} />
      </Box>
      {/* window */}
      <Box args={[0.3, 0.3, 0.05]} position={[-0.4, h * 0.65, 1.01]}>
        <meshStandardMaterial color="#fbbf24" roughness={0.4} />
      </Box>
      <Box args={[0.3, 0.3, 0.05]} position={[0.4, h * 0.65, 1.01]}>
        <meshStandardMaterial color="#fbbf24" roughness={0.4} />
      </Box>
    </group>
  );
}

/* ====== SHOP ====== */
function Shop3D({ color, height }: BProps) {
  const h = height;
  return (
    <group>
      <Box args={[2, h, 2]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Box>
      {/* awning */}
      <Box args={[2.2, 0.15, 0.5]} position={[0, h * 0.7, 0.85]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.75).getStyle()} roughness={0.5} />
      </Box>
      {/* display window */}
      <Box args={[1.2, 0.7, 0.05]} position={[0, h * 0.45, 1.01]}>
        <meshStandardMaterial color="#fef3c7" roughness={0.3} metalness={0.1} />
      </Box>
      {/* door */}
      <Box args={[0.3, 1, 0.05]} position={[0.5, h * 0.4, 1.01]}>
        <meshStandardMaterial color="#3e1f0a" roughness={0.9} />
      </Box>
    </group>
  );
}

/* ====== TOWER ====== */
function Tower3D({ color, height }: BProps) {
  const h = height * 1.5;
  const rows = 5;
  const cols = 2;
  const windows: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      windows.push(
        <Box key={`w-${r}-${c}`} args={[0.2, 0.25, 0.02]} position={[-0.4 + c * 0.5, 0.5 + r * (h / rows), 1.01]}>
          <meshStandardMaterial color="#fef3c7" roughness={0.3} />
        </Box>
      );
    }
  }
  return (
    <group>
      <Box args={[1.5, h, 1.5]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.05).getStyle()} roughness={0.6} />
      </Box>
      {windows}
      {/* antenna */}
      <Cylinder args={[0.02, 0.02, 0.5, 8]} position={[0, h + 0.25, 0]}>
        <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.6} />
      </Cylinder>
      <Box args={[0.3, 0.3, 0.3]} position={[0, h + 0.15, 0]}>
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </Box>
    </group>
  );
}

/* ====== FACTORY ====== */
function Factory3D({ color, height }: BProps) {
  const h = height;
  return (
    <group>
      <Box args={[2.2, h, 1.8]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.03).getStyle()} roughness={0.7} />
      </Box>
      {/* garage door */}
      <Box args={[1.2, h * 0.7, 0.05]} position={[0, h * 0.3, 0.91]}>
        <meshStandardMaterial color="#1f2937" roughness={0.8} />
      </Box>
      {/* chimneys */}
      <Cylinder args={[0.18, 0.22, 0.7, 8]} position={[-0.5, h + 0.35, -0.3]}>
        <meshStandardMaterial color="#78716c" roughness={0.8} />
      </Cylinder>
      <Cylinder args={[0.15, 0.18, 0.55, 8]} position={[0.5, h + 0.28, 0]}>
        <meshStandardMaterial color="#78716c" roughness={0.8} />
      </Cylinder>
      {/* smoke */}
      <Sphere args={[0.2, 8, 8]} position={[-0.5, h + 0.85, -0.3]}>
        <meshStandardMaterial color="#9ca3af" roughness={1} transparent opacity={0.3} />
      </Sphere>
    </group>
  );
}

/* ====== PARK ====== */
function Park3D({ height: _h }: BProps) {
  return (
    <group>
      <Box args={[1.9, 0.15, 1.9]} position={[0, 0.08, 0]}>
        <meshStandardMaterial color="#4ade80" roughness={0.8} />
      </Box>
      {/* trees */}
      <Sphere args={[0.35, 8, 8]} position={[-0.45, 0.45, -0.35]}>
        <meshStandardMaterial color="#166534" roughness={1} />
      </Sphere>
      <Sphere args={[0.4, 8, 8]} position={[0.5, 0.4, 0.3]}>
        <meshStandardMaterial color="#15803d" roughness={1} />
      </Sphere>
      <Sphere args={[0.3, 8, 8]} position={[-0.1, 0.5, 0.5]}>
        <meshStandardMaterial color="#14532d" roughness={1} />
      </Sphere>
      <Cylinder args={[0.06, 0.08, 0.6, 8]} position={[-0.45, 0.35, -0.35]}>
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </Cylinder>
      <Cylinder args={[0.06, 0.08, 0.6, 8]} position={[0.5, 0.3, 0.3]}>
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </Cylinder>
      {/* bench */}
      <Box args={[0.5, 0.08, 0.15]} position={[0.2, 0.22, 0.5]}>
        <meshStandardMaterial color="#a16207" roughness={0.9} />
      </Box>
    </group>
  );
}

/* ====== GREEN ROOF ====== */
function GreenRoof3D({ height }: BProps) {
  const h = height;
  return (
    <group>
      <Box args={[1.8, h, 1.8]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color="#86efac" roughness={0.7} />
      </Box>
      <Box args={[1.6, 0.2, 1.6]} position={[0, h + 0.1, 0]}>
        <meshStandardMaterial color="#22c55e" roughness={0.9} />
      </Box>
      {/* plants */}
      <Sphere args={[0.2, 8, 8]} position={[-0.4, h + 0.35, -0.3]}>
        <meshStandardMaterial color="#15803d" roughness={1} />
      </Sphere>
      <Sphere args={[0.25, 8, 8]} position={[0.4, h + 0.3, 0.3]}>
        <meshStandardMaterial color="#166534" roughness={1} />
      </Sphere>
    </group>
  );
}

/* ====== STEPPED ====== */
function Stepped3D({ color, height }: BProps) {
  const h = height * 1.6;
  const h1 = h * 0.4, h2 = h * 0.35, h3 = h * 0.25;
  return (
    <group>
      <Box args={[2, h1, 2]} position={[0, h1 / 2, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Box>
      <Box args={[1.5, h2, 1.5]} position={[0, h1 + h2 / 2, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.1).getStyle()} roughness={0.7} />
      </Box>
      <Box args={[1, h3, 1]} position={[0, h1 + h2 + h3 / 2, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.2).getStyle()} roughness={0.7} />
      </Box>
    </group>
  );
}

/* ====== CYLINDER ====== */
function Cylinder3D({ color, height, id }: BProps) {
  const h = height * 1.2;
  return (
    <group>
      <Cylinder args={[0.9, 1, h, 16]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color={color} roughness={0.6} />
      </Cylinder>
      {/* rim bands */}
      <Cylinder args={[1.02, 1.02, 0.1, 16]} position={[0, h * 0.65, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.7).getStyle()} roughness={0.5} metalness={0.2} />
      </Cylinder>
      <Cylinder args={[1.02, 1.02, 0.1, 16]} position={[0, h * 0.35, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.7).getStyle()} roughness={0.5} metalness={0.2} />
      </Cylinder>
      {/* top cap */}
      <Cylinder args={[0.85, 0.95, 0.15, 16]} position={[0, h + 0.07, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.15).getStyle()} roughness={0.4} />
      </Cylinder>
      {/* pipes */}
      <Cylinder args={[0.08, 0.08, 0.4, 8]} position={[-0.95, h * 0.7, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.5).getStyle()} roughness={0.6} />
      </Cylinder>
      {id === 'desalination' && (
        <Cylinder args={[0.08, 0.08, 0.4, 8]} position={[0.95, h * 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.5).getStyle()} roughness={0.6} />
        </Cylinder>
      )}
    </group>
  );
}

/* ====== TURBINE ====== */
function Turbine3D({ color, height }: BProps) {
  const h = height * 1.8;
  return (
    <group>
      {/* tower */}
      <Cylinder args={[0.15, 0.2, h, 8]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color="#94a3b8" roughness={0.5} metalness={0.3} />
      </Cylinder>
      {/* nacelle */}
      <Box args={[0.5, 0.25, 0.3]} position={[0, h + 0.12, 0]}>
        <meshStandardMaterial color={color} roughness={0.5} />
      </Box>
      {/* hub */}
      <Cylinder args={[0.12, 0.12, 0.1, 8]} position={[0, h + 0.3, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#475569" roughness={0.4} />
      </Cylinder>
      {/* blades */}
      <Box args={[0.06, 0.06, 0.8]} position={[0, h + 0.3, -0.6]}>
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.2} />
      </Box>
      <Box args={[0.06, 0.8, 0.06]} position={[0, h + 0.7, -0.2]}>
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.2} />
      </Box>
    </group>
  );
}

/* ====== SOLAR ====== */
function Solar3D({ height }: BProps) {
  const h = height * 0.6;
  return (
    <group>
      <Box args={[1.8, h, 1.8]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color="#0284c7" roughness={0.6} />
      </Box>
      {/* solar panels — tilted flat boxes */}
      <Box args={[0.9, 0.06, 0.7]} position={[-0.35, h + 0.15, -0.2]} rotation={[0.3, 0, 0]}>
        <meshStandardMaterial color="#1e3a5f" roughness={0.3} metalness={0.5} />
      </Box>
      <Box args={[0.9, 0.06, 0.7]} position={[0.35, h + 0.15, 0.2]} rotation={[0.3, 0, 0]}>
        <meshStandardMaterial color="#1e3a5f" roughness={0.3} metalness={0.5} />
      </Box>
      <Box args={[0.9, 0.06, 0.7]} position={[-0.35, h + 0.15, 0.5]} rotation={[0.3, 0, 0]}>
        <meshStandardMaterial color="#1e3a5f" roughness={0.3} metalness={0.5} />
      </Box>
      <Box args={[0.9, 0.06, 0.7]} position={[0.35, h + 0.15, -0.5]} rotation={[0.3, 0, 0]}>
        <meshStandardMaterial color="#1e3a5f" roughness={0.3} metalness={0.5} />
      </Box>
    </group>
  );
}

/* ====== BLOCK / WAVE CONVERTER / COMPOSTING ====== */
function Block3D({ color, height, id }: BProps) {
  const h = height;
  if (id === 'wave_converter') {
    return (
      <group>
        <Box args={[1.6, h * 0.7, 1.6]} position={[0, h * 0.35, 0]}>
          <meshStandardMaterial color={color} roughness={0.6} />
        </Box>
        <Cylinder args={[0.35, 0.4, 0.3, 8]} position={[-0.3, h * 0.85, -0.3]}>
          <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.3).getStyle()} roughness={0.4} />
        </Cylinder>
        <Cylinder args={[0.3, 0.35, 0.25, 8]} position={[0.3, h * 0.8, 0.3]}>
          <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.3).getStyle()} roughness={0.4} />
        </Cylinder>
      </group>
    );
  }
  if (id === 'composting') {
    return (
      <group>
        <Box args={[1.8, h * 0.55, 1.8]} position={[0, h * 0.28, 0]}>
          <meshStandardMaterial color="#8b6914" roughness={0.8} />
        </Box>
        <Box args={[1.5, 0.25, 1.5]} position={[0, h * 0.65, 0]}>
          <meshStandardMaterial color="#5c3d0e" roughness={0.9} />
        </Box>
        <Sphere args={[0.12, 8, 8]} position={[-0.4, h * 0.75, -0.3]}>
          <meshStandardMaterial color="#d4a017" roughness={0.7} />
        </Sphere>
        <Sphere args={[0.1, 8, 8]} position={[0.3, h * 0.8, 0.4]}>
          <meshStandardMaterial color="#c49010" roughness={0.7} />
        </Sphere>
      </group>
    );
  }
  return (
    <Box args={[1.8, h, 1.8]} position={[0, h / 2, 0]}>
      <meshStandardMaterial color={color} roughness={0.7} />
    </Box>
  );
}

/* ====== WALL ====== */
function Wall3D({ color, height }: BProps) {
  const h = Math.max(height, 0.5);
  return (
    <group>
      <Box args={[2, h, 0.5]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Box>
      <Box args={[2.1, 0.1, 0.55]} position={[0, h + 0.05, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.08).getStyle()} roughness={0.5} />
      </Box>
    </group>
  );
}

/* ====== SLOPED ====== */
function Sloped3D({ color, height }: BProps) {
  const h = height;
  // Use a custom shape for the sloped top
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1, 0);
    s.lineTo(1, 0);
    s.lineTo(0, 0.6);
    s.closePath();
    return s;
  }, []);
  const extrudeSettings = useMemo(() => ({ steps: 1, depth: 1.8, bevelEnabled: false }), []);

  return (
    <group>
      <Box args={[2, h, 1.8]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Box>
      <mesh position={[-1, h, -0.9]} rotation={[0, 0, Math.PI / 2]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.12).getStyle()} roughness={0.5} />
      </mesh>
    </group>
  );
}

/* ====== OBSERVATORY ====== */
function Observatory3D({ color, height }: BProps) {
  const h = height * 1.3;
  return (
    <group>
      <Box args={[1.4, h * 0.6, 1.4]} position={[0, h * 0.3, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Box>
      <Sphere args={[0.75, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} position={[0, h * 0.6, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.2).getStyle()} roughness={0.4} />
      </Sphere>
      {/* telescope */}
      <Cylinder args={[0.04, 0.04, 0.5, 8]} position={[0, h * 0.85, 0]} rotation={[0.4, 0, 0]}>
        <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.6} />
      </Cylinder>
      <Cylinder args={[0.07, 0.05, 0.2, 8]} position={[0, h * 1.05, 0.2]} rotation={[0.4, 0, 0]}>
        <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.4} />
      </Cylinder>
    </group>
  );
}

/* ====== DOME ====== */
function Dome3D({ color, height, id }: BProps) {
  const h = height * 1.3;
  const domeColor = id === 'transit_hub' ? '#dc2626' : color;
  return (
    <group>
      <Box args={[1.5, h * 0.6, 1.5]} position={[0, h * 0.3, 0]}>
        <meshStandardMaterial color={domeColor} roughness={0.7} />
      </Box>
      <Sphere args={[0.8, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} position={[0, h * 0.6, 0]}>
        <meshStandardMaterial color={new THREE.Color(domeColor).multiplyScalar(1.2).getStyle()} roughness={0.4} />
      </Sphere>
      {id === 'transit_hub' && (
        <Box args={[1, 0.15, 0.3]} position={[0, h * 0.55, 0.8]}>
          <meshStandardMaterial color="#fbbf24" roughness={0.4} />
        </Box>
      )}
      {id !== 'transit_hub' && (
        <>
          <Cylinder args={[0.03, 0.03, 0.3, 8]} position={[-0.5, h * 0.85, 0]} rotation={[0.3, 0, 0.5]}>
            <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.4} />
          </Cylinder>
          <Cylinder args={[0.03, 0.03, 0.3, 8]} position={[0.5, h * 0.85, 0]} rotation={[0.3, 0, -0.5]}>
            <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.4} />
          </Cylinder>
        </>
      )}
    </group>
  );
}

/* ====== CHIMNEY (Recycling Center) ====== */
function Chimney3D({ height }: BProps) {
  const h = height;
  return (
    <group>
      <Box args={[1.5, h, 1.5]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color="#78716c" roughness={0.7} />
      </Box>
      <Cylinder args={[0.15, 0.18, 0.9, 8]} position={[0.3, h + 0.45, -0.2]}>
        <meshStandardMaterial color="#57534e" roughness={0.8} />
      </Cylinder>
      <Cylinder args={[0.12, 0.14, 0.6, 8]} position={[-0.3, h + 0.3, 0.2]}>
        <meshStandardMaterial color="#57534e" roughness={0.8} />
      </Cylinder>
      {/* smoke puffs */}
      <Sphere args={[0.15, 8, 8]} position={[0.3, h + 1, -0.2]}>
        <meshStandardMaterial color="#9ca3af" roughness={1} transparent opacity={0.35} />
      </Sphere>
      <Sphere args={[0.1, 8, 8]} position={[0.3, h + 1.2, -0.15]}>
        <meshStandardMaterial color="#9ca3af" roughness={1} transparent opacity={0.25} />
      </Sphere>
    </group>
  );
}

/* ====== FLAT (Bike Lane) ====== */
function Flat3D({ height: _h }: BProps) {
  return (
    <group>
      <Box args={[1.9, 0.08, 1.9]} position={[0, 0.04, 0]}>
        <meshStandardMaterial color="#dc2626" roughness={0.7} />
      </Box>
      {/* lane stripes */}
      <Box args={[1.4, 0.02, 0.04]} position={[0, 0.09, -0.4]}>
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </Box>
      <Box args={[1.4, 0.02, 0.04]} position={[0, 0.09, 0.4]}>
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </Box>
    </group>
  );
}

/* ====== MAIN ====== */
interface Props { building: Building }
export default function BuildingModel3D({ building }: Props) {
  const color = CATEGORY_COLORS[building.category] || '#f59e0b';
  const h = building.height * 1.2;
  const p: BProps = { color, height: h, emoji: building.emoji, category: building.category, id: building.id };

  switch (building.shape) {
    case 'house': return <House3D {...p} />;
    case 'shop': return <Shop3D {...p} />;
    case 'tower': return <Tower3D {...p} />;
    case 'factory': return <Factory3D {...p} />;
    case 'park': return <Park3D {...p} />;
    case 'green_roof': return <GreenRoof3D {...p} />;
    case 'stepped': return <Stepped3D {...p} />;
    case 'cylinder': return <Cylinder3D {...p} />;
    case 'turbine': return <Turbine3D {...p} />;
    case 'solar': return <Solar3D {...p} />;
    case 'block': return <Block3D {...p} />;
    case 'wall': return <Wall3D {...p} />;
    case 'sloped': return <Sloped3D {...p} />;
    case 'observatory': return <Observatory3D {...p} />;
    case 'dome': return <Dome3D {...p} />;
    case 'chimney': return <Chimney3D {...p} />;
    case 'flat': return <Flat3D {...p} />;
    default: return <Block3D {...p} />;
  }
}
