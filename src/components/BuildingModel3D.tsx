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
      {/* Level 1 — wide base */}
      <Box args={[2, h1, 2]} position={[0, h1 / 2, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Box>
      {/* Greenhouse glass panels on level 1 */}
      {[-0.7, 0, 0.7].map((x, i) => (
        <Box key={`g1-${i}`} args={[0.35, h1 * 0.6, 0.04]} position={[x, h1 * 0.5, 1.01]}>
          <meshStandardMaterial color="#bae6fd" roughness={0.15} metalness={0.2} emissive="#7dd3fc" emissiveIntensity={0.1} />
        </Box>
      ))}
      {/* Crops on level 1 */}
      {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
        <group key={`c1-${i}`}>
          <Box args={[0.12, h1 * 0.15, 0.12]} position={[x, h1 * 0.85, 0.55]}>
            <meshStandardMaterial color={i % 2 === 0 ? '#86efac' : '#4ade80'} roughness={1} />
          </Box>
          <Cylinder args={[0.02, 0.02, 0.08, 4]} position={[x, h1 * 0.94, 0.55]}>
            <meshStandardMaterial color={i % 2 === 0 ? '#22c55e' : '#16a34a'} roughness={0.8} />
          </Cylinder>
        </group>
      ))}
      {/* Irrigation pipe along level 1 edge */}
      <Cylinder args={[0.03, 0.03, 2.0, 6]} position={[0, h1 * 0.7, 0.85]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.5} />
      </Cylinder>
      {/* Level 2 */}
      <Box args={[1.5, h2, 1.5]} position={[0, h1 + h2 / 2, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.1).getStyle()} roughness={0.7} />
      </Box>
      {[-0.45, -0.15, 0.15, 0.45].map((x, i) => (
        <Box key={`g2-${i}`} args={[0.25, h2 * 0.5, 0.03]} position={[x, h1 + h2 * 0.5, 0.76]}>
          <meshStandardMaterial color="#bae6fd" roughness={0.15} metalness={0.2} emissive="#7dd3fc" emissiveIntensity={0.1} />
        </Box>
      ))}
      {[-0.4, -0.1, 0.2, 0.5].map((x, i) => (
        <group key={`c2-${i}`}>
          <Box args={[0.1, h2 * 0.15, 0.1]} position={[x, h1 + h2 * 0.85, 0.4]}>
            <meshStandardMaterial color={i % 2 === 0 ? '#a3e635' : '#84cc16'} roughness={1} />
          </Box>
        </group>
      ))}
      {/* Level 3 */}
      <Box args={[1, h3, 1]} position={[0, h1 + h2 + h3 / 2, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.2).getStyle()} roughness={0.7} />
      </Box>
      {[-0.3, 0, 0.3].map((x, i) => (
        <Box key={`g3-${i}`} args={[0.2, h3 * 0.5, 0.03]} position={[x, h1 + h2 + h3 * 0.5, 0.51]}>
          <meshStandardMaterial color="#bae6fd" roughness={0.15} metalness={0.2} emissive="#7dd3fc" emissiveIntensity={0.1} />
        </Box>
      ))}
      {[-0.25, 0, 0.25].map((x, i) => (
        <group key={`c3-${i}`}>
          <Sphere args={[0.08, 6, 4]} position={[x, h1 + h2 + h3 * 0.85, 0.25]}>
            <meshStandardMaterial color={i === 0 ? '#fbbf24' : i === 1 ? '#ef4444' : '#22c55e'} roughness={0.7} />
          </Sphere>
        </group>
      ))}
      {/* Rooftop water tank */}
      <Cylinder args={[0.2, 0.2, 0.25, 8]} position={[0, h1 + h2 + h3 + 0.12, 0]}>
        <meshStandardMaterial color="#3b82f6" roughness={0.4} />
      </Cylinder>
      {/* Downpipe from tank */}
      <Cylinder args={[0.02, 0.02, h * 0.3, 4]} position={[0.2, h1 + h2 + h3 - 0.1, 0.2]}>
        <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.5} />
      </Cylinder>
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
        {/* Base platform */}
        <Box args={[1.6, 0.1, 1.6]} position={[0, 0.05, 0]}>
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </Box>
        {/* Oscillating water column chamber */}
        <Box args={[0.8, h * 0.7, 0.6]} position={[0, h * 0.35 + 0.1, 0]}>
          <meshStandardMaterial color={color} roughness={0.55} />
        </Box>
        {/* Chamber opening at bottom */}
        <Box args={[0.5, 0.1, 0.4]} position={[0, 0.12, 0]}>
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </Box>
        {/* Turbine housing on top */}
        <Cylinder args={[0.2, 0.25, 0.3, 8]} position={[0, h * 0.7 + 0.25, 0]}>
          <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.2).getStyle()} roughness={0.4} />
        </Cylinder>
        {/* Turbine blades (visible through top) */}
        <Box args={[0.35, 0.03, 0.08]} position={[0, h * 0.7 + 0.4, 0]}>
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.3} />
        </Box>
        <Box args={[0.08, 0.03, 0.35]} position={[0, h * 0.7 + 0.4, 0]}>
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.3} />
        </Box>
        {/* Wave-like base details */}
        {[-0.5, 0, 0.5].map((x, i) => (
          <Box key={`wv-${i}`} args={[0.2, 0.06, 0.6]} position={[x, 0.06, 0.5]} rotation={[0, 0, i * 0.2 - 0.2]}>
            <meshStandardMaterial color="#3b82f6" roughness={0.4} metalness={0.3} />
          </Box>
        ))}
        {/* Outlet pipe */}
        <Cylinder args={[0.06, 0.06, 0.5, 8]} position={[0, 0.3, 0.6]} rotation={[0.5, 0, 0]}>
          <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.5} />
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
  if (id === 'emergency_center') {
    return (
      <group>
        {/* Main building */}
        <Box args={[1.8, h, 1.5]} position={[0, h / 2, 0]}>
          <meshStandardMaterial color={color} roughness={0.7} />
        </Box>
        {/* Red stripe band */}
        <Box args={[1.82, 0.12, 1.52]} position={[0, h * 0.58, 0]}>
          <meshStandardMaterial color="#dc2626" roughness={0.5} />
        </Box>
        {/* Garage bay doors */}
        {[-0.4, 0.4].map((x, i) => (
          <group key={`gd-${i}`}>
            <Box args={[0.5, 0.45, 0.05]} position={[x, h * 0.25, 0.76]}>
              <meshStandardMaterial color="#1f2937" roughness={0.8} />
            </Box>
            <Box args={[0.02, 0.45, 0.05]} position={[x, h * 0.25, 0.76]}>
              <meshStandardMaterial color="#64748b" roughness={0.5} />
            </Box>
          </group>
        ))}
        {/* Cross/medical emblem */}
        <Box args={[0.35, 0.1, 0.04]} position={[0, h * 0.65, 0.76]}>
          <meshStandardMaterial color="#ef4444" roughness={0.3} emissive="#dc2626" emissiveIntensity={0.2} />
        </Box>
        <Box args={[0.1, 0.35, 0.04]} position={[0, h * 0.65, 0.76]}>
          <meshStandardMaterial color="#ef4444" roughness={0.3} emissive="#dc2626" emissiveIntensity={0.2} />
        </Box>
        {/* Siren light bar on top */}
        <Box args={[1.2, 0.08, 0.15]} position={[0, h + 0.04, 0.3]}>
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </Box>
        {/* Siren lights */}
        {[-0.4, 0, 0.4].map((x, i) => (
          <Sphere key={`sl-${i}`} args={[0.07, 6, 4]} position={[x, h + 0.1, 0.3]}>
            <meshStandardMaterial color={i % 2 === 0 ? '#ef4444' : '#3b82f6'} roughness={0.2} emissive={i % 2 === 0 ? '#ef4444' : '#3b82f6'} emissiveIntensity={0.6} />
          </Sphere>
        ))}
        {/* Radio antenna on top */}
        <Cylinder args={[0.025, 0.025, 0.5, 6]} position={[0.5, h + 0.3, -0.3]}>
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.5} />
        </Cylinder>
        <Sphere args={[0.04, 6, 4]} position={[0.5, h + 0.55, -0.3]}>
          <meshStandardMaterial color="#ef4444" roughness={0.2} emissive="#ef4444" emissiveIntensity={0.3} />
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
  return (
    <group>
      {/* Thick base foundation */}
      <Box args={[1.9, 0.15, 1.2]} position={[0, 0.08, 0]}>
        <meshStandardMaterial color="#d4d4d4" roughness={0.7} />
      </Box>
      {/* Main wave-deflecting wall — tall curved barrier */}
      <Box args={[1.8, h, 0.25]} position={[0, h / 2 + 0.15, 0]}>
        <meshStandardMaterial color={color} roughness={0.65} />
      </Box>
      {/* Sloped wave-facing side */}
      <Box args={[1.8, h * 0.7, 0.35]} position={[0, h * 0.4 + 0.15, 0.3]} rotation={[-0.55, 0, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.1).getStyle()} roughness={0.55} />
      </Box>
      {/* Tiered protection layers */}
      <Box args={[1.7, h * 0.25, 0.5]} position={[0, h * 0.2 + 0.15, -0.2]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.85).getStyle()} roughness={0.6} />
      </Box>
      <Box args={[1.5, h * 0.2, 0.5]} position={[0, h * 0.35 + 0.15, -0.3]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.9).getStyle()} roughness={0.6} />
      </Box>
      <Box args={[1.3, h * 0.2, 0.5]} position={[0, h * 0.5 + 0.15, -0.4]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.95).getStyle()} roughness={0.6} />
      </Box>
      {/* Buttress supports on sides */}
      {[-0.7, 0.7].map((x, i) => (
        <Box key={`b-${i}`} args={[0.2, h, 0.6]} position={[x, h / 2 + 0.15, -0.1]}>
          <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.8).getStyle()} roughness={0.7} />
        </Box>
      ))}
    </group>
  );
}

