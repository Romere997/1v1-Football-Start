// Boots the real game file in a stubbed DOM and drives it with synthetic keys.
const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('./open_field_v6.html', 'utf8');
let js = html.split('<script>')[1].split('</script>')[0];
// expose the game object for test introspection only
js = js.replace('game.frame();', 'globalThis.__g = game; game.frame();');

function makeEl(id) {
  const el = {
    id, textContent: '', innerHTML: '', value: '',
    style: new Proxy({}, { get: () => '', set: () => true }),
    dataset: {}, children: [], clientWidth: 1000, clientHeight: 700,
    classList: {
      _s: new Set(),
      add(c) { this._s.add(c) }, remove(c) { this._s.delete(c) },
      toggle(c, f) { f ? this._s.add(c) : this._s.delete(c) },
      contains(c) { return this._s.has(c) },
    },
    addEventListener() {}, appendChild(c) { this.children.push(c) },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 }),
  };
  return el;
}

const noop2d = new Proxy({}, {
  get: (t, k) => {
    if (k === 'canvas') return {};
    if (k === 'createLinearGradient') return () => ({ addColorStop() {} });
    if (k === 'measureText') return () => ({ width: 10 });
    return () => {};
  },
  set: () => true,
});

function boot() {
  const els = {};
  const document = {
    getElementById(id) { return (els[id] ||= makeEl(id)), id === 'game'
      ? Object.assign(els[id], { getContext: () => noop2d, width: 1000, height: 636 })
      : els[id]; },
    querySelectorAll: () => [],
    createElement: () => makeEl('new'),
    addEventListener() {},
  };

  let listeners = {};
  let rafQueue = [];
  let clock = 0;

  const window = {
    addEventListener(t, f) { (listeners[t] ||= []).push(f) },
    devicePixelRatio: 1,
    AudioContext: function () {
      return {
        currentTime: 0, destination: {},
        createOscillator: () => ({ frequency: {}, connect() {}, start() {}, stop() {} }),
        createGain: () => ({ gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }),
      };
    },
  };

  const sandbox = {
    document, window, console,
    performance: { now: () => clock },
    requestAnimationFrame: (f) => rafQueue.push(f),
    setTimeout: () => 0,
    localStorage: { getItem: () => null, setItem() {} },
    Math, JSON, Set, Map, Array, Object, Number, String, Infinity, NaN,
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(js, sandbox, { filename: 'game.js' });

  const key = (code, down = true) => {
    (listeners[down ? 'keydown' : 'keyup'] || []).forEach(f =>
      f({ code, preventDefault() {} }));
  };
  const step = (frames = 1, ms = 16.7) => {
    for (let i = 0; i < frames; i++) {
      clock += ms;
      const q = rafQueue; rafQueue = [];
      q.forEach(f => f());
    }
  };
  const tap = (code) => { key(code, true); step(2); key(code, false); step(1); };

  return { g: () => sandbox.globalThis.__g, els, key, step, tap, getText: (id) => (els[id] ? els[id].textContent : null) };
}

module.exports = { boot };
