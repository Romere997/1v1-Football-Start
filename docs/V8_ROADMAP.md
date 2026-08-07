# Openfield Football V8 — Migration Roadmap (authoritative handoff doc)

> **Read this first.** This document is the single source of truth for the
> V8 TypeScript + Phaser migration. Any session (human chat, cron build job,
> subagent) that continues this work MUST read this file, the V7 spec
> (`open_field_v6.html` at repo root), and the config contracts in
> `v8/src/config/` before writing code.
>
> Mirrored in OmniCRM: project row `openfield-football`, `journal` entries,
> and `memory` rows keyed `v8-roadmap-*`. The OmniCRM `next_action` column
> always holds the CURRENT next step.
>
> Branch: `v8-phaser` (V7 untouched on `main`). Repo: github.com/Romere997/OpenfieldFootball

---

## 0. Why V8 exists

V7 (`open_field_v6.html`, ~1800 lines, single file) is a **proven, tested
gameplay spec** — it must not be deleted or weakened. But adding features to
one HTML file is unsustainable. V8 restructures into separated
simulation / rendering / input / UI / config / state so the game can grow
(animated sprites, WebGL effects, controller support, mobile) without
recreating a monolith.

**Success = behavioral parity with V7, proven by tests.** "It boots" is not
success. A feature is only "ported" when a V7-equivalent test passes.

## 1. Architecture (locked)

```
v8/
├── index.html / package.json / tsconfig.json / vite.config.ts   (DONE)
├── src/
│   ├── main.ts                     # Phaser boot + scene wiring      (TODO)
│   ├── config/                     # ALL magic numbers, typed        (DONE)
│   │   ├── gameplay.ts             # FIELD, LOS, DT, kits, spots
│   │   ├── defenders.ts            # DEF_TYPES, MATCHUP, STRUGGLE
│   │   ├── routes.ts               # routeTarget() V7 formulas
│   │   └── progression.ts          # SkillSet, upgrade formulas
│   ├── utils/                      # vec.ts, rng.ts (seedable)       (DONE)
│   ├── input/
│   │   ├── actions.ts              # GameActions/MenuAction contract (DONE)
│   │   └── InputManager.ts         # keyboard/mobile -> actions      (TODO)
│   ├── entities/                   # pure TS, NO Phaser              (TODO)
│   │   ├── Player.ts  Receiver.ts  Defender.ts  Blocker.ts  Football.ts
│   │   └── carrier.ts              # shared grabbers/struggle mixin
│   ├── systems/                    # pure TS, NO Phaser              (TODO)
│   │   ├── MovementSystem.ts  StaminaSystem.ts  RouteSystem.ts
│   │   ├── PassingSystem.ts  BlockingSystem.ts  TacklingSystem.ts
│   │   └── DefensiveAISystem.ts
│   ├── simulation/
│   │   ├── GameState.ts            # phase/score/lives/skills/calls  (DONE)
│   │   └── GameSimulation.ts       # fixed-timestep owner of entities+systems (TODO)
│   ├── rendering/                  # Phaser render helpers           (TODO)
│   │   ├── FieldRenderer.ts  EntityRenderer.ts  CameraRig.ts  Effects.ts
│   └── scenes/                     # Phaser scenes, thin UI shells   (TODO)
│       ├── MenuScene.ts  UpgradeScene.ts  ScoutScene.ts
│       ├── PlayCallScene.ts  GameScene.ts  PostPlayScene.ts
└── tests/                          # vitest, pure-logic + integration (TODO)
```

## 2. Hard design rules (from Ross's spec — DO NOT VIOLATE)

1. Simulation is **independent of Phaser**. Phaser = rendering/scenes/camera/audio/assets/input integration only.
2. **Never blindly replace V7 movement/collision with generic Phaser physics.** Preserve football feel unless a change is tested & proven better.
3. **Every V7 magic number lives in `config/`**, typed, verbatim from V7.
4. TypeScript **strict** mode; meaningful interfaces; no `any`.
5. Gameplay consumes **actions** (`MOVE`, `JUKE`, `SPIN`, `TRUCK`, `SLOW`, `PASS_WR1..3`), never raw keys. Controller/mobile-ready.
6. **Seedable/deterministic randomness** (`utils/rng.ts`) — AI and sim reproducible in tests.
7. **Fixed simulation timestep** (DT = 1/60) decoupled from render FPS.
8. **V7 stays untouched** until V8 hits parity.

## 3. Migration waves (each = one cron run or one focused session)

Each wave ends with: tests green → commit on `v8-phaser` → push →
roadmap updated (this file) → OmniCRM journal entry + `next_action` updated.

