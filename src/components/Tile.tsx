import { useGameStore } from '../store/gameStore';
import BuildingShape from './BuildingShape';
import type { Building } from '../types';
import { HW, HH } from '../util/iso';

interface TileProps {
  building: Building | null;
  row: number;
  col: number;
  x: number;
  y: number;
  zOrder: number;
}

export default function Tile({ building, row, col, x, y, zOrder }: TileProps) {
  const selectedBuilding = useGameStore((s) => s.selectedBuilding);
  const money = useGameStore((s) => s.money);
  const placeBuilding = useGameStore((s) => s.placeBuilding);
  const removeBuilding = useGameStore((s) => s.removeBuilding);

  const canAfford = selectedBuilding ? money >= selectedBuilding.cost : false;
  const isEmpty = building === null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (building !== null) {
      removeBuilding(row, col);
    } else if (selectedBuilding && canAfford) {
      placeBuilding(row, col);
    }
  };

  return (
    <div
      className="tile-iso"
      style={{
        left: x - HW,
        top: y - HH,
        width: HW * 2,
        height: HH * 2,
        zIndex: zOrder,
      }}
      onClick={handleClick}
      onPointerDown={(e) => e.stopPropagation()}
      title={
        building
          ? `${building.name} — click to remove`
          : selectedBuilding
            ? canAfford
              ? `Place ${selectedBuilding.name} ($${selectedBuilding.cost})`
              : `Need $${selectedBuilding.cost - money} more`
            : 'Empty tile'
      }
    >
      <div className="tile-iso-ground" />
      {building && <BuildingShape building={building} />}
      {isEmpty && selectedBuilding && canAfford && (
        <div className="tile-iso-placeholder">
          <span>{selectedBuilding.emoji}</span>
        </div>
      )}
    </div>
  );
}
