import type { Building, Category } from '../types';
import { CATEGORY_COLORS } from '../data/buildings';
import { HW, HH, TILE_W, TILE_H, topPolygon, frontPolygon, rightPolygon, viewBox } from '../util/iso';

function parseColor(c: string): { r: number; g: number; b: number } {
  if (c.startsWith('#')) {
    const h = c.replace('#', '');
    return { r: parseInt(h.substring(0, 2), 16), g: parseInt(h.substring(2, 4), 16), b: parseInt(h.substring(4, 6), 16) };
  }
  const m = c.match(/rgb\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)/);
  if (m) return { r: parseFloat(m[1]), g: parseFloat(m[2]), b: parseFloat(m[3]) };
  return { r: 0, g: 0, b: 0 };
}
function darken(c: string, f: number) {
  const { r, g, b } = parseColor(c);
  return `rgb(${Math.floor(r * f)},${Math.floor(g * f)},${Math.floor(b * f)})`;
}
function lighten(c: string, f: number) {
  const { r, g, b } = parseColor(c);
  return `rgb(${Math.floor(Math.min(255, r + (255 - r) * f))},${Math.floor(Math.min(255, g + (255 - g) * f))},${Math.floor(Math.min(255, b + (255 - b) * f))})`;
}

interface ShapeProps { color: string; h: number; emoji: string; category: Category; id: string }

/** Y on front-left wall at (x, frac=0..1 from top to bottom) */
function fwY(x: number, h: number, frac: number): number { return HH + x / 2 + frac * h; }
/** Y on front-right wall */
function rwY(x: number, h: number, frac: number): number { return (HW * 1.5) - x / 2 + frac * h; }

/** Parallelogram polygon on the front-left wall at (x, frac) with width w, pixel height ph */
function fwPoly(x: number, h: number, frac: number, w: number, ph: number): string {
  const y = fwY(x, h, frac);
  return `${x},${y} ${x + w},${y + w / 2} ${x + w},${y + w / 2 + ph} ${x},${y + ph}`;
}
/** Parallelogram polygon on the front-right wall */
function rwPoly(x: number, h: number, frac: number, w: number, ph: number): string {
  const y = rwY(x, h, frac);
  return `${x},${y} ${x + w},${y - w / 2} ${x + w},${y - w / 2 + ph} ${x},${y + ph}`;
}

/* ====== Building3D wrapper ====== */
function Building3D({
  h, color, topColor, frontColor, rightColor, strokeColor,
  topChildren, frontChildren, rightChildren,
}: {
  h: number; color: string;
  topColor?: string; frontColor?: string; rightColor?: string; strokeColor?: string;
  topChildren?: React.ReactNode; frontChildren?: React.ReactNode; rightChildren?: React.ReactNode;
}) {
  const tc = topColor ?? color;
  const fc = frontColor ?? darken(color, 0.7);
  const rc = rightColor ?? darken(color, 0.5);
  const sc = strokeColor ?? darken(color, 0.4);
  return (
    <div style={{ position: 'absolute', left: 0, top: -h, width: TILE_W, height: h + TILE_H, pointerEvents: 'none' }}>
      <svg width={TILE_W} height={h + TILE_H} viewBox={viewBox(h)} style={{ display: 'block', overflow: 'visible' }}>
        <polygon points={frontPolygon(h)} fill={fc} stroke={sc} strokeWidth={0.5} strokeLinejoin="round" />
        <polygon points={rightPolygon(h)} fill={rc} stroke={sc} strokeWidth={0.5} strokeLinejoin="round" />
        {frontChildren}
        {rightChildren}
        <polygon points={topPolygon()} fill={tc} stroke={sc} strokeWidth={0.5} strokeLinejoin="round" />
        {topChildren}
      </svg>
    </div>
  );
}

