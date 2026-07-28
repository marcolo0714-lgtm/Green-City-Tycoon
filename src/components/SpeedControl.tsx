import { useGameStore } from '../store/gameStore';
import type { GameSpeed } from '../types';

export default function SpeedControl() {
  const gameSpeed = useGameStore((s) => s.gameSpeed);
  const setGameSpeed = useGameStore((s) => s.setGameSpeed);

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
          className={`speed-btn ${gameSpeed === speed ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setGameSpeed(speed); }}
          onTouchEnd={(e) => { e.preventDefault(); setGameSpeed(speed); }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
