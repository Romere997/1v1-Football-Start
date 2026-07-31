# Interface Contract — Wave −1 Freeze

This file is owned by the orchestrator and is **frozen** for the duration of Wave 1.

Agents may read it. If an agent believes anything here is wrong, it must report that belief and stop — it must not edit this file.

---

## Project surface

```
1v1-Football-Start/
├── open_field_v6.html          # Playable build; target for V7 merge
├── harness.js                  # Node/Vm harness driving DOM/stubbed browser
├── test.js                     # Harness tests
├── docs/
│   ├── preflight.md            # KNOW / ASSUME / BLIND + verdict
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
