import { useMemo } from 'react';
import * as THREE from 'three';
import { Box, Cylinder, Cone, Sphere } from '@react-three/drei';
import type { Building } from '../types';
import { CATEGORY_COLORS } from '../data/buildings';

interface BProps { color: string; height: number; emoji: string; category: string; id: string }

/* ====== HOUSE ====== */
function House3D({ color, height }: BProps) {
  const h = height;
  const hw = 1; // half-width
  return (
    <group>
      <Box args={[2, h, 2]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Box>
      <Cone args={[1.55, 0.8, 4]} position={[0, h + 0.2, 0]} rotation={[0, Math.PI / 4, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.55).getStyle()} roughness={0.6} />
      </Cone>
      {/* chimney */}
      <Box args={[0.25, 0.5, 0.25]} position={[0.5, h + 0.5, 0.5]}>
        <meshStandardMaterial color="#78716c" roughness={0.8} />
      </Box>
      {/* door — slightly recessed */}
      <Box args={[0.35, 0.9, 0.05]} position={[0, 0.4, hw + 0.02]}>
        <meshStandardMaterial color="#3e1f0a" roughness={0.9} />
      </Box>
      {/* windows — flush with wall */}
      <Box args={[0.28, 0.28, 0.02]} position={[-0.45, h * 0.65, hw + 0.01]}>
        <meshStandardMaterial color="#fbbf24" roughness={0.3} emissive="#fbbf24" emissiveIntensity={0.3} />
      </Box>
      <Box args={[0.28, 0.28, 0.02]} position={[0.45, h * 0.65, hw + 0.01]}>
        <meshStandardMaterial color="#fbbf24" roughness={0.3} emissive="#fbbf24" emissiveIntensity={0.3} />
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
      <Box args={[1.2, 0.7, 0.02]} position={[0, h * 0.45, 1.01]}>
        <meshStandardMaterial color="#fef3c7" roughness={0.3} metalness={0.1} emissive="#fef3c7" emissiveIntensity={0.15} />
      </Box>
      {/* door */}
      <Box args={[0.3, 0.9, 0.05]} position={[0.55, 0.4, 1.01]}>
        <meshStandardMaterial color="#3e1f0a" roughness={0.9} />
      </Box>
    </group>
  );
}

/* ====== TOWER ====== */
function Tower3D({ color, height }: BProps) {
  const h = height * 1.5;
  const w = 0.8; // half-width
  const rows = 5, cols = 2;
  const windows: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = -w + 0.2 + c * 0.5;
      windows.push(
        <Box key={`fw-${r}-${c}`} args={[0.2, 0.25, 0.02]} position={[x, 0.4 + r * (h / rows), w + 0.01]}>
          <meshStandardMaterial color="#fef3c7" roughness={0.3} emissive="#fef3c7" emissiveIntensity={0.25} />
        </Box>
      );
      windows.push(
        <Box key={`rw-${r}-${c}`} args={[0.02, 0.25, 0.2]} position={[w + 0.01, 0.4 + r * (h / rows), -w + 0.2 + c * 0.5]}>
          <meshStandardMaterial color="#fef3c7" roughness={0.3} emissive="#fef3c7" emissiveIntensity={0.25} />
        </Box>
      );
    }
  }
  return (
    <group>
      <Box args={[w * 2, h, w * 2]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.05).getStyle()} roughness={0.55} />
      </Box>
      {/* entrance */}
      <Box args={[0.6, 0.8, 0.05]} position={[0, 0.35, w + 0.02]}>
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
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
      {/* main body */}
      <Box args={[2.2, h, 1.8]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.03).getStyle()} roughness={0.7} />
      </Box>
      {/* sawtooth roof ridges */}
      {[-0.6, 0, 0.6].map((x, i) => (
        <Box key={i} args={[0.5, 0.3, 1.6]} position={[x, h + 0.15, 0]}>
          <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.6).getStyle()} roughness={0.6} />
        </Box>
      ))}
      {/* garage door */}
      <Box args={[1.2, 0.7, 0.05]} position={[0, h * 0.3, 0.91]}>
        <meshStandardMaterial color="#1f2937" roughness={0.8} />
      </Box>
      {/* door line split */}
      <Box args={[0.02, 0.7, 0.06]} position={[0, h * 0.3, 0.91]}>
        <meshStandardMaterial color="#4b5563" roughness={0.5} />
      </Box>
      {/* chimneys */}
      <Cylinder args={[0.16, 0.2, 0.7, 8]} position={[-0.55, h + 0.4, -0.3]}>
        <meshStandardMaterial color="#78716c" roughness={0.8} />
      </Cylinder>
      <Cylinder args={[0.13, 0.16, 0.55, 8]} position={[0.55, h + 0.35, 0.1]}>
        <meshStandardMaterial color="#78716c" roughness={0.8} />
      </Cylinder>
      {/* smoke */}
      <Sphere args={[0.18, 8, 8]} position={[-0.55, h + 0.9, -0.3]}>
        <meshStandardMaterial color="#9ca3af" roughness={1} transparent opacity={0.3} />
      </Sphere>
    </group>
  );
}

