import { useEffect, useRef, useState, useCallback } from 'react';
import GameScene3D from './components/GameScene3D';
import BuildingMenu from './components/BuildingMenu';
import StatusBar from './components/StatusBar';
import MeterPanel from './components/MeterPanel';
import SpeedControl from './components/SpeedControl';
import NotificationOverlay from './components/NotificationOverlay';
import TutorialOverlay from './components/TutorialOverlay';
import { useGameStore } from './store/gameStore';
import './App.css';

const TICK_INTERVAL_MS = 5000;

function App() {
  const gameSpeed = useGameStore((s) => s.gameSpeed);
  const gameResult = useGameStore((s) => s.gameResult);
  const tick = useGameStore((s) => s.tick);
  const resetGame = useGameStore((s) => s.resetGame);
  const intervalRef = useRef<number | null>(null);
  const [sceneKey, setSceneKey] = useState(0);

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

  const speedClass = gameSpeed === 0 ? 'paused' : gameSpeed === 2 ? 'fast' : '';

  return (
    <div className={`app ${speedClass}`}>
      <StatusBar onReset={handleReset} />
      <div className="game-layout">
        <div className="left-panel">
          <SpeedControl />
          <BuildingMenu />
        </div>
        <main className="grid-container">
          <GameScene3D key={sceneKey} />
        </main>
        <div className="right-panel">
          <MeterPanel />
        </div>
      </div>
      <NotificationOverlay />
      <TutorialOverlay />
    </div>
  );
}

export default App;
