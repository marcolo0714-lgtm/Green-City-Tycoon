const HW: number = 28;
const HH: number = 14;
const TILE_W: number = HW * 2;
const TILE_H: number = HH * 2;

function topPolygon(): string {
  return `${HW},0 ${HW * 2},${HH} ${HW},${HH * 2} 0,${HH}`;
}

function frontPolygon(h: number): string {
  return `${HW},${HH * 2} 0,${HH} 0,${h + HH} ${HW},${h + HH * 2}`;
}

function rightPolygon(h: number): string {
  return `${HW},${HH * 2} ${HW * 2},${HH} ${HW * 2},${h + HH} ${HW},${h + HH * 2}`;
}

function viewBox(h: number): string {
  return `0 0 ${TILE_W} ${h + TILE_H}`;
}

function tileToScreen(col: number, row: number, offsetX = 0, offsetY = 0): { x: number; y: number } {
  return {
    x: (col - row) * HW + offsetX,
    y: (col + row) * HH + offsetY,
  };
}

export { HW, HH, TILE_W, TILE_H, topPolygon, frontPolygon, rightPolygon, viewBox, tileToScreen };