/* ====== PARK ====== */
function Park3D({ height: _h }: BProps) {
  return (
    <group>
      <Box args={[1.9, 0.12, 1.9]} position={[0, 0.06, 0]}>
        <meshStandardMaterial color="#4ade80" roughness={0.8} />
      </Box>
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
      <Box args={[0.5, 0.06, 0.12]} position={[0.25, 0.18, 0.55]}>
        <meshStandardMaterial color="#a16207" roughness={0.9} />
      </Box>
      {/* fence posts */}
      {[-0.5, -0.25, 0, 0.25, 0.5].map((x, i) => (
        <Cylinder key={`fp-${i}`} args={[0.02, 0.02, 0.2, 6]} position={[x, 0.2, 0.8]}>
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </Cylinder>
      ))}
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
      <Box args={[1.6, 0.18, 1.6]} position={[0, h + 0.09, 0]}>
        <meshStandardMaterial color="#22c55e" roughness={0.9} />
      </Box>
      <Sphere args={[0.2, 8, 8]} position={[-0.4, h + 0.32, -0.3]}>
        <meshStandardMaterial color="#15803d" roughness={1} />
      </Sphere>
      <Sphere args={[0.25, 8, 8]} position={[0.4, h + 0.28, 0.3]}>
        <meshStandardMaterial color="#166534" roughness={1} />
      </Sphere>
    </group>
  );
}

/* ====== STEPPED (Vertical Farm) ====== */
function Stepped3D({ color, height }: BProps) {
  const h = height * 1.8;
  const h1 = h * 0.4, h2 = h * 0.3, h3 = h * 0.3;
  return (
    <group>
      {/* Level 1 */}
      <Box args={[2, h1, 2]} position={[0, h1 / 2, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Box>
      {/* crops on level 1 */}
      {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
        <Box key={`c1-${i}`} args={[0.15, h1 * 0.2, 0.15]} position={[x, h1 * 0.85, 0.6]}>
          <meshStandardMaterial color="#86efac" roughness={1} />
        </Box>
      ))}
      {/* Level 2 */}
      <Box args={[1.5, h2, 1.5]} position={[0, h1 + h2 / 2, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.1).getStyle()} roughness={0.7} />
      </Box>
      {[-0.4, -0.1, 0.2, 0.5].map((x, i) => (
        <Box key={`c2-${i}`} args={[0.12, h2 * 0.2, 0.12]} position={[x, h1 + h2 * 0.85, 0.45]}>
          <meshStandardMaterial color="#86efac" roughness={1} />
        </Box>
      ))}
      {/* Level 3 */}
      <Box args={[1, h3, 1]} position={[0, h1 + h2 + h3 / 2, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.2).getStyle()} roughness={0.7} />
      </Box>
      {[-0.25, 0, 0.25].map((x, i) => (
        <Box key={`c3-${i}`} args={[0.1, h3 * 0.2, 0.1]} position={[x, h1 + h2 + h3 * 0.85, 0.3]}>
          <meshStandardMaterial color="#86efac" roughness={1} />
        </Box>
      ))}
    </group>
  );
}

