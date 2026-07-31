import { useGameStore } from '../store/gameStore';

interface Props { onReset: () => void; dayProgress: number }

export default function StatusBar({ onReset, dayProgress }: Props) {
  const money = useGameStore((s) => s.money);
  const selectedBuilding = useGameStore((s) => s.selectedBuilding);
  const tickCount = useGameStore((s) => s.tickCount);
  const gameSpeed = useGameStore((s) => s.gameSpeed);
  const gameResult = useGameStore((s) => s.gameResult);
  const restartTutorial = useGameStore((s) => s.restartTutorial);

  const day = tickCount + 1;

  let moneyColor = '#22c55e';
  if (money < 500) moneyColor = '#ef4444';
  else if (money < 2000) moneyColor = '#f59e0b';

  const speedLabel = gameSpeed === 0 ? 'Paused' : gameSpeed === 2 ? '2×' : '1×';

  return (
    <div className="status-bar">
      <h1 className="game-title">Green City Tycoon</h1>
      <div className="status-info">
        <div className="day-progress-wrap">
          <span className="tick-display">📅 Day {day}</span>
          <div className="day-progress-track">
            <div className="day-progress-fill" style={{ width: `${dayProgress}%` }} />
          </div>
        </div>
        <span className="speed-badge" title={`Speed: ${speedLabel}`}>
          {gameSpeed === 0 ? '⏸' : gameSpeed === 2 ? '⏩' : '▶'} {speedLabel}
        </span>
        <div className="money-display" style={{ color: moneyColor }}>
          <span className="money-icon">💰</span>
          <span className="money-value">${money}</span>
        </div>
        {selectedBuilding && !gameResult && (
          <div className="selection-hint">
            {selectedBuilding.emoji} {selectedBuilding.name} — click tile to place
          </div>
        )}
        <button className="status-icon-btn" onClick={restartTutorial} title="Tutorial">❓</button>
        <button className="status-icon-btn" onClick={onReset} title="Restart">🔄</button>
      </div>
    </div>
  );
}
