// Hexagonal tiling/tessellations/grid centers with
// axial addressing (coordinates) and cartesian location translation
// Human translated and simplified from
// https://www.redblobgames.com/grids/hexagons/implementation.html

export type Hex = {
  readonly q: number;
  readonly r: number;
};

export const equal = function (a: Hex, b: Hex) {
  return a.q === b.q && a.r === b.r;
};

export const add = function (a: Hex, b: Hex) {
  return { q: a.q + b.q, r: a.r + b.r };
};

export const subtract = function (a: Hex, b: Hex) {
  return { q: a.q - b.q, r: a.r - b.r };
};

export const multiply = function (a: Hex, k: number) {
  // If k isn't an integer, returns fractional hex
  return { q: a.q * k, r: a.q * k };
};

export const cubeLength = function (a: Hex) {
  return Math.floor((Math.abs(a.q) + Math.abs(a.r) + Math.abs(-a.q - a.r)) / 2);
};

export const cubeDistance = function (a: Hex, b: Hex) {
  return cubeLength(subtract(a, b));
};

// Hex neighbor addresses relative to the current hex
export const directions = [
  { q: 0, r: 1 },
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
];

export const neighbors = function (a: Hex) {
  return directions.map((d: Hex) => add(a, d));
};

export const pointy = {
  f: [Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0],
  b: [Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0],
  angle: 0.5, // in radians
};

export const flat = {
  f: [3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0)],
  b: [2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0],
  angle: 0.0, // in radians
};

export type Point = {
  readonly x: number;
  readonly y: number;
};

export const isWhole = function (a: Hex) {
  return Number.isInteger(a.q) && Number.isInteger(a.r);
};

export const round = function (f: Hex) {
  const q = Math.floor(f.q + 0.5);
  const r = Math.floor(f.r + 0.5);
  const s = Math.floor(-f.q - f.r + 0.5);
  const qDiff = Math.abs(q - f.q);
  const rDiff = Math.abs(r - f.r);
  const sDiff = Math.abs(s - (-f.q - f.r));
  if (qDiff > rDiff && qDiff > sDiff) {
    return { q: -r - s, r: r };
  } else if (rDiff > sDiff) {
    return { q: q, r: -q - s };
  }
  return { q, r };
};

export type Layout = {
  readonly size: Point;
  readonly origin: Point;
};

export const hexToCartesian = function (a: Hex, layout: Layout) {
  const x =
    (pointy.f[0] * a.q + pointy.f[1] * a.r) * layout.size.x + layout.origin.x;
  const y =
    (pointy.f[2] * a.q + pointy.f[3] * a.r) * layout.size.y + layout.origin.y;
  return { x, y };
};

export const cartesianToFractionalHex = function (w: Point, layout: Layout) {
  const x = w.x / layout.size.x;
  const y = w.y / layout.size.y;
  const q = pointy.b[0] * x + pointy.b[1] * y;
  const r = pointy.b[2] * x + pointy.b[3] * y;
  return { q, r };
};

export const nearestHexCenter = function (w: Point, layout: Layout) {
  const fractional = cartesianToFractionalHex(w, layout);
  const a = round(fractional);
  return a;
};

const arc = (Math.PI * 2) / 6; // One-third PI aka one sixth of the circumference
const angles = [0, arc, 2 * arc, 3 * arc, 4 * arc, 5 * arc];

// First pass. Not aligned
export const cartesianPointsUnitPointy = angles.map(function (angle) {
  return {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
});

const hexagon = function (radius: number) {
  // eslint-disable-next-line functional/no-let
  let x = 0,
    y = 0;
  return angles.map((angle) => {
    const x1 = Math.cos(angle) * radius;
    const y1 = Math.sin(angle) * radius;
    const dx = x1 - x;
    const dy = y1 - y;
    x = x1;
    y = y1;
    return [dx, dy];
  });
};

// Trick from D3 hexbin
export const hexagonSvg = (radius: number) => 'm' + hexagon(radius).join('l') + 'z'
