/* Bugyy: pixel cat that lives on top of the page. Port of ESDY (ESDY Planner v13+).
   Mount: const destroy = mountBugyy({ name, storageKey, below, color }); destroy() removes everything.
   This site runs it without the dynamic island: no panel, no hunger, grey cat by default. */
(function () {
'use strict';
const CSS = ".esdy-island-wrap, .esdy-cat-world { --card:#fff; --fg:#000; --line:#e2ded9; --muted:rgba(0,0,0,.56); --accent:#16A34A; --font-ui:'Inter',system-ui,sans-serif; --font-mono:'JetBrains Mono',ui-monospace,monospace; --spring:cubic-bezier(.2,1.4,.4,1); }\nbody { position: relative; isolation: isolate; }\n.esdy-island-wrap { position: fixed; top: var(--esdy-top, max(10px, env(safe-area-inset-top, 0px))); left: 50%; transform: translateX(-50%); z-index: 90; display: flex; justify-content: center; pointer-events: none; }\n.esdy-island { pointer-events: auto; background: #09090b; color: #f5f5f7; border-radius: 22px; width: 196px; overflow: hidden; box-shadow: 0 10px 30px -10px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.06); transition: width .5s var(--spring), border-radius .5s var(--spring); }\n.esdy-island.mini:not(.open) { width: 52px; }\n.esdy-island { transition: width .5s var(--spring), border-radius .5s var(--spring), transform .35s ease, opacity .25s; }\n.esdy-island.away:not(.open) { transform: translateY(-160%); opacity: 0; pointer-events: none; }\n.esdy-island.mini:not(.open) .esdy-island-btn { padding: 0; justify-content: center; }\n.esdy-island.mini:not(.open) :is(.esdy-island-name, .esdy-hunger) { display: none; } /* mini pill shows only ESDY, no clipped text */\n.esdy-island.open { width: min(360px, calc(100vw - 24px)); border-radius: 26px; }\n.esdy-island-btn { all: unset; box-sizing: border-box; cursor: pointer; display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 14px 0 8px; width: 100%; }\n.esdy-island-btn:focus-visible { outline: 2px solid #7fd6c2; outline-offset: -3px; border-radius: 22px; }\n.esdy-island-btn canvas { width: 31px; height: 26px; image-rendering: pixelated; flex: none; transition: transform .12s ease-out; } /* 24\u00d720 sprite grid, same height as before */\n.esdy-island-name { font: 600 13px var(--font-ui); flex: 1; }\n.esdy-hunger { display: flex; gap: 2px; }\n.esdy-hunger i { width: 6px; height: 10px; border-radius: 2px; background: #3a3a40; }\n.esdy-hunger i.on { background: #ffb347; }\n.esdy-hunger.low i.on { background: #ff6b6b; }\n.esdy-island-panel { display: grid; gap: 12px; padding: 0 14px; max-height: 0; opacity: 0; overflow: hidden; visibility: hidden; transition: max-height .5s var(--spring), opacity .25s, padding .3s, visibility 0s .5s; }\n.esdy-island.open .esdy-island-panel { max-height: min(460px, calc(100dvh - 80px)); overflow-y: auto; opacity: 1; padding: 4px 14px 14px; visibility: visible; transition: max-height .5s var(--spring), opacity .25s, padding .3s; }\n.esdy-ip-label { font: 500 10.5px var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: #9a9aa3; }\n.esdy-cat-picks { display: grid; gap: 8px; margin-top: 6px; }\n.esdy-cat-breed { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }\n.esdy-cat-breed > span { font-size: 11.5px; color: #b4b4bc; width: 100%; }\n.esdy-cat-pick { all: unset; box-sizing: border-box; cursor: pointer; width: 44px; height: 44px; border-radius: 12px; background: #1c1c21; display: grid; place-items: center; border: 2px solid transparent; transition: transform .2s var(--spring), background .2s; }\n.esdy-cat-pick canvas { width: 36px; height: 36px; image-rendering: pixelated; }\n.esdy-cat-pick:hover { transform: translateY(-2px); background: #2a2a31; }\n.esdy-cat-pick[aria-pressed=\"true\"] { border-color: #7fd6c2; background: #24302d; }\n.esdy-cat-pick:focus-visible { outline: 2px solid #7fd6c2; outline-offset: 2px; }\n.esdy-ip-acts { display: flex; gap: 8px; flex-wrap: wrap; }\n.esdy-ip-acts button { all: unset; box-sizing: border-box; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 12px; border-radius: 12px; background: #1c1c21; color: #f5f5f7; font: 500 13px var(--font-ui); transition: transform .2s var(--spring), background .2s; }\n.esdy-ip-acts button:hover { background: #2a2a31; transform: translateY(-1px); }\n.esdy-ip-acts button:active { transform: scale(.94); }\n.esdy-ip-acts button:focus-visible { outline: 2px solid #7fd6c2; }\n.esdy-ip-acts svg { width: 16px; height: 16px; }\n.esdy-ip-stat { font-size: 12px; color: #b4b4bc; }\n\n/* cat lane: the cat roams the full width of the dashboard */\n/* The cat lives on its own fixed overlay that never takes clicks, so no component moves or loses a click. */\n.esdy-cat-world { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 45; }\n#esdy-cat-canvas { position: absolute; left: 0; top: 0; width: 48px; height: 40px; /* = CAT_W \u00d7 CAT_H; a mismatch squashes the sprite */ image-rendering: pixelated; will-change: transform; }\n.esdy-cat-food { position: absolute; left: 0; top: 0; width: 11px; height: 5px; border-radius: 1px; background: #5aa9e6; box-shadow: inset 2px 1px 0 -1px #1e3a52; }\n.esdy-cat-food::after { content: \"\"; position: absolute; left: 10px; top: -1px; width: 3px; height: 7px; background: #5aa9e6; }\n.esdy-cat-ball { position: absolute; left: 0; top: 0; width: 10px; height: 10px; background: linear-gradient(#ff5c5c 0 40%, #fff 40% 60%, #ff5c5c 60%); }\n.esdy-cat-fx { position: absolute; pointer-events: none; font: 600 12px var(--font-ui); white-space: nowrap; }\n.esdy-cat-bubble { white-space: normal; width: max-content; max-width: min(220px, calc(100vw - 24px)); text-align: center; line-height: 1.35; transform-origin: 50% 100%; box-shadow: 0 8px 20px -12px rgba(0,0,0,.4); }\n.esdy-cat-bubble small { display: block; font: 600 9.5px var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--accent); margin-bottom: 1px; }\n.esdy-cat-bubble { background: var(--card); color: var(--fg); border: 1px solid var(--line); padding: 3px 8px; border-radius: 10px; animation: esdy-bubble 1.8s ease forwards; }\n.esdy-cat-bubble::after { content: \"\"; position: absolute; left: calc(50% + var(--tx, 0px)); bottom: -5px; width: 8px; height: 8px; margin-left: -4px; background: inherit; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); transform: rotate(45deg); } /* tail points at ESDY */\n.esdy-cat-heart { color: #ff5c8a; font-size: 16px; animation: esdy-heart 1.1s ease-out forwards; }\n.esdy-cat-z { color: var(--muted); font-size: 13px; animation: esdy-zz 2.2s ease-out forwards; }\n/* fxPlace sets the bubble's real position; the animation only adds a small rise, so a frame without it never shifts the bubble */\n@keyframes esdy-bubble { 0% { opacity: 0; transform: translateY(6px) scale(.85); } 8% { opacity: 1; transform: none; } 90% { opacity: 1; transform: none; } 100% { opacity: 0; transform: translateY(-6px); } }\n@keyframes esdy-heart { from { opacity: 1; transform: translate(0, 0) scale(.6); } to { opacity: 0; transform: translate(var(--dx, 0), -38px) scale(1.2); } }\n@keyframes esdy-zz { from { opacity: 0; transform: translate(0, 0); } 20% { opacity: 1; } to { opacity: 0; transform: translate(14px, -30px); } }\n@media (hover: none) { .esdy-cat-pick:hover, .esdy-ip-acts button:hover { transform: none; } }\n";
const CONTEXT = [["capabilities", "Android and iOS, one codebase for both."], ["projects", "These are real products Iqbal has tested."], ["about", "5 years in QA, since Dec 2021."],["contact", "Wanna talk? Email or LinkedIn, either works."]];
window.mountBugyy = function mountBugyy(opts) {
  opts = opts || {};
  if (document.getElementById('esdy-cat-world')) return function () {};
  const NAME = opts.name || 'Bugyy';
  const STORAGE_KEY = opts.storageKey || 'bugyy-cat-v1';
  // lifecycle: every listener, timer, frame and observer is tracked so destroy() leaves nothing behind
  const offs = [], ivs = [], tos = new Set(), mos = []; let raf = 0, dead = false;
  const on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); offs.push(() => t.removeEventListener(ev, fn, o)); };
  const addEventListener = (ev, fn, o) => on(window, ev, fn, o);
  const docOn = (ev, fn, o) => on(document, ev, fn, o);
  const setInterval = (f, ms) => { const id = window.setInterval(f, ms); ivs.push(id); return id; };
  const setTimeout = (f, ms) => { const id = window.setTimeout(() => { tos.delete(id); f(); }, ms); tos.add(id); return id; };
  const requestAnimationFrame = (f) => (dead ? 0 : (raf = window.requestAnimationFrame(f)));
  class MutationObserver extends window.MutationObserver { constructor(cb) { super(cb); mos.push(this); } }

  const style = document.createElement('style'); style.id = 'esdy-style'; style.textContent = CSS; document.head.append(style);
  const holder = document.createElement('div');
  holder.innerHTML = `<div class="esdy-cat-world" id="esdy-cat-world" aria-hidden="true"><canvas id="esdy-cat-canvas" width="44" height="28" hidden></canvas><div class="esdy-cat-food" id="esdy-cat-food" hidden></div><div class="esdy-cat-ball" id="esdy-cat-ball" hidden></div></div>`; const worldEl = holder.firstElementChild; document.body.append(worldEl);

const $ = (id) => document.getElementById('esdy-' + id);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; if (tag === 'input') n.enterKeyHint = 'done'; return n; };
function store(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
function load(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
function icon(name) {
  const NS = 'http://www.w3.org/2000/svg'; const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('width', '20'); svg.setAttribute('height', '20');
  svg.innerHTML = ICONS[name] || ''; return svg;
}
const ICONS = {
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  fish: '<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 3.54 7 6-.94 2.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M18 12v.01M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/>',
  ball: '<circle cx="12" cy="12" r="9"/><path d="M12 3a15 15 0 0 1 0 18M3.5 9h17M3.5 15h17"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  'eye-off': '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20"/>',
  smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
};

// ---------- pixel cat: roams the lane under the header; controls live in the dynamic island ----------
// ---------- ESDY sprite: front-facing sitting pixel cat, one base shape per breed, colours per variant ----------
// Codes: o outline, a ear fur, r inner ear, c face, s stripe/patch, e left eye, E right eye, n nose, w whisker,
//        m muzzle/chest, b body, f paws, t tail, q tail stripe, k closed eye.
const CAT_BASE = [
  '....o.......o.......',
  '...oao.....oao......',
  '..oaraoooooarao.....',
  '..oarcccccccrao.....',
  '..occcscscsccco.....',
  '..occecccccEcco.....',
  '..occecccccEcco.....',
  'wwoccccmnmccccoww...',
  '.wocccmmmmmcccow....',
  'w..occccmcccco..w...',
  '...obbbmmmbbbo..o...',
  '...obsbmmmbsbo.oto..',
  '..obbbbmmmbbbbooto..',
  '..obsbbmmmbbsbotto..',
  '..obbobbmbbobboqqo..',
  '..obbobbobbobbotto..',
  '..obsobbobbosboqqo..',
  '..obbobbobbobbotto..',
  '..obboffoffobbtoo...',
  '...oooooooooooo.....',
];
// Each breed is its own drawing on the same 20×20 grid; sway = first tail row that leans on odd frames.
const CAT_BREEDS = {
  kampung: { name: 'Kampung', rows: CAT_BASE },
  // Round head, small rounded ears, full cheeks.
  bsh: { name: 'British Shorthair', rows: [
    '....................',
    '...ooo.....ooo......',
    '..oaraoooooarao.....',
    '..oarcccccccrao.....',
    '..occcscscsccco.....',
    '..occecccccEcco.....',
    '.occcecccccEccco....',
    'wocccccmnmcccccow...',
    '..occcmmmmmccco.....',
    'w..occccmcccco..w...',
    '...obbbmmmbbbo..o...',
    '...obsbmmmbsbo.oto..',
    '..obbbbmmmbbbbooto..',
    '..obsbbmmmbbsbotto..',
    '..obbobbmbbobboqqo..',
    '..obbobbobbobbotto..',
    '..obsobbobbosboqqo..',
    '..obbobbobbobbotto..',
    '..obboffoffobbtoo...',
    '...oooooooooooo.....',
  ] },
  // Long fur: fluffy cheek ruff and a thick tail.
  anggora: { name: 'Anggora', rows: [
    '....o.......o.......',
    '...oao.....oao......',
    '..oaraoooooarao.....',
    '..oarcccccccrao.....',
    '..occcscscsccco.....',
    '..occecccccEcco.....',
    '..occecccccEcco.....',
    'w.occccmnmcccco.w...',
    '.occccmmmmmcccco....',
    'w.occcccmccccco.w...',
    '...obbbmmmbbbo..oo..',
    '...obsbmmmbsbo.otto.',
    '..obbbbmmmbbbbootto.',
    '..obsbbmmmbbsbottto.',
    '..obbobbmbbobboqqqo.',
    '..obbobbobbobbottto.',
    '..obsobbobbosboqqqo.',
    '..obbobbobbobbottto.',
    '..obboffoffobbttoo..',
    '...ooooooooooooo....',
  ] },
  // Short legs: same cat, sits two pixels lower.
  munchkin: { name: 'Munchkin', sway: 12, rows: [
    '....................',
    '....................',
    '....o.......o.......',
    '...oao.....oao......',
    '..oaraoooooarao.....',
    '..oarcccccccrao.....',
    '..occcscscsccco.....',
    '..occecccccEcco.....',
    '..occecccccEcco.....',
    'wwoccccmnmccccoww...',
    '.wocccmmmmmcccow....',
    'w..occccmcccco..w...',
    '...obbbmmmbbbo..o...',
    '...obsbmmmbsbo.oto..',
    '..obbbbmmmbbbbooto..',
    '..obsbbmmmbbsbotto..',
    '..obbobbmbbobboqqo..',
    '..obbobbobbobbotto..',
    '..obboffoffobbtoo...',
    '...oooooooooooo.....',
  ] },
};
const CAT_COLORS = [
  { id: 'kampung-oranye', breed: 'kampung', name: 'Kampung oranye', b: '#f08a24', s: '#c4570f', m: '#ffc98a', f: '#ffc98a', r: '#ffb3a0', e: '#2b1d14', n: '#ff8f8f', o: '#2b1d14', w: '#5a3a24' },
  { id: 'kampung-hitam', breed: 'kampung', name: 'Kampung hitam', b: '#2f2f35', s: '#222227', m: '#3e3e46', f: '#3e3e46', r: '#5a4a4f', e: '#f2a02a', n: '#5a4a4f', o: '#0d0d10', w: '#9a9aa2' },
  { id: 'kampung-abu', breed: 'kampung', name: 'Kampung abu dada putih', b: '#8d9097', s: '#5b5e66', m: '#f7f7f7', f: '#f7f7f7', r: '#f2b8a8', e: '#1a1a1a', n: '#f2a0a0', o: '#26262a', w: '#26262a' },
  { id: 'kampung-calico', breed: 'kampung', name: 'Kampung calico', b: '#f6f1e7', s: '#2f2f35', a: '#e07a2a', c: '#f6f1e7', t: '#e07a2a', q: '#2f2f35', m: '#ffffff', f: '#ffffff', r: '#ffb3a0', e: '#2b1d14', n: '#ff9aa0', o: '#3a2a20', w: '#3a2a20' },
  { id: 'kampung-putih', breed: 'kampung', name: 'Kampung putih', b: '#f7f5f0', s: '#f7f5f0', m: '#ffffff', f: '#ffffff', r: '#ffc4cc', e: '#3a6fd8', n: '#ffadb8', o: '#4a4238', w: '#8a8076' },
  { id: 'bsh-blue', breed: 'bsh', name: 'British Shorthair blue', b: '#7f8b99', s: '#7f8b99', m: '#97a3b0', f: '#97a3b0', r: '#c9a3a3', e: '#e88a1a', n: '#6a5a64', o: '#2b3038', w: '#c8ced6' },
  { id: 'bsh-lilac', breed: 'bsh', name: 'British Shorthair lilac', b: '#b9aaab', s: '#b9aaab', m: '#cdbfbf', f: '#cdbfbf', r: '#e3b5b5', e: '#e88a1a', n: '#9a7f86', o: '#4a3f42', w: '#efe6e6' },
  { id: 'anggora-putih', breed: 'anggora', name: 'Anggora putih (mata beda warna)', b: '#fbfaf6', s: '#fbfaf6', m: '#ffffff', f: '#ffffff', r: '#ffc4cc', e: '#3a8ff0', E: '#e8b020', n: '#ffadb8', o: '#6b6358', w: '#9a9086' },
  { id: 'anggora-krem', breed: 'anggora', name: 'Anggora krem', b: '#f3dcb4', s: '#e8c890', m: '#fbf0dc', f: '#fbf0dc', r: '#ffc4cc', e: '#3a8ff0', n: '#f0a0a8', o: '#6b5440', w: '#8a7058' },
  { id: 'munchkin-krem', breed: 'munchkin', name: 'Munchkin krem', b: '#e9c38f', s: '#d19a5c', m: '#f8e6c8', f: '#f8e6c8', r: '#ffb8a8', e: '#2b1d14', n: '#f08f8f', o: '#4a3020', w: '#6a4a30' },
  { id: 'munchkin-tabby', breed: 'munchkin', name: 'Munchkin tabby cokelat', b: '#9a6b45', s: '#5e3d24', m: '#d9b48c', f: '#d9b48c', r: '#e8a898', e: '#5c8a2a', n: '#d08080', o: '#2a1a10', w: '#3a2a1a' },
];
const OLD_COLOR = { oranye: 'kampung-oranye', abu: 'kampung-abu', hitam: 'kampung-hitam', putih: 'kampung-putih', belang: 'kampung-calico', ungu: 'kampung-oranye', mint: 'kampung-oranye' };
const CAT_KEY = STORAGE_KEY;
const catSaved = load(CAT_KEY) || {};
const catState = { color: OLD_COLOR[catSaved.color] || catSaved.color || 'kampung-oranye', hunger: typeof catSaved.hunger === 'number' ? catSaved.hunger : 80, at: catSaved.at || Date.now(), hidden: !!catSaved.hidden, pets: catSaved.pets || 0, meals: catSaved.meals || 0 };
catState.color = CAT_COLORS.some((c) => c.id === opts.color) ? opts.color : 'kampung-abu'; catState.hidden = false; // grey by default; no picker or show/hide without the island
const hungerNow = () => 100; // no island to feed from, so the cat never gets hungry
function saveCat() { catState.hunger = hungerNow(); catState.at = Date.now(); store(CAT_KEY, { ...catState }); }
// Missing codes fall back to the body/face colours, so a variant only lists what differs.
const mixHex = (a, b, t) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, '0')).join('');
// d/g = far-side legs and paws in side view: the body/paw colour pulled a little toward the outline.
const hexLum = (h) => [1, 3, 5].reduce((s, i, j) => s + parseInt(h.slice(i, i + 2), 16) / 255 * [.2126, .7152, .0722][j], 0);
// k = face lines (mouth, closed eyes): outline colour, but lighter on dark coats so the expression stays visible.
function variantPal(v) { const face = v.c || v.b; return { ...v, a: v.a || v.b, c: face, t: v.t || v.b, q: v.q || v.s, E: v.E || v.e, k: hexLum(face) < .3 ? mixHex(v.w, '#ffffff', .2) : v.o, d: mixHex(v.b, v.o, .2), g: mixHex(v.f, v.o, .16) }; }
const palette = (id = catState.color) => variantPal(CAT_COLORS.find((x) => x.id === id) || CAT_COLORS[0]);

