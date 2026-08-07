// Defender archetypes + matchup table — ported VERBATIM from V7
// (open_field_v6.html DEF_TYPES / MATCHUP). These numbers are the
// behavioral spec; V8 must preserve them exactly.

export type Behavior = "CHASE" | "ZONE" | "MIRROR" | "BULL" | "CUT" | "COVER" | "RUSH" | "LOB";

export interface DefenderSpec {
  name: string;
  /** Stamina-bar color (CSS string). */
  color: string;
  number: number;
  speed: number;
  accel: number;
  grip: number;
  pursuit: number;
  size: number;
  maxStamina: number;
  behavior: Behavior;
  desc: string;
  gassed: string;
}

export const DEF_TYPES: Record<string, DefenderSpec> = {
  SPEEDSTER: { name: "SPEEDSTER", color: "#00d4ff", number: 21, speed: 9.6, accel: 55, grip: 5.0, pursuit: 9, size: 1.0, maxStamina: 62, behavior: "CHASE", desc: "Chases you down", gassed: "Speed collapses" },
  TACKLER: { name: "TACKLER", color: "#ff3366", number: 55, speed: 7.0, accel: 35, grip: 9.5, pursuit: 6, size: 1.32, maxStamina: 100, behavior: "ZONE", desc: "Zones & wraps up", gassed: "Can't hold a tackle" },
  BALANCED: { name: "BALANCED", color: "#a855f7", number: 42, speed: 8.0, accel: 45, grip: 7.5, pursuit: 7.5, size: 1.15, maxStamina: 85, behavior: "MIRROR", desc: "Mirrors your cuts", gassed: "Reactions go slow" },
  HITTER: { name: "HITTER", color: "#ff6b35", number: 94, speed: 6.6, accel: 30, grip: 9.0, pursuit: 5, size: 1.5, maxStamina: 120, behavior: "BULL", desc: "Bull rush", gassed: "Stops charging" },
  HYBRID: { name: "HYBRID", color: "#22c55e", number: 33, speed: 8.8, accel: 50, grip: 7.0, pursuit: 9, size: 1.1, maxStamina: 75, behavior: "CUT", desc: "Cuts off angles", gassed: "Loses the angle" },
  CORNER: { name: "CORNER", color: "#ff00ff", number: 24, speed: 9.2, accel: 52, grip: 5.5, pursuit: 8.5, size: 1.0, maxStamina: 70, behavior: "COVER", desc: "Shadows a WR", gassed: "Coverage breaks" },
  RUSHER: { name: "RUSHER", color: "#ffd700", number: 99, speed: 7.6, accel: 46, grip: 8.5, pursuit: 7, size: 1.45, maxStamina: 95, behavior: "RUSH", desc: "Rushes the QB", gassed: "Rush goes dead" },
  LOB: { name: "LOB", color: "#facc15", number: 31, speed: 8.1, accel: 44, grip: 7.2, pursuit: 8.8, size: 1.18, maxStamina: 88, behavior: "LOB", desc: "Tight zone, closes hard", gassed: "Zone coverage collapses" },
};

export type MoveType = "TRUCK" | "SPIN" | "JUKE";

/** How well each move works against each type while being wrapped up. 1.0 = their weakness. */
export const MATCHUP: Record<string, Record<MoveType, number>> = {
  SPEEDSTER: { TRUCK: 1.0, SPIN: 0.6, JUKE: 0.3 },
  TACKLER: { SPIN: 1.0, JUKE: 0.6, TRUCK: 0.3 },
  BALANCED: { JUKE: 0.7, SPIN: 0.7, TRUCK: 0.7 },
  HITTER: { JUKE: 1.0, SPIN: 0.55, TRUCK: 0.25 },
  HYBRID: { SPIN: 1.0, TRUCK: 0.6, JUKE: 0.3 },
  CORNER: { TRUCK: 1.0, JUKE: 0.7, SPIN: 0.5 },
  RUSHER: { SPIN: 0.9, JUKE: 0.7, TRUCK: 0.5 },
  LOB: { JUKE: 1.0, SPIN: 0.65, TRUCK: 0.4 },
};

export const bestMoveVs = (t: string): MoveType => {
  const m = MATCHUP[t];
  return (Object.keys(m) as MoveType[]).reduce((a, b) => (m[b] > m[a] ? b : a));
};

/** Wrap-up struggle constants. */
export const STRUGGLE = { window: 0.95, moveCD: 0.2, moveCost: 7, breakCost: 14, passive: 0.09, extraGrabber: 0.55 } as const;

export const WR_NUMBERS = [11, 17, 88] as const;
export const DL_NUMBERS = [99, 91, 75] as const;
export const OL_NUMBERS = [74, 66, 52, 63, 79] as const;

/** Back-seven archetype pool, cycled by round (V7 order). */
export const DEF_POOL = [
  DEF_TYPES.CORNER, DEF_TYPES.TACKLER, DEF_TYPES.SPEEDSTER, DEF_TYPES.HITTER,
  DEF_TYPES.HYBRID, DEF_TYPES.BALANCED, DEF_TYPES.LOB,
];

/** Number of back-seven defenders for a round. */
export const getDefCount = (round: number): number => Math.min(2 + Math.floor(round * 0.55), 7);
