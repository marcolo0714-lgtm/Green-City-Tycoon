import { useGameStore } from '../store/gameStore';

export default function NotificationOverlay() {
  const warnings = useGameStore((s) => s.warnings);
  const gameResult = useGameStore((s) => s.gameResult);
  const dismissWarning = useGameStore((s) => s.dismissWarning);
  const resetGame = useGameStore((s) => s.resetGame);
  const continueGame = useGameStore((s) => s.continueGame);
  const pollution = useGameStore((s) => s.pollution);
  const money = useGameStore((s) => s.money);
  const population = useGameStore((s) => s.population);
  const happiness = useGameStore((s) => s.happiness);
  const renewablePct = useGameStore((s) => s.renewablePct);
  const resilience = useGameStore((s) => s.resilience);
  const tickCount = useGameStore((s) => s.tickCount);
  const disasterWarning = useGameStore((s) => s.disasterWarning);
  const disasterActive = useGameStore((s) => s.disasterActive);

  return (
    <>
      {/* Warning toasts */}
      {(warnings.length > 0 || disasterWarning || disasterActive) && (
        <div className="warning-container">
          {/* Disaster warning */}
          {disasterWarning && (
            <div className="warning-toast disaster">
              <span className="warning-icon">🌋</span>
              <span>
                <strong>{disasterWarning.message}</strong>
                <span className="warning-countdown"> ({disasterWarning.daysLeft} days)</span>
              </span>
            </div>
          )}
          {/* Disaster active */}
          {disasterActive && (
            <div className="warning-toast disaster active">
              <span className="warning-icon">💥</span>
              <span>
                <strong>{disasterActive.type} aftermath</strong>
                <span className="warning-countdown"> ({disasterActive.daysLeft}d recovery)</span>
              </span>
            </div>
          )}
          {warnings.map((w) => (
            <div key={w.type} className="warning-toast">
              <span className="warning-icon">⚠️</span>
              <span>
                <strong>{w.message}</strong>
                <span className="warning-countdown"> ({w.countdown} day{w.countdown !== 1 ? 's' : ''} left)</span>
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
            <p className="game-overlay-sub">Completed in {tickCount} days</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="game-overlay-btn" onClick={continueGame}>Continue Playing</button>
              <button className="game-overlay-btn secondary" onClick={resetGame}>New Game</button>
            </div>
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