// ---- poses. Front (facing the screen) comes from CAT_BREEDS; side poses face right and are mirrored for left.
// Side codes add d/g (far legs/paws). Encoded "skip:row|row…": empty top rows skipped, trailing dots trimmed.
const CAT_SIDE = {
  kampung: {
    stand: '2:...............o...o|..............oao.oao|..............oaroorao|....oo.......occcccccco|...oqqo......occcecceco|..otto.......occcecceco|..oqqo.......occcccmmno|..otto..ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooddbbo|.....obbddo.oddbbo|.....obbddo.oddbbo|.....offggo.oggffo|......oooo...oooo',
    standB: '2:...............o...o|..............oao.oao|..............oaroorao|...oo........occcccccco|..oqqo.......occcecceco|.otto........occcecceco|.oqqo........occcccmmno|.otto...ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooddbbo|.....obbddo.oddbbo|.....obbddo.oddbbo|.....offggo.oggffo|......oooo...oooo',
    blink: '2:...............o...o|..............oao.oao|..............oaroorao|....oo.......occcccccco|...oqqo......occcccccco|..otto.......occckcckco|..oqqo.......occcccmmno|..otto..ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooddbbo|.....obbddo.oddbbo|.....obbddo.oddbbo|.....offggo.oggffo|......oooo...oooo',
    happy: '2:...............o...o|..............oao.oao|..............oaroorao|....oo.......occcccccco|...oqqo......occckcckco|..otto.......occkckkcko|..oqqo.......occcccmmno|..otto..ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooddbbo|.....obbddo.oddbbo|.....obbddo.oddbbo|.....offggo.oggffo|......oooo...oooo',
    walk0: '2:...............o...o|..............oao.oao|..............oaroorao|....oo.......occcccccco|...oqqo......occcecceco|..otto.......occcecceco|..oqqo.......occcccmmno|..otto..ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbboo|....obboddoooddobbo|....obboddo.oddobbo|....obboggo.oggobbo|....offooo...oooffo|.....oo.........oo',
    walk1: '2:...............o...o|..............oao.oao|..............oaroorao|...oo........occcccccco|..oqqo.......occcecceco|.otto........occcecceco|.oqqo........occcccmmno|.otto...ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooodbbo|.....obbddo..odbbo|.....offddo..odffo|......ooggo..oggo|........oo....oo',
    walk2: '2:...............o...o|..............oao.oao|..............oaroorao|....oo.......occcccccco|...oqqo......occcecceco|..otto.......occcecceco|..oqqo.......occcccmmno|..otto..ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....odbbooooobbdo|.....odbbo...obbdo|.....ogbbo...obbgo|......offo...offo|.......oo.....oo',
    walk3: '2:...............o...o|..............oao.oao|..............oaroorao|...oo........occcccccco|..oqqo.......occcecceco|.otto........occcecceco|.oqqo........occcccmmno|.otto...ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbdooooodbbo|.....obbdo...odbbo|.....offdo...odffo|......oggo...oggo|.......oo.....oo',
    crouch: '5:...............o...o|..............oao.oao|..............oaroorao|.............occcccccco|.............occcecceco|.............occcecceco|........oooooocccccmmno|......oobsbsbsbcccmmmo|...ooobbbbbbbbbmmoooo|.ooqqbbbbbbbbbbmmo|oqqtobbbbbbbbbbmmo|ttoo.obmmmmmmmbbo|oo...obbddoooddbbo|.....offggo.oggffo|......oooo...oooo',
    leap: '1:................o...o|...............oao.oao|...............oaroorao|..............occcccccco|..............occcecceco|..............occcecceco|........ooooooocccccmmno|ooo...oobsbsbsbbcccmmmo|qqtooobbbbbbbbbbmmoooo|ooqqtbbbbbbbbbbbmmo|..ooobbbbbbbbbbbmbbooo|....oobmmmmmmmmbbbbbbfo|...oddbbooooooooooobbfo|..oddbbo...........ooo|.oggffo|..oooo',
    fall: '2:...............o...o|..............oao.oao|..............oaroorao|...oo........occcccccco|..otto.......occcecceco|.oqqo........occcecceco|.otto........occcccmmno|..oqqo..ooooooocccmmmo|...ottoobsbsbsboooooo|....oobbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|......obbddooddbbo|......offggooddbbo|.......oooo..oggbbo|..............ooffo|................oo',
    sleep0: '9:...............o....o|..............oao..oao|......ooooooooaraooarao|.....obbsbsbsocccccccco|....obbbbbbbbocccccccco|...obbbbbbbbbockkcckkco|...obbbbbbbbbocccmnmcco|...obbbbbbbbbffcmmmmcfo|...otqtqtqtqtqtqtqtqto|....oqtqtqooooooooooo|.....ooooo',
    sleep1: '9:...............o....o|..............oao..oao|.............oaraooarao|.....ooooooooocccccccco|....obbbbbbbbocccccccco|...obbbbbbbbbockkcckkco|...obbbbbbbbbocccmnmcco|...obbbbbbbbbffcmmmmcfo|...otqtqtqtqtqtqtqtqto|....oqtqtqooooooooooo|.....ooooo',
    eat0: '7:....oo..........o...o|...oqqo........oao.oao|..otto.........oaroorao|..oqqo........occcccccco|..otto..ooooooocccccccco|..oqqooobsbsbsbccckcckco|...ottbbbbbbbbbcccccmmno|....obbbbbbbbbbmcccmmmo|....obbbbbbbbbbmmooooo|.....obmmmmmmmbbo|.....obbddoooddbbo|.....offggo.oggffo|......oooo...oooo',
    eat1: '7:...oo|..oqqo..........o...o|.otto..........oao.oao|.oqqo..........oaroorao|.otto...ooooooocccccccco|..oqqooobsbsbsbcccccccco|...ottbbbbbbbbbccckcckco|....obbbbbbbbbbcccccmmno|....obbbbbbbbbbmcccmmmo|.....obmmmmmmmbboooooo|.....obbddoooddbbo|.....offggo.oggffo|......oooo...oooo',
  },
  bsh: {
    stand: '3:...............oo..oo|..............oaroorao|....oo.......occcccccco|...oqqo.....occccecceco|..otto......occccecceco|..oqqo......occccccmmno|..otto..ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooddbbo|.....obbddo.oddbbo|.....obbddo.oddbbo|.....offggo.oggffo|......oooo...oooo',
    standB: '3:...............oo..oo|..............oaroorao|...oo........occcccccco|..oqqo......occccecceco|.otto.......occccecceco|.oqqo.......occccccmmno|.otto...ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooddbbo|.....obbddo.oddbbo|.....obbddo.oddbbo|.....offggo.oggffo|......oooo...oooo',
    blink: '3:...............oo..oo|..............oaroorao|....oo.......occcccccco|...oqqo.....occccccccco|..otto......occcckcckco|..oqqo......occccccmmno|..otto..ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooddbbo|.....obbddo.oddbbo|.....obbddo.oddbbo|.....offggo.oggffo|......oooo...oooo',
    happy: '3:...............oo..oo|..............oaroorao|....oo.......occcccccco|...oqqo.....occcckcckco|..otto......occckckkcko|..oqqo......occccccmmno|..otto..ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooddbbo|.....obbddo.oddbbo|.....obbddo.oddbbo|.....offggo.oggffo|......oooo...oooo',
    walk0: '3:...............oo..oo|..............oaroorao|....oo.......occcccccco|...oqqo.....occccecceco|..otto......occccecceco|..oqqo......occccccmmno|..otto..ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbboo|....obboddoooddobbo|....obboddo.oddobbo|....obboggo.oggobbo|....offooo...oooffo|.....oo.........oo',
    walk1: '3:...............oo..oo|..............oaroorao|...oo........occcccccco|..oqqo......occccecceco|.otto.......occccecceco|.oqqo.......occccccmmno|.otto...ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooodbbo|.....obbddo..odbbo|.....offddo..odffo|......ooggo..oggo|........oo....oo',
    walk2: '3:...............oo..oo|..............oaroorao|....oo.......occcccccco|...oqqo.....occccecceco|..otto......occccecceco|..oqqo......occccccmmno|..otto..ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....odbbooooobbdo|.....odbbo...obbdo|.....ogbbo...obbgo|......offo...offo|.......oo.....oo',
    walk3: '3:...............oo..oo|..............oaroorao|...oo........occcccccco|..oqqo......occccecceco|.otto.......occccecceco|.oqqo.......occccccmmno|.otto...ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbdooooodbbo|.....obbdo...odbbo|.....offdo...odffo|......oggo...oggo|.......oo.....oo',
    crouch: '6:...............oo..oo|..............oaroorao|.............occcccccco|............occccecceco|............occccecceco|........oooooccccccmmno|......oobsbsbsbcccmmmo|...ooobbbbbbbbbmmoooo|.ooqqbbbbbbbbbbmmo|oqqtobbbbbbbbbbmmo|ttoo.obmmmmmmmbbo|oo...obbddoooddbbo|.....offggo.oggffo|......oooo...oooo',
    leap: '2:................oo..oo|...............oaroorao|..............occcccccco|.............occccecceco|.............occccecceco|........ooooooccccccmmno|ooo...oobsbsbsbbcccmmmo|qqtooobbbbbbbbbbmmoooo|ooqqtbbbbbbbbbbbmmo|..ooobbbbbbbbbbbmbbooo|....oobmmmmmmmmbbbbbbfo|...oddbbooooooooooobbfo|..oddbbo...........ooo|.oggffo|..oooo',
    fall: '3:...............oo..oo|..............oaroorao|...oo........occcccccco|..otto......occccecceco|.oqqo.......occccecceco|.otto.......occccccmmno|..oqqo..ooooooocccmmmo|...ottoobsbsbsboooooo|....oobbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|......obbddooddbbo|......offggooddbbo|.......oooo..oggbbo|..............ooffo|................oo',
    sleep0: '10:..............oo....oo|......ooooooooaaooooaao|.....obbsbsbsocccccccco|....obbbbbbbbocccccccco|...obbbbbbbbbockkcckkco|...obbbbbbbbbocccmnmcco|...obbbbbbbbbffcmmmmcfo|...otqtqtqtqtqtqtqtqto|....oqtqtqooooooooooo|.....ooooo',
    sleep1: '10:..............oo....oo|.............oaaooooaao|.....ooooooooocccccccco|....obbbbbbbbocccccccco|...obbbbbbbbbockkcckkco|...obbbbbbbbbocccmnmcco|...obbbbbbbbbffcmmmmcfo|...otqtqtqtqtqtqtqtqto|....oqtqtqooooooooooo|.....ooooo',
    eat0: '7:....oo|...oqqo.........oo..oo|..otto.........oaroorao|..oqqo........occcccccco|..otto..ooooooccccccccco|..oqqooobsbsbscccckcckco|...ottbbbbbbbbccccccmmno|....obbbbbbbbbbmcccmmmo|....obbbbbbbbbbmmooooo|.....obmmmmmmmbbo|.....obbddoooddbbo|.....offggo.oggffo|......oooo...oooo',
    eat1: '7:...oo|..oqqo|.otto...........oo..oo|.oqqo..........oaroorao|.otto...ooooooocccccccco|..oqqooobsbsbsccccccccco|...ottbbbbbbbbcccckcckco|....obbbbbbbbbccccccmmno|....obbbbbbbbbbmcccmmmo|.....obmmmmmmmbboooooo|.....obbddoooddbbo|.....offggo.oggffo|......oooo...oooo',
  },
  anggora: {
    stand: '2:...............o...o|..............oao.oao|..............oaroorao|...ooo.......occcccccco|..oqqqo......occcecceco|.ottto.......occcecceco|.oqqqo.......occcccmmno|.ottto..ooooooccccmmmo|.oqqqooobsbsbsbcmmooo|..otttbbbbbbbbbmmo|...oobbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooddbbo|.....obbddo.oddbbo|.....obbddo.oddbbo|.....offggo.oggffo|......oooo...oooo',
    standB: '2:...............o...o|..............oao.oao|..............oaroorao|..ooo........occcccccco|.oqqqo.......occcecceco|ottto........occcecceco|oqqqo........occcccmmno|ottto...ooooooccccmmmo|.oqqqooobsbsbsbcmmooo|..otttbbbbbbbbbmmo|...oobbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooddbbo|.....obbddo.oddbbo|.....obbddo.oddbbo|.....offggo.oggffo|......oooo...oooo',
    blink: '2:...............o...o|..............oao.oao|..............oaroorao|...ooo.......occcccccco|..oqqqo......occcccccco|.ottto.......occckcckco|.oqqqo.......occcccmmno|.ottto..ooooooccccmmmo|.oqqqooobsbsbsbcmmooo|..otttbbbbbbbbbmmo|...oobbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooddbbo|.....obbddo.oddbbo|.....obbddo.oddbbo|.....offggo.oggffo|......oooo...oooo',
    happy: '2:...............o...o|..............oao.oao|..............oaroorao|...ooo.......occcccccco|..oqqqo......occckcckco|.ottto.......occkckkcko|.oqqqo.......occcccmmno|.ottto..ooooooccccmmmo|.oqqqooobsbsbsbcmmooo|..otttbbbbbbbbbmmo|...oobbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooddbbo|.....obbddo.oddbbo|.....obbddo.oddbbo|.....offggo.oggffo|......oooo...oooo',
    walk0: '2:...............o...o|..............oao.oao|..............oaroorao|...ooo.......occcccccco|..oqqqo......occcecceco|.ottto.......occcecceco|.oqqqo.......occcccmmno|.ottto..ooooooccccmmmo|.oqqqooobsbsbsbcmmooo|..otttbbbbbbbbbmmo|...oobbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbboo|....obboddoooddobbo|....obboddo.oddobbo|....obboggo.oggobbo|....offooo...oooffo|.....oo.........oo',
    walk1: '2:...............o...o|..............oao.oao|..............oaroorao|..ooo........occcccccco|.oqqqo.......occcecceco|ottto........occcecceco|oqqqo........occcccmmno|ottto...ooooooccccmmmo|.oqqqooobsbsbsbcmmooo|..otttbbbbbbbbbmmo|...oobbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooodbbo|.....obbddo..odbbo|.....offddo..odffo|......ooggo..oggo|........oo....oo',
    walk2: '2:...............o...o|..............oao.oao|..............oaroorao|...ooo.......occcccccco|..oqqqo......occcecceco|.ottto.......occcecceco|.oqqqo.......occcccmmno|.ottto..ooooooccccmmmo|.oqqqooobsbsbsbcmmooo|..otttbbbbbbbbbmmo|...oobbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....odbbooooobbdo|.....odbbo...obbdo|.....ogbbo...obbgo|......offo...offo|.......oo.....oo',
    walk3: '2:...............o...o|..............oao.oao|..............oaroorao|..ooo........occcccccco|.oqqqo.......occcecceco|ottto........occcecceco|oqqqo........occcccmmno|ottto...ooooooccccmmmo|.oqqqooobsbsbsbcmmooo|..otttbbbbbbbbbmmo|...oobbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbdooooodbbo|.....obbdo...odbbo|.....offdo...odffo|......oggo...oggo|.......oo.....oo',
    crouch: '5:...............o...o|..............oao.oao|..............oaroorao|.............occcccccco|.............occcecceco|.............occcecceco|........oooooocccccmmno|......oobsbsbsccccmmmo|..oooobbbbbbbbbcmmooo|ooqqqbbbbbbbbbbmmo|qqqtobbbbbbbbbbmmo|ttoo.obmmmmmmmbbo|oo...obbddoooddbbo|.....offggo.oggffo|......oooo...oooo',
    leap: '1:................o...o|...............oao.oao|...............oaroorao|..............occcccccco|..............occcecceco|..............occcecceco|........ooooooocccccmmno|ooo...oobsbsbsbccccmmmo|qqtooobbbbbbbbbbcmmooo|oqqqtbbbbbbbbbbbmmo|.oooobbbbbbbbbbbmbbooo|....oobmmmmmmmmbbbbbbfo|...oddbbooooooooooobbfo|..oddbbo...........ooo|.oggffo|..oooo',
    fall: '2:...............o...o|..............oao.oao|..............oaroorao|..ooo........occcccccco|.ottto.......occcecceco|oqqqo........occcecceco|ottto........occcccmmno|.oqqqo..ooooooccccmmmo|..otttoobsbsbsbcmmooo|...ooobbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|......obbddooddbbo|......offggooddbbo|.......oooo..oggbbo|..............ooffo|................oo',
    sleep0: '9:...............o....o|..............oao..oao|......ooooooooaraooarao|.....obbsbsbsocccccccco|....obbbbbbbbocccccccco|...obbbbbbbbbockkcckkco|...obbbbbbbbbccccmnmcco|...obbbbbbbbbcfcmmmmcfo|...otqtqtqtqtqtqtqtqto|....oqtqtqooooooooooo|.....ooooo',
    sleep1: '9:...............o....o|..............oao..oao|.............oaraooarao|.....ooooooooocccccccco|....obbbbbbbbocccccccco|...obbbbbbbbbockkcckkco|...obbbbbbbbbccccmnmcco|...obbbbbbbbbcfcmmmmcfo|...otqtqtqtqtqtqtqtqto|....oqtqtqooooooooooo|.....ooooo',
    eat0: '7:...ooo..........o...o|..oqqqo........oao.oao|.ottto.........oaroorao|.oqqqo........occcccccco|.ottto..ooooooocccccccco|.oqqqooobsbsbsbccckcckco|..otttbbbbbbbbbcccccmmno|...oobbbbbbbbbbccccmmmo|....obbbbbbbbbbmcmmooo|.....obmmmmmmmbbooo|.....obbddoooddbbo|.....offggo.oggffo|......oooo...oooo',
    eat1: '7:..ooo|.oqqqo..........o...o|ottto..........oao.oao|oqqqo..........oaroorao|ottto...ooooooocccccccco|.oqqqooobsbsbsbcccccccco|..otttbbbbbbbbbccckcckco|...oobbbbbbbbbbcccccmmno|....obbbbbbbbbbccccmmmo|.....obmmmmmmmbbcmmooo|.....obbddoooddbboo|.....offggo.oggffo|......oooo...oooo',
  },
  munchkin: {
    stand: '4:...............o...o|..............oao.oao|..............oaroorao|....oo.......occcccccco|...oqqo......occcecceco|..otto.......occcecceco|..oqqo.......occcccmmno|..otto..ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooddbbo|.....offggo.oggffo|......oooo...oooo',
    standB: '4:...............o...o|..............oao.oao|..............oaroorao|...oo........occcccccco|..oqqo.......occcecceco|.otto........occcecceco|.oqqo........occcccmmno|.otto...ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooddbbo|.....offggo.oggffo|......oooo...oooo',
    blink: '4:...............o...o|..............oao.oao|..............oaroorao|....oo.......occcccccco|...oqqo......occcccccco|..otto.......occckcckco|..oqqo.......occcccmmno|..otto..ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooddbbo|.....offggo.oggffo|......oooo...oooo',
    happy: '4:...............o...o|..............oao.oao|..............oaroorao|....oo.......occcccccco|...oqqo......occckcckco|..otto.......occkckkcko|..oqqo.......occcccmmno|..otto..ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....obbddoooddbbo|.....offggo.oggffo|......oooo...oooo',
    walk0: '4:...............o...o|..............oao.oao|..............oaroorao|....oo.......occcccccco|...oqqo......occcecceco|..otto.......occcecceco|..oqqo.......occcccmmno|..otto..ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbboo|....obboggoooggobbo|....offooo...oooffo|.....oo.........oo',
    walk1: '4:...............o...o|..............oao.oao|..............oaroorao|...oo........occcccccco|..oqqo.......occcecceco|.otto........occcecceco|.oqqo........occcccmmno|.otto...ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....offddoooodffo|......ooggo..oggo|........oo....oo',
    walk2: '4:...............o...o|..............oao.oao|..............oaroorao|....oo.......occcccccco|...oqqo......occcecceco|..otto.......occcecceco|..oqqo.......occcccmmno|..otto..ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....ogbbooooobbgo|......offo...offo|.......oo.....oo',
    walk3: '4:...............o...o|..............oao.oao|..............oaroorao|...oo........occcccccco|..oqqo.......occcecceco|.otto........occcecceco|.oqqo........occcccmmno|.otto...ooooooocccmmmo|..oqqooobsbsbsboooooo|...ottbbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|.....offdooooodffo|......oggo...oggo|.......oo.....oo',
    crouch: '6:...............o...o|..............oao.oao|..............oaroorao|.............occcccccco|.............occcecceco|.............occcecceco|........oooooocccccmmno|......oobsbsbsbcccmmmo|...ooobbbbbbbbbmmoooo|.ooqqbbbbbbbbbbmmo|oqqtobbbbbbbbbbmmo|ttoo.obmmmmmmmbbo|oo...offggoooggffo|......oooo...oooo',
    leap: '1:................o...o|...............oao.oao|...............oaroorao|..............occcccccco|..............occcecceco|..............occcecceco|........ooooooocccccmmno|ooo...oobsbsbsbbcccmmmo|qqtooobbbbbbbbbbmmoooo|ooqqtbbbbbbbbbbbmmo|..ooobbbbbbbbbbbmbbooo|....oobmmmmmmmmbbbbbbfo|...oddbbooooooooooobbfo|..oddbbo...........ooo|.oggffo|..oooo',
    fall: '2:...............o...o|..............oao.oao|..............oaroorao|...oo........occcccccco|..otto.......occcecceco|.oqqo........occcecceco|.otto........occcccmmno|..oqqo..ooooooocccmmmo|...ottoobsbsbsboooooo|....oobbbbbbbbbmmo|....obbbbbbbbbbmmo|....obbbbbbbbbbmmo|.....obmmmmmmmbbo|......obbddooddbbo|......offggooddbbo|.......oooo..oggbbo|..............ooffo|................oo',
    sleep0: '9:...............o....o|..............oao..oao|......ooooooooaraooarao|.....obbsbsbsocccccccco|....obbbbbbbbocccccccco|...obbbbbbbbbockkcckkco|...obbbbbbbbbocccmnmcco|...obbbbbbbbbffcmmmmcfo|...otqtqtqtqtqtqtqtqto|....oqtqtqooooooooooo|.....ooooo',
    sleep1: '9:...............o....o|..............oao..oao|.............oaraooarao|.....ooooooooocccccccco|....obbbbbbbbocccccccco|...obbbbbbbbbockkcckkco|...obbbbbbbbbocccmnmcco|...obbbbbbbbbffcmmmmcfo|...otqtqtqtqtqtqtqtqto|....oqtqtqooooooooooo|.....ooooo',
    eat0: '8:....oo..........o...o|...oqqo........oao.oao|..otto.........oaroorao|..oqqo........occcccccco|..otto..ooooooocccccccco|..oqqooobsbsbsbccckcckco|...ottbbbbbbbbbcccccmmno|....obbbbbbbbbbmcccmmmo|....obbbbbbbbbbmmooooo|.....obmmmmmmmbbo|.....offggoooggffo|......oooo...oooo',
    eat1: '8:...oo|..oqqo..........o...o|.otto..........oao.oao|.oqqo..........oaroorao|.otto...ooooooocccccccco|..oqqooobsbsbsbcccccccco|...ottbbbbbbbbbccckcckco|....obbbbbbbbbbcccccmmno|....obbbbbbbbbbmcccmmmo|.....obmmmmmmmbboooooo|.....offggoooggffo|......oooo...oooo',
  },
};
const CW = 24, CH = 20, SPRITES = {};
const sideRows = (breed, pose) => { const [n, body] = ((CAT_SIDE[breed] || CAT_SIDE.kampung)[pose] || CAT_SIDE.kampung.stand).split(':'); const rows = Array(+n).fill('').concat(body.split('|')); while (rows.length < CH) rows.push(''); return rows.map((r) => r.padEnd(CW, '.')); };
const frontRows = (breed) => (CAT_BREEDS[breed] || CAT_BREEDS.kampung).rows.map((r) => ('..' + r + '..').slice(0, CW));
// Face expressions for the front pose, placed relative to the eyes so every breed shares them.
function faceExpr(grid, expr) {
  const y0 = grid.findIndex((r) => r.includes('e')); if (y0 < 0) return;
  const L = grid[y0].indexOf('e'), R = grid[y0].indexOf('E'), cx = (L + R) >> 1;
  const set = (x, y, c) => { if (grid[y] && grid[y][x] && grid[y][x] !== '.') grid[y][x] = c; };
  const mouth = (...pts) => pts.forEach(([dx, dy, c]) => set(cx + dx, y0 + dy, c || 'k'));
  if (expr === 'closed') { [L, R].forEach((x) => { set(x, y0, 'c'); set(x, y0 + 1, 'k'); }); mouth([-1, 3], [1, 3]); }
  else if (expr === 'happy') { [L, R].forEach((x) => { set(x, y0, 'k'); set(x, y0 + 1, 'c'); set(x - 1, y0 + 1, 'k'); set(x + 1, y0 + 1, 'k'); }); set(L - 1, y0 + 2, 'r'); set(R + 1, y0 + 2, 'r'); mouth([-1, 3], [0, 3, 'r'], [1, 3]); }
  else if (expr === 'flat') { [L, R].forEach((x) => set(x, y0, 'k')); mouth([-1, 3], [0, 3], [1, 3]); }
  else if (expr === 'surprised') { set(L + 1, y0, 'e'); set(L + 1, y0 + 1, 'e'); set(R - 1, y0, 'E'); set(R - 1, y0 + 1, 'E'); mouth([0, 3]); }
  else if (expr === 'sad') { set(L - 1, y0 - 1, 'k'); set(R + 1, y0 - 1, 'k'); mouth([0, 3], [-1, 4], [1, 4]); }
  else mouth([-1, 3], [1, 3]); // smile: the ":3" cat mouth under the nose
}
function catSprite(breed, pose, expr) {
  const key = breed + '|' + pose + '|' + expr; if (SPRITES[key]) return SPRITES[key];
  const front = pose === 'front' || pose === 'frontB'; const info = CAT_BREEDS[breed] || CAT_BREEDS.kampung;
  const grid = (front ? frontRows(breed) : sideRows(breed, pose)).map((r) => r.split(''));
  if (front) {
    faceExpr(grid, expr);
    if (pose === 'frontB') { const sw = info.sway || 10; for (let y = sw; y <= sw + 1; y++) { // tail tip leans one pixel outward
      const seg = grid[y].slice(17); for (let x = 17; x < CW; x++) grid[y][x] = '.';
      seg.forEach((ch, i) => { if (ch !== '.' && 18 + i < CW) grid[y][18 + i] = ch; }); } }
  }
  const out = []; grid.forEach((row, y) => row.forEach((ch, x) => { if (ch !== '.') out.push([x, y, ch]); }));
  return (SPRITES[key] = out);
}
function drawCat(ctx, ox, oy, s, pose, expr, dir, pal) {
  for (const [x, y, c] of catSprite(pal.breed, pose, expr)) { ctx.fillStyle = pal[c] || pal.o; ctx.fillRect(ox + (dir > 0 ? x : CW - 1 - x) * s, oy + y * s, s, s); }
}

