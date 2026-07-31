# Acceptance Criteria — V1 Scope

**Rule:** Anything not listed here is not in V1. If it is not in this file, it goes to `Planned` in the shipped README.

## AC-01 — Three receiver roster
User can throw to WR 1 / WR 2 / WR 3 using keys 5 / 6 / 7.
→ CHECK: `node test.js::receiverRoster`

## AC-02 — Pass indicator lists all eligible receivers
When the QB has the ball and has not thrown, the bottom pass indicator shows receiver targets.
→ CHECK: harness or manual DOM probe reading `#passIndicator` text contains receiver labels/slots.

## AC-03 — Dynamic defensive scout screen
The scout screen shows 3+ unique defender types and avoids a monolithic lineup.
→ CHECK: harness snapshot of `#defenderPreview` distinct `defender-name` text values.

## AC-04 — Defender stamina bars on field
Every defender renders a stamina bar whose color maps to `DEF_TYPES.color` and can drain.
→ CHECK: `e2e/smoke.spec.ts` or harness visual snapshot; fallback: DOM + simulation evidence.

## AC-05 — QB set-factor accuracy
A fully planted QB throws more accurately than when sprinting.
→ CHECK: `aim7b.js` benchmark port or `test.js` added case with `getSetFactor` assertion.

## AC-06 — Wrap-up struggle flow
When a defender reaches the carrier, the carrier enters struggle state and can break free or be tackled.
→ CHECK: harness scenario inducing contact and asserting `carrier.grabbers.length > 0` then either BREAK/DOWN outcome.

## AC-07 — Struggling no longer instantly ends play
Contact starts a fight timer; the play ends when the struggle resolve triggers DOWN/BREAK instead of on contact itself.
→ CHECK: harness asserts contact does not immediately transition to POST/GameOver states.

## AC-08 — Receiver HUD list
The HUD shows receiver rows with route names, openness dots, and ball state.
→ CHECK: DOM probe `#hudWrList` children count and text content stability.

## AC-09 — Gassed defender loses behavior
A defender with zero stamina loses its behavior/special ability according to `gassed` rules.
→ CHECK: harness or simulation draining stamina and asserting behavior path changes after empty state.

## AC-10 — Existing baseline tests still pass
V7 port does not regress current harness contracts.
→ CHECK: `node test.js` exits 0.
