import { useGameStore } from '../store/gameStore';

export default function NotificationOverlay() {
  const warnings = useGameStore((s) => s.warnings);
  const gameResult = useGameStore((s) => s.gameResult);
  const dismissWarning = useGameStore((s) => s.dismissWarning);
  const resetGame = useGameStore((s) => s.resetGame);
  const pollution = useGameStore((s) => s.pollution);
  const money = useGameStore((s) => s.money);
  const population = useGameStore((s) => s.population);
  const happiness = useGameStore((s) => s.happiness);
  const renewablePct = useGameStore((s) => s.renewablePct);
  const resilience = useGameStore((s) => s.resilience);
  const tickCount = useGameStore((s) => s.tickCount);

  return (
    <>
      {/* Warning toasts */}
      {warnings.length > 0 && (
        <div className="warning-container">
          {warnings.map((w) => (
            <div key={w.type} className="warning-toast">
              <span className="warning-icon">⚠️</span>
              <span>
                <strong>{w.message}</strong>
                <span className="warning-countdown"> ({w.countdown} month{w.countdown !== 1 ? 's' : ''} left)</span>
              </span>
              <button className="warning-dismiss" onClick={() => dismissWarning(w.type)}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Win screen */}
      {gameResult === 'win' && (
        <div className="game-overlay">
          <div className="game-overlay-card win">
            <h2>🏆 City Thriving!</h2>
            <p>Your city is a model of sustainability.</p>
            <div className="game-overlay-stats">
              <span>💰 ${money}</span>
              <span>👥 {population}</span>
              <span>🌿 AQ {100 - pollution}%</span>
              <span>😊 {happiness}%</span>
              <span>⚡ {renewablePct}%</span>
              <span>🛡️ {resilience}%</span>
            </div>
            <p className="game-overlay-sub">Completed in {tickCount} months</p>
            <button className="game-overlay-btn" onClick={resetGame}>Play Again</button>
          </div>
        </div>
      )}

      {/* Lose screen */}
      {gameResult === 'lose' && (
        <div className="game-overlay">
          <div className="game-overlay-card lose">
            <h2>💀 City Collapsed</h2>
            <p>The problems became too severe to handle.</p>
            <p className="game-overlay-sub">Lasted {tickCount} months</p>
            <button className="game-overlay-btn" onClick={resetGame}>Try Again</button>
          </div>
        </div>
      )}
    </>
  );
}
