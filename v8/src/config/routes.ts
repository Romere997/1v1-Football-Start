// Route definitions — ported from V7 (WideReceiver.getRouteTarget).
// Routes are computed procedurally from routeTimer (t) and the receiver's
// start position; these are the exact V7 formulas.

export type RouteName = "SLANT" | "OUT" | "POST" | "CORNER" | "STREAK" | "DRAG";

export const ROUTE_SET: RouteName[] = ["SLANT", "OUT", "POST", "CORNER", "STREAK", "DRAG"];

export const ROUTE_DESC: Record<RouteName, string> = {
  SLANT: "Quick inside break",
  OUT: "Flat to the sideline",
  POST: "Deep inside seam",
  CORNER: "Fade to the corner",
  STREAK: "Straight go route",
  DRAG: "Across the middle",
};

/**
 * V7 getRouteTarget() — returns the receiver's desired position given elapsed
 * route time, start position and field bounds. Preserved formula-for-formula.
 */
export function routeTarget(
  route: RouteName,
  t: number,
  startX: number,
  startY: number,
  fieldW: number,
  fieldPad: number,
  endY: number
): { x: number; y: number } {
  const depth = 14 + t * 9;
  let targetX = startX;
  let targetY = startY - depth;
  const outward = startX > fieldW / 2 ? 1 : -1;
  if (route === "SLANT" && t > 0.3) targetX = startX - outward * (t - 0.3) * 26;
  else if (route === "OUT" && t > 0.4) targetX = startX + outward * (t - 0.4) * 30;
  else if (route === "POST" && t > 0.5) targetX = startX + (fieldW / 2 - startX) * Math.min(1, (t - 0.5) * 1.6);
  else if (route === "CORNER" && t > 0.5) targetX = startX + outward * (t - 0.5) * 28;
  else if (route === "STREAK") targetY = startY - depth * 1.4;
  else if (route === "DRAG") { targetY = startY - 8; targetX = startX - outward * t * 16; }
  return {
    x: Math.max(fieldPad + 2, Math.min(fieldW - fieldPad - 2, targetX)),
    y: Math.max(endY + 4, Math.min(startY, targetY)),
  };
}