/* ====== HOUSE ====== */
function House({ color, h }: ShapeProps) {
  const dx = 7, dy = 9;
  return (
    <Building3D color={color} h={h}
      topChildren={
        <g>
          <polygon points={`${HW - 12},3 ${HW + 12},3 ${HW},${HH - 1}`}
            fill={darken(color, 0.35)} stroke={darken(color, 0.5)} strokeWidth={0.5} />
          <rect x={HW + 4} y={0} width={3} height={6} fill="#78716c" stroke="#57534e" strokeWidth={0.3} />
        </g>
      }
      frontChildren={
        <g>
          <polygon points={fwPoly(HW / 2 - dx / 2, h, 0.5, dx, dy)} fill="#3e1f0a" />
          <polygon points={fwPoly(2, h, 0.2, 6, 6)} fill="#fbbf24" stroke="#3e1f0a" strokeWidth={0.3} />
          <polygon points={fwPoly(HW - 14, h, 0.2, 6, 6)} fill="#fbbf24" stroke="#3e1f0a" strokeWidth={0.3} />
          <line x1={0} y1={fwY(0, h, 0.1)} x2={HW} y2={fwY(HW, h, 0.1)} stroke={darken(color, 0.6)} strokeWidth={0.4} />
        </g>
      }
    />
  );
}

/* ====== SHOP ====== */
function Shop({ color, h }: ShapeProps) {
  return (
    <Building3D color={color} h={h}
      frontChildren={
        <g>
          {Array.from({ length: 7 }).map((_, i) => (
            <polygon key={i} points={fwPoly(i * 4, h, 0.12, 3, 4)}
              fill={i % 2 === 0 ? darken(color, 0.3) : lighten(color, 0.1)} />
          ))}
          <polygon points={fwPoly(3, h, 0.38, 16, 9)} fill="#fef3c7" stroke="#3e1f0a" strokeWidth={0.4} />
          <line x1={5} y1={fwY(5, h, 0.42)} x2={17} y2={fwY(17, h, 0.42)} stroke={darken(color, 0.4)} strokeWidth={0.3} />
          <polygon points={fwPoly(HW / 2 + 3, h, 0.38, 4, 9)} fill="#3e1f0a" />
          <circle cx={HW / 2 + 4.5} cy={fwY(HW / 2 + 4.5, h, 0.55)} r={0.6} fill="#fbbf24" />
        </g>
      }
      topChildren={
        <g>
          <polygon points={`${HW - 8},${HH - 2} ${HW + 8},${HH - 7} ${HW + 8},${HH - 3} ${HW - 8},${HH + 2}`}
            fill={lighten(color, 0.2)} stroke={darken(color, 0.4)} strokeWidth={0.3} />
        </g>
      }
    />
  );
}

/* ====== TOWER ====== */
function Tower({ color, h }: ShapeProps) {
  const rows = 4, cols = 2;
  const cw = 5, ch = 5;
  const pieces: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = 1 + c * 7;
      pieces.push(<polygon key={`fw-${r}-${c}`} points={fwPoly(x, h, 0.08 + r * 0.2, cw, ch)} fill="#fef3c7" stroke="#1e293b" strokeWidth={0.2} />);
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = HW + 2 + c * 7;
      pieces.push(<polygon key={`rw-${r}-${c}`} points={rwPoly(x, h, 0.08 + r * 0.2, cw, ch)} fill="#fef3c7" stroke="#1e293b" strokeWidth={0.2} />);
    }
  }
  return (
    <Building3D color={lighten(color, 0.04)} h={h}
      frontChildren={
        <g>
          <polygon points={fwPoly(HW / 2 - 5, h, 0.55, 10, h * 0.35)} fill="#1e293b" />
          {pieces}
        </g>
      }
      rightChildren={
        <g>
          <polygon points={rwPoly(HW + 2, h, 0.55, 8, h * 0.35)} fill="#1e293b" />
          {pieces}
        </g>
      }
      topChildren={<g>
        <polygon points={`${HW - 3},-1 ${HW + 3},-7 ${HW + 3},-3 ${HW - 3},3`}
          fill={lighten(color, 0.25)} stroke={darken(color, 0.3)} strokeWidth={0.3} />
        <line x1={HW} y1={-1} x2={HW} y2={-7} stroke={darken(color, 0.6)} strokeWidth={0.4} />
      </g>}
    />
  );
}

