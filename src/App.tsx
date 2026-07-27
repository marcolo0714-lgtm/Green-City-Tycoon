import { useEffect, useRef, useState, useCallback } from 'react';
import GameScene3D from './components/GameScene3D';
import BuildingMenu from './components/BuildingMenu';
import StatusBar from './components/StatusBar';
import MeterPanel from './components/MeterPanel';
import SpeedControl from './components/SpeedControl';
import NotificationOverlay from './components/NotificationOverlay';
import TutorialOverlay from './components/TutorialOverlay';
import ObjectivesPanel from './components/ObjectivesPanel';
import ConfirmDialog from './components/ConfirmDialog';
import { useGameStore } from './store/gameStore';
import './App.css';

const TICK_INTERVAL_MS = 5000;

function App() {
  const gameSpeed = useGameStore((s) => s.gameSpeed);
  const gameResult = useGameStore((s) => s.gameResult);
  const disasterWarning = useGameStore((s) => s.disasterWarning);
  const setGameSpeed = useGameStore((s) => s.setGameSpeed);
  const tick = useGameStore((s) => s.tick);
  const resetGame = useGameStore((s) => s.resetGame);
  const intervalRef = useRef<number | null>(null);
  const [sceneKey, setSceneKey] = useState(0);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const prevSpeedRef = useRef(gameSpeed);

  // Pause on mobile panel open, resume when both close
  useEffect(() => {
    const isMobile = window.innerWidth <= 900;
    const panelOpen = leftOpen || rightOpen;
    if (isMobile && panelOpen && gameSpeed !== 0) {
      prevSpeedRef.current = gameSpeed;
      setGameSpeed(0);
    } else if (isMobile && !panelOpen && gameSpeed === 0 && prevSpeedRef.current !== 0 && !gameResult) {
      setGameSpeed(prevSpeedRef.current);
    }
  }, [leftOpen, rightOpen, gameSpeed, gameResult, setGameSpeed]);

  useEffect(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (gameSpeed === 0 || gameResult) return;

    const ms = TICK_INTERVAL_MS / gameSpeed;
    intervalRef.current = window.setInterval(() => {
      tick();
    }, ms);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [gameSpeed, gameResult, tick]);

  const handleReset = useCallback(() => {
    if (window.confirm('Reset your city? All progress will be lost.')) {
      resetGame();
      setSceneKey(k => k + 1);
    }
  }, [resetGame]);

  const handleGridClick = useCallback(() => {
    setLeftOpen(false);
    setRightOpen(false);
  }, []);

  const speedClass = (gameSpeed === 0 ? 'paused' : gameSpeed === 2 ? 'fast' : '')
    + (disasterWarning ? ' disaster-warning' : '');

  return (
    <div className={`app ${speedClass} ${leftOpen ? 'left-open' : ''} ${rightOpen ? 'right-open' : ''}`}>
      <StatusBar onReset={handleReset} />
      <div className="game-layout">
        {/* Sidebar backdrop for mobile */}
        {(leftOpen || rightOpen) && <div className="panel-backdrop" onClick={handleGridClick} />}

        <div className={`left-panel ${leftOpen ? 'open' : ''}`}>
          <SpeedControl />
          <BuildingMenu />
        </div>
        <main className="grid-container" onClick={handleGridClick}>
          <GameScene3D key={sceneKey} />
        </main>
        <div className={`right-panel ${rightOpen ? 'open' : ''}`}>
          <MeterPanel />
        </div>
      </div>

      {/* Mobile bottom toolbar */}
      <div className="bottom-toolbar">
        <SpeedControl />
        <button className="speed-btn" onClick={() => setLeftOpen(o => !o)}>🏗️</button>
        <button className="speed-btn" onClick={() => setRightOpen(o => !o)}>📊</button>
      </div>

      <NotificationOverlay />
      <ObjectivesPanel />
      <ConfirmDialog />
      <TutorialOverlay />
    </div>
  );
}

export default App;