- ✅ **Wave 0 — DONE 2026-08-07:** scaffold (vite+ts+phaser 4.2.1), config contracts, utils, input actions, GameState. `npm install` done. Phaser 4 API verified from shipped `.d.ts` (Scene/config/input/camera/graphics all available).
- 🔄 **Wave 1 — entities + InputManager + test scaffolding:**
  - `InputManager.ts`: keyboard mapping (WASD/arrows → dir, Digit4 → slow, Digit1/2/3 → JUKE/SPIN/TRUCK with just-pressed + held semantics, Digit5/6/7 → passTo 0/1/2, Enter/Space/Escape/arrows → MenuAction queue). Injectable key-state source for tests. Mobile/touch stub.
  - `entities/carrier.ts`: `initCarrier`, `updateStruggle` (V7 lines ~428-452), `struggleInput` (V7 ~453-470) as shared mixin functions on a `Carrier` interface (grabbers, struggle, struggleTimer, struggleCD, down, downAnim, lastEscape).
  - `entities/Player.ts`: V7 Player class (lines 476-575) — getSpeed/getAccel/getThrowPower/getSetFactor/getThrowAccuracy/update/doMove/doThrow. Uses `config/progression` formulas + `Random`.
  - `entities/Receiver.ts`: V7 WideReceiver (lines 584-700) — pickRoute/setRoute/getRouteTarget/update/doMove/catchBall. Routes via `config/routes.routeTarget`.
  - `entities/Defender.ts`: V7 Defender (lines 790-950) — all 8 behaviors (CHASE/ZONE/MIRROR/BULL/CUT/COVER/RUSH/LOB), gassed logic, blocked/beaten states, stamina drain.
  - `entities/Blocker.ts`: V7 OLineman (lines 698-790) — blockMode BLOCK/PULL_L/PULL_R, assign/engage/hunt, shed, shove.
  - `entities/Football.ts`: V7 Football (lines ~670-697) — flight, height arc, in-bounds check.
  - Tests: unit tests per entity (deterministic seed), config parity tests asserting V8 config === V7 numbers.
- ⏳ **Wave 2 — systems:** MovementSystem (player/WR accel-lerp movement), StaminaSystem (drain/regain per V7), RouteSystem (WR route following), DefensiveAISystem (pickTarget per behavior), BlockingSystem (assignBlocks committed assignments + PULL side-lock + OL hunt), PassingSystem (tryPass lead computation, catch/intercept rolls), TacklingSystem (handleContact, breakFree, goDown). Tests per system.
- ⏳ **Wave 3 — GameSimulation:** fixed-timestep loop (accumulator, DT=1/60), owns entities+systems, full phase machine (MENU→UPGRADE→SCOUT→CALLS→PLAY→POST/GAMEOVER), round setup (generateDefs, startRound, calls applied), scoring/lives/high-score, deterministic integration test: boot→score a TD→game over, asserts phase/score/lives transitions.
- ⏳ **Wave 4 — rendering + scenes:** FieldRenderer (field, yard lines, LOS), EntityRenderer (kits from config, numbers, stamina bars), CameraRig (follow, zoom 8.5 V7-equivalent), Effects (particles stub), scenes: Menu/Upgrade/Scout/PlayCall/Game/PostPlay as thin shells reading GameState + rendering helpers. `main.ts` boots Phaser 4 with scene list. `npm run dev` shows the full vertical slice loop.
- ⏳ **Wave 5 — parity + visual pass:** full PARITY.md (V7 FEATURE | V8 STATUS | TESTED | NOTES), V7 regression harness still green (`npm test` at repo root), performance check (60fps, entity/draw-call sanity), then visual polish (sprites, field textures, particles, camera shake/zoom, touchdown effects).

## 4. Parity checklist (definition of done for V8)

3 WR roster · receiver routes · WR1/2/3 pass actions · bullet/lob · planted
accuracy (setFactor) · 5 OL · BLOCK/PULL_L/PULL_R · committed blocking
assignments · defender archetypes ×8 · defender stamina · GASSED behavior ·
sticky corner coverage · scrambling · juke/spin/truck · wrap-up struggle ·
player stamina · lives · scoring · upgrade system · scout screen · calls
screen · mobile/input abstraction.

## 5. Testing + Verification tooling

[Argent](https://github.com/software-mansion/argent) (v0.19.0, installed in v8/) is the
official device-control + UI-testing toolkit for this project — installed for the UI-verification
waves (Waves 4-5). Used for: driving the Phaser game canvas in-browser, screenshot diff
regression, visual verification of HUD/layout, record-and-replay for gameplay flows.

```bash
argent tools                  # list available MCP tools
argent run screenshot_capture  # capture game state
argent run test_flow           # run a flow YAML
```

## 6. Commands (verified)

```bash
cd C:\Users\rpresendieu\shipping\1v1-Football-Start
git checkout v8-phaser            # V8 work lives here
cd v8
npm install                       # done in Wave 0
npm run typecheck                 # tsc --noEmit
npm run build                     # tsc && vite build
npx vitest run                    # V8 tests
cd .. && npm test                 # V7 regression (must stay green)
```

## 6. Long-term storage / handoff

- **This file** = authoritative roadmap. Update it at the end of every wave.
- **OmniCRM** (`C:\Users\rpresendieu\omnicrm\crm.db`): project `openfield-football`
  (columns `vision/purpose/next_action/notes`), `journal` rows per wave
  (type=progress, payload=wave summary + commit hash), `memory` rows keyed
  `v8-roadmap-*`, `tasks` rows per wave. Prefer the **API** at
  http://localhost:5050 if up, else direct SQLite (WAL-safe, small writes).
- **RILP events** (`C:\Users\rpresendieu\AppData\Local\hermes\learning\events.jsonl`):
  append `TASK_STARTED` / `VALIDATION_COMPLETED` per wave. APPEND ONLY —
  never `write_file` over it (see hermes-path-safety).
- **Cron**: `openfield-v8-builder` job continues the next wave on schedule.
  It reads this file first; if a human session is mid-wave it should skip
  (check `git status` clean / roadmap wave marker).

## 7. Current state (updated every wave)

- Wave 0 complete. Branch `v8-phaser`, scaffold + config + utils + actions + GameState committed.
- V7 `main` untouched; V7 tests green (8/8 + 5/5 + 2/2).
- NEXT ACTION: Wave 1 — entities + InputManager + test scaffolding (3 parallel subagents).
