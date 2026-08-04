const { boot } = require('./harness.js');

let pass = 0, fail = 0;
const check = (name, cond, extra = '') => {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${extra ? '  (' + extra + ')' : ''}`);
  cond ? pass++ : fail++;
};

// Start a game with the WR enabled, run to the PLAY state.
function startPlay() {
  const g = boot();
  g.step(2);
  g.tap('Enter');            // MENU -> UPGRADE
  g.tap('KeyR');             // enable the receiver
  g.tap('Enter');            // UPGRADE -> SCOUT
  g.tap('Enter');            // SCOUT -> CALLS (pre-snap)
  g.tap('Enter');            // CALLS -> PLAY
  return g;
}

console.log('\n=== 1. Game boots and reaches the PLAY state ===');
{
  const g = startPlay();
  g.step(30);
  check('HUD round counter is live', g.getText('hudRound') === 1 || g.getText('hudRound') === '1',
        'hudRound=' + g.getText('hudRound'));
  check('yard marker updating', g.getText('hudYard') !== '');
}

console.log('\n=== 2. Throwing a pass always resolves (no zombie play) ===');
{
  const results = {};
  for (let trial = 0; trial < 60; trial++) {
    const g = startPlay();
    g.key('KeyW');                 // run upfield
    g.step(60);                    // ~1s so the route develops
    g.tap('Digit5');               // THROW TO WR1
    g.step(1200);                   // let it fully play out
    const title = g.getText('postTitle') || 'NO_RESOLUTION';
    results[title] = (results[title] || 0) + 1;
  }
  console.log('   outcomes over 60 passes:', JSON.stringify(results));
  check('every pass reached a terminal outcome', !results['NO_RESOLUTION'],
        'unresolved=' + (results['NO_RESOLUTION'] || 0));
  const completions = (results['TOUCHDOWN!'] || 0);
  const incompletes = (results['INCOMPLETE'] || 0);
  const picks = (results['INTERCEPTED!'] || 0);
  check('completions are common, not rare', completions + (results['TACKLED!'] || 0) > incompletes,
        `caught-ish=${completions + (results['TACKLED!'] || 0)} incomplete=${incompletes}`);
  check('interceptions are not runaway', picks < 12, 'picks=' + picks + '/60');
}

console.log('\n=== 3. An incompletion does NOT cost a life ===');
{
  let checked = false;
  for (let trial = 0; trial < 80 && !checked; trial++) {
    const g = startPlay();
    g.key('KeyW');
    g.step(60);
    g.tap('Digit4');
    g.step(1200);
    if (g.getText('postTitle') === 'INCOMPLETE') {
      const hearts = g.els['postLives'].children;
      const lost = hearts.filter(h => h.classList.contains('lost')).length;
      check('lives untouched after an incompletion', lost === 0, 'hearts lost=' + lost);
      check('subtitle explains it', /no life lost/i.test(g.getText('postSubtitle')),
            g.getText('postSubtitle'));
      checked = true;
    }
  }
  if (!checked) console.log('  SKIP  (no incompletion occurred in 80 trials)');
}

console.log('\n=== 4. You can throw again after a pass is dead ===');
{
  // Reach a POST screen from an incompletion, retry the round, throw again.
  let verified = false;
  for (let trial = 0; trial < 80 && !verified; trial++) {
    const g = startPlay();
    g.key('KeyW'); g.step(60); g.tap('Digit4'); g.step(1200);
    if (g.getText('postTitle') !== 'INCOMPLETE') continue;
    g.tap('Enter');            // POST -> SCOUT (retry)
    g.tap('Enter');            // SCOUT -> PLAY
    g.els['postTitle'].textContent = 'CLEARED';
    g.key('KeyW'); g.step(60); g.tap('Digit4'); g.step(1200);
    check('second pass resolved on the retried down',
          g.getText('postTitle') !== 'CLEARED', 'title=' + g.getText('postTitle'));
    verified = true;
  }
  if (!verified) console.log('  SKIP  (could not set up scenario)');
}

console.log('\n=== 5. No touchdown without possession ===');
{
  // Throw the ball, then sprint the empty-handed QB at the end zone.
  let bogusTD = 0, trials = 40;
  for (let t = 0; t < trials; t++) {
    const g = startPlay();
    g.tap('Digit4');                 // throw immediately
    g.key('KeyW'); g.key('ShiftLeft');
    g.step(1200);                     // run flat out for ~8s
    if (g.getText('postTitle') === 'TOUCHDOWN!') {
      // Only legitimate if the WR caught it. Check the WR HUD said HAS BALL.
      if (g.getText('hudWrStatus') !== "YOU'RE THE WR - RUN!") bogusTD++;
    }
  }
  check('no ball-less touchdowns', bogusTD === 0, 'bogus=' + bogusTD + '/' + trials);
}

console.log('\n=== 6. Rounds without the WR still play normally ===');
{
  const g = boot();
  g.step(2); g.tap('Enter'); g.tap('Enter'); g.tap('Enter'); g.tap('Enter');   // no KeyR = run-only (default calls)
  g.key('KeyW');
  g.step(1400);
  const title = g.getText('postTitle');
  check('run-only round resolves', title === 'TOUCHDOWN!' || title === 'TACKLED!', 'title=' + title);
}

console.log('\n=== 7. Menu input survives high-refresh-rate frames ===');
{
  const g = boot();
  g.step(2);
  // 240Hz: most frames are shorter than one 60Hz physics tick.
  g.key('Enter', true); g.step(3, 4.1); g.key('Enter', false); g.step(3, 4.1);
  check('ENTER registered at 240fps', g.els['menuOverlay'].classList.contains('visible') === false);
}

console.log(`\n${'='.repeat(46)}\n  ${pass} passed, ${fail} failed\n${'='.repeat(46)}\n`);
process.exit(fail ? 1 : 0);
