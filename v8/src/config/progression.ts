// Player progression (upgrades) — ported from V7 (Game.skills / showUpgrade).

export interface SkillSet {
  speed: number;
  acceleration: number;
  breakTackle: number;
  spinMove: number;
  agility: number;
  strength: number;
  throwPower: number;
  throwAccuracy: number;
  wrSpeed: number;
  hands: number;
}

export const SKILL_KEYS: (keyof SkillSet)[] = [
  "speed", "acceleration", "breakTackle", "spinMove", "agility",
  "strength", "throwPower", "throwAccuracy", "wrSpeed", "hands",
];

export const SKILL_NAMES: Record<keyof SkillSet, string> = {
  speed: "SPEED",
  acceleration: "ACCEL",
  breakTackle: "BREAK",
  spinMove: "SPIN",
  agility: "AGILITY",
  strength: "STRENGTH",
  throwPower: "THROW PWR",
  throwAccuracy: "THROW ACC",
  wrSpeed: "WR SPEED",
  hands: "HANDS",
};

/** WR/offensive-line-adjacent skills get a different tint in the upgrade UI. */
export const WR_SKILLS: (keyof SkillSet)[] = ["throwPower", "throwAccuracy", "wrSpeed", "hands"];

export const SKILL_MAX = 10;

export const baseSkills = (): SkillSet => ({
  speed: 5, acceleration: 5, breakTackle: 5, spinMove: 5, agility: 5,
  strength: 5, throwPower: 5, throwAccuracy: 5, wrSpeed: 5, hands: 5,
});

/** V7 player stat formulas derived from skills. */
export const playerSpeed = (skills: SkillSet): number => (6.9 + skills.speed * 0.4);
export const playerAccel = (skills: SkillSet): number => (32 + skills.acceleration * 4.5);
export const throwPower = (skills: SkillSet): number => 15 + skills.throwPower * 2;
export const throwAccuracy = (skills: SkillSet, setFactor: number): number =>
  Math.max(0, Math.min(0.97, 0.34 + skills.throwAccuracy * 0.05 + setFactor * 0.22));
export const wrSpeed = (skills: SkillSet): number => 7.0 + skills.wrSpeed * 0.25;