/* ====== OBSERVATORY ====== */
function Observatory3D({ color, height }: BProps) {
  const h = height * 1.3;
  return (
    <group>
      {/* Base foundation ring */}
      <Cylinder args={[0.85, 0.9, 0.12, 16]} position={[0, 0.06, 0]}>
        <meshStandardMaterial color="#d4d4d4" roughness={0.6} />
      </Cylinder>
      {/* Main tower */}
      <Cylinder args={[0.6, 0.7, h * 0.55, 16]} position={[0, h * 0.28, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Cylinder>
      {/* Ring bands on tower */}
      <Cylinder args={[0.72, 0.72, 0.05, 16]} position={[0, h * 0.35, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.75).getStyle()} roughness={0.4} />
      </Cylinder>
      <Cylinder args={[0.62, 0.62, 0.05, 16]} position={[0, h * 0.52, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.75).getStyle()} roughness={0.4} />
      </Cylinder>
      {/* Dome */}
      <Sphere args={[0.68, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} position={[0, h * 0.57, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.25).getStyle()} roughness={0.35} metalness={0.2} />
      </Sphere>
      {/* Dome observation slit */}
      <Box args={[0.7, 0.04, 0.04]} position={[0, h * 0.84, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.4).getStyle()} roughness={0.5} />
      </Box>
      {/* Slit frame */}
      <Box args={[0.04, 0.04, 0.7]} position={[0.35, h * 0.84, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.4} />
      </Box>
      {/* Telescope — thicker barrel */}
      <Cylinder args={[0.04, 0.04, 0.5, 8]} position={[0, h * 0.78, 0.12]} rotation={[0.35, 0, 0]}>
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.6} />
      </Cylinder>
      <Cylinder args={[0.06, 0.05, 0.2, 8]} position={[0, h * 0.96, 0.32]} rotation={[0.35, 0, 0]}>
        <meshStandardMaterial color="#e2e8f0" roughness={0.15} metalness={0.5} />
      </Cylinder>
      {/* Small balcony platform */}
      <Box args={[0.8, 0.04, 0.15]} position={[0, h * 0.5, 0.55]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.8).getStyle()} roughness={0.6} />
      </Box>
      {/* Railing posts */}
      {[-0.3, -0.15, 0, 0.15, 0.3].map((x, i) => (
        <Cylinder key={`rp-${i}`} args={[0.015, 0.015, 0.15, 4]} position={[x, h * 0.57, 0.55]}>
          <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.5} />
        </Cylinder>
      ))}
    </group>
  );
}

/* ====== DOME (Transit Hub) ====== */
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
          {/* Station box extension */}
          <Box args={[1.3, 0.5, 0.5]} position={[0, h * 0.3, 0.6]}>
            <meshStandardMaterial color={new THREE.Color(domeColor).multiplyScalar(0.7).getStyle()} roughness={0.6} />
          </Box>
          {/* Entrance archway */}
          <Box args={[0.55, 0.35, 0.06]} position={[0, h * 0.28, 0.87]}>
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </Box>
          {/* Info display board (vertical, facing front) */}
          <Box args={[0.5, 0.3, 0.04]} position={[0.55, h * 0.48, 0.35]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </Box>
          <Box args={[0.42, 0.22, 0.02]} position={[0.55, h * 0.48, 0.37]}>
            <meshStandardMaterial color="#3b82f6" roughness={0.2} emissive="#1d4ed8" emissiveIntensity={0.25} />
          </Box>
          {/* Display board pole */}
          <Cylinder args={[0.03, 0.03, 0.4, 6]} position={[0.55, h * 0.22, 0.35]}>
            <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.5} />
          </Cylinder>
          {/* Platform canopy */}
          <Box args={[1.8, 0.06, 0.8]} position={[0, h * 0.62, 0.7]}>
            <meshStandardMaterial color="#fbbf24" roughness={0.4} />
          </Box>
          {/* Canopy support pillars */}
          {[-0.7, -0.35, 0, 0.35, 0.7].map((x, i) => (
            <Cylinder key={`cpl-${i}`} args={[0.025, 0.025, h * 0.48, 6]} position={[x, h * 0.35, 0.8]}>
              <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.5} />
            </Cylinder>
          ))}
          {/* Platform */}
          <Box args={[2.1, 0.06, 0.5]} position={[0, 0.03, 0.85]}>
            <meshStandardMaterial color="#94a3b8" roughness={0.6} />
          </Box>
          {/* Track pair */}
          <Box args={[2.2, 0.02, 0.08]} position={[0, 0.01, 0.65]}>
            <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.6} />
          </Box>
          <Box args={[2.2, 0.02, 0.08]} position={[0, 0.01, 1.05]}>
            <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.6} />
          </Box>
          {/* Station name sign */}
          <Box args={[0.8, 0.1, 0.04]} position={[0, h * 0.68, 0]}>
            <meshStandardMaterial color="#fef3c7" roughness={0.3} emissive="#fef3c7" emissiveIntensity={0.15} />
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

