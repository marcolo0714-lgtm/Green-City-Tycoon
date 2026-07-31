import { useEffect, useState, useMemo } from 'react';
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
  extra?: string;
}

function MeterBar({ label, value, max = 100, color, icon, suffix = '', delta, deltaKey = '', extra }: MeterProps) {
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
          {value}{suffix}{extra && <span className="meter-extra">{extra}</span>}
        </span>
      </div>
      <div className="meter-track">
        <div className="meter-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      {showDelta && delta !== 0 && (
        <div className={`meter-delta ${isPositive ? 'up' : 'down'}`} key={deltaKey + delta}>
          {deltaLabel}
        </div>
      )}
    </div>
  );
}

function fmt(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return String(n);
}

function fmtMult(n: number): string {
  if (n < 10) return n.toFixed(1);
  if (n < 100) return Math.round(n).toString();
  if (n < 10000) return (n / 1000).toFixed(1) + 'K';
  return (n / 1000000).toFixed(1) + 'M';
}

const METER_ADJUSTERS = [
  { key: 'money' as const, emoji: '💰', label: 'Money', adjStep: 1000000 },
  { key: 'population' as const, emoji: '👥', label: 'Population', adjStep: 500000 },
  { key: 'pollution' as const, emoji: '🌿', label: 'Air Quality', adjStep: 10, invert: true },
  { key: 'happiness' as const, emoji: '😊', label: 'Happiness', adjStep: 10 },
  { key: 'renewablePct' as const, emoji: '⚡', label: 'Renewable', adjStep: 10 },
  { key: 'resilience' as const, emoji: '🛡️', label: 'Resilience', adjStep: 10 },
];

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
  const cancelDisaster = useGameStore((s) => s.cancelDisaster);
  const startDisaster = useGameStore((s) => s.startDisaster);
  const disasterWarning = useGameStore((s) => s.disasterWarning);
  const disasterActive = useGameStore((s) => s.disasterActive);
  const adjustMeter = useGameStore((s) => s.adjustMeter);
  const instantComplete = useGameStore((s) => s.instantComplete);
  const devDisasterLevel = useGameStore((s) => s.devDisasterLevel);
  const setDevDisasterLevel = useGameStore((s) => s.setDevDisasterLevel);
  const toggleShowAllGoals = useGameStore((s) => s.toggleShowAllGoals);
  const devShowAllGoals = useGameStore((s) => s.devShowAllGoals);
  const toggleShowAllEventViews = useGameStore((s) => s.toggleShowAllEventViews);
  const devShowAllEventViews = useGameStore((s) => s.devShowAllEventViews);
  const activeBuffs = useGameStore((s) => s.activeBuffs);
  const eventsOrganized = useGameStore((s) => s.eventsOrganized);
  const grid = useGameStore((s) => s.grid);

  const housingCapacity = useMemo(() => {
    let eco = 0, green = 0;
    for (const row of grid) for (const cell of row) {
      if (cell) {
        if (cell.category === 'economic') eco++;
        if (cell.category === 'green') green++;
      }
    }
    return Math.floor((eco * 250 + green * 50) * activeBuffs.popCapMultiplier);
  }, [grid, activeBuffs.popCapMultiplier]);

  return (
    <div className="meter-panel">
      <h3 className="meter-section-title">Meters</h3>
      <MeterBar label="Money" value={money} max={10000000} color="#eab308" icon="💰"
        suffix="" delta={deltas.money} deltaKey={`money-${tickCount}`} />
      <MeterBar label="Population" value={population} max={10000000} color="#3b82f6" icon="👥"
        suffix="" delta={deltas.population} deltaKey={`pop-${tickCount}`}
        extra={` / ${fmt(housingCapacity)}`} />
      <MeterBar label="Air Quality" value={100 - pollution}
        color={pollution > 50 ? '#ef4444' : '#22c55e'} icon="🌿"
        suffix="%" delta={deltas.pollution !== undefined ? -deltas.pollution : undefined} deltaKey={`aq-${tickCount}`} />
      <MeterBar label="Happiness" value={happiness} color="#06b6d4" icon="😊"
        suffix="%" delta={deltas.happiness} deltaKey={`hap-${tickCount}`} />
      <MeterBar label="Renewable" value={renewablePct} color="#f97316" icon="⚡"
        suffix="%" delta={deltas.renewablePct} deltaKey={`ren-${tickCount}`} />
      <MeterBar label="Resilience" value={resilience} color="#8b5cf6" icon="🛡️"
        suffix="%" delta={deltas.resilience} deltaKey={`res-${tickCount}`} />

      {eventsOrganized.length > 0 && (
        <>
          <h3 className="meter-section-title">Event Boosts</h3>
          <div className="boosts-list">
            {activeBuffs.incomeMultiplier > 1 && <div className="boost-row">💰 Income<span className="boost-mult">×{fmtMult(activeBuffs.incomeMultiplier)}</span></div>}
            {activeBuffs.resilienceMultiplier > 1 && <div className="boost-row">🛡️ Resilience<span className="boost-mult">×{fmtMult(activeBuffs.resilienceMultiplier)}</span></div>}
            {activeBuffs.renewableMultiplier > 1 && <div className="boost-row">⚡ Renewable<span className="boost-mult">×{fmtMult(activeBuffs.renewableMultiplier)}</span></div>}
            {activeBuffs.popCapMultiplier > 1 && <div className="boost-row">🏘️ Pop Cap<span className="boost-mult">×{fmtMult(activeBuffs.popCapMultiplier)}</span></div>}
            {activeBuffs.popGrowthMultiplier > 1 && <div className="boost-row">📈 Pop Growth<span className="boost-mult">×{fmtMult(activeBuffs.popGrowthMultiplier)}</span></div>}
            {activeBuffs.pollutionMultiplier < 1 && <div className="boost-row clean">🌿 Pollution<span className="boost-mult">×{fmtMult(activeBuffs.pollutionMultiplier)}</span></div>}
          </div>
        </>
      )}

      <h3 className="meter-section-title">Dev Options</h3>
      <button className="dev-toggle-btn" onClick={toggleDevGrid} title="Dev: show/hide all buildings">
        🛠 {hasBuildings ? 'Clear' : 'Fill'} Grid
      </button>

      <button className="dev-toggle-btn" onClick={instantComplete} title="Dev: instantly finish all construction and terrain clearing">
        ⚡ Instant Complete
      </button>

      <button className="dev-toggle-btn" onClick={toggleShowAllGoals} title="Dev: show all 20 goals including locked ones">
        {devShowAllGoals ? '🙈' : '👁'} {devShowAllGoals ? 'Hide' : 'Show'} All Goals
      </button>

      <button className="dev-toggle-btn" onClick={toggleShowAllEventViews} title="Dev: add Preview button to all events in sidebar">
        {devShowAllEventViews ? '🙈' : '🖼'} {devShowAllEventViews ? 'Hide' : 'Show'} Event Previews
      </button>

      {(disasterWarning || disasterActive) && (
        <button className="dev-toggle-btn" onClick={cancelDisaster} title="Cancel current disaster">
          ✖ Cancel Disaster
        </button>
      )}

      <div className="dev-disaster-row">
        {(['tsunami', 'earthquake', 'drought', 'smog'] as const).map(t => (
          <button key={t} className="dev-disaster-btn" onClick={() => startDisaster(t)}
            title={`Start ${t} disaster`}>
            {t === 'tsunami' ? '🌊' : t === 'earthquake' ? '🔥' : t === 'drought' ? '☀️' : '💨'}
          </button>
        ))}
      </div>

      <div className="dev-disaster-slider">
        <span className="dev-slider-label">Disaster Level: <strong>{devDisasterLevel}</strong></span>
        <input
          type="range"
          min={1} max={5} value={devDisasterLevel}
          onChange={(e) => setDevDisasterLevel(Number(e.target.value))}
          className="dev-slider"
        />
      </div>

      <div className="dev-adj-list">
        {METER_ADJUSTERS.map(m => (
          <div key={m.key} className="dev-adj-row">
            <span className="dev-adj-emoji">{m.emoji}</span>
            <span className="dev-adj-label">{m.label}</span>
            <button className="dev-adj-btn" onClick={() => adjustMeter(m.key, m.invert ? -m.adjStep : m.adjStep)}>+</button>
            <button className="dev-adj-btn" onClick={() => adjustMeter(m.key, m.invert ? m.adjStep : -m.adjStep)}>−</button>
          </div>
        ))}
      </div>
    </div>
  );
}
