# Interface Contract — Wave −1 Freeze

This file is owned by the orchestrator and is **frozen** for the duration of Wave 1.

Agents may read it. If an agent believes anything here is wrong, it must report that belief and stop — it must not edit this file.

---

## Project surface

```
1v1-Football-Start/
├── open_field_v6.html        # Playable build; target for V7 merge
├── harness.js                 # Node/Vm harness driving DOM/stubbed browser
├── test.js                    # Harness tests
├── scripts/verify-v7.cjs      # V7 mechanical verification
├── package.json               # Script runner wrapper
├── CHANGELOG.md               # Release notes
├── docs/
│   ├── preflight.md            # KNOW / ASSUME / BLIND + verdict + ship graph
│   ├── acceptance.md           # Frozen V1 scope
│   └── contract.md             # This file
└── README.md                   # Shipped README
```

## Public function signatures used by tests/harness

These must remain callable with the same call signatures after merge.

```ts
// Exposed on the game instance as __g
const g = boot();
g.step(frames, ms?);
g.tap(code);
g.key(code, down?);
g.els // element stubs by id
g.getText(id) // textContent reader
```

## DOM element ids

| id | Purpose |
|---|---|
| `hudRound` | Round counter |
| `hudScore` | Score display |
| `hudYard` | Yard marker |
| `hudTime` | Round time |
| `hudLives` | Top-left lives |
| `upgradeLives` | Upgrade overlay lives |
| `postLives` | Post-play lives |
| `hudStamina` | QB stamina bar |
| `hudStaminaWarn` | Stamina warning text |
| `hudWrSection` / `hudWrList` | Receiver rows |
| `passIndicator` | Open receiver targeting hints |
| `moveIndicator` | Near-defender counter hint |
| `menuOverlay` | Start menu |
| `upgradeOverlay` | Skill upgrade panel |
| `scoutOverlay` | Defense scout panel |
| `postOverlay` | Post-play summary panel |
| `gameOverOverlay` | Game over panel |
| `skillGrid` | Skill cards container |
| `defenderPreview` | Defender lineup cards |
| `roundBadge` / `scoutRoundBadge` | Round header badges |
| `postTitle` / `postSubtitle` | Result title/text |
| `postScore` | Score in post panel |
| `btnStart` / `btnConfirmUpgrade` / `btnStartRound` / `btnNextRound` / `btnMainMenu` / `btnPlayAgain` | Primary buttons |

## Game states

```ts
type State = "MENU" | "UPGRADE" | "SCOUT" | "PLAY" | "POST" | "GAMEOVER";
```

## Key behaviors preserved in V7

- WASD movement with auto-sprint
- Hold `4` to slow without stamina drain
- Planted feet increases throw accuracy
- `5/6/7` pass-to-WR inputs
- Mashing `1/2/3` during wrap-up is a struggle input
- Incomplete passes do not cost a life
- Interceptions / tackles cost one life
- End-zone touchdown ends round as win

## Ship workflow — fake-edge rules

This repo uses the graph-style ship workflow from the article
**Graph Engineering explained: what it is, when to use it and when not to**.

### Fake-edge test
Before sequencing two steps, ask: *does the second step actually need the first step's output?*
- If **yes** → keep the edge.
- If **no** → run them in parallel or collapse them.

### Real edges in this repo's ship graph
1. **Wave 0 → Wave 1**: baseline must exist before the feature port, otherwise diff has no floor.
2. **Wave 1 → Wave 2**: verification must test the actual ported code, not the baseline.
3. **Wave 2 → Ship**: do not ship unverified work; tests and mechanical checks must pass.

### Edges explicitly removed as fake
1. `docs/acceptance.md` does not wait for `docs/preflight.md` — they are independent Wave -1 artifacts.
2. `docs/contract.md` does not wait for both docs — it is owned by the orchestrator and can be drafted in parallel.
3. `README.md` draft can be written in Wave 1; only the **evidence/status** section waits for Wave 2 test output.
4. Screenshots can be captured during Wave 2 while the local server is already running; they do not need a clean ship-state commit first.

### Diamond pattern used here
- **Fan out**: Wave -1 docs, Wave 1 feature port, Wave 2 verification docs
- **Reduce**: plain code / harness runs, not in-chat summarization
- **Synthesize**: orchestrator integrates agent outputs into final commit