const reduceCat = opts.ignoreReducedMotion ? { matches: false } : matchMedia('(prefers-reduced-motion: reduce)');
const CS = 2, CAT_W = CW * CS, CAT_H = CH * CS;
// Components the cat may stand on (top edge), and everything it must never cover: text, controls, media, the island, the ticker.
// Only the island and the toast float; everything else scrolls with the page.
const TEXT_PERCH = opts.textPerch || 'h2.display, .odo, .co, .proj-body h3, .edu-card h3, .logos span';
const PERCH_SEL = (opts.perch || '.card, .stack-group, .sim, .ci-art, .ci-card, .portrait, .proj-art, .plan-head, .role.now, .areas li, .btn-dark') + ', ' + TEXT_PERCH;
const BLOCK_SEL = 'a[href], button, input, select, textarea, label, summary, [role="button"], [tabindex]:not([tabindex="-1"]), img, svg, canvas:not(#esdy-cat-canvas), .chip, .sp, .pill, .swatch, .esdy-cat-pick' + (opts.block ? ', ' + opts.block : ', .tag, .badge, .spec, .now-pill, .pass-stamp, .lbl, .stamp, .device, .browser, .mweb, .stat-ico, .saas, .ico');
const INTERACTIVE_SEL = 'a[href], button, input, select, textarea, label, summary, [role="button"], [draggable="true"], [contenteditable]';
const cat = { el: null, ox: 0, range: [0, 0], dir: 1, state: 'idle', target: 0, until: 0, frame: 0, ft: 0, jy: 0, vy: 0, hop: null, lastTouch: performance.now(), food: null, ball: null, nextNag: 0, nextZ: 0, nextCheck: 0, then: null,
  step: 0, walked: 0, mood: null, landUntil: 0, turnUntil: 0, blinkUntil: 0, fx: [] };
