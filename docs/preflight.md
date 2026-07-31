# Preflight — 1v1-Football-Start V7 Port

```json
{
  "event": "TASK_STARTED",
  "task": "1v1-Football-Start-v7-port",
  "level": "L2",
  "preflight": {
    "KNOW": "Repo is a single-page HTML game with Node harness tests. Baseline `node test.js` passes 8/8 on `main`. Repo cloned and branch `feature/open-field-v7` created.",
    "ASSUME": "V7 HTML pasted in chat is the intended full replacement for V6 gameplay surface and mechanics. Porting it into `open_field_v6.html` preserves existing harness/test expectations or will require test rewrite.",
    "BLIND": "Whether full V7 feature set can be merged without regressing existing `test.js` contracts; whether harness stubs cover new V7 UI elements and defender/struggle systems; final screen/flow behavior after port; whether existing test.js assumptions match V7 mechanics."
  }
}
```

## Verdict Log

```json
{
  "event": "TASK_CLOSED",
  "task": "1v1-Football-Start-v7-port",
  "verdict": "NO_GAP | SUSPECTED_GAP | CONFIRMED_GAP",
  "evidence": "EXTERNAL: [build/test exit codes, harness output counts, file diff scope audit, screenshot capture success]. Mirror: [assumptions that held/blind spots resolved]"
}
```

## Revised ship graph — fake-edge audit result

```
Wave -1
  ├─ preflight.md          (orchestrator)
  ├─ acceptance.md          (orchestrator)
  └─ contract.md            (orchestrator)
        ↓
Wave 0   baseline green + backup
        ↓
Wave 1   port V7 features
   ├─ open_field_v6.html    (agent B)
   └─ README.md draft        (agent C)   ← moved earlier; only evidence line waits
        ↓
Wave 2   verification + docs finalize
   ├─ verify-v7.cjs         (agent C)
   ├─ package.json          (agent C)
   ├─ CHANGELOG.md          (agent C)
   ├─ test.js update        (agent C)
   ├─ run tests             (orchestrator)
   ├─ README.md finalize     (agent C)   ← needs test output for evidence line only
   └─ screenshots           (orchestrator, during Wave 2 while server is up)
        ↓
Ship     commit → merge → tag → push → live URL verify
```

### Fake edges removed on this ship

1. `acceptance.md` no longer waits for `preflight.md` write to finish — both are independent Wave -1 artifacts.
2. `contract.md` no longer waits for both docs — it is owned by the orchestrator and can be drafted in parallel.
3. `README.md` draft moved to Wave 1 — only the **evidence/status** section waits for Wave 2 test output.
4. Screenshots moved to Wave 2 — captured while the local server is already running; does not need a clean ship-state commit.

### Real edges preserved

- Wave 0 → Wave 1: baseline must exist before port so diff is meaningful.
- Wave 1 → Wave 2: verification must test the actual ported code.
- Wave 2 → Ship: do not ship unverified work.
