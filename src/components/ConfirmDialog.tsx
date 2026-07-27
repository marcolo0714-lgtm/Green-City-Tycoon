import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export default function ConfirmDialog() {
  const pending = useGameStore((s) => s.pendingRemoval);
  const confirmRemoval = useGameStore((s) => s.confirmRemoval);
  const cancelRemoval = useGameStore((s) => s.cancelRemoval);
  const setGameSpeed = useGameStore((s) => s.setGameSpeed);
  const setSpeedRef = useRef(setGameSpeed);
  setSpeedRef.current = setGameSpeed;

  // Pause game while dialog is open, restore on dismiss
  useEffect(() => {
    if (!pending) return;
    const prev = useGameStore.getState().gameSpeed;
    if (prev !== 0) setSpeedRef.current(0);
    return () => {
      if (prev !== 0) setSpeedRef.current(prev);
    };
  }, [pending]);

  if (!pending) return null;

  return (
    <div className="confirm-overlay" onClick={cancelRemoval}>
      <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-text">
          Remove {pending.emoji} <strong>{pending.name}</strong>?
        </p>
        <p className="confirm-refund">20% refund: <span style={{ color: '#fbbf24' }}>${pending.refund}</span></p>
        <div className="confirm-buttons">
          <button className="confirm-btn cancel" onClick={cancelRemoval}>Cancel</button>
          <button className="confirm-btn remove" onClick={confirmRemoval}>Remove</button>
        </div>
      </div>
    </div>
  );
}