// Expression: a short-lived mood from an event wins; otherwise hungry = sad, long ignored = flat, else a small smile.
const setMood = (e, ms) => { cat.mood = { e, until: performance.now() + ms }; };
function catExpr(now) {
  if (cat.mood && now < cat.mood.until) return cat.mood.e;
  if (hungerNow() < 25) return 'sad';
  return now - cat.lastTouch > 120000 ? 'flat' : 'smile';
}
// Turning around shows one front-facing frame, like a real cat swinging its head first.
function face(dir) { if (dir && dir !== cat.dir) { cat.dir = dir; cat.turnUntil = performance.now() + 130; } }
const overlap = (a, b) => a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;

// Text perches stand on the tops of their first line's glyphs, not on the empty line box above them.
const mctx = document.createElement('canvas').getContext('2d'); const metricCache = new Map();
function glyphInset(e, text, boxH) { // px from the top of a line box of height boxH down to the top of its tallest glyph
  const cs = getComputedStyle(e); const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const key = font + '|' + Math.round(boxH) + '|' + text; let v = metricCache.get(key);
  if (v == null) {
    mctx.font = font; const m = mctx.measureText(text || 'H'); const fA = m.fontBoundingBoxAscent, fD = m.fontBoundingBoxDescent;
    v = Math.max(0, (boxH - (fA + fD)) / 2 + fA - m.actualBoundingBoxAscent);
    if (metricCache.size > 3000) metricCache.clear(); metricCache.set(key, v);
  }
  return v;
}
function perchRect(e) {
  if (!e.matches || !e.matches(TEXT_PERCH)) return e.getBoundingClientRect();
  if (e.classList.contains('odo')) { // rolling digits: the box is exactly one line, the hidden digits are clipped
    const r = e.getBoundingClientRect(); const top = r.top + glyphInset(e, e.getAttribute('aria-label') || '0', r.height);
    return { left: r.left, right: r.right, top, bottom: r.bottom, width: r.width, height: r.bottom - top };
  }
  const range = document.createRange(); range.selectNodeContents(e);
  const rs = [...range.getClientRects()].filter((x) => x.width > 1);
  if (!rs.length) return e.getBoundingClientRect();
  const first = rs.reduce((a, b) => (b.top < a.top ? b : a)); const line = rs.filter((x) => Math.abs(x.top - first.top) < 3);
  const left = Math.min(...line.map((x) => x.left)), right = Math.max(...line.map((x) => x.right));
  const top = first.top + glyphInset(e, (e.textContent || '').trim().slice(0, 40), first.height);
  return { left, right, top, bottom: first.bottom, width: right - left, height: first.bottom - top };
}

