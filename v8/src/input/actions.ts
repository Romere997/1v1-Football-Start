// Input abstraction — gameplay code consumes ACTIONS, never raw keys.
// This is the contract that makes controller/mobile support possible later.
// The concrete InputManager (input/InputManager.ts) maps devices -> GameActions.

import type { MoveType } from "../config/defenders";

export type MoveAction = MoveType; // "JUKE" | "SPIN" | "TRUCK"

export interface GameActions {
  /** Normalized movement direction (-1..1). */
  dirX: number;
  dirY: number;
  /** Hold-to-slow (V7 Digit4). No stamina drain while slowing. */
  slow: boolean;
  /** Just-pressed skill move this frame (or null). */
  move: MoveAction | null;
  /** Currently-held skill move (works while wrapped up — mash OR hold). */
  moveHeld: MoveAction | null;
  /** Just-pressed pass target index 0..2, or -1. */
  passTo: number;
}

export const emptyActions = (): GameActions => ({
  dirX: 0, dirY: 0, slow: false, move: null, moveHeld: null, passTo: -1,
});

// UI navigation actions (menus: upgrade, scout, calls, post-play).
export type MenuAction =
  | "CONFIRM"   // Enter / Space
  | "CANCEL"    // Escape
  | "UP"
  | "DOWN"
  | "LEFT"
  | "RIGHT";
