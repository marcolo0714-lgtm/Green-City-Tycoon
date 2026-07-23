import { useGameStore } from '../store/gameStore';

interface MeterProps {
  label: string;
  value: number;
  max?: number;
  color: string;
  icon: string;
  suffix?: string;
}

function MeterBar({ label, value, max = 100, color, icon, suffix = '' }: MeterProps) {
  const pct = Math.min(100, (value / max) * 100);
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

  return (
    <div className="meter-panel">
      <MeterBar
        label="Money"
        value={money}
        max={2000}
        color="#f59e0b"
        icon="💰"
        suffix=""
      />
      <MeterBar
        label="Population"
        value={population}
        color="#22c55e"
        icon="👥"
        suffix=""
      />
      <MeterBar
        label="Pollution"
        value={pollution}
        color={pollution > 50 ? '#ef4444' : '#f59e0b'}
        icon="🏭"
        suffix="%"
      />
      <MeterBar
        label="Happiness"
        value={happiness}
        color="#06b6d4"
        icon="😊"
        suffix="%"
      />
      <MeterBar
        label="Renewable"
        value={renewablePct}
        color="#22c55e"
        icon="⚡"
        suffix="%"
      />
      <MeterBar
        label="Resilience"
        value={resilience}
        color="#8b5cf6"
        icon="🛡️"
        suffix="%"
      />
    </div>
  );
}
