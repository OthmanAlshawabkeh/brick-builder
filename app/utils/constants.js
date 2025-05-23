export const base = 25;

export const bricks = [
  { x: 1, z: 1 },
  { x: 2, z: 1 },
  { x: 2, z: 2 },
  { x: 3, z: 1 },
  { x: 3, z: 2 },
  { x: 4, z: 1 },
  { x: 4, z: 2 },
  { x: 6, z: 2 },
  { x: 8, z: 2 },
  { x: 2, z: 4 },
  { x: 4, z: 4 }
];

export const colors = ['#FF0000', '#FF9800', '#F0E100', '#00DE00', '#A1BC24', '#0011CF', '#FFFFFF', '#000000', '#652A0C' ];

export function addCustomBrick(dimensions) {
  if (!bricks.some(brick => brick.x === dimensions.x && brick.z === dimensions.z)) {
    bricks.push(dimensions);
  }
}