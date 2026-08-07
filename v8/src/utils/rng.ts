// Seedable deterministic RNG (mulberry32) — used for AI and simulation so
// behavior is reproducible in tests. `Math.random` remains the default when
// no seed is provided, but everything that affects gameplay outcome should
// route through an Rng so tests can pin seeds.

export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A thin wrapper so gameplay code can call rng() for any random draw. */
export class Random {
  private rng: Rng;
  constructor(seed?: number) {
    this.rng = seed === undefined ? Math.random : mulberry32(seed);
  }
  next(): number {
    return this.rng();
  }
  /** Uniform [lo, hi). */
  range(lo: number, hi: number): number {
    return lo + (hi - lo) * this.rng();
  }
  /** Integer in [0, n). */
  int(n: number): number {
    return Math.floor(this.rng() * n);
  }
  /** Pick a random element. */
  pick<T>(arr: readonly T[]): T {
    return arr[this.int(arr.length)];
  }
  /** True with probability p. */
  chance(p: number): boolean {
    return this.rng() < p;
  }
}