/* ====== FACTORY ====== */
function Factory({ color, h }: ShapeProps) {
  return (
    <Building3D color={lighten(color, 0.02)} h={h}
      topChildren={
        <g>
          <rect x={4} y={2} width={5} height={8} fill="#78716c" stroke="#44403c" strokeWidth={0.3} rx={0.5} />
          <rect x={HW - 4} y={4} width={4} height={5} fill="#78716c" stroke="#44403c" strokeWidth={0.3} rx={0.5} />
          <ellipse cx={6.5} cy={2} rx={3} ry={1.5} fill="#9ca3af" opacity={0.35} />
          <ellipse cx={HW - 2} cy={4} rx={2.5} ry={1.2} fill="#9ca3af" opacity={0.35} />
        </g>
      }
      frontChildren={
        <g>
          <polygon points={fwPoly(HW / 2 - 9, h, 0.55, 18, 14)} fill="#1f2937" stroke={darken(color, 0.3)} strokeWidth={0.4} />
          <line x1={0} y1={fwY(0, h, 0.42)} x2={HW} y2={fwY(HW, h, 0.42)} stroke="#374151" strokeWidth={0.3} />
          <line x1={0} y1={fwY(0, h, 0.32)} x2={HW} y2={fwY(HW, h, 0.32)} stroke="#374151" strokeWidth={0.3} />
          <line x1={0} y1={fwY(0, h, 0.22)} x2={HW} y2={fwY(HW, h, 0.22)} stroke="#374151" strokeWidth={0.3} />
        </g>
      }
    />
  );
}

/* ====== PARK ====== */
function Park({ h }: ShapeProps) {
  return (
    <Building3D color="#4ade80" h={Math.max(h, 5)} topColor="#4ade80"
      topChildren={
        <g>
          <circle cx={HW - 11} cy={HH - 4} r={3.5} fill="#166534" />
          <circle cx={HW + 9} cy={HH - 5} r={4} fill="#15803d" />
          <circle cx={HW - 5} cy={HH + 5} r={3} fill="#166534" />
          <circle cx={HW + 11} cy={HH + 4} r={3} fill="#14532d" />
          <circle cx={HW - 1} cy={HH - 1} r={2.5} fill="#22c55e" />
          <rect x={HW - 2} y={HH + 4} width={10} height={2} fill="#a16207" rx={0.3} />
        </g>
      }
    />
  );
}

/* ====== GREEN ROOF ====== */
function GreenRoof({ h }: ShapeProps) {
  return (
    <Building3D color="#86efac" h={h}
      topChildren={
        <g>
          <polygon points={`${HW - 22},${HH - 2} ${HW + 22},${HH - 2} ${HW + 14},${HH + 6} ${HW - 14},${HH + 6}`}
            fill="#22c55e" stroke="#166534" strokeWidth={0.4} />
          {[-16, -6, 4, 14].map(x0 => (
            <line key={x0} x1={HW + x0} y1={HH - 1} x2={HW + x0} y2={HH + 4} stroke="#166534" strokeWidth={0.3} />
          ))}
          <circle cx={HW - 8} cy={HH + 2} r={2} fill="#15803d" />
          <circle cx={HW + 8} cy={HH + 2} r={2} fill="#166534" />
        </g>
      }
    />
  );
}

/* ====== STEPPED (Vertical Farm) ====== */
function Stepped({ color, h }: ShapeProps) {
  const h1 = Math.round(h * 0.4), h2 = Math.round(h * 0.35), h3 = h - h1 - h2;
  const topH = h2 + h3 + 10, totalH = h + TILE_H + topH;
  const c1 = color, c2 = lighten(color, 0.1), c3 = lighten(color, 0.2);
  const sc1 = darken(c1, 0.4), sc2 = darken(c2, 0.4), sc3 = darken(c3, 0.4);
  function shift(p: string, d: number) { return p.split(' ').map(pt => { const [x, y] = pt.split(',').map(Number); return `${x},${y - d}`; }).join(' '); }
  return (
    <div style={{ position: 'absolute', left: 0, top: -(h + topH), width: TILE_W, height: totalH, pointerEvents: 'none' }}>
      <svg width={TILE_W} height={totalH} viewBox={`0 ${-topH} ${TILE_W} ${totalH}`} style={{ display: 'block', overflow: 'visible' }}>
        <polygon points={frontPolygon(h1)} fill={darken(c1, 0.7)} stroke={sc1} strokeWidth={0.5} strokeLinejoin="round" />
        <polygon points={rightPolygon(h1)} fill={darken(c1, 0.5)} stroke={sc1} strokeWidth={0.5} strokeLinejoin="round" />
        <polygon points={shift(frontPolygon(h2), h1)} fill={darken(c2, 0.7)} stroke={sc2} strokeWidth={0.5} strokeLinejoin="round" />
        <polygon points={shift(rightPolygon(h2), h1)} fill={darken(c2, 0.5)} stroke={sc2} strokeWidth={0.5} strokeLinejoin="round" />
        <polygon points={shift(frontPolygon(h3), h1 + h2)} fill={darken(c3, 0.7)} stroke={sc3} strokeWidth={0.5} strokeLinejoin="round" />
        <polygon points={shift(rightPolygon(h3), h1 + h2)} fill={darken(c3, 0.5)} stroke={sc3} strokeWidth={0.5} strokeLinejoin="round" />
        <polygon points={shift(topPolygon(), h1 + h2)} fill={c3} stroke={sc3} strokeWidth={0.5} strokeLinejoin="round" />
        <text x={HW} y={HH - h1 - h2} textAnchor="middle" dominantBaseline="central" fontSize={7}
          style={{ pointerEvents: 'none', userSelect: 'none' }}>🌾</text>
      </svg>
    </div>
  );
}