/* ====== CYLINDER ====== */
function Cylinder3D({ color, height, id }: BProps) {
  const h = height * 1.2;
  return (
    <group>
      <Cylinder args={[0.9, 1, h, 16]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color={color} roughness={0.55} />
      </Cylinder>
      {[0.3, 0.6].map((frac, i) => (
        <Cylinder key={`rb-${i}`} args={[1.01, 1.01, 0.08, 16]} position={[0, h * frac, 0]}>
          <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.7).getStyle()} roughness={0.5} metalness={0.2} />
        </Cylinder>
      ))}
      <Cylinder args={[0.85, 0.95, 0.12, 16]} position={[0, h + 0.06, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.15).getStyle()} roughness={0.4} />
      </Cylinder>
      <Cylinder args={[0.06, 0.06, 0.35, 8]} position={[-0.95, h * 0.65, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.5).getStyle()} roughness={0.6} />
      </Cylinder>
      {id === 'desalination' && (
        <>
          <Cylinder args={[0.06, 0.06, 0.35, 8]} position={[0.95, h * 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.5).getStyle()} roughness={0.6} />
          </Cylinder>
          <Cylinder args={[0.04, 0.04, 0.3, 8]} position={[0, h + 0.25, 0.9]} rotation={[Math.PI / 4, 0, 0]}>
            <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.5).getStyle()} roughness={0.6} />
          </Cylinder>
        </>
      )}
    </group>
  );
}

/* ====== TURBINE ====== */
function Turbine3D({ color, height }: BProps) {
  const h = height * 1.8;
  return (
    <group>
      <Cylinder args={[0.14, 0.18, h, 8]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color="#94a3b8" roughness={0.5} metalness={0.3} />
      </Cylinder>
      <Box args={[0.4, 0.22, 0.25]} position={[0, h + 0.11, 0]}>
        <meshStandardMaterial color={color} roughness={0.5} />
      </Box>
      <Cylinder args={[0.1, 0.1, 0.08, 8]} position={[0, h + 0.26, -0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#475569" roughness={0.4} />
      </Cylinder>
      <Box args={[0.05, 0.05, 0.7]} position={[0, h + 0.26, -0.55]}>
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.2} />
      </Box>
      <Box args={[0.05, 0.7, 0.05]} position={[0, h + 0.6, -0.18]}>
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.2} />
      </Box>
    </group>
  );
}

/* ====== SOLAR ====== */
function Solar3D({ height }: BProps) {
  const h = height * 0.5;
  return (
    <group>
      <Box args={[1.8, h, 1.8]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color="#0284c7" roughness={0.6} />
      </Box>
      {[-0.45, 0.45].map((x, xi) =>
        [-0.4, 0.4].map((z, zi) => (
          <Box key={`s-${xi}-${zi}`} args={[0.7, 0.04, 0.55]} position={[x, h + 0.12, z]} rotation={[0.25, 0, 0]}>
            <meshStandardMaterial color="#1e3a5f" roughness={0.3} metalness={0.5} />
          </Box>
        ))
      )}
    </group>
  );
}

/* ====== BLOCK / WAVE CONVERTER / COMPOSTING ====== */
function Block3D({ color, height, id }: BProps) {
  const h = height;
  if (id === 'wave_converter') {
    return (
      <group>
        <Box args={[1.6, h * 0.65, 1.6]} position={[0, h * 0.33, 0]}>
          <meshStandardMaterial color={color} roughness={0.55} />
        </Box>
        <Box args={[1.8, 0.12, 1.8]} position={[0, h * 0.7, 0]}>
          <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.75).getStyle()} roughness={0.5} />
        </Box>
        <Cylinder args={[0.3, 0.35, 0.25, 8]} position={[-0.3, h * 0.85, -0.3]}>
          <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.3).getStyle()} roughness={0.4} />
        </Cylinder>
        <Cylinder args={[0.25, 0.3, 0.2, 8]} position={[0.3, h * 0.82, 0.3]}>
          <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.3).getStyle()} roughness={0.4} />
        </Cylinder>
      </group>
    );
  }
  if (id === 'composting') {
    return (
      <group>
        <Box args={[1.8, h * 0.5, 1.8]} position={[0, h * 0.25, 0]}>
          <meshStandardMaterial color="#8b6914" roughness={0.8} />
        </Box>
        <Box args={[1.5, 0.2, 1.5]} position={[0, h * 0.55, 0]}>
          <meshStandardMaterial color="#5c3d0e" roughness={0.9} />
        </Box>
        <Sphere args={[0.1, 8, 8]} position={[-0.35, h * 0.7, -0.25]}>
          <meshStandardMaterial color="#d4a017" roughness={0.7} />
        </Sphere>
        <Sphere args={[0.08, 8, 8]} position={[0.3, h * 0.72, 0.35]}>
          <meshStandardMaterial color="#c49010" roughness={0.7} />
        </Sphere>
        <Sphere args={[0.09, 8, 8]} position={[0, h * 0.68, -0.4]}>
          <meshStandardMaterial color="#f59e0b" roughness={0.7} />
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
      <Box args={[2, h, 0.4]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Box>
      <Box args={[2.1, 0.08, 0.44]} position={[0, h + 0.04, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.08).getStyle()} roughness={0.5} />
      </Box>
      {/* buttresses */}
      {[-0.6, 0.6].map((x, i) => (
        <Box key={`b-${i}`} args={[0.15, h, 0.5]} position={[x, h / 2, 0]}>
          <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.9).getStyle()} roughness={0.7} />
        </Box>
      ))}
    </group>
  );
}

