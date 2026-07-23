import { useGameStore } from '../store/gameStore';

export default function StatusBar() {
  const money = useGameStore((s) => s.money);
  const selectedBuilding = useGameStore((s) => s.selectedBuilding);
  const tickCount = useGameStore((s) => s.tickCount);
  const gameSpeed = useGameStore((s) => s.gameSpeed);

  let moneyColor = '#22c55e';
  if (money < 100) moneyColor = '#ef4444';
  else if (money < 200) moneyColor = '#f59e0b';

  const speedLabel = gameSpeed === 0 ? 'Paused' : gameSpeed === 2 ? '2×' : '1×';

  return (
    <div className="status-bar">
      <h1 className="game-title">Green City Tycoon</h1>
      <div className="status-info">
        <span className="tick-display">⏱ Tick {tickCount}</span>
        <span className="speed-badge" title={`Speed: ${speedLabel}`}>
          {gameSpeed === 0 ? '⏸' : gameSpeed === 2 ? '⏩' : '▶'} {speedLabel}
        </span>
        <div className="money-display" style={{ color: moneyColor }}>
          <span className="money-icon">💰</span>
          <span className="money-value">${money}</span>
        </div>
        {selectedBuilding && (
          <div className="selection-hint">
            {selectedBuilding.emoji} {selectedBuilding.name} — click tile to place
          </div>
        )}
      </div>
    </div>
  );
}