/* ====== CYLINDER (Water Purifier / Desalination) ====== */
function Cylinder({ color, h, id }: ShapeProps) {
  return (
    <Building3D color={color} h={h}
      topChildren={
        <g>
          <ellipse cx={HW} cy={HH} rx={HW - 2} ry={HH - 2} fill={lighten(color, 0.15)} stroke={darken(color, 0.4)} strokeWidth={0.5} />
          <ellipse cx={HW} cy={HH} rx={HW - 6} ry={HH - 6} fill={lighten(color, 0.25)} stroke={darken(color, 0.3)} strokeWidth={0.3} />
          <polygon points={`-1,${HH - 1} 3,${HH - 3} 3,${HH + 1} -1,${HH + 1}`} fill={darken(color, 0.5)} />
          <polygon points={`${HW * 2 - 2},${HH - 1} ${HW * 2 + 2},${HH - 3} ${HW * 2 + 2},${HH + 1} ${HW * 2 - 2},${HH + 1}`} fill={darken(color, 0.5)} />
          {id === 'desalination' && <text x={HW} y={HH} textAnchor="middle" dominantBaseline="central" fontSize={5} fill="#fff" style={{ pointerEvents: 'none' }}>🌊</text>}
        </g>
      }
      frontChildren={
        <g>
          <polyline points={fwPoly(4, h, 0.3, HW - 8, 0)} fill="none" stroke={darken(color, 0.4)} strokeWidth={0.4} />
          <polyline points={fwPoly(4, h, 0.6, HW - 8, 0)} fill="none" stroke={darken(color, 0.4)} strokeWidth={0.4} />
        </g>
      }
    />
  );
}

/* ====== TURBINE ====== */
function Turbine({ color, h }: ShapeProps) {
  return (
    <Building3D color={lighten(color, 0.15)} h={h}
      frontChildren={
        <g>
          <polygon points={fwPoly(11, h, 0.02, 6, h * 0.96)} fill="#94a3b8" opacity={0.35} />
        </g>
      }
      topChildren={
        <g>
          <polygon points={`${HW - 3},${HH - 1} ${HW + 3},${HH - 4} ${HW + 3},${HH} ${HW - 3},${HH + 3}`}
            fill={lighten(color, 0.3)} stroke={darken(color, 0.3)} strokeWidth={0.3} />
          <line x1={HW} y1={HH - 8} x2={HW} y2={HH + 10} stroke="#e2e8f0" strokeWidth={1.2} strokeLinecap="round" />
          <line x1={HW - 7} y1={HH + 1} x2={HW + 7} y2={HH + 1} stroke="#e2e8f0" strokeWidth={1.2} strokeLinecap="round" />
          <line x1={HW - 5} y1={HH - 4} x2={HW + 5} y2={HH + 6} stroke="#e2e8f0" strokeWidth={1.2} strokeLinecap="round" />
          <line x1={HW - 5} y1={HH + 6} x2={HW + 5} y2={HH - 4} stroke="#e2e8f0" strokeWidth={1.2} strokeLinecap="round" />
          <circle cx={HW} cy={HH + 1} r={1.5} fill="#475569" />
        </g>
      }
    />
  );
}