/* ====== SOLAR FARM (Solar Mega-Farm) ====== */
function SolarFarm3D({ height: _h }: BProps) {
  const panelRows = 4, panelCols = 3;
  const panels: React.ReactNode[] = [];
  for (let r = 0; r < panelRows; r++) {
    for (let c = 0; c < panelCols; c++) {
      panels.push(
        <Box key={`sp-${r}-${c}`} args={[0.55, 0.04, 0.4]} position={[-0.7 + c * 0.65, 0.25 + r * 0.3, 0]} rotation={[0.25, 0, 0]}>
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.6} />
        </Box>
      );
    }
  }
  return (
    <group>
      <Box args={[2, 0.08, 1.9]} position={[0, 0.04, 0]}>
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </Box>
      {[0, 1, 2, 3].map((r) => (
        <Box key={`sr-${r}`} args={[1.9, 0.06, 0.04]} position={[0, 0.12 + r * 0.3, 0]}>
          <meshStandardMaterial color="#64748b" roughness={0.5} metalness={0.4} />
        </Box>
      ))}
      {panels}
      {/* Inverter boxes */}
      <Box args={[0.3, 0.15, 0.25]} position={[0.75, 0.12, 0.7]}>
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </Box>
      <Box args={[0.3, 0.15, 0.25]} position={[-0.75, 0.12, -0.7]}>
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </Box>
    </group>
  );
}

