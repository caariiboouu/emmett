// One animation loop moves the foil on the one card that is "live".
// Input sources, highest priority first: a finger or mouse, the phone's tilt, a slow idle drift.
// The loop writes --px and --py (-1..1, 0 = center, positive --py = below center).

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches

const s = {
  el: null,
  x: 0.15,
  y: -0.2,
  tx: 0.15,
  ty: -0.2,
  lastPointer: 0,
  gyro: null, // { x, y } when the phone reports tilt
  baseBeta: null,
}

const clamp = (v) => Math.max(-1, Math.min(1, v))

export function setLive(el) {
  if (s.el && s.el !== el) {
    s.el.style.setProperty("--px", "0.15")
    s.el.style.setProperty("--py", "-0.2")
  }
  s.el = el
}

export function pointAt(px, py) {
  s.tx = clamp(px)
  s.ty = clamp(py)
  s.lastPointer = performance.now()
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
  window.addEventListener("deviceorientation", onOrientation)
  return true
}

function frame(now) {
  if (s.el) {
    const pointerFresh = now - s.lastPointer < 1400
    if (!pointerFresh) {
      if (s.gyro) {
        s.tx = s.gyro.x
        s.ty = s.gyro.y
      } else if (!reduceMotion) {
        const t = now / 1000
        s.tx = Math.sin(t * 0.55) * 0.55
        s.ty = Math.sin(t * 0.8 + 1) * 0.35 - 0.1
      }
    }
    const k = pointerFresh ? 0.35 : 0.08
    s.x += (s.tx - s.x) * k
    s.y += (s.ty - s.y) * k
    s.el.style.setProperty("--px", s.x.toFixed(3))
    s.el.style.setProperty("--py", s.y.toFixed(3))
  }
  requestAnimationFrame(frame)
}

requestAnimationFrame(frame)
