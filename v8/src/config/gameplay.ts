// Core gameplay constants — extracted from open_field_v6.html (V7 source of
// truth). Every magic number in the game belongs in this config.

/** World is 76 wide x 150 tall; +y is DOWN the field toward the end zone (y=18). */
export const FIELD = { w: 76, h: 150, startY: 130, endY: 18, pad: 3 } as const;

/** Line of scrimmage. */
export const LOS = FIELD.startY - 5;

/** Fixed simulation timestep (seconds). Gameplay is computed at this rate regardless of render FPS. */
export const DT = 1 / 60;

/** Map a world y coordinate to a displayed yard line (50 = own goal line, 100 = end zone). */
export const yardLine = (y: number): number =>
  Math.round(
    Math.max(50, Math.min(100, 50 + (50 * (FIELD.startY - y)) / (FIELD.startY - FIELD.endY)))
  );

// Kits (jersey colors) ported from V7. Stored as hex numbers for Phaser.
export const DEF_KIT = { jersey: 0xa8202f, dark: 0x71131f, trim: 0xf0e6d2, pants: 0x16161c, helmet: 0x2b2b33 };
export const OFF_KIT = { jersey: 0x00cc6a, dark: 0x00814a, trim: 0xeafff4, pants: 0x16161c, helmet: 0xe8e8e8 };
export const WR_KIT = { jersey: 0xff9500, dark: 0xb56400, trim: 0xfff4e0, pants: 0x16161c, helmet: 0xffb84d };
export const OL_KIT = { jersey: 0x4a90d9, dark: 0x2f5d8c, trim: 0xe6f2ff, pants: 0x16161c, helmet: 0x87ceeb };

/** Down linemen spacing on the LOS. */
export const DL_X = [FIELD.w / 2 - 6, FIELD.w / 2, FIELD.w / 2 + 6] as const;

/** Back-seven defender spots, indexed by round-scaling count (V7 order). */
export const BACK_SEVEN_SPOTS = [
  { x: FIELD.w * 0.5, y: LOS - 13 },
  { x: FIELD.w * 0.18, y: LOS - 17 },
  { x: FIELD.w * 0.82, y: LOS - 17 },
  { x: FIELD.w * 0.33, y: LOS - 27 },
  { x: FIELD.w * 0.67, y: LOS - 27 },
  { x: FIELD.w * 0.5, y: LOS - 40 },
  { x: FIELD.w * 0.25, y: LOS - 52 },
] as const;