/* ====== STATION (Metro Hub) ====== */
function Station3D({ color, height }: BProps) {
  const h = height * 1.6;
  return (
    <group>
      {/* Main hall */}
      <Box args={[2, h, 1.1]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </Box>
      {/* Curved barrel roof */}
      <Cylinder args={[0.65, 0.65, 1.9, 8, 1, true, 0, Math.PI]} position={[0, h, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.2).getStyle()} roughness={0.35} metalness={0.2} />
      </Cylinder>
      {/* Clock tower */}
      <Box args={[0.25, h * 0.45, 0.25]} position={[0.7, h + h * 0.23, 0.25]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.1).getStyle()} roughness={0.6} />
      </Box>
      <Box args={[0.35, 0.3, 0.35]} position={[0.7, h + h * 0.4, 0.25]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.85).getStyle()} roughness={0.5} />
      </Box>
      <Cylinder args={[0.22, 0.22, 0.04, 8]} position={[0.7, h + h * 0.38, 0.45]}>
        <meshStandardMaterial color="#fef3c7" roughness={0.2} emissive="#fef3c7" emissiveIntensity={0.4} />
      </Cylinder>
      <Cone args={[0.2, 0.15, 4]} position={[0.7, h + h * 0.5, 0.25]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.7).getStyle()} roughness={0.5} />
      </Cone>
      {/* Entrance arches */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <group key={`arch-${i}`}>
          <Box args={[0.2, 0.05, 0.3]} position={[x, h * 0.42, 0.56]}>
            <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.9).getStyle()} roughness={0.6} />
          </Box>
          <Box args={[0.04, h * 0.38, 0.04]} position={[x + 0.08, h * 0.21, 0.56]}>
            <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.9).getStyle()} roughness={0.6} />
          </Box>
          <Box args={[0.04, h * 0.38, 0.04]} position={[x - 0.08, h * 0.21, 0.56]}>
            <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.9).getStyle()} roughness={0.6} />
          </Box>
        </group>
      ))}
      {/* Platform with canopy */}
      <Box args={[2.1, 0.08, 0.65]} position={[0, 0.04, -0.52]}>
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </Box>
      <Box args={[1.8, 0.04, 0.35]} position={[0, 0.22, -0.5]}>
        <meshStandardMaterial color="#d4d4d4" roughness={0.5} />
      </Box>
      {/* Canopy pillars */}
      {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
        <Cylinder key={`cpl-${i}`} args={[0.03, 0.03, 0.2, 6]} position={[x, 0.13, -0.5]}>
          <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.5} />
        </Cylinder>
      ))}
      {/* Tracks */}
      <Box args={[2.2, 0.03, 0.08]} position={[0, 0.02, -0.3]}>
        <meshStandardMaterial color="#64748b" roughness={0.5} metalness={0.6} />
      </Box>
      <Box args={[2.2, 0.03, 0.08]} position={[0, 0.02, -0.75]}>
        <meshStandardMaterial color="#64748b" roughness={0.5} metalness={0.6} />
      </Box>
      {/* Signal light */}
      <Sphere args={[0.06, 6, 4]} position={[-0.8, h + 0.15, 0]}>
        <meshStandardMaterial color="#ef4444" roughness={0.2} emissive="#ef4444" emissiveIntensity={0.5} />
      </Sphere>
    </group>
  );
}

