// Motion for the one "live" surface: the sealed pack, or one card.
//
// Two modes, one path:
// - Idle: a slow figure-eight sway. It runs as Web Animations on `transform` only, so the
//   compositor (GPU thread) plays it. The main thread does no work per frame.
// - Input: a finger, the mouse, or the phone's tilt. A requestAnimationFrame loop eases the
//   surface toward the input and writes `transform` on the same layers.
// When input stops, the loop eases back onto the idle path, then hands over to the animations
// at the same point of the loop, so there is no jump.
//
// x / y run -1..1, 0 = center, positive y = below center.

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches

const LOOP_MS = 11000 // one full figure-eight
const SAMPLES = 32 // keyframes per loop
const INPUT_HOLD_MS = 1400 // after the last input, wait this long before going back to idle

const s = {
  el: null,
  parts: [], // [element, (x, y) => transform string]
  anims: [],
  mode: "rest", // "idle" | "input" | "rest"
  x: 0,
  y: 0,
  tx: 0,
  ty: 0,
  lastPointer: -1e9,
  gyro: null,
  baseBeta: null,
  looping: false,
}

const clamp = (v) => Math.max(-1, Math.min(1, v))
const f = (n) => n.toFixed(2)

// The idle path, as a function of time. Integer frequencies, so it closes on itself every loop.
function drift(t) {
  const a = ((t % LOOP_MS) / LOOP_MS) * Math.PI * 2
  return [Math.sin(a) * 0.55, Math.sin(a * 2 + 1) * 0.35 - 0.1]
}

// The layers that move on each kind of surface, and how they move.
function cardParts(card) {
  const q = (sel) => card.querySelector(sel)
  return [
    [card, (x, y) => `rotateX(${f(y * 12)}deg) rotateY(${f(x * -14)}deg)`],
    [q(".card-sheen"), (x) => `translateX(${f(x * -28)}%)`],
    [q(".card-glare"), (x, y) => `translate(${f(x * 22)}%, ${f(y * 22)}%)`],
    [q(".holo-foil"), (x, y) => `translate(${f(x * -18)}%, ${f(y * -20)}%)`],
    [q(".holo-bars"), (x, y) => `translate(${f(x * -12)}%, ${f(y * 4)}%)`],
    [q(".holo-refract-a"), (x, y) => `translate(${f(x * 8)}%, ${f(y * -6)}%) scale(${f(Math.min(1, 0.42 + (x + 1) * 0.22))})`],
    [q(".holo-refract-b"), (x, y) => `translate(${f(x * 6)}%, ${f(y * 7)}%) scale(${f(Math.min(1, 0.38 + (1 - x) * 0.24))})`],
    [q(".holo-spot"), (x, y) => `translate(${f(x * 26)}%, ${f(y * 28)}%)`],
    [q(".card-rev"), (x, y) => `translate(${f(x * -20)}%, ${f(y * -20)}%)`],
  ].filter(([el]) => el)
}

function packParts(pack) {
  const q = (sel) => pack.querySelector(sel)
  return [
    [q(".pack-inner"), (x, y) => `rotateX(${f(y * -8)}deg) rotateY(${f(x * 10)}deg)`],
    [q(".pack-sheen"), (x, y) => `translate(${f(x * -14)}%, ${f(y * -8)}%)`],
    [q(".pack-band"), (x) => `translateX(${f(x * 30)}%)`],
  ].filter(([el]) => el)
}

function write(x, y) {
  for (const [el, fn] of s.parts) el.style.transform = fn(x, y)
}

function stopIdle() {
  for (const a of s.anims) a.cancel()
  s.anims = []
}