// On a text perch the cat may only stand where letters reach the perch height (capitals, ascenders):
// a long stretch of short letters ("answers") gets a no-stand zone, so the cat never floats above x-height.
function lowRuns(e) {
  const pr = perchRect(e); if (pr.bottom < -40 || pr.top > innerHeight + 40) return [];
  const fs = parseFloat(getComputedStyle(e).fontSize); const out = []; const range = document.createRange();
  const walker = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); let lineTop = null, a = null, b = null;
  const flush = () => { if (a != null && b - a > 40) out.push({ left: a + 20, right: b - 20, top: pr.top - 30, bottom: pr.top - 2, width: b - a - 40, height: 28 }); a = b = null; };
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    for (let i = 0; i < n.length; i++) {
      range.setStart(n, i); range.setEnd(n, i + 1); const r = range.getBoundingClientRect(); if (!r.width) continue;
      if (lineTop == null) lineTop = r.top; if (Math.abs(r.top - lineTop) > 3) continue; // first line only
      const ch = n.data[i]; const low = !ch.trim() || r.top + glyphInset(n.parentElement, ch, r.height) > pr.top + fs * .1;
      if (low) { if (a == null) a = r.left; b = r.right; } else flush();
    }
  }
  flush(); return out;
}

// No island on this site: the cat drops in from just under the header, centred; perches must sit below that line.
function anchorRect() { const b = opts.below && document.querySelector(opts.below); const y = b ? Math.max(0, b.getBoundingClientRect().bottom) : 0; return { left: innerWidth / 2, right: innerWidth / 2, width: 0, height: 0, top: y, bottom: y }; }
function catBlockers() {
  const vh = innerHeight, vw = innerWidth, out = [];
  const add = (r) => { if (r.width > 0 && r.height > 0 && r.bottom > -40 && r.top < vh + 40 && r.right > 0 && r.left < vw) out.push(r); };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT) });
  const range = document.createRange();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const pe = n.parentElement; if (!pe || pe.closest('script, style, title, #esdy-cat-world, .odo')) continue;
    range.selectNodeContents(n); const txt = n.nodeValue.trim().slice(0, 40);
    for (const r of range.getClientRects()) { const g = glyphInset(pe, txt, r.height); add({ left: r.left, right: r.right, top: r.top + g, bottom: r.bottom, width: r.width, height: r.height - g }); }
  }
  document.querySelectorAll(BLOCK_SEL).forEach((e) => add(e.getBoundingClientRect()));
  document.querySelectorAll('.odo').forEach((e) => add(perchRect(e)));
  document.querySelectorAll(TEXT_PERCH).forEach((e) => { if (!e.classList.contains('odo')) lowRuns(e).forEach(add); });
  ['island'].forEach((id) => { const e = $(id); if (e && !e.hidden) add(e.getBoundingClientRect()); });
  return out;
}
// Free stretches on the top edge of each visible component where the whole cat fits without touching a blocker.
function catFindSpots() {
  const bl = catBlockers(); const vh = innerHeight, vw = innerWidth;
  const minTop = anchorRect().bottom + 4;
  const spots = [];
  for (const e of document.querySelectorAll(PERCH_SEL)) {
    if (e.closest('dialog, [hidden], .esdy-island-wrap, header, .banner, .mobile-menu')) continue;
    const r = perchRect(e);
    if (r.width < CAT_W + 6 || r.top - CAT_H - 6 < minTop || r.top > vh - 8 || r.left < 0 || r.right > vw) continue;
    const lo = r.left + 3, hi = r.right - CAT_W - 3; let start = null;
    for (let x = lo; x <= hi + .1; x += 6) {
      const ok = !bl.some((b) => overlap({ left: x, right: x + CAT_W, top: r.top - CAT_H - 4, bottom: r.top }, b));
      if (ok && start === null) start = x;
      if (start !== null && (!ok || x + 6 > hi + .1)) {
        const end = ok ? x : x - 6;
        // The perch must really be the top surface here (not hidden under a sticky bar or another layer).
        const onTop = [start, (start + end) / 2, end].every((px) => { const h = document.elementFromPoint(px + CAT_W / 2, r.top + 2); return h && (h === e || e.contains(h)); });
        if (end >= start && onTop) spots.push({ el: e, x0: start - r.left, x1: end - r.left, y: r.top, cx: (start + end) / 2 + CAT_W / 2, w: end - start });
        start = null;
      }
    }
  }
  return spots;
}
function catPos() {
  if (cat.hop) return { x: cat.hop.x, y: cat.hop.y };
  if (!cat.el || !cat.el.isConnected) return null;
  const r = perchRect(cat.el); if (!r.width && !r.height) return null;
  return { x: r.left + cat.ox, y: r.top };
}
function pickSpot(minW = 0) {
  const spots = catFindSpots().filter((sp) => sp.w >= minW);
  if (!spots.length) return null;
  if (minW) return spots.sort((a, b) => b.w - a.w)[0];
  const p = catPos();
  const near = p ? spots.filter((sp) => sp.el !== cat.el && Math.hypot(sp.cx - p.x, sp.y - p.y) < 650) : [];
  const list = near.length ? near : spots;
  return list[Math.floor(Math.random() * list.length)];
}
function catHopTo(spot, then, ox) {
  let p = catPos(); let drop = false;
  if (!p) { const ir = anchorRect(); p = { x: ir.left + ir.width / 2 - CAT_W / 2, y: ir.bottom + CAT_H - 4 }; drop = true; }
  const r = perchRect(spot.el);
  const tox = ox != null ? ox : spot.x0 + Math.random() * (spot.x1 - spot.x0);
  const ex = r.left + tox, ey = r.top, dist = Math.hypot(ex - p.x, ey - p.y);
  const T = drop ? Math.min(1.4, Math.max(.6, Math.sqrt(Math.max(1, ey - p.y)) / 26, Math.abs(ex - p.x) / 600)) : Math.min(1, Math.max(.4, dist / 750));
  // pre = crouch before take-off (anticipation); a drop from the island has none.
  cat.hop = { sx: p.x + scrollX, sy: p.y + scrollY, el: spot.el, ox: tox, range: [spot.x0, spot.x1], t: 0, T, h: drop ? 0 : 24 + Math.min(110, dist * .12), x: p.x, y: p.y, drop, pre: drop || reduceCat.matches ? 0 : .18 };
  cat.then = then || null; cat.dir = ex >= p.x ? 1 : -1; cat.state = 'hop'; cat.jy = 0; cat.vy = 0;
}
function catLand() {
  const h = cat.hop; cat.el = h.el; cat.ox = h.ox; cat.range = h.range; cat.hop = null;
  cat.landUntil = performance.now() + (h.drop ? 260 : 170); // crouch on landing to absorb the fall
  if (h.drop) setMood('surprised', 900);
  cat.state = 'idle'; cat.until = performance.now() + 700 + Math.random() * 900;
  const fn = cat.then; cat.then = null; if (fn) fn();
  if (!cat.hop) catValidate(performance.now()); // content may have moved under the landing spot: never crouch on text, not even for a frame
}
function catPick(now) {
  if (now - cat.lastTouch > 60000 && Math.random() < .4) { cat.state = 'sleep'; return; }
  if (reduceCat.matches) { cat.state = 'sit'; cat.until = now + 1e9; return; }
  const r = Math.random(); const span = cat.range[1] - cat.range[0];
  if (r < .35 && span > 24) { cat.state = 'walk'; cat.target = cat.range[0] + Math.random() * span; }
  else if (r < .72) { const sp = pickSpot(); if (sp) catHopTo(sp); else { cat.state = 'idle'; cat.until = now + 2000; } }
  else if (r < .80) { cat.state = 'idle'; cat.until = now + 1500 + Math.random() * 2500; }
  else if (r < .90) { cat.state = 'look'; cat.until = now + 1800 + Math.random() * 2200; } // turns to look at you
  else { cat.state = 'sit'; cat.until = now + 3000 + Math.random() * 5000; }
}
// Re-check the current perch: content may have changed, scrolled away, or a dialog/text may now sit there.
function catValidate(now) {
  cat.nextCheck = now + 2500;
  if (cat.hop) return;
  const p = catPos();
  const ok = p && (() => {
    const box = { left: p.x, right: p.x + CAT_W, top: p.y - CAT_H - 4 - cat.jy, bottom: p.y };
    if (p.y - CAT_H < anchorRect().bottom + 4 || p.y > innerHeight - 8 || p.x < 0 || p.x + CAT_W > innerWidth) return false;
    if (document.querySelector('dialog[open]')) return false;
    return !catBlockers().some((b) => overlap(box, b));
  })();
  if (ok) return;
  if (p && cat.el) { // maybe just slide along the same component
    const same = catFindSpots().filter((sp) => sp.el === cat.el);
    const fit = same.find((sp) => cat.ox >= sp.x0 - 1 && cat.ox <= sp.x1 + 1);
    if (fit) { cat.range = [fit.x0, fit.x1]; return; }
    // Never walk across text to reach the free part: hop over to it instead.
    if (same.length) { const sp = same.sort((a, b) => Math.abs(a.x0 - cat.ox) - Math.abs(b.x0 - cat.ox))[0]; catHopTo(sp, null, sp.x0 + (sp.x1 - sp.x0) / 2); cat.hop.pre = 0; return; } // leaving a covered spot: no crouch first
  }
  const sp = pickSpot();
  if (sp) { catHopTo(sp); cat.hop.pre = 0; } else { cat.el = null; cat.hop = null; }
}
// Effects live in #cat-world (document coordinates) and are re-placed every frame, so bubbles and hearts travel with the cat.
function fxPlace(f, p) {
  const isB = f.n.classList.contains('esdy-cat-bubble'); const cx = p.x + CAT_W / 2 + f.dx;
  let x = cx;
  if (isB) { const half = Math.min(f.w / 2 + 8, innerWidth / 2); x = Math.max(half, Math.min(innerWidth - half, x)); f.n.style.setProperty('--tx', Math.round(Math.max(-f.w / 2 + 12, Math.min(f.w / 2 - 12, cx - x))) + 'px'); }
  f.n.style.left = Math.round(x + scrollX - (isB ? f.w / 2 : 0)) + 'px';
  f.n.style.top = Math.round(p.y + scrollY - CAT_H - cat.jy - (isB ? 8 + f.h : 18)) + 'px';
}
function catFx(cls, text, dx = 0, label = '', ms = 2300) {
  const p = catPos(); if (!p) return;
  const n = el('span', 'esdy-cat-fx ' + cls);
  if (label) n.append(el('small', null, label));
  n.append(document.createTextNode(text));
  n.style.setProperty('--dx', Math.round(Math.random() * 30 - 15) + 'px');
  n.style.animationDuration = ms + 'ms';
  $('cat-world').append(n);
  const f = { n, dx, w: n.offsetWidth, h: n.offsetHeight }; cat.fx.push(f); fxPlace(f, p);
  setTimeout(() => { n.remove(); cat.fx = cat.fx.filter((x) => x !== f); }, ms + 120);
}
function say(t, label = '') {
  if (!t) return;
  cat.fx = cat.fx.filter((f) => { if (f.n.classList.contains('esdy-cat-bubble')) { f.n.remove(); return false; } return true; });
  catFx('esdy-cat-bubble', t, 0, label, Math.min(6500, Math.max(2400, 1200 + t.length * 55)));
}
const hearts = (n = 3) => { for (let i = 0; i < n; i++) setTimeout(() => catFx('esdy-cat-heart', '♥', (i - (n - 1) / 2) * 12, '', 1100), i * 120); };