/* ====== SOLAR ====== */
function Solar({ h }: ShapeProps) {
  return (
    <Building3D color="#0284c7" h={h}
      topChildren={
        <g>
          <polygon points={`${HW - 17},${HH - 4} ${HW + 5},${HH - 9} ${HW + 3},${HH + 1} ${HW - 19},${HH + 5}`}
            fill="#1e3a5f" stroke="#0c1e2e" strokeWidth={0.4} />
          <polygon points={`${HW + 7},${HH - 6} ${HW + 21},${HH - 2} ${HW + 19},${HH + 4} ${HW + 5},${HH}`}
            fill="#1e3a5f" stroke="#0c1e2e" strokeWidth={0.4} />
          <line x1={HW - 15} y1={HH - 3} x2={HW - 1} y2={HH - 7} stroke="#3b82f6" strokeWidth={0.3} />
          <line x1={HW - 17} y1={HH + 1} x2={HW - 1} y2={HH - 4} stroke="#3b82f6" strokeWidth={0.3} />
          <line x1={HW + 9} y1={HH - 3} x2={HW + 19} y2={HH} stroke="#3b82f6" strokeWidth={0.3} />
          <line x1={HW + 7} y1={HH + 2} x2={HW + 17} y2={HH + 5} stroke="#3b82f6" strokeWidth={0.3} />
        </g>
      }
    />
  );
}

/* ====== BLOCK (Wave Converter / Composting Hub) ====== */
function Block({ color, h, id }: ShapeProps) {
  if (id === 'wave_converter') {
    return (
      <Building3D color={color} h={h}
        frontChildren={
          <g>
            <polyline points={fwPoly(2, h, 0.15, HW - 4, 0)} fill="none" stroke={lighten(color, 0.4)} strokeWidth={0.6} strokeLinecap="round" />
            <polyline points={fwPoly(2, h, 0.25, HW - 4, 0)} fill="none" stroke={lighten(color, 0.4)} strokeWidth={0.5} strokeLinecap="round" />
          </g>
        }
        topChildren={
          <g>
            <circle cx={HW - 4} cy={HH - 2} r={3} fill={lighten(color, 0.3)} stroke={darken(color, 0.3)} strokeWidth={0.3} />
            <circle cx={HW + 4} cy={HH + 2} r={2.5} fill={lighten(color, 0.3)} stroke={darken(color, 0.3)} strokeWidth={0.3} />
          </g>
        }
      />
    );
  }
  if (id === 'composting') {
    return (
      <Building3D color="#a07818" h={h} topColor="#b8860b"
        topChildren={
          <g>
            <polygon points={`${HW - 20},${HH - 4} ${HW + 20},${HH - 7} ${HW + 12},${HH + 4} ${HW - 12},${HH + 4}`}
              fill="#5c3d0e" stroke="#3e2a09" strokeWidth={0.3} />
            <circle cx={HW - 6} cy={HH - 1} r={1.5} fill="#d4a017" />
            <circle cx={HW + 6} cy={HH + 1} r={1.2} fill="#c49010" />
            <circle cx={HW} cy={HH + 3} r={1} fill="#d4a017" />
          </g>
        }
        frontChildren={
          <g>
            <polygon points={fwPoly(4, h, 0.55, HW - 8, 7)} fill="#5c3d0e" stroke="#3e2a09" strokeWidth={0.4} />
          </g>
        }
      />
    );
  }
  return <Building3D color={color} h={h} />;
}

/* ====== WALL (Seawall) ====== */
function Wall({ color, h }: ShapeProps) {
  return (
    <Building3D color={color} h={Math.max(h, 6)} topColor={lighten(color, 0.08)}
      topChildren={
        <g>
          <polygon points={`2,${HH - 2}  ${HW * 2 - 2},${HH - 2 + HW - 1}  ${HW * 2 - 2},${HH + 2 + HW - 1}  2,${HH + 2}`}
            fill={lighten(color, 0.12)} stroke={darken(color, 0.4)} strokeWidth={0.4} />
          {[4, 12, 20, 28, 36, 44, 52].map(x => (
            <line key={x} x1={x} y1={rwY(x, 0, 0) - 4} x2={x} y2={rwY(x, 0, 0) + 4}
              stroke={darken(color, 0.4)} strokeWidth={0.3} />
          ))}
        </g>
      }
      frontChildren={
        <g>
          {Array.from({ length: Math.max(1, Math.floor(h / 4)) }).map((_, i) => (
            <polyline key={i} points={fwPoly(0, h, 0.2 + i / Math.max(h / 4, 1), HW, 0)}
              fill="none" stroke={darken(color, 0.3)} strokeWidth={0.4} />
          ))}
        </g>
      }
    />
  );
}