/* ====== FOREST TOWER (Vertical Forest Tower) ====== */
function ForestTower3D({ color, height }: BProps) {
  const h = height * 2.0;
  const floors = 5;
  const balconyElements: React.ReactNode[] = [];
  for (let f = 0; f < floors; f++) {
    const y = 0.5 + f * (h / floors);
    const angle = f * 0.6;
    // Balcony base
    balconyElements.push(
      <Box key={`fb-${f}`} args={[0.8, 0.06, 0.7]} position={[0, y, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.1).getStyle()} roughness={0.6} />
      </Box>
    );
    // Tree clusters on balcony
    [-0.2, 0.18].forEach((_ox, ti) => {
      const tx = Math.cos(angle + ti * 1.5) * 0.28;
      const tz = Math.sin(angle + ti * 1.5) * 0.2;
      balconyElements.push(
        <Sphere key={`ft-${f}-${ti}`} args={[0.13, 6, 4]} position={[tx, y + 0.16, tz]}>
          <meshStandardMaterial color={ti === 0 ? '#166534' : '#15803d'} roughness={1} />
        </Sphere>
      );
    });
  }
  return (
    <group>
      {/* Core tower */}
      <Box args={[0.55, h, 0.55]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color={color} roughness={0.65} />
      </Box>
      {/* Vertical greenery strips */}
      {[-0.22, 0.22].map((x, i) => (
        <Box key={`vg-${i}`} args={[0.08, h * 0.85, 0.08]} position={[x, h * 0.45, x]}>
          <meshStandardMaterial color="#22c55e" roughness={0.8} />
        </Box>
      ))}
      {balconyElements}
      {/* Rooftop crown */}
      <Cone args={[0.3, 0.25, 4]} position={[0, h + 0.12, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.15).getStyle()} roughness={0.5} />
      </Cone>
    </group>
  );
}

/* ====== WATER PLANT (Water Reclamation) ====== */
function WaterPlant3D({ color, height }: BProps) {
  const h = height * 1.4;
  return (
    <group>
      {/* Main treatment tanks */}
      <Cylinder args={[0.55, 0.55, h, 16]} position={[-0.45, h / 2, -0.2]}>
        <meshStandardMaterial color={color} roughness={0.6} />
      </Cylinder>
      <Cylinder args={[0.45, 0.45, h * 0.75, 16]} position={[0.35, h * 0.38, 0.25]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.1).getStyle()} roughness={0.6} />
      </Cylinder>
      {/* Ring bands on tanks */}
      {[0.3, 0.6].map((frac, i) => (
        <Cylinder key={`rb-${i}`} args={[0.57, 0.57, 0.05, 16]} position={[-0.45, h * frac, -0.2]}>
          <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.75).getStyle()} roughness={0.4} />
        </Cylinder>
      ))}
      {/* Connecting pipes */}
      <Cylinder args={[0.06, 0.06, 0.7, 8]} position={[0, h * 0.55, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.5} />
      </Cylinder>
      <Cylinder args={[0.05, 0.05, 0.5, 8]} position={[0, h * 0.35, 0.1]} rotation={[0, 0.3, Math.PI / 2]}>
        <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.5} />
      </Cylinder>
      {/* Settling basin */}
      <Box args={[1.3, 0.12, 0.8]} position={[0, 0.06, -0.5]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.7).getStyle()} roughness={0.6} />
      </Box>
      <Box args={[1.3, 0.12, 0.8]} position={[0, 0.12, -0.5]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.85).getStyle()} roughness={0.5} transparent opacity={0.5} />
      </Box>
      {/* Water surface */}
      <Box args={[1.15, 0.02, 0.65]} position={[0, 0.16, -0.5]}>
        <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.3} emissive="#1d4ed8" emissiveIntensity={0.15} />
      </Box>
    </group>
  );
}

/* ====== LAB COMPLEX (Research Hub) ====== */
function LabComplex3D({ color, height }: BProps) {
  const h = height * 1.5;
  return (
    <group>
      {/* Left wing */}
      <Box args={[0.8, h * 0.7, 1.2]} position={[-0.55, h * 0.35, 0]}>
        <meshStandardMaterial color={color} roughness={0.65} />
      </Box>
      {/* Right wing */}
      <Box args={[0.8, h * 0.85, 1.2]} position={[0.55, h * 0.42, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.05).getStyle()} roughness={0.65} />
      </Box>
      {/* Central atrium (glass) */}
      <Box args={[0.65, h * 0.6, 0.8]} position={[0, h * 0.3, 0]}>
        <meshStandardMaterial color="#38bdf8" roughness={0.15} metalness={0.3} emissive="#0284c7" emissiveIntensity={0.12} />
      </Box>
      {/* Connecting bridge */}
      <Box args={[0.6, 0.08, 0.5]} position={[0, h * 0.65, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.8).getStyle()} roughness={0.5} />
      </Box>
      {/* Roof equipment */}
      <Cylinder args={[0.08, 0.08, 0.35, 8]} position={[-0.55, h * 0.85, -0.3]}>
        <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.5} />
      </Cylinder>
      <Box args={[0.25, 0.2, 0.25]} position={[0.55, h * 0.9, 0.3]}>
        <meshStandardMaterial color="#475569" roughness={0.5} />
      </Box>
      {/* Antenna array */}
      <Cylinder args={[0.02, 0.02, 0.4, 6]} position={[0, h * 0.8, 0]}>
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.6} />
      </Cylinder>
      <Box args={[0.06, 0.06, 0.06]} position={[0, h * 1.0, 0]}>
        <meshStandardMaterial color="#e2e8f0" roughness={0.2} />
      </Box>
      {/* Window strips */}
      {[0.3, 0.6].map((frac, i) => (
        <Box key={`lw-${i}`} args={[0.05, 0.08, 1.05]} position={[-0.16, h * frac, 0]}>
          <meshStandardMaterial color="#fef3c7" roughness={0.3} emissive="#fef3c7" emissiveIntensity={0.2} />
        </Box>
      ))}
    </group>
  );
}