// ---- weekly cat lines: reminders, life wisdom, click feedback. A new set per ISO week, stored in db "catlines/<week>".
const CAT_LINES_DEFAULT = {
  "reminders": [
    "Hiring an SDET? The CV button's right up top, no cap.",
    "Peep the Projects section to see what Iqbal tested.",
    "Iqbal's down for full-time or freelance gigs.",
    "Flaky test? Log it now, don't let it slide.",
    "Peek at What I test: WebdriverIO, Appium, Playwright and more.",
    "Wanna chat? Hit Email me at the bottom."
  ],
  "wisdom": [
    "A bug caught today is way cheaper than one in prod.",
    "Slow progress is still progress, fr.",
    "Breaks count as work too. Go stretch a bit.",
    "Small wins every day beat big wins once in a while.",
    "Green builds feel good. Honest green builds feel better."
  ],
  "feedback": [
    "Mrow! I'm Bugyy, resident bug hunter.",
    "Hehe, that tickles!",
    "Mrrp? Busy sniffing out bugs rn.",
    "Nyaa~ go say hi to Iqbal!",
    "Purrr… thanks for dropping by.",
    "Meow! All tests green today, we vibing."
  ]
};
function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day); const y = t.getUTCFullYear();
  return `${y}-W${String(Math.ceil(((t - Date.UTC(y, 0, 1)) / 86400000 + 1) / 7)).padStart(2, '0')}`;
}
let catLines = CAT_LINES_DEFAULT, catLinesWeek = '';
const lineBags = {};
function nextLine(kind) {
  const src = (catLines[kind] && catLines[kind].length) ? catLines[kind] : CAT_LINES_DEFAULT[kind];
  let bag = lineBags[kind];
  if (!bag || !bag.items.length || bag.src !== src) { bag = lineBags[kind] = { src, items: src.slice().sort(() => Math.random() - .5) }; }
  return bag.items.pop();
}
const cleanLines = (x) => (Array.isArray(x) ? x.filter((v) => typeof v === 'string' && v.trim()).map((v) => v.trim().slice(0, 160)) : []);
// Mouse (or pen) coming close startles ESDY: jump in fright, then run away from the pointer; cornered or chased, it leaps to a far perch.
const STARTLE = ['Whoa, jumpscare!', 'Waa!', 'Yikes, back off!', 'Meow?!', 'Bro, you scared me!', 'Nyaa, the cursor!', 'Oh my gosh!', 'Missed me!'];
let startles = [], calmUntil = 0, lastStartle = 0;
function catStartle(px, py) {
  const now = performance.now(); startles = startles.filter((t) => now - t < 8000); startles.push(now);
  cat.lastTouch = now; cat.food = null; cat.ball = null;
  if (startles.length >= 5) { calmUntil = now + 9000; startles = []; cat.state = 'look'; cat.until = now + 3000; setMood('flat', 3000); say('Okay okay… I give up. Just pet me already.'); return; }
  const chased = startles.length >= 2;
  setMood('surprised', 1700); say(chased ? 'Quit chasing me!' : STARTLE[Math.floor(Math.random() * STARTLE.length)]);
  if (reduceCat.matches) { cat.state = 'look'; cat.until = now + 1500; return; }
  const p = catPos(); if (!p) return; const away = px < p.x + CAT_W / 2 ? 1 : -1;
  const target = away > 0 ? cat.range[1] : cat.range[0];
  if (chased || Math.abs(target - cat.ox) < 50) { // cornered or chased: leap to a perch far from the pointer
    const far = catFindSpots().filter((sp) => sp.el !== cat.el).map((sp) => ({ sp, d: Math.hypot(sp.cx - px, sp.y - py) })).filter((o) => o.d > 180).sort((a, b) => b.d - a.d).slice(0, 3);
    if (far.length) { cat.vy = 0; cat.jy = 0; catHopTo(far[Math.floor(Math.random() * far.length)].sp); return; }
  }
  cat.state = 'flee'; cat.target = target; cat.v = 0; cat.dir = away; cat.turnUntil = 0;
  if (cat.jy === 0) cat.vy = 250; // a startled hop straight up
}
docOn('pointermove', (e) => {
  if ((e.pointerType !== 'mouse' && e.pointerType !== 'pen') || catState.hidden || cat.hop || !cat.el || document.querySelector('dialog[open]')) return;
  const now = performance.now(); if (now < calmUntil || now - lastStartle < 900 || (cat.state === 'flee' && now - lastStartle < 1500)) return;
  const p = catPos(); if (!p) return;
  if (Math.hypot(e.clientX - (p.x + CAT_W / 2), e.clientY - (p.y - CAT_H / 2 - cat.jy)) > 72) return;
  lastStartle = now; catStartle(e.clientX, e.clientY);
}, { passive: true });
// Rotates reminders, life wisdom and (when there is something worth saying) a line about what is on screen now.
let lineTurn = 0;
function contextLine() {
  // which section sits in the middle of the screen right now
  for (const [id, t] of CONTEXT) { const n = document.getElementById(id); if (!n) continue; const r = n.getBoundingClientRect(); if (r.top < innerHeight / 2 && r.bottom > innerHeight / 2) return t; }
  return '';
}
function nextCatLine() {
  for (let i = 0; i < 3; i++) {
    const k = ['reminders', 'wisdom', 'context'][lineTurn++ % 3];
    if (k === 'context') { const c = contextLine(); if (c) return [c, 'FYI']; continue; }
    return [nextLine(k), k === 'reminders' ? 'Tip' : 'Real talk'];
  }
  return [nextLine('reminders'), 'Tip'];
}
function catPoke() {
  cat.lastTouch = performance.now();
  if (!catPos()) { const sp = pickSpot(); if (sp) catHopTo(sp, () => say('Hey there!')); return; }
  if (cat.state === 'sleep') { cat.state = 'look'; cat.until = cat.lastTouch + 2000; setMood('surprised', 1400); say('Mrrp?'); return; }
  if (!cat.hop && cat.state !== 'eat' && cat.state !== 'chase') { cat.state = 'look'; cat.until = cat.lastTouch + 2200; } // turns to you
  if (!reduceCat.matches && cat.jy === 0 && !cat.hop) cat.vy = 260;
  setMood('happy', 1800); say(nextLine('feedback')); hearts(1);
}
// Food and ball need room: move to the widest free perch first.
function withRoom(minW, fn) {
  if (cat.el && cat.range[1] - cat.range[0] >= minW && !cat.hop) { fn(); return; }
  const sp = pickSpot(minW); if (sp) catHopTo(sp, fn, sp.x0); else say('Too cramped here');
}
function catFeed() {
  cat.lastTouch = performance.now();
  if (reduceCat.matches) { finishMeal(); return; }
  if (cat.food) { say('Still got food, chill'); return; }
  withRoom(70, () => {
    const fo = cat.range[1] + CAT_W - 10; cat.food = { el: cat.el, ox: fo };
    cat.state = 'walk'; cat.target = cat.range[1]; face(1); setMood('surprised', 700); say('Fish!');
  });
}
function finishMeal() { catState.hunger = 100; catState.at = Date.now(); catState.meals++; saveCat(); setMood('happy', 3000); hearts(3); say('So full!'); renderIsland(); }
function catPlay() {
  cat.lastTouch = performance.now();
  if (reduceCat.matches) { say('Ball time!'); hearts(1); return; }
  if (cat.state === 'sleep') cat.state = 'idle';
  withRoom(140, () => { cat.ball = { el: cat.el, x: cat.range[1] + CAT_W - 12, vx: -220, kicks: 0, rot: 0, lo: cat.range[0], hi: cat.range[1] + CAT_W - 12 }; });
}
function catPet() { catState.pets++; saveCat(); cat.lastTouch = performance.now(); if (cat.state !== 'sleep' && !cat.hop) { cat.state = 'sit'; cat.until = performance.now() + 3500; } setMood('happy', 3500); hearts(4); say('Prrrr…'); renderIsland(); }
function catSleep() { if (cat.hop) return; cat.state = 'sleep'; cat.food = null; cat.ball = null; cat.nextZ = 0; }

