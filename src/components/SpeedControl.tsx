import { useGameStore } from '../store/gameStore';
import type { GameSpeed } from '../types';

export default function SpeedControl() {
  const gameSpeed = useGameStore((s) => s.gameSpeed);
  const setGameSpeed = useGameStore((s) => s.setGameSpeed);
  const tutorialComplete = useGameStore((s) => s.tutorialComplete);
  const disasterMinigame = useGameStore((s) => s.disasterMinigame);
  const locked = !tutorialComplete || disasterMinigame !== null;

  const speeds: { speed: GameSpeed; label: string }[] = [
    { speed: 0, label: '⏸' },
    { speed: 1, label: '▶ 1×' },
    { speed: 2, label: '⏩ 2×' },
  ];

  return (
    <div className="speed-control">
      {speeds.map(({ speed, label }) => (
        <button
          key={speed}
          type="button"
          disabled={locked}
          className={`speed-btn ${gameSpeed === speed ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!locked) setGameSpeed(speed); }}
          onTouchEnd={(e) => { e.preventDefault(); if (!locked) setGameSpeed(speed); }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
