import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

interface MeterProps {
  label: string;
  value: number;
  max?: number;
  color: string;
  icon: string;
  suffix?: string;
  delta?: number;
  deltaKey?: string;
}

function MeterBar({ label, value, max = 100, color, icon, suffix = '', delta, deltaKey = '' }: MeterProps) {
  const pct = Math.min(100, (value / max) * 100);
  const [showDelta, setShowDelta] = useState(false);

  useEffect(() => {
    if (delta !== undefined && delta !== 0) {
      setShowDelta(true);
      const t = setTimeout(() => setShowDelta(false), 1800);
      return () => clearTimeout(t);
    }
  }, [delta, deltaKey]);

  const isPositive = delta && delta > 0;
  const deltaLabel = delta && delta !== 0
    ? `${isPositive ? '+' : ''}${Number.isInteger(delta) ? delta : delta.toFixed(0)}${suffix}`
    : '';

  return (
    <div className="meter">
      <div className="meter-header">
        <span className="meter-icon">{icon}</span>
        <span className="meter-label">{label}</span>
        <span className="meter-value" style={{ color }}>
          {value}{suffix}
        </span>
      </div>
      <div className="meter-track">
        <div
          className="meter-fill"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {showDelta && delta !== 0 && (
        <div className={`meter-delta ${isPositive ? 'up' : 'down'}`} key={deltaKey + delta}>
          {deltaLabel}
        </div>
      )}
    </div>
  );
}

export default function MeterPanel() {
  const money = useGameStore((s) => s.money);
  const population = useGameStore((s) => s.population);
  const pollution = useGameStore((s) => s.pollution);
  const happiness = useGameStore((s) => s.happiness);
  const renewablePct = useGameStore((s) => s.renewablePct);
  const resilience = useGameStore((s) => s.resilience);
  const deltas = useGameStore((s) => s.meterDeltas);
  const tickCount = useGameStore((s) => s.tickCount);
  const toggleDevGrid = useGameStore((s) => s.toggleDevGrid);
  const hasBuildings = useGameStore((s) => s.grid.some(row => row.some(cell => cell !== null)));

  return (
    <div className="meter-panel">
      <MeterBar label="Money" value={money} max={100000} color="#f59e0b" icon="💰"
        suffix="" delta={deltas.money} deltaKey={`money-${tickCount}`} />
      <MeterBar label="Population" value={population} color="#22c55e" icon="👥"
        suffix="" delta={deltas.population} deltaKey={`pop-${tickCount}`} />
      <MeterBar label="Air Quality" value={100 - pollution}
        color={pollution > 50 ? '#ef4444' : '#22c55e'} icon="🌿"
        suffix="%" delta={deltas.pollution !== undefined ? -deltas.pollution : undefined} deltaKey={`aq-${tickCount}`} />
      <MeterBar label="Happiness" value={happiness} color="#06b6d4" icon="😊"
        suffix="%" delta={deltas.happiness} deltaKey={`hap-${tickCount}`} />
      <MeterBar label="Renewable" value={renewablePct} color="#22c55e" icon="⚡"
        suffix="%" delta={deltas.renewablePct} deltaKey={`ren-${tickCount}`} />
      <MeterBar label="Resilience" value={resilience} color="#8b5cf6" icon="🛡️"
        suffix="%" delta={deltas.resilience} deltaKey={`res-${tickCount}`} />

      <button className="dev-toggle-btn" onClick={toggleDevGrid} title="Dev: show/hide all buildings">
        🛠 {hasBuildings ? 'Clear' : 'Fill'} Grid
      </button>
    </div>
  );
}
