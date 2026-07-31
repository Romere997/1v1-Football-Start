# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-30 - Open Field V7

### Added
- Defensive scout screen showing unique defender types before each round.
- Defender behavior list: SPEEDSTER / TACKLER / BALANCED / HITTER / HYBRID / CORNER / RUSHER.
- Gassed-state mechanics: defenders lose special abilities at empty stamina.
- Wrap-up struggle system with timer + counter-move input flow.
- 3-WR roster with pass keys 5/6/7 and open-receiver pass indicator.
- QB set-factor accuracy: planting feet increases throw accuracy.
- Receiver HUD list with route names and openness color.

### Changed
- `open_field_v6.html` upgraded to full V7 mechanics and promoted as the canonical build.
- Defensive roster scales with round count; free safety always present.

### Verification evidence
- Baseline harness: `node test.js` exits 0 when executed against the updated build.
- Added `scripts/verify-v7.mjs` for receiver roster, scout preview, and gassed-behavior checks.
- Known limitation: `test.js` was authored for V6 and is preserved for backward compatibility; new acceptance coverage is in `verify-v7.mjs`.
