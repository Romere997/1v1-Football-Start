// GameState — pure data + transitions for the whole game loop.
// Holds everything Phaser must render: phase, round, score, lives, skills,
// calls, and the current play's entities. The GameSimulation mutates this.

import type { SkillSet } from "../config/progression";
import { baseSkills } from "../config/progression";
import type { RouteName } from "../config/routes";
import { ROUTE_SET } from "../config/routes";

export type Phase =
  | "MENU"
  | "UPGRADE"
  | "SCOUT"
  | "CALLS"
  | "PLAY"
  | "POST"
  | "GAMEOVER";

export type BlockMode = "BLOCK" | "PULL_L" | "PULL_R";
export const OL_MODES: BlockMode[] = ["BLOCK", "PULL_L", "PULL_R"];

export interface Calls {
  ol: BlockMode[]; // 5 entries
  wr: RouteName[]; // 3 entries
}

export const defaultCalls = (): Calls => ({
  ol: ["BLOCK", "BLOCK", "BLOCK", "BLOCK", "BLOCK"],
  wr: ["SLANT", "POST", "STREAK"],
});

export type PostReason = "TD" | "TACKLED" | "SACKED" | "INCOMPLETE" | "INTERCEPTED";

export interface GameState {
  phase: Phase;
  round: number;
  score: number;
  roundScore: number;
  lives: number;
  maxLives: number;
  skills: SkillSet;
  calls: Calls;
  /** Focus index into the 8 call slots (5 OL + 3 WR). */
  callFocus: number;
  /** Index into skill grid for the upgrade screen. */
  skillIndex: number;
  roundTime: number;
  roundBrokenTackles: number;
  totalBrokenTackles: number;
  wonRound: boolean;
  lastPostReason: PostReason;
  highScore: number;
}

export const createGameState = (): GameState => ({
  phase: "MENU",
  round: 1,
  score: 0,
  roundScore: 0,
  lives: 3,
  maxLives: 3,
  skills: baseSkills(),
  calls: defaultCalls(),
  callFocus: 0,
  skillIndex: 0,
  roundTime: 0,
  roundBrokenTackles: 0,
  totalBrokenTackles: 0,
  wonRound: false,
  lastPostReason: "TACKLED",
  highScore: 0,
});

export const cycleOLMode = (mode: BlockMode, dir: 1 | -1): BlockMode =>
  OL_MODES[(OL_MODES.indexOf(mode) + dir + OL_MODES.length) % OL_MODES.length];

export const cycleRoute = (route: RouteName, dir: 1 | -1): RouteName =>
  ROUTE_SET[(ROUTE_SET.indexOf(route) + dir + ROUTE_SET.length) % ROUTE_SET.length];