let catLast = 0, spriteKey = '';
const catSpriteEl = $('cat-canvas'), catFoodEl = $('cat-food'), catBallEl = $('cat-ball');
function catHideParts() { catSpriteEl.hidden = true; catFoodEl.hidden = true; catBallEl.hidden = true; }
function setSprite(pose, expr, dir) {
  const d = devicePixelRatio || 1; const key = [pose, expr, dir, catState.color, d].join('|'); if (key === spriteKey) return; spriteKey = key;
  if (catSpriteEl.width !== CAT_W * d) { catSpriteEl.width = CAT_W * d; catSpriteEl.height = CAT_H * d; catSpriteEl.style.width = CAT_W + 'px'; catSpriteEl.style.height = CAT_H + 'px'; }
  const g = catSpriteEl.getContext('2d'); g.setTransform(d, 0, 0, d, 0, 0); g.clearRect(0, 0, CAT_W, CAT_H); drawCat(g, 0, 0, CS, pose, expr, dir, palette());
}
const place = (n, x, y, extra = '') => { n.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)${extra}`; };
// The island shows what ESDY is doing on the page right now: same pose, direction, expression, and a scaled-down jump.
let islandKey = '';
function islandMirror(pose, expr, dir, lift) {
  const cv = $('island-cat'); if (!cv) return;
  const key = [pose, expr, dir, catState.color].join('|');
  if (key !== islandKey) { islandKey = key; const g = cv.getContext('2d'); g.clearRect(0, 0, CW, CH); drawCat(g, 0, 0, 1, pose, expr, dir, palette()); }
  const y = reduceCat.matches ? 0 : -Math.round(Math.min(6, Math.max(0, lift))); if (cv._y !== y) { cv._y = y; cv.style.transform = y ? `translateY(${y}px)` : ''; }
}
const islandIdle = (now) => islandMirror(cat.state === 'sleep' ? 'sleep' + cat.frame : 'front', catExpr(now), 1, 0);
function catLoop(ts) {
  requestAnimationFrame(catLoop);
  if (document.hidden) { catLast = ts; return; }
  if (catState.hidden) { catLast = ts; islandIdle(ts); return; } // hidden from the page: the island still shows ESDY sitting
  const dt = Math.min(.05, (ts - (catLast || ts)) / 1000); catLast = ts; const now = ts;
  if (now > cat.nextCheck) catValidate(now);
  if (!cat.el && !cat.hop) { catHideParts(); islandIdle(now); return; }

  if (cat.hop) {
    const h = cat.hop;
    const hr = h.el.isConnected ? perchRect(h.el) : null;
    if (!hr || (!hr.width && !hr.height)) { cat.hop = null; cat.el = null; cat.then = null; cat.nextCheck = now + 450; } // target vanished (view change): drop in again
    else {
      const r = hr; const ex = r.left + h.ox, ey = r.top; const sx = h.sx - scrollX, sy = h.sy - scrollY;
      if (h.pre > 0) h.pre -= dt; else h.t = Math.min(1, h.t + dt / h.T);
      // Content may have moved during the jump: re-check the landing spot once before touching down, and retarget mid-air if it is now covered.
      if (!h.checked && h.t >= .6) { h.checked = true; const box = { left: ex, right: ex + CAT_W, top: ey - CAT_H - 4, bottom: ey };
        if (ey - CAT_H < anchorRect().bottom + 4 || catBlockers().some((b) => overlap(box, b))) { const sp = pickSpot(); if (sp) { catHopTo(sp, cat.then); cat.hop.pre = 0; return; } } }
      if (h.drop) { // falls like it has weight: x eases out, y accelerates
        h.x = sx + (ex - sx) * h.t * h.t * (3 - 2 * h.t); h.y = sy + (ey - sy) * h.t * h.t;
      } else {
        const e = h.t < .5 ? 2 * h.t * h.t : 1 - Math.pow(-2 * h.t + 2, 2) / 2;
        h.x = sx + (ex - sx) * e; h.y = sy + (ey - sy) * e - h.h * 4 * h.t * (1 - h.t);
      }
      if (h.t >= 1) catLand();
    }
  } else {
    if (cat.vy || cat.jy > 0) { cat.vy -= 1000 * dt; cat.jy = Math.max(0, cat.jy + cat.vy * dt); if (cat.jy === 0 && cat.vy < 0) cat.vy = 0; }
    if (cat.food && cat.food.el !== cat.el) cat.food = null;
    if (cat.ball && cat.ball.el !== cat.el) cat.ball = null;
    if (cat.ball) {
      const b = cat.ball; b.x += b.vx * dt; b.vx *= 1 - .9 * dt; b.rot += b.vx * dt / 6;
      if (b.x < b.lo) { b.x = b.lo; b.vx = Math.abs(b.vx); } if (b.x > b.hi) { b.x = b.hi; b.vx = -Math.abs(b.vx); }
      cat.state = 'chase'; cat.target = Math.max(cat.range[0], Math.min(cat.range[1], b.x - CAT_W / 2 + 6));
      if (Math.abs(cat.ox + CAT_W / 2 - b.x - 6) < 16 && Math.abs(b.vx) < 80) {
        b.kicks++; b.vx = (b.x > (b.lo + b.hi) / 2 ? -1 : 1) * (150 + Math.random() * 120); if (cat.jy === 0) cat.vy = 200;
        setMood('happy', 900);
        if (b.kicks >= 5) { cat.ball = null; cat.state = 'sit'; cat.until = now + 4000; hearts(2); say('That was fun!'); }
      }
    }
    if (cat.state === 'walk' || cat.state === 'chase' || cat.state === 'flee') {
      const dx = cat.target - cat.ox;
      if (cat.state === 'flee' && cat.jy > 0) { /* startle jump straight up first; the run starts on landing */ }
      else if (Math.abs(dx) < 1.5) {
        if (cat.food) { cat.dir = 1; cat.state = 'eat'; cat.until = now + 2600; }
        else if (cat.state === 'walk') { cat.state = 'idle'; cat.until = now + 600 + Math.random() * 1200; }
        else if (cat.state === 'flee') { cat.v = 0; cat.state = 'look'; cat.until = now + 1300 + Math.random() * 700; if (Math.random() < .35) say(['Hmph.', 'Phew…', 'Safe…'][Math.floor(Math.random() * 3)]); }
      } else if (performance.now() >= cat.turnUntil) {
        face(Math.sign(dx));
        if (performance.now() >= cat.turnUntil) {
          let speed = cat.state === 'chase' ? 95 : 34;
          if (cat.state === 'flee') { const A = 560; cat.v = Math.min(190, (cat.v || 0) + A * dt, Math.sqrt(2 * A * .8 * Math.abs(dx)) + 8); speed = cat.v; } // sprint: accelerate, then brake to a stop
          const mv = Math.min(Math.abs(dx), speed * dt); cat.ox += cat.dir * mv;
          cat.walked += mv; if (cat.walked >= (cat.state === 'flee' ? 6.5 : cat.state === 'chase' ? 5 : 3.5)) { cat.walked = 0; cat.step = (cat.step + 1) % 4; } // legs advance with distance, so feet never slide
        }
      }
    } else if (cat.state === 'eat') {
      if (now > cat.until) { cat.food = null; finishMeal(); cat.state = 'sit'; cat.until = now + 3000; }
    } else if (cat.state === 'sleep') {
      if (now > cat.nextZ) { catFx('esdy-cat-z', 'z', 8, '', 2200); cat.nextZ = now + 1800; }
    } else if (now > cat.until) catPick(now);
  }
  if (now > cat.nextNag) { cat.nextNag = now + 90000; if (hungerNow() < 25 && cat.state !== 'sleep') { if (!cat.hop && cat.state !== 'eat') { cat.state = 'look'; cat.until = now + 2500; } say('So hungry… fish pls?'); } }
  if (!cat.nextLine) cat.nextLine = now + 8000; // first line soon after the page opens
  if (now > cat.nextLine && !cat.hop && catPos()) {
    if (cat.fx.some((f) => f.n.classList.contains('esdy-cat-bubble'))) cat.nextLine = now + 3000; // never talk over itself
    else { cat.nextLine = now + 20000 + Math.random() * 8000; const [txt, label] = nextCatLine(); say(txt, label); }
  }
  cat.ft += dt;
  if (cat.ft > (cat.state === 'sleep' ? .9 : cat.state === 'eat' ? .22 : .6)) { cat.ft = 0; cat.frame = (cat.frame + 1) % 2; if (Math.random() < .12) cat.blinkUntil = now + 140; }
  const expr = catExpr(now); const blink = now < cat.blinkUntil && cat.state !== 'flee';
  let pose;
  if (cat.hop) pose = cat.hop.drop ? 'fall' : cat.hop.pre > 0 ? 'crouch' : cat.hop.t < .5 ? 'leap' : 'fall';
  else if (now < cat.landUntil) pose = 'crouch';
  else if (cat.jy > 0 && cat.state === 'flee') pose = 'front'; // the startle: jumps up facing you, eyes wide
  else if (cat.jy > 0 && cat.state === 'chase') pose = 'leap';
  else if (now < cat.turnUntil || cat.state === 'sit' || cat.state === 'look') pose = cat.frame ? 'frontB' : 'front';
  else if (cat.state === 'walk' || cat.state === 'chase' || cat.state === 'flee') pose = 'walk' + cat.step;
  else if (cat.state === 'eat') pose = 'eat' + cat.frame;
  else if (cat.state === 'sleep') pose = 'sleep' + cat.frame;
  else pose = blink ? 'blink' : expr === 'happy' ? 'happy' : cat.frame ? 'standB' : 'stand';
  cat.pose = pose;
  { const h = cat.hop; const arc = h && !h.drop && h.pre <= 0 ? h.h * 4 * h.t * (1 - h.t) : 0; islandMirror(pose, blink && pose.startsWith('front') ? 'closed' : expr, cat.dir, cat.jy * .12 + arc * .05); }
  const p = catPos(); if (!p) { catHideParts(); return; }
  const sx = scrollX, sy = scrollY;
  setSprite(pose, blink && pose.startsWith('front') ? 'closed' : expr, cat.dir);
  catSpriteEl.hidden = false; place(catSpriteEl, p.x + sx, p.y + sy - CAT_H - cat.jy);
  for (const f of cat.fx) fxPlace(f, p);
  if (cat.food && !cat.hop) { const r = perchRect(cat.food.el); catFoodEl.hidden = false; place(catFoodEl, r.left + cat.food.ox + sx - 8, r.top + sy - 5); } else catFoodEl.hidden = true;
  if (cat.ball && !cat.hop) { const r = perchRect(cat.ball.el); catBallEl.hidden = false; place(catBallEl, r.left + cat.ball.x + sx, r.top + sy - 10, ` rotate(${Math.round(cat.ball.rot * 40)}deg)`); } else catBallEl.hidden = true;
}
// The overlay never takes clicks. A click on empty space where the cat stands (no control can be under it) pokes the cat.
docOn('pointerdown', (e) => {
  if (catState.hidden || e.target.closest(INTERACTIVE_SEL + ', #esdy-island')) return;
  const p = catPos(); if (!p) return;
  if (e.clientX >= p.x - 4 && e.clientX <= p.x + CAT_W + 4 && e.clientY >= p.y - CAT_H - cat.jy - 4 && e.clientY <= p.y + 2) catPoke();
});
addEventListener('scroll', () => { cat.nextCheck = Math.min(cat.nextCheck, performance.now() + 250); }, { passive: true });
addEventListener('resize', () => { cat.nextCheck = 0; });
// Content that re-renders under the cat (live data, a filter, a new panel) is re-checked right away, not after 2.5 s.
new MutationObserver((ms) => {
  if (cat.nextCheck === Infinity || !ms.some((m) => !(m.target.closest ? m.target : m.target.parentElement)?.closest?.('#esdy-cat-world, .esdy-island-wrap, #termBody, #rotator, .cov, .marquee'))) return;
  cat.nextCheck = Math.min(cat.nextCheck, performance.now() + 60);
}).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'hidden', 'open'] });

function renderIsland() {} // no island: nothing to render
$('cat-world').hidden = catState.hidden;
cat.nextCheck = Infinity; // armed by catArm() once the first data snapshot has rendered
if (opts.debug) window.__bugyy = { cat, catState, get startles() { return startles; }, get calmUntil() { return calmUntil; }, get lastStartle() { return lastStartle; } };
function catArm() { if (cat.nextCheck === Infinity) cat.nextCheck = performance.now() + 700; }
// A view change hides the perch: let the new view render, then the cat drops in from the island again.
function catOnRoute() {
  const gone = (e) => { if (!e || !e.isConnected) return true; const r = e.getBoundingClientRect(); return !r.width && !r.height; };
  if (cat.hop && gone(cat.hop.el)) { cat.hop = null; cat.then = null; cat.el = null; }
  if (cat.el && gone(cat.el)) { cat.el = null; cat.food = null; cat.ball = null; } if (cat.nextCheck !== Infinity && !cat.el && !cat.hop) cat.nextCheck = performance.now() + 450; }
requestAnimationFrame(catLoop);

  catArm();

  return function destroy() {
    dead = true; window.cancelAnimationFrame(raf);
    offs.forEach((f) => f()); ivs.forEach((id) => window.clearInterval(id)); tos.forEach((id) => window.clearTimeout(id)); mos.forEach((m) => m.disconnect());
    worldEl.remove(); style.remove();
  };
};
})();