/* ====== GRID CENTER (Smart Grid Center) ====== */
function GridCenter3D({ color, height }: BProps) {
  const h = height * 1.4;
  return (
    <group>
      {/* Main hexagonal-like building using rotated boxes */}
      <Box args={[1.5, h, 1.3]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color={color} roughness={0.6} />
      </Box>
      {/* Tiered upper sections */}
      <Box args={[1.1, h * 0.25, 0.9]} position={[0, h + 0.12, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.1).getStyle()} roughness={0.5} />
      </Box>
      <Box args={[0.7, h * 0.18, 0.6]} position={[0, h + 0.33, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.2).getStyle()} roughness={0.5} />
      </Box>
      {/* Large display screen */}
      <Box args={[0.9, 0.5, 0.03]} position={[0, h * 0.55, 0.66]}>
        <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.3} emissive="#1d4ed8" emissiveIntensity={0.25} />
      </Box>
      {/* Screen bezel */}
      <Box args={[0.95, 0.55, 0.02]} position={[0, h * 0.55, 0.64]}>
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </Box>
      {/* Grid lattice on sides */}
      {[-0.6, 0.6].map((x, i) => (
        <group key={`gl-${i}`}>
          {[0, 1, 2].map((l) => (
            <Box key={`glh-${l}`} args={[0.04, 0.55, 0.04]} position={[x, 0.2 + l * 0.55, 0.4]}>
              <meshStandardMaterial color="#fbbf24" roughness={0.3} emissive="#fbbf24" emissiveIntensity={0.15} />
            </Box>
          ))}
          {[0, 1].map((l) => (
            <Box key={`glv-${l}`} args={[0.04, 0.04, 0.75]} position={[x, 0.47 + l * 0.55, 0]}>
              <meshStandardMaterial color="#fbbf24" roughness={0.3} emissive="#fbbf24" emissiveIntensity={0.15} />
            </Box>
          ))}
        </group>
      ))}
      {/* Cooling units on top */}
      <Box args={[0.35, 0.3, 0.3]} position={[0.4, h + 0.15, 0.3]}>
        <meshStandardMaterial color="#475569" roughness={0.5} />
      </Box>
      <Box args={[0.3, 0.25, 0.25]} position={[-0.35, h + 0.12, -0.25]}>
        <meshStandardMaterial color="#475569" roughness={0.5} />
      </Box>
      {/* Antenna mast */}
      <Cylinder args={[0.04, 0.05, 0.6, 6]} position={[0, h + 0.5, 0]}>
        <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.5} />
      </Cylinder>
      <Box args={[0.15, 0.04, 0.04]} position={[0, h + 0.8, 0]}>
        <meshStandardMaterial color="#fbbf24" roughness={0.2} emissive="#fbbf24" emissiveIntensity={0.3} />
      </Box>
    </group>
  );
}

/* ====== TRADE CENTER (Global Trade Hub) ====== */
function TradeCenter3D({ color, height }: BProps) {
  const h = height * 2.2;
  return (
    <group>
      {/* Tapered main tower — wider at bottom, narrow at top */}
      <Box args={[0.7, h * 0.3, 0.7]} position={[0, h * 0.15, 0]}>
        <meshStandardMaterial color={color} roughness={0.6} />
      </Box>
      <Box args={[1.0, h * 0.3, 1.0]} position={[0, h * 0.4, 0]}>
        <meshStandardMaterial color={color} roughness={0.6} />
      </Box>
      <Box args={[1.3, h * 0.25, 1.3]} position={[0, h * 0.65, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.05).getStyle()} roughness={0.55} />
      </Box>
      <Box args={[1.5, h * 0.15, 1.5]} position={[0, h * 0.85, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.95).getStyle()} roughness={0.55} />
      </Box>
      {/* Crown/spire at top */}
      <Cylinder args={[0.3, 0.35, h * 0.2, 8]} position={[0, h * 0.98, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.2).getStyle()} roughness={0.4} />
      </Cylinder>
      <Cone args={[0.2, h * 0.18, 6]} position={[0, h * 1.12, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.3).getStyle()} roughness={0.3} metalness={0.3} />
      </Cone>
      {/* Vertical glass strips */}
      {[-0.4, 0, 0.4].map((x, i) => (
        <Box key={`gs-${i}`} args={[0.08, h * 0.6, 0.04]} position={[x, h * 0.5, 0.76]}>
          <meshStandardMaterial color="#bae6fd" roughness={0.2} metalness={0.2} emissive="#38bdf8" emissiveIntensity={0.12} />
        </Box>
      ))}
      {/* Entrance canopy */}
      <Box args={[0.9, 0.06, 0.3]} position={[0, h * 0.28, 0.8]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.1).getStyle()} roughness={0.5} />
      </Box>
      {/* Entrance doors */}
      <Box args={[0.5, 0.35, 0.04]} position={[0, h * 0.2, 0.76]}>
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </Box>
    </group>
  );
}