/* ====== SLOPED (Wave Absorber) ====== */
function Sloped({ color, h }: ShapeProps) {
  return (
    <Building3D color={color} h={h}
      topChildren={
        <g>
          <polygon points={`${HW - 18},${HH + 2} ${HW + 18},${HH - 3} ${HW},${HH - 7}`}
            fill={lighten(color, 0.12)} stroke={darken(color, 0.4)} strokeWidth={0.4} />
          {[-12, -4, 4, 12].map(x0 => (
            <line key={x0} x1={HW + x0} y1={HH} x2={HW + x0} y2={HH - 5} stroke={darken(color, 0.5)} strokeWidth={0.3} />
          ))}
        </g>
      }
      frontChildren={
        <g>
          <polygon points={fwPoly(3, h, 0.7, HW - 6, 4)} fill={darken(color, 0.5)} />
        </g>
      }
    />
  );
}

/* ====== OBSERVATORY ====== */
function Observatory({ color, h }: ShapeProps) {
  const bh = Math.round(h * 0.7);
  return (
    <Building3D color={color} h={bh}
      topChildren={
        <g>
          <ellipse cx={HW} cy={HH + 4} rx={10} ry={4} fill={lighten(color, 0.2)} stroke={darken(color, 0.4)} strokeWidth={0.5} />
          <path d={`M ${HW - 10} ${HH + 4} A 10 7 0 0 1 ${HW + 10} ${HH + 4}`} fill={lighten(color, 0.3)} stroke={darken(color, 0.4)} strokeWidth={0.5} />
          <rect x={HW - 1} y={HH - 3} width={2} height={5} fill={darken(color, 0.6)} rx={0.3} />
          <circle cx={HW} cy={HH - 4} r={2} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={0.3} />
        </g>
      }
      frontChildren={
        <g>
          <polygon points={fwPoly(HW / 2 - 3, bh, 0.4, 6, 8)} fill="#1e293b" />
        </g>
      }
    />
  );
}

/* ====== DOME ====== */
function Dome({ color, h, id }: ShapeProps) {
  const isTransit = id === 'transit_hub';
  const bh = Math.round(h * 0.7);
  const domeColor = isTransit ? '#dc2626' : color;
  return (
    <Building3D color={domeColor} h={bh}
      topChildren={
        <g>
          <ellipse cx={HW} cy={HH + 4} rx={12} ry={5} fill={lighten(domeColor, 0.2)} stroke={darken(domeColor, 0.4)} strokeWidth={0.5} />
          <path d={`M ${HW - 12} ${HH + 4} A 12 8 0 0 1 ${HW + 12} ${HH + 4}`} fill={lighten(domeColor, 0.3)} stroke={darken(domeColor, 0.4)} strokeWidth={0.5} />
          {isTransit ? (
            <>
              <polygon points={`${HW - 10},${HH - 1} ${HW + 10},${HH - 6} ${HW + 10},${HH - 3} ${HW - 10},${HH + 2}`}
                fill="#fbbf24" />
              <polygon points={`${HW - 6},${HH - 5} ${HW + 6},${HH - 9} ${HW + 6},${HH - 4} ${HW - 6},${HH}`}
                fill="#1e293b" />
            </>
          ) : (
            <>
              <line x1={HW - 7} y1={HH + 1} x2={HW - 2} y2={HH - 4} stroke="#e2e8f0" strokeWidth={0.6} />
              <circle cx={HW - 7} cy={HH + 1} r={1.2} fill="#e2e8f0" />
              <line x1={HW + 2} y1={HH + 1} x2={HW + 7} y2={HH - 4} stroke="#e2e8f0" strokeWidth={0.6} />
              <circle cx={HW + 7} cy={HH + 1} r={1.2} fill="#e2e8f0" />
            </>
          )}
        </g>
      }
      frontChildren={
        <g>
          {isTransit ? (
            <>
              <polygon points={`2,${fwY(2, bh, 0.5)} ${HW - 2},${fwY(HW - 2, bh, 0.5)} ${HW - 2},${fwY(HW - 2, bh, 0.5) + 2} 2,${fwY(2, bh, 0.5) + 2}`}
                fill="#fbbf24" />
              <polygon points={fwPoly(HW / 2 - 4, bh, 0.55, 8, 7)} fill="#1e293b" />
            </>
          ) : (
            <polygon points={fwPoly(HW / 2 - 3, bh, 0.45, 6, 7)} fill="#1e293b" />
          )}
        </g>
      }
    />
  );
}

