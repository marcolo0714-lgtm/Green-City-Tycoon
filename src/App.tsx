import { useEffect, useRef } from 'react';
import GameScene3D from './components/GameScene3D';
import BuildingMenu from './components/BuildingMenu';
import StatusBar from './components/StatusBar';
import MeterPanel from './components/MeterPanel';
import SpeedControl from './components/SpeedControl';
import { useGameStore } from './store/gameStore';
import './App.css';

const TICK_INTERVAL_MS = 5000;

function App() {
  const gameSpeed = useGameStore((s) => s.gameSpeed);
  const tick = useGameStore((s) => s.tick);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (gameSpeed === 0) return;

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
  }, [gameSpeed, tick]);

  return (
    <div className="app">
      <StatusBar />
      <div className="game-layout">
        <div className="left-panel">
          <SpeedControl />
          <BuildingMenu />
        </div>
        <main className="grid-container">
          <GameScene3D />
        </main>
        <div className="right-panel">
          <MeterPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