/* ====== PEACE GARDEN (World Peace Garden) ====== */
function PeaceGarden3D({ height: _h }: BProps) {
  return (
    <group>
      {/* Circular base */}
      <Cylinder args={[1.05, 1.05, 0.08, 16]} position={[0, 0.04, 0]}>
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </Cylinder>
      {/* Garden bed ring */}
      <Cylinder args={[1.0, 1.0, 0.1, 16]} position={[0, 0.11, 0]}>
        <meshStandardMaterial color="#4ade80" roughness={0.8} />
      </Cylinder>
      {/* Central monument obelisk */}
      <Cylinder args={[0.08, 0.12, 1.2, 8]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#d1d5db" roughness={0.4} metalness={0.3} />
      </Cylinder>
      <Sphere args={[0.1, 8, 8]} position={[0, 1.2, 0]}>
        <meshStandardMaterial color="#fbbf24" roughness={0.2} metalness={0.3} emissive="#fbbf24" emissiveIntensity={0.2} />
      </Sphere>
      {/* Radiating flower beds */}
      {[0, Math.PI / 3, 2 * Math.PI / 3, Math.PI, 4 * Math.PI / 3, 5 * Math.PI / 3].map((angle, i) => {
        const x = Math.sin(angle) * 0.55;
        const z = Math.cos(angle) * 0.55;
        return (
          <group key={`fbed-${i}`}>
            <Box args={[0.3, 0.06, 0.3]} position={[x, 0.11, z]}>
              <meshStandardMaterial color="#22c55e" roughness={0.8} />
            </Box>
            <Sphere args={[0.07, 6, 4]} position={[x, 0.2, z]}>
              <meshStandardMaterial color={['#ef4444', '#fbbf24', '#ec4899', '#a855f7', '#f97316', '#3b82f6'][i]} roughness={0.6} />
            </Sphere>
          </group>
        );
      })}
      {/* Path strips */}
      {[0, Math.PI / 3, 2 * Math.PI / 3, Math.PI, 4 * Math.PI / 3, 5 * Math.PI / 3].map((angle, i) => {
        const x = Math.sin(angle) * 0.75;
        const z = Math.cos(angle) * 0.75;
        return (
          <Box key={`path-${i}`} args={[0.12, 0.02, 0.25]} position={[x, 0.09, z]} rotation={[0, angle, 0]}>
            <meshStandardMaterial color="#d4d4d4" roughness={0.7} />
          </Box>
        );
      })}
      {/* Benches */}
      {[-0.7, 0.7].map((x, i) => (
        <Box key={`gb-${i}`} args={[0.5, 0.05, 0.12]} position={[x, 0.2, -0.1]}>
          <meshStandardMaterial color="#a16207" roughness={0.9} />
        </Box>
      ))}
    </group>
  );
}

/* ====== CHARGING STATION (EV Charging Hub) ====== */
function ChargingStation3D({ height: _h }: BProps) {
  return (
    <group>
      {/* Base platform */}
      <Box args={[1.8, 0.06, 1.3]} position={[0, 0.03, 0]}>
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </Box>
      {/* Angled canopy roof */}
      <Box args={[1.6, 0.06, 1.0]} position={[0, 0.7, 0]} rotation={[0.12, 0, 0]}>
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </Box>
      {/* Solar panel on canopy */}
      <Box args={[1.3, 0.03, 0.8]} position={[0, 0.73, 0.02]} rotation={[0.12, 0, 0]}>
        <meshStandardMaterial color="#1e3a5f" roughness={0.3} metalness={0.5} />
      </Box>
      {/* Support pillars */}
      {[-0.5, 0.5].map((x, i) => (
        <Cylinder key={`cp-${i}`} args={[0.05, 0.05, 0.65, 6]} position={[x, 0.35, -0.3]}>
          <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.4} />
        </Cylinder>
      ))}
      {[-0.5, 0.5].map((x, i) => (
        <Cylinder key={`cpb-${i}`} args={[0.05, 0.05, 0.55, 6]} position={[x, 0.3, 0.35]}>
          <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.4} />
        </Cylinder>
      ))}
      {/* Charging posts */}
      {[-0.4, 0, 0.4].map((x, i) => (
        <group key={`chg-${i}`}>
          <Cylinder args={[0.04, 0.05, 0.4, 6]} position={[x, 0.2, -0.5]}>
            <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.5} />
          </Cylinder>
          <Box args={[0.12, 0.2, 0.08]} position={[x, 0.35, -0.5]}>
            <meshStandardMaterial color="#22c55e" roughness={0.4} emissive="#22c55e" emissiveIntensity={0.1} />
          </Box>
          {/* Cable */}
          <Cylinder args={[0.012, 0.012, 0.3, 4]} position={[x, 0.28, -0.46]} rotation={[0.5, 0, 0]}>
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </Cylinder>
        </group>
      ))}
      {/* Payment kiosk */}
      <Box args={[0.3, 0.35, 0.18]} position={[0.65, 0.2, -0.45]}>
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </Box>
      <Box args={[0.22, 0.12, 0.04]} position={[0.65, 0.28, -0.35]}>
        <meshStandardMaterial color="#3b82f6" roughness={0.3} emissive="#3b82f6" emissiveIntensity={0.2} />
      </Box>
    </group>
  );
}