function startIdle() {
  stopIdle()
  s.mode = "idle"
  const frames = Array.from({ length: SAMPLES + 1 }, (_, i) => drift((i / SAMPLES) * LOOP_MS))
  for (const [el, fn] of s.parts) {
    const a = el.animate(
      frames.map(([x, y]) => ({ transform: fn(x, y) })),
      { duration: LOOP_MS, iterations: Infinity, easing: "linear" },
    )
    // Start time 0 puts every animation on the shared clock, in step with drift(now).
    a.startTime = 0
    s.anims.push(a)
  }
}

function startInput(now) {
  if (s.mode === "idle") {
    // Take over from the animations at the exact point they had reached.
    ;[s.x, s.y] = drift(now)
    write(s.x, s.y)
    stopIdle()
  }
  s.mode = "input"
  if (!s.looping) {
    s.looping = true
    requestAnimationFrame(frame)
  }
}

export function setLive(el) {
  if (s.el === el) return
  // The old surface goes back to rest.
  stopIdle()
  if (s.el) {
    write(0, 0)
    s.el.classList.remove("is-live")
  }
  s.el = el
  s.parts = el ? (el.classList.contains("pack") ? packParts(el) : cardParts(el)) : []
  if (!el) {
    s.mode = "rest"
    return
  }
  el.classList.add("is-live")
  const now = performance.now()
  if (s.gyro || now - s.lastPointer < INPUT_HOLD_MS) {
    s.x = s.y = 0
    startInput(now)
  } else if (reduceMotion) {
    s.mode = "rest"
    write(0, 0)
  } else {
    startIdle()
  }
}

export function pointAt(px, py) {
  s.tx = clamp(px)
  s.ty = clamp(py)
  const now = performance.now()
  s.lastPointer = now
  if (s.el && s.mode !== "input") startInput(now)
}

export function pointFromEvent(el, event) {
  const box = el.getBoundingClientRect()
  pointAt(((event.clientX - box.left) / box.width) * 2 - 1, ((event.clientY - box.top) / box.height) * 2 - 1)
}

function onOrientation(event) {
  if (event.gamma == null || event.beta == null) return
  if (s.baseBeta == null) s.baseBeta = event.beta
  // Let the rest angle follow slowly, so the phone can be held at any angle.
  s.baseBeta += (event.beta - s.baseBeta) * 0.01
  s.gyro = { x: clamp(event.gamma / 22), y: clamp((event.beta - s.baseBeta) / 18) }
  if (s.el && s.mode !== "input") startInput(performance.now())
}

export function gyroNeedsPermission() {
  return typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function"
}

export function hasTouch() {
  return matchMedia("(pointer: coarse)").matches
}

// Android and others: listen at once. iOS: call this from a click handler.
export async function enableGyro() {
  if (typeof DeviceOrientationEvent === "undefined") return false
  if (gyroNeedsPermission()) {
    try {
      const answer = await DeviceOrientationEvent.requestPermission()
      if (answer !== "granted") return false
    } catch {
      return false
    }
  }
  window.addEventListener("deviceorientation", onOrientation, { passive: true })
  return true
}

// Runs only in input mode. It stops itself when the surface is back on the idle path.
function frame(now) {
  if (s.mode !== "input" || !s.el) {
    s.looping = false
    return
  }
  const pointerFresh = now - s.lastPointer < INPUT_HOLD_MS
  let k = 0.35
  if (pointerFresh) {
    // target already set by pointAt
  } else if (s.gyro) {
    s.tx = s.gyro.x
    s.ty = s.gyro.y
    k = 0.2
  } else if (reduceMotion) {
    s.tx = s.ty = 0
    k = 0.15
  } else {
    // Ease back onto the moving idle path, then let the animations take over.
    ;[s.tx, s.ty] = drift(now)
    k = 0.08
    if (Math.abs(s.x - s.tx) < 0.01 && Math.abs(s.y - s.ty) < 0.01) {
      startIdle()
      s.looping = false
      return
    }
  }
  s.x += (s.tx - s.x) * k
  s.y += (s.ty - s.y) * k
  write(s.x, s.y)
  requestAnimationFrame(frame)
}
