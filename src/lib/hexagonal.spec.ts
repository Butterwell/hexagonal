import test from 'ava';

import { equal, nearestHexCenter } from './hexagonal';

test('equal', (t) => {
  t.is(equal({ q: 1, r: 1 }, { q: 1, r: 0 }), false);
  t.is(equal({ q: 1, r: 1 }, { q: 0, r: 1 }), false);
  t.is(equal({ q: 1, r: 1 }, { q: 1, r: 1 }), true);
});

test('nearestHexCenter', (t) => {
  const layout = { size: { x: 1, y: 1 }, origin: { x: 0, y: 0 } };
  t.deepEqual(nearestHexCenter({ x: 0, y: 0 }, layout), { q: 0, r: 0 });
  t.deepEqual(nearestHexCenter({ x: 2.51 * Math.sqrt(3), y: 0 }, layout), {
    q: 3,
    r: 0,
  });
  t.deepEqual(nearestHexCenter({ x: 2.49 * Math.sqrt(3), y: 0 }, layout), {
    q: 2,
    r: 0,
  });
});