/* ====== GEOTHERMAL PLANT ====== */
function Geothermal3D({ color, height }: BProps) {
  const h = height * 1.3;
  return (
    <group>
      {/* Main plant building */}
      <Box args={[1.4, h, 1.2]} position={[0, h / 2, 0]}>
        <meshStandardMaterial color={color} roughness={0.65} />
      </Box>
      {/* Industrial roof structure */}
      <Box args={[1.5, 0.1, 1.3]} position={[0, h + 0.05, 0]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.7).getStyle()} roughness={0.5} />
      </Box>
      {/* Cooling tower */}
      <Cylinder args={[0.35, 0.45, h * 0.8, 12]} position={[0.65, h * 0.6, -0.15]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.15).getStyle()} roughness={0.55} />
      </Cylinder>
      <Cylinder args={[0.3, 0.35, 0.08, 12]} position={[0.65, h * 0.15, -0.15]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.8).getStyle()} roughness={0.4} />
      </Cylinder>
      {/* Main steam pipe going underground */}
      <Cylinder args={[0.1, 0.1, 0.5, 8]} position={[0, 0.5, -0.3]} rotation={[0.3, 0, 0]}>
        <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.5} />
      </Cylinder>
      {/* Connecting pipe between building and tower */}
      <Cylinder args={[0.06, 0.06, 0.6, 8]} position={[0.3, h * 0.5, -0.1]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.5} />
      </Cylinder>
      {/* Steam vents */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <group key={`steam-${i}`}>
          <Cylinder args={[0.04, 0.05, 0.25, 6]} position={[x, h + 0.18, -0.3 + i * 0.15]}>
            <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.5} />
          </Cylinder>
          <Sphere args={[0.1, 8, 6]} position={[x, h + 0.4, -0.3 + i * 0.15]}>
            <meshStandardMaterial color="#cbd5e1" roughness={1} transparent opacity={0.25} />
          </Sphere>
        </group>
      ))}
    </group>
  );
}

/* ====== LAB (Research Lab) ====== */
function Lab3D({ color, height }: BProps) {
  const h = height * 1.5;
  return (
    <group>
      {/* Main building — wide and modern */}
      <Box args={[1.8, h * 0.65, 1.2]} position={[0, h * 0.33, 0]}>
        <meshStandardMaterial color={color} roughness={0.65} />
      </Box>
      {/* Upper floor — narrower */}
      <Box args={[1.3, h * 0.25, 0.8]} position={[0, h * 0.78, -0.1]}>
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.08).getStyle()} roughness={0.55} />
      </Box>
      {/* Glass curtain wall — front elevation */}
      <Box args={[1.5, h * 0.5, 0.04]} position={[0, h * 0.4, 0.61]}>
        <meshStandardMaterial color="#7dd3fc" roughness={0.12} metalness={0.25} emissive="#38bdf8" emissiveIntensity={0.1} />
      </Box>
      {/* Glass grid lines */}
      {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
        <Box key={`glv-${i}`} args={[0.025, h * 0.5, 0.02]} position={[x, h * 0.4, 0.63]}>
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.4} />
        </Box>
      ))}
      {[0.2, 0.4].map((y, i) => (
        <Box key={`glh-${i}`} args={[1.5, 0.02, 0.02]} position={[0, h * (0.2 + y), 0.63]}>
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.4} />
        </Box>
      ))}
      {/* Entrance */}
      <Box args={[0.5, 0.4, 0.06]} position={[0, h * 0.18, 0.63]}>
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </Box>
      {/* Roof equipment — HVAC units */}
      {[-0.4, 0.4].map((x, i) => (
        <Box key={`hvac-${i}`} args={[0.35, 0.2, 0.3]} position={[x, h * 0.75, 0.2]}>
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </Box>
      ))}
      {/* Roof vent pipes */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <Cylinder key={`rv-${i}`} args={[0.04, 0.05, 0.25, 6]} position={[x, h * 0.9, -0.2 + i * 0.1]}>
          <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.4} />
        </Cylinder>
      ))}
      {/* Antenna mast */}
      <Cylinder args={[0.02, 0.02, 0.4, 6]} position={[0, h * 0.98, 0]}>
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.6} />
      </Cylinder>
      <Box args={[0.06, 0.06, 0.06]} position={[0, h * 1.18, 0]}>
        <meshStandardMaterial color="#e2e8f0" roughness={0.2} />
      </Box>
      {/* Side window strips */}
      {[-0.7, 0.7].map((x, i) => (
        <Box key={`sw-${i}`} args={[0.04, h * 0.3, 0.5]} position={[x, h * 0.35, 0]}>
          <meshStandardMaterial color="#fef3c7" roughness={0.2} emissive="#fef3c7" emissiveIntensity={0.12} />
        </Box>
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
    case 'solar_farm': return <SolarFarm3D {...p} />;
    case 'station': return <Station3D {...p} />;
    case 'forest_tower': return <ForestTower3D {...p} />;
    case 'water_plant': return <WaterPlant3D {...p} />;
    case 'lab_complex': return <LabComplex3D {...p} />;
    case 'grid_center': return <GridCenter3D {...p} />;
    case 'trade_center': return <TradeCenter3D {...p} />;
    case 'peace_garden': return <PeaceGarden3D {...p} />;
    case 'charging_station': return <ChargingStation3D {...p} />;
    case 'geothermal': return <Geothermal3D {...p} />;
    case 'lab': return <Lab3D {...p} />;
    default: return <Block3D {...p} />;
  }
}