/* ====== SLOPED (Wave Absorber) ====== */
function Sloped3D({ color, height }: BProps) {
  const h = height;
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.85, 0);
    s.lineTo(0.85, 0);
    s.lineTo(0, 0.45);
    s.closePath();
    return s;
  }, []);
  const extrudeSettings = useMemo(() => ({ steps: 1, depth: 1.4, bevelEnabled: false }), []);

  return (
    <group>
      <Box args={[1.8, h, 1.4]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Box>
      <mesh position={[-0.85, h, -0.7]} rotation={[0, 0, Math.PI / 2]}>
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
      <Cylinder args={[0.65, 0.7, h * 0.6, 16]} position={[0, h * 0.3, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Cylinder>
      <Sphere args={[0.7, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} position={[0, h * 0.6, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.2).getStyle()} roughness={0.4} />
      </Sphere>
      {/* dome slit */}
      <Box args={[0.8, 0.03, 0.03]} position={[0, h * 0.88, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.5).getStyle()} roughness={0.5} />
      </Box>
      {/* telescope */}
      <Cylinder args={[0.03, 0.03, 0.45, 8]} position={[0, h * 0.82, 0.15]} rotation={[0.35, 0, 0]}>
        <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.6} />
      </Cylinder>
      <Cylinder args={[0.05, 0.04, 0.15, 8]} position={[0, h * 1.0, 0.35]} rotation={[0.35, 0, 0]}>
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
      <Cylinder args={[0.7, 0.75, h * 0.58, 16]} position={[0, h * 0.29, 0]}>
        <meshStandardMaterial color={domeColor} roughness={0.7} />
      </Cylinder>
      <Sphere args={[0.72, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} position={[0, h * 0.58, 0]}>
        <meshStandardMaterial color={new THREE.Color(domeColor).multiplyScalar(1.25).getStyle()} roughness={0.35} />
      </Sphere>
      {id === 'transit_hub' ? (
        <>
          {/* platform canopy */}
          <Box args={[1.6, 0.08, 0.6]} position={[0, h * 0.62, 0.6]}>
            <meshStandardMaterial color="#fbbf24" roughness={0.4} />
          </Box>
          {/* station box */}
          <Box args={[1, 0.5, 0.4]} position={[0, h * 0.3, 0.55]}>
            <meshStandardMaterial color={new THREE.Color(domeColor).multiplyScalar(0.7).getStyle()} roughness={0.6} />
          </Box>
          {/* doors */}
          {[-0.25, 0, 0.25].map((x, i) => (
            <Box key={`td-${i}`} args={[0.15, 0.35, 0.03]} position={[x, h * 0.3, 0.76]}>
              <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </Box>
          ))}
          {/* tracks */}
          <Box args={[1.9, 0.03, 0.15]} position={[0, 0.03, -0.5]}>
            <meshStandardMaterial color="#64748b" roughness={0.6} metalness={0.5} />
          </Box>
          <Box args={[1.9, 0.03, 0.15]} position={[0, 0.03, -0.2]}>
            <meshStandardMaterial color="#64748b" roughness={0.6} metalness={0.5} />
          </Box>
        </>
      ) : (
        <>
          <Cylinder args={[0.03, 0.03, 0.3, 8]} position={[-0.45, h * 0.8, 0]} rotation={[0.25, 0, 0.5]}>
            <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.4} />
          </Cylinder>
          <Sphere args={[0.05, 8, 8]} position={[-0.6, h * 0.85, 0.1]}>
            <meshStandardMaterial color="#e2e8f0" roughness={0.2} />
          </Sphere>
          <Cylinder args={[0.03, 0.03, 0.3, 8]} position={[0.45, h * 0.8, 0]} rotation={[0.25, 0, -0.5]}>
            <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.4} />
          </Cylinder>
          <Sphere args={[0.05, 8, 8]} position={[0.6, h * 0.85, 0.1]}>
            <meshStandardMaterial color="#e2e8f0" roughness={0.2} />
          </Sphere>
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
      {/* main building */}
      <Box args={[1.5, h, 1.3]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color="#78716c" roughness={0.7} />
      </Box>
      {/* green recycling stripe */}
      <Box args={[1.52, 0.15, 1.32]} position={[0, h * 0.55, 0]}>
        <meshStandardMaterial color="#22c55e" roughness={0.6} />
      </Box>
      {/* conveyor on top */}
      <Box args={[0.15, 0.08, 1]} position={[0, h + 0.04, 0.2]}>
        <meshStandardMaterial color="#57534e" roughness={0.8} />
      </Box>
      {/* chimneys */}
      <Cylinder args={[0.14, 0.16, 0.7, 8]} position={[0.35, h + 0.35, -0.15]}>
        <meshStandardMaterial color="#57534e" roughness={0.8} />
      </Cylinder>
      <Cylinder args={[0.1, 0.12, 0.5, 8]} position={[-0.3, h + 0.25, 0.2]}>
        <meshStandardMaterial color="#57534e" roughness={0.8} />
      </Cylinder>
      {/* smoke */}
      <Sphere args={[0.14, 8, 8]} position={[0.35, h + 0.8, -0.15]}>
        <meshStandardMaterial color="#9ca3af" roughness={1} transparent opacity={0.3} />
      </Sphere>
      <Sphere args={[0.08, 8, 8]} position={[0.35, h + 0.95, -0.1]}>
        <meshStandardMaterial color="#9ca3af" roughness={1} transparent opacity={0.2} />
      </Sphere>
      {/* recycle symbol plaque */}
      <Box args={[0.5, 0.4, 0.03]} position={[0, h * 0.55, 0.66]}>
        <meshStandardMaterial color="#22c55e" roughness={0.4} emissive="#22c55e" emissiveIntensity={0.15} />
      </Box>
    </group>
  );
}

/* ====== FLAT (Bike Lane) ====== */
function Flat3D({ height: _h }: BProps) {
  return (
    <group>
      <Box args={[1.9, 0.06, 1.9]} position={[0, 0.03, 0]}>
        <meshStandardMaterial color="#dc2626" roughness={0.7} />
      </Box>
      <Box args={[1.4, 0.02, 0.03]} position={[0, 0.07, -0.4]}>
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </Box>
      <Box args={[1.4, 0.02, 0.03]} position={[0, 0.07, 0.4]}>
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </Box>
      {/* bike icon posts */}
      {[-0.5, 0.5].map((x, i) => (
        <Cylinder key={`bp-${i}`} args={[0.03, 0.03, 0.35, 6]} position={[x, 0.2, 0]}>
          <meshStandardMaterial color="#64748b" roughness={0.5} metalness={0.5} />
        </Cylinder>
      ))}
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
