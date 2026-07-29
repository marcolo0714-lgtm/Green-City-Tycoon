import { useGameStore } from '../store/gameStore';
import { useEffect, useState, useRef } from 'react';

export default function NotificationOverlay() {
  const warnings = useGameStore((s) => s.warnings);
  const gameResult = useGameStore((s) => s.gameResult);
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
  const disasterMinigame = useGameStore((s) => s.disasterMinigame);
  const minigamePlayed = useGameStore((s) => s.minigamePlayed);
  const startMinigame = useGameStore((s) => s.startMinigame);
  const seenAdvisories = useGameStore((s) => s.seenAdvisories);
  const repeatableAdvisories = useGameStore((s) => s.repeatableAdvisories);
  const activeRef = useRef(new Set<string>()); // currently visible keys
  const doneRef = useRef(new Set<string>());   // permanently dismissed (one-time only)
  const [, setTick] = useState(0);

  // Show new one-time advisories, hide after 10s, never show again
  useEffect(() => {
    let changed = false;
    for (let i = 0; i < seenAdvisories.length; i++) {
      const key = `once-${i}`;
      if (!doneRef.current.has(key) && !activeRef.current.has(key)) {
        activeRef.current.add(key);
        setTimeout(() => {
          activeRef.current.delete(key);
          doneRef.current.add(key); // permanent dismiss
          setTick(n => n + 1);
        }, 10000);
        changed = true;
      }
    }
    // Repeatable advisories: show when condition is true, hide after 10s
    for (const ra of repeatableAdvisories) {
      const key = `rep-${ra.id}`;
      if (!activeRef.current.has(key)) {
        activeRef.current.add(key);
        setTimeout(() => {
          activeRef.current.delete(key);
          setTick(n => n + 1);
        }, 10000);
        changed = true;
      }
    }
    if (changed) setTick(n => n + 1);
  }, [seenAdvisories, seenAdvisories.length, repeatableAdvisories, repeatableAdvisories.length]);

  // Visible: one-time that are still active, plus repeatable that are active
  const visibleOnce = seenAdvisories.filter((_, i) => activeRef.current.has(`once-${i}`));
  const visibleRepeatable = repeatableAdvisories.filter(ra => activeRef.current.has(`rep-${ra.id}`));
  const visibleItems = [...visibleOnce, ...visibleRepeatable];

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
            </div>
          ))}
        </div>
      )}

      {/* Advisory toasts — stacked vertically */}
      <div className="advisory-stack">
        {visibleItems.map((a, vi) => (
          <div key={`adv-${a.id}`} className="advisory-container" style={{ top: `${56 + vi * 42}px` }}>
            <div className="advisory-toast">
              <span className="advisory-icon">💡</span>
              <span>{a.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Standalone Prepare button — only when disaster warning active and not yet played */}
      {disasterWarning && !disasterMinigame && !minigamePlayed && (
        <div className="minigame-prepare-container">
          <button className="minigame-launch standalone" onClick={startMinigame}>
            ⚠️ Prepare for {disasterWarning.type} (5 Qs)
          </button>
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
            <p className="game-overlay-sub">Lasted {tickCount} days</p>
            <button className="game-overlay-btn" onClick={resetGame}>Try Again</button>
          </div>
        </div>
      )}
    </>
  );
}