/* ====== CHIMNEY (Recycling) ====== */
function ChimneyShape({ color: _color, h }: ShapeProps) {
  return (
    <Building3D color="#78716c" h={h} topColor="#8b8076"
      topChildren={
        <g>
          <rect x={4} y={0} width={6} height={11} fill="#57534e" stroke="#44403c" strokeWidth={0.3} rx={0.5} />
          <ellipse cx={7} cy={0} rx={3.5} ry={1.5} fill="#a8a29e" />
          <ellipse cx={7} cy={-2} rx={2} ry={1} fill="#9ca3af" opacity={0.5} />
          <ellipse cx={7} cy={-4} rx={1.2} ry={0.6} fill="#9ca3af" opacity={0.3} />
          <text x={HW + 4} y={HH - 3} textAnchor="middle" fontSize={8}
            style={{ pointerEvents: 'none', userSelect: 'none' }}>♻</text>
        </g>
      }
      frontChildren={
        <g>
          <polygon points={fwPoly(4, h, 0.55, HW - 8, h * 0.4)} fill="#57534e" />
          <polyline points={fwPoly(2, h, 0.4, HW - 4, 0)} fill="none" stroke="#44403c" strokeWidth={0.3} />
        </g>
      }
    />
  );
}

/* ====== FLAT (Bike Lane) ====== */
function Flat({ h }: ShapeProps) {
  return (
    <Building3D color="#dc2626" h={Math.max(h, 2)}
      topChildren={
        <g>
          <polyline points={`4,${HH - 2} ${HW * 2 - 4},${HH - 2 + HW}`} fill="none" stroke="#fff" strokeWidth={0.5} strokeDasharray="3 3" opacity={0.5} />
          <polyline points={`4,${HH + 2} ${HW * 2 - 4},${HH + 2 + HW}`} fill="none" stroke="#fff" strokeWidth={0.5} strokeDasharray="3 3" opacity={0.5} />
          <text x={HW} y={HH} textAnchor="middle" dominantBaseline="central" fontSize={8}
            style={{ pointerEvents: 'none', userSelect: 'none' }}>🚲</text>
        </g>
      }
    />
  );
}

/* ====== MAIN ====== */
interface Props { building: Building }
export default function BuildingShape({ building }: Props) {
  let color = CATEGORY_COLORS[building.category];
  if (building.shape === 'park' || building.shape === 'green_roof') color = '#4ade80';
  const h = building.height * 14;
  const p: ShapeProps = { color, h, emoji: building.emoji, category: building.category, id: building.id };

  switch (building.shape) {
    case 'house': return <House {...p} />;
    case 'shop': return <Shop {...p} />;
    case 'tower': return <Tower {...p} />;
    case 'factory': return <Factory {...p} />;
    case 'park': return <Park {...p} />;
    case 'green_roof': return <GreenRoof {...p} />;
    case 'stepped': return <Stepped {...p} />;
    case 'cylinder': return <Cylinder {...p} />;
    case 'turbine': return <Turbine {...p} />;
    case 'solar': return <Solar {...p} />;
    case 'block': return <Block {...p} />;
    case 'wall': return <Wall {...p} />;
    case 'sloped': return <Sloped {...p} />;
    case 'observatory': return <Observatory {...p} />;
    case 'dome': return <Dome {...p} />;
    case 'chimney': return <ChimneyShape {...p} />;
    case 'flat': return <Flat {...p} />;
    default: return <Block {...p} />;
  }
}
