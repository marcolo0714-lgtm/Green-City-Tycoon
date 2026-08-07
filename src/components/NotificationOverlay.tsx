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
  const minigameStats = useGameStore((s) => s.minigameStats);
  const damageReport = useGameStore((s) => s.damageReport);
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
              <span className="warning-body">
                <strong>{disasterWarning.message}</strong>
                <span className="warning-countdown"> ({disasterWarning.daysLeft}d)</span>
                <div className="warning-bar-track">
                  <div className="warning-bar-fill" style={{ width: `${Math.max(0, (disasterWarning.daysLeft / disasterWarning.maxDays) * 100)}%`, background: '#fbbf24' }} />
                </div>
              </span>
            </div>
          )}
          {/* Disaster active */}
          {disasterActive && (
            <div className="warning-toast disaster active">
              <span className="warning-icon">💥</span>
              <span className="warning-body">
                <strong>{disasterActive.type} aftermath</strong>
                <span className="warning-countdown"> ({disasterActive.daysLeft}d recovery)</span>
                <div className="warning-bar-track">
                  <div className="warning-bar-fill" style={{ width: `${Math.max(0, (disasterActive.daysLeft / 3) * 100)}%`, background: '#ef4444' }} />
                </div>
              </span>
            </div>
          )}
          {warnings.map((w) => (
            <div key={w.type} className="warning-toast">
              <span className="warning-icon">⚠️</span>
              <span className="warning-body">
                <strong>{w.message}</strong>
                <span className="warning-countdown"> ({w.countdown}d)</span>
                <div className="warning-bar-track">
                  <div className="warning-bar-fill warning-bar-danger" style={{ width: `${Math.max(0, (w.countdown / 5) * 100)}%` }} />
                </div>
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
            ⚠️ Prepare for {disasterWarning.type} (4 Qs)
          </button>
        </div>
      )}

      {/* Preparedness stats — shown during warning phase after quiz */}
      {disasterWarning && minigamePlayed && minigameStats && (
        <div className="minigame-prepare-container">
          <div className="minigame-stats-box">
            <div className="mstats-title">📋 Preparedness Results</div>
            <div className="mstats-row">
              <span className="mstats-label">Correct</span>
              <span className="mstats-value">{minigameStats.score} / 4</span>
            </div>
            <div className="mstats-row">
              <span className="mstats-label">Damage Reduction</span>
              <span className="mstats-value mstats-highlight">{Math.round((1 - minigameStats.pct) * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Damage report — shown during active disaster recovery */}
      {disasterActive && damageReport && (
        <div className="minigame-prepare-container">
          <div className="minigame-stats-box">
            <div className="mstats-title">🏚️ Disaster Impact</div>
            {damageReport.destroyed > 0 && (
              <div className="mstats-row">
                <span className="mstats-label">Buildings Lost</span>
                <span className="mstats-value">{damageReport.destroyed}</span>
              </div>
            )}
            {damageReport.money > 0 && (
              <div className="mstats-row">
                <span className="mstats-label">Money Lost</span>
                <span className="mstats-value">${damageReport.money}</span>
              </div>
            )}
            {damageReport.population > 0 && (
              <div className="mstats-row">
                <span className="mstats-label">Population Lost</span>
                <span className="mstats-value">{damageReport.population}</span>
              </div>
            )}
      {damageReport.happiness > 0 && (
        <div className="mstats-row">
          <span className="mstats-label">Happiness Drop</span>
          <span className="mstats-value">-{Number((damageReport.happiness / 10).toFixed(1))}%</span>
        </div>
      )}
            {damageReport.resilience > 0 && (
              <div className="mstats-row">
                <span className="mstats-label">Resilience Drop</span>
                <span className="mstats-value">-{damageReport.resilience}%</span>
              </div>
            )}
            {damageReport.pollution > 0 && (
              <div className="mstats-row">
                <span className="mstats-label">Pollution Added</span>
                <span className="mstats-value">+{damageReport.pollution}%</span>
              </div>
            )}
          </div>
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
            {(() => {
              const fatal = warnings.find(w => w.countdown <= 0);
              const moneyHints = [
                '💡 Build Houses and Shops early to generate steady income. Organize events to multiply your earnings.',
                '💡 Avoid buying expensive buildings you cannot sustain. Focus on income-generating buildings first.',
                '💡 Organize events in order — each completed event stacks income multipliers multiplicatively.',
                '💡 Clear cheap terrain (forests: $2K) early to make room for more income buildings.',
                '💡 Check the Events tab — events with low requirements can be organized earliest for big income boosts.',
              ];
              const popHints = [
                '💡 Build Houses and Shops to provide housing — population cannot grow without room to live.',
                '💡 Keep happiness above 30% for population growth. Parks and Green Roofs raise happiness daily.',
                '💡 Organize events to multiply your population growth and housing capacity.',
                '💡 If population is declining fast, pause construction and focus on housing buildings immediately.',
                '💡 Green Roofs contribute to both housing capacity and happiness — great early-game value.',
              ];
              const pollutionHints = [
                '💡 Build Parks, Green Roofs, and Solar Panels to reduce pollution. Organize events to slash pollution multipliers.',
                '💡 Green buildings reduce pollution impact during smog disasters. Keep at least 2-3 Parks or Green Roofs.',
                '💡 Watch the Air Quality meter — when it drops below 50%, prioritize clean buildings over income.',
                '💡 Avoid clustering Factories and Shops. Spread polluting buildings across the grid with clean buildings in between.',
                '💡 The Clean Energy Kickstart event (Event 2) halves all pollution — organize it early.',
              ];
              const happinessHints = [
                '💡 Add Parks (0.5% per day) and Green Roofs (0.2%) to steadily build happiness over time.',
                '💡 Avoid overcrowding — if population exceeds housing capacity, happiness drops faster each day.',
                '💡 Keep pollution below 50% — prolonged pollution causes escalating happiness penalties.',
                '💡 Check building adjacency synergies — placing a Park next to a House gives +0.2% happiness per day.',
                '💡 Disaster damage to happiness is permanent. Complete the minigame quiz with a perfect score to reduce happiness loss by 70%.',
              ];
              const pick = (hints: string[]) => hints[Math.floor(Math.random() * hints.length)];
              if (fatal?.type === 'money') return (
                <>
                  <p>Your treasury ran dry and the city went bankrupt.</p>
                  <p className="game-overlay-hint">{pick(moneyHints)}</p>
                </>
              );
              if (fatal?.type === 'population') return (
                <>
                  <p>Citizens abandoned the city — too few people remained to sustain it.</p>
                  <p className="game-overlay-hint">{pick(popHints)}</p>
                </>
              );
              if (fatal?.type === 'pollution') return (
                <>
                  <p>Choking pollution made the city uninhabitable.</p>
                  <p className="game-overlay-hint">{pick(pollutionHints)}</p>
                </>
              );
              if (fatal?.type === 'happiness') return (
                <>
                  <p>Citizens rioted — happiness plummeted beyond recovery.</p>
                  <p className="game-overlay-hint">{pick(happinessHints)}</p>
                </>
              );
              return <p>The problems became too severe to handle.</p>;
            })()}
            <p className="game-overlay-sub">Lasted {tickCount} days</p>
            <button className="game-overlay-btn" onClick={resetGame}>Try Again</button>
          </div>
        </div>
      )}
    </>
  );
}
