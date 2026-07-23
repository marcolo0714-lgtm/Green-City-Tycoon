import { useState, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { tileToScreen } from '../util/iso';
import Tile from './Tile';

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const GRID_OFFSET_X = 0;
const GRID_OFFSET_Y = 0;

export default function Grid() {
  const grid = useGameStore((s) => s.grid);
  const gridSize = useGameStore((s) => s.gridSize);

  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, panX0: 0, panY0: 0 });
  const sceneRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, panX0: panX, panY0: panY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [panX, panY]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    setPanX(dragRef.current.panX0 + (e.clientX - dragRef.current.startX));
    setPanY(dragRef.current.panY0 + (e.clientY - dragRef.current.startY));
  }, [dragging]);

  const handlePointerUp = useCallback(() => { setDragging(false); }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;
    const oldScale = scale;
    const delta = -e.deltaY * 0.001;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, oldScale * (1 + delta)));
    setScale(newScale);
    const ratio = newScale / oldScale;
    setPanX(cx - (cx - panX) * ratio);
    setPanY(cy - (cy - panY) * ratio);
  }, [scale, panX, panY]);

  const tiles: Array<{ ri: number; ci: number }> = [];
  for (let s = 0; s <= (gridSize - 1) * 2; s++) {
    for (let ri = 0; ri < gridSize; ri++) {
      const ci = s - ri;
      if (ci >= 0 && ci < gridSize) tiles.push({ ri, ci });
    }
  }

  return (
    <div
      ref={sceneRef}
      className={`grid-scene ${dragging ? 'dragging' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
    >
      <div className="ocean-2d" />
      <div className="grid-pan" style={{ transform: `translate(${panX}px, ${panY}px) scale(${scale})` }}>
        <div className="island-base-2d" />
        {tiles.map(({ ri, ci }) => {
          const { x, y } = tileToScreen(ci, ri, GRID_OFFSET_X, GRID_OFFSET_Y);
          return (
            <Tile
              key={`${ri}-${ci}`}
              building={grid[ri][ci]}
              row={ri}
              col={ci}
              x={x}
              y={y}
              zOrder={ri + ci}
            />
          );
        })}
      </div>
    </div>
  );
}
