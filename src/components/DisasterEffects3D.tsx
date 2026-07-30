import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

const SPACING = 2.6;

/* Build a curved wave-face geometry (tall plane with crest curling forward) */
function createWaveGeometry(width: number, height: number, curl: number) {
  const segsW = 4;
  const segsH = 24;
  const geo = new THREE.PlaneGeometry(width, height, segsW, segsH);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const frac = (y / height + 0.5);
    // Narrow at base, wide in middle, curling at top — like a breaking wave
    const taper = 1 - frac * 0.3; // slightly narrower at top
    pos.setX(i, pos.getX(i) * taper);
    // Push forward: bottom stays back, middle pushes forward, top curls over
    const push = (frac < 0.8) ? frac * 1.2 : 0.96 - (frac - 0.8) * 2.5;
    pos.setZ(i, Math.max(push - 0.5, 0) * curl * 1.5);
  }
  geo.computeVertexNormals();
  return geo;
}

/* ====== TSUNAMI WAVE — curved wave walls ====== */
function TsunamiWave({ level }: { level: number }) {
  const frameRefs = useRef<THREE.Mesh[]>([]);
  const foamRefs = useRef<THREE.Mesh[]>([]);
  const travel = useRef(0);
  const recede = useRef(0);
  const gridSize = useGameStore((s) => s.gridSize);
  const gridCenter = (gridSize - 1) * SPACING * 0.5;
  const gridExtent = gridCenter + SPACING / 2;

  useFrame((_, delta) => {
    const state = useGameStore.getState();
    if (state.gameSpeed === 0) return;
    const dt = delta * state.gameSpeed;
    const daysLeft = state.disasterWarning?.daysLeft ?? 0;
    const isActive = state.disasterActive?.type === 'tsunami';
    const isWarning = state.disasterWarning?.type === 'tsunami';

    // Travel: advance during last day of warning
    if (isWarning && daysLeft <= 1) {
      travel.current = Math.min(1, travel.current + dt * 0.2);
    }

    // Recede: advance during active recovery
    if (isActive) {
      recede.current = Math.min(1, recede.current + dt * 0.2);
    } else if (!isActive && !isWarning) {
      travel.current = 0;
      recede.current = 0;
    }

    const t = travel.current;
    const r = recede.current;

    // Effective position: advances during warning, recedes during recovery
    const range = level <= 2 ? 1 : level <= 4 ? 2 : 3;
    const innerBound = range * SPACING;
    const outerStart = gridExtent + 5;
    // Travel toward target, then recede back by 1 tile per level
    const effTravel = Math.min(1, t);
    let wallDist = outerStart - effTravel * (outerStart - (gridExtent - innerBound));
    wallDist += r * SPACING;
    const half = Math.max(0.01, wallDist);
    const gridSpan = gridExtent * 2 + 2; // constant full-grid width for all walls

    // Height + alpha: visible only during last warning day, fade during recovery
    const baseH = 3 + level * 1.5;
    const warnFade = 1 - t * 0.65;
    const recFade = 1 - r;
    const h = baseH * warnFade * recFade;

    const FULL_ALPHA = 0.22;
    const alpha = t > 0 ? FULL_ALPHA * warnFade * recFade : 0;

    const curl = warnFade * recFade * 0.6;

    const walls: Array<{ px: number; pz: number; rotY: number }> = [
      { px: gridCenter, pz: gridCenter + half, rotY: 0 },
      { px: gridCenter, pz: gridCenter - half, rotY: Math.PI },
      { px: gridCenter + half, pz: gridCenter, rotY: -Math.PI / 2 },
      { px: gridCenter - half, pz: gridCenter, rotY: Math.PI / 2 },
    ];

    for (let i = 0; i < 4; i++) {
      const fm = frameRefs.current[i];
      const cm = foamRefs.current[i];
      if (!fm || !cm) continue;
      const w = walls[i];

      fm.position.set(w.px, h / 2, w.pz);
      fm.rotation.set(0, w.rotY, 0);
      fm.visible = alpha > 0.002 && h > 0.04;
      (fm.material as THREE.MeshBasicMaterial).opacity = alpha;
      fm.geometry.dispose();
      fm.geometry = createWaveGeometry(gridSpan, h, curl);

      cm.position.set(w.px, h - 0.3, w.pz);
      cm.rotation.set(0, w.rotY, 0);
      cm.visible = alpha > 0.003 && h > 0.08;
      (cm.material as THREE.MeshBasicMaterial).opacity = alpha * 1.3;
      cm.geometry.dispose();
      cm.geometry = new THREE.PlaneGeometry(gridSpan * 0.5, 0.4);
    }
  });

  return (
    <group>
      {[0, 1, 2, 3].map(i => (
        <group key={i}>
          <mesh ref={el => { if (el) { frameRefs.current[i] = el; el.userData.progress = '0'; } }}>
            <planeGeometry args={[1, 1, 1, 1]} />
            <meshBasicMaterial color="#0ea5e9" transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
          <mesh ref={el => { if (el) foamRefs.current[i] = el; }}>
            <planeGeometry args={[1, 0.3, 1, 1]} />
            <meshBasicMaterial color="#e0f2fe" transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ====== SMOG PARTICLE CLOUD ====== */
function SmogCloud({ active, warning }: { active: boolean; warning: boolean }) {
  const gridSize = useGameStore((s) => s.gridSize);
  const gameSpeed = useGameStore((s) => s.gameSpeed);
  const gridCenter = (gridSize - 1) * SPACING * 0.5;
  const half = gridCenter + SPACING * 1.5;

  const positions = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = gridCenter + (Math.random() - 0.5) * half * 2.8;
      pos[i * 3 + 1] = Math.random() * half * 0.9;
      pos[i * 3 + 2] = gridCenter + (Math.random() - 0.5) * half * 2.8;
    }
    return pos;
  }, [half, gridCenter]);

  const pointsRef = useRef<THREE.Points>(null);
  const opacity = useRef(0);

  useFrame((_, delta) => {
    const spd = gameSpeed === 0 ? 0 : delta;
    const target = active ? 1 : warning ? 0.08 : 0;
    opacity.current += (target - opacity.current) * Math.min(1, spd * 2);

    if (!pointsRef.current || opacity.current < 0.01) return;
    const geom = pointsRef.current.geometry;
    const posArr = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < posArr.length / 3; i++) {
      posArr[i * 3] += Math.sin(Date.now() * 0.0003 + i * 0.5) * 0.04 * spd * 10;
      posArr[i * 3 + 2] += Math.cos(Date.now() * 0.0004 + i * 0.3) * 0.04 * spd * 10;
      posArr[i * 3 + 1] += 0.15 * spd * 8;
      if (posArr[i * 3 + 1] > half * 1.3) posArr[i * 3 + 1] = -half * 0.3;
    }
    geom.attributes.position.needsUpdate = true;
    (pointsRef.current.material as THREE.PointsMaterial).opacity = opacity.current * 0.55;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#78716c"
        size={2.0}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.NormalBlending}
        sizeAttenuation
      />
    </points>
  );
}

/* ====== DROUGHT GROUND CRACKS ====== */
function DroughtCracks({ active, warning }: { active: boolean; warning: boolean }) {
  const gridSize = useGameStore((s) => s.gridSize);
  const gameSpeed = useGameStore((s) => s.gameSpeed);
  const landMin = -SPACING / 2;
  const landMax = (gridSize - 1) * SPACING + SPACING / 2;
  const opacity = useRef(0);

  const hexSegments = useMemo(() => {
    const hexWidth = 1.2;
    const hexHeight = hexWidth * 0.866;
    const cols = Math.ceil((landMax - landMin) / hexWidth) + 2;
    const rows = Math.ceil((landMax - landMin) / hexHeight) + 2;
    const segs: Array<{ x: number; z: number; w: number; h: number; angle: number }> = [];
    const r = hexWidth / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cx = landMin + col * hexWidth + (row % 2 === 0 ? 0 : r);
        const cz = landMin + row * hexHeight;
        if (cx < landMin + r * 1.5 || cx > landMax - r * 1.5 || cz < landMin + r * 1.5 || cz > landMax - r * 1.5) continue;

        const vertices: Array<{ x: number; z: number }> = [];
        for (let v = 0; v < 6; v++) {
          const angle = Math.PI / 3 * v - Math.PI / 2;
          vertices.push({ x: cx + Math.cos(angle) * r, z: cz + Math.sin(angle) * r });
        }

        for (let e = 0; e < 6; e++) {
          const v1 = vertices[e];
          const v2 = vertices[(e + 1) % 6];
          if (v1.x < landMin || v1.x > landMax || v1.z < landMin || v1.z > landMax) continue;
          if (v2.x < landMin || v2.x > landMax || v2.z < landMin || v2.z > landMax) continue;

          const dx = v2.x - v1.x;
          const dz = v2.z - v1.z;
          const len = Math.sqrt(dx * dx + dz * dz);
          const midX = (v1.x + v2.x) / 2;
          const midZ = (v1.z + v2.z) / 2;
          const edgeAngle = Math.atan2(dz, dx);

          segs.push({
            x: midX, z: midZ,
            w: 0.07 + Math.random() * 0.07,
            h: len * 1.6,
            angle: edgeAngle,
          });
        }
      }
    }
    return segs;
  }, [landMin, landMax]);

  useFrame((_, delta) => {
    const spd = gameSpeed === 0 ? 0 : delta;
    const target = active ? 1 : warning ? 0.45 : 0;
    opacity.current += (target - opacity.current) * Math.min(1, spd * 2);
  });

  if (opacity.current < 0.005) return null;

  return (
    <group>
      {hexSegments.map((hs, i) => (
        <mesh key={`cr-${i}`} position={[hs.x, -0.03, hs.z]} rotation={[0, -hs.angle, 0]}>
          <boxGeometry args={[hs.w, 0.008, hs.h]} />
          <meshBasicMaterial color="#2a0800" transparent opacity={Math.min(1, opacity.current * 1.1)} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ====== DROUGHT LAND TINT ====== */
function DroughtLand({ active, warning }: { active: boolean; warning: boolean }) {
  const gridSize = useGameStore((s) => s.gridSize);
  const gameSpeed = useGameStore((s) => s.gameSpeed);
  const gridCenter = (gridSize - 1) * SPACING * 0.5;
  const landSide = gridCenter + SPACING;
  const opacity = useRef(0);

  useFrame((_, delta) => {
    const spd = gameSpeed === 0 ? 0 : delta;
    const target = active ? 1 : warning ? 0.45 : 0;
    opacity.current += (target - opacity.current) * Math.min(1, spd * 2);
  });

  if (opacity.current < 0.005) return null;

  return (
    <mesh position={[gridCenter, -0.05, gridCenter]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[landSide * 2, landSide * 2]} />
      <meshBasicMaterial color="#b0901a" transparent opacity={opacity.current * 0.5} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ====== MAIN ====== */
export default function DisasterEffects3D() {
  const disasterWarning = useGameStore((s) => s.disasterWarning);
  const disasterActive = useGameStore((s) => s.disasterActive);
  const eventsOrganized = useGameStore((s) => s.eventsOrganized);
  const snapshotLevel = useRef(1);

  const warnType = disasterWarning?.type;
  const activeType = disasterActive?.type;
  const devLevel = disasterWarning?.devLevel;
  const derivedLevel = devLevel || (() => {
    if (eventsOrganized.length <= 1) return 1;
    if (eventsOrganized.length <= 3) return 2;
    if (eventsOrganized.length <= 5) return 3;
    if (eventsOrganized.length <= 7) return 4;
    return 5;
  })();

  // Snapshot level at warning time so recovery uses the same level
  if (disasterWarning) snapshotLevel.current = derivedLevel;
  const level = disasterWarning ? derivedLevel : snapshotLevel.current;

  return (
    <>
      {(warnType === 'tsunami' || activeType === 'tsunami') && (
        <TsunamiWave level={level} />
      )}
      {(warnType === 'smog' || activeType === 'smog') && (
        <SmogCloud active={activeType === 'smog'} warning={warnType === 'smog'} />
      )}
      {(warnType === 'drought' || activeType === 'drought') && (
        <>
          <DroughtLand active={activeType === 'drought'} warning={warnType === 'drought'} />
          <DroughtCracks active={activeType === 'drought'} warning={warnType === 'drought'} />
        </>
      )}
    </>
  );
}
