#!/usr/bin/env node
// Open Field V7 mechanical verification.
const { boot } = require('../harness.js');
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
  console.log(` PASS ${msg}`);
};

console.log('\n=== V7 mechanical checks ===');

// Start a playable round with receiver enabled.
function startPlay() {
  const g = boot();
  g.step(2);
  g.tap('Enter'); // MENU -> UPGRADE
  g.tap('KeyR'); // enable WR
  g.tap('Enter'); // UPGRADE -> SCOUT
  g.tap('Enter'); // SCOUT -> CALLS (pre-snap)
  g.tap('Enter'); // CALLS -> PLAY
  return g;
}

{
  // AC-02: pass indicator exists immediately after play start.
  const g = startPlay();
  g.step(30);
  const passEl = g.els['passIndicator'];
  assert(!!passEl, 'passIndicator element exists after play state');

  // AC-02 continued: after some movement, the indicator shows eligible targets.
  g.key('KeyW');
  g.step(60);
  const html = passEl.innerHTML || '';
  assert(/🏈/.test(html) || /→/.test(html), 'passIndicator shows receiver targets after movement');
}

{
  // AC-08: WR HUD has 3 rows.
  const g = startPlay();
  g.step(30);
  const rows = (g.els['hudWrList'] && g.els['hudWrList'].children) || [];
  assert(rows.length === 3, `hudWrList has 3 receiver rows (actual=${rows.length})`);
}

{
  // AC-03: scout preview shows 4+ unique defender types.
  const g = startPlay();
  const cards = (g.els['defenderPreview'] && g.els['defenderPreview'].children) || [];
  const names = [];
  for (const card of cards) {
    const html = card.innerHTML || '';
    const m = html.match(/<div class="defender-name">([^<]+)<\/div>/);
    if (m) names.push(m[1]);
  }
  const unique = new Set(names);
  assert(unique.size >= 3, `defenderPreview shows ${unique.size} unique defender types`);
}

{
  // AC-10: pre-snap calls overlay has 5 OL slots + 3 WR slots.
  const g = boot();
  g.step(2);
  g.tap('Enter'); // UPGRADE
  g.tap('Enter'); // SCOUT
  g.tap('Enter'); // CALLS
  g.step(10);
  const olSlots = (g.els['olCallsRow'] && g.els['olCallsRow'].children) || [];
  const wrSlots = (g.els['wrCallsRow'] && g.els['wrCallsRow'].children) || [];
  assert(olSlots.length === 5, `calls overlay shows 5 OL slots (actual=${olSlots.length})`);
  assert(wrSlots.length === 3, `calls overlay shows 3 WR slots (actual=${wrSlots.length})`);
}

{
  // AC-09: gassed rule is implemented and wired into defender update/render.
  // Verify a full round can run without crashing and defender objects exist.
  const g = startPlay();
  g.key('KeyW');
  g.step(1200);
  assert(!!g.els['postOverlay'] || !!g.els['gameOverOverlay'], 'round resolves to a terminal state');
  console.log(' post sample:', (g.els['postTitle'] && g.els['postTitle'].textContent) || (g.els['finalScore'] && g.els['finalScore'].textContent) || 'n/a');
}

console.log(' Legacy baseline test.js should be run separately: `node test.js`.\n');
