# Acceptance Criteria — V1 Scope

**Rule:** Anything not listed here is not in V1. If it is not in this file, it goes to `Planned` in the shipped README.

## AC-01 — Three receiver roster
User can throw to WR 1 / WR 2 / WR 3 using keys 5 / 6 / 7.
→ CHECK: `node test.js` pass coverage + `scripts/verify-v7.cjs::hudWrList`

## AC-02 — Pass indicator lists all eligible receivers
When the QB has the ball and has not thrown, the bottom pass indicator shows receiver targets.
→ CHECK: `scripts/verify-v7.cjs::passIndicator`

## AC-03 — Dynamic defensive scout screen
The scout screen shows 3+ unique defender types and avoids a monolithic lineup.
→ CHECK: `scripts/verify-v7.cjs::defenderPreview`

## AC-04 — Defender stamina bars on field
Every defender renders a stamina bar whose color maps to `DEF_TYPES.color` and can drain.
→ CHECK: harness visual snapshot + defender render path in `open_field_v6.html`

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
→ CHECK: `scripts/verify-v7.cjs::hudWrList`

## AC-09 — Gassed defender loses behavior
A defender with zero stamina loses its behavior/special ability according to `gassed` rules.
→ CHECK: `scripts/verify-v7.cjs` + defender update/render path in `open_field_v6.html`

## AC-10 — Existing baseline tests still pass
V7 port does not regress current harness contracts.
→ CHECK: `node test.js` exits 0.

## Wave-2 verdict template

| AC-## | Description | CHECK | Verdict | Evidence |
|---|---|---|---|---|
| AC-01 | Three receiver roster | `node test.js` + `verify-v7.cjs::hudWrList` | PASS / FAIL / UNPROVEN | ... |
| AC-02 | Pass indicator lists targets | `verify-v7.cjs::passIndicator` | PASS / FAIL / UNPROVEN | ... |
| AC-03 | Dynamic scout screen | `verify-v7.cjs::defenderPreview` | PASS / FAIL / UNPROVEN | ... |
| AC-04 | Defender stamina bars | visual snapshot + code path | PASS / FAIL / UNPROVEN | ... |
| AC-05 | QB set-factor accuracy | `getSetFactor` benchmark | PASS / FAIL / UNPROVEN | ... |
| AC-06 | Wrap-up struggle flow | harness contact scenario | PASS / FAIL / UNPROVEN | ... |
| AC-07 | Struggle does not instantly end play | harness POST/GameOver assertion | PASS / FAIL / UNPROVEN | ... |
| AC-08 | Receiver HUD list | `verify-v7.cjs::hudWrList` | PASS / FAIL / UNPROVEN | ... |
| AC-09 | Gassed defender behavior | `verify-v7.cjs` + render path | PASS / FAIL / UNPROVEN | ... |
| AC-10 | Baseline tests still pass | `node test.js` | PASS / FAIL / UNPROVEN | ... |

**UNPROVEN is not a shipping state.** The only legal moves on UNPROVEN are:
- write the check and run it → becomes PASS or FAIL
- move the AC to `Planned` under R8 descope
