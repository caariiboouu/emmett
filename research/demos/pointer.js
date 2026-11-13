// Pointer → custom properties used by foil.css and the edge demos.
// --px / --py are -1 at the left/top edge and +1 at the right/bottom edge.

function setPointer(el, clientX, clientY) {
  const box = el.getBoundingClientRect()
  const px = clamp(((clientX - box.left) / box.width) * 2 - 1)
  const py = clamp(((clientY - box.top) / box.height) * 2 - 1)
  el.style.setProperty("--px", px.toFixed(3))
  el.style.setProperty("--py", py.toFixed(3))
  return { px, py, box }
}

function clamp(value) {
  return Math.max(-1, Math.min(1, value))
}

function bindSurface(el) {
  el.addEventListener("pointermove", (event) => {
    setPointer(el, event.clientX, event.clientY)
  })
  el.addEventListener("pointerleave", () => {
    el.style.setProperty("--px", "0.15")
    el.style.setProperty("--py", "-0.2")
  })
}

// fePointLight x/y are CSS pixels inside the filtered element.
function bindLight(el, light) {
  const move = (event) => {
    const box = el.getBoundingClientRect()
    light.setAttribute("x", Math.round(event.clientX - box.left))
    light.setAttribute("y", Math.round(event.clientY - box.top))
  }
  el.addEventListener("pointermove", move)
}

// Angle of the pointer around the element center, in degrees.
// Same atan2 recipe as the proximity-border post.
function bindAngle(el) {
  el.addEventListener("pointermove", (event) => {
    const box = el.getBoundingClientRect()
    const cx = box.left + box.width / 2
    const cy = box.top + box.height / 2
    let angle = (Math.atan2(event.clientY - cy, event.clientX - cx) * 180) / Math.PI
    if (angle < 0) angle += 360
    el.style.setProperty("--angle", (angle + 90).toFixed(1))
    const dist = Math.hypot(event.clientX - cx, event.clientY - cy)
    const near = Math.max(0, 1 - dist / 260)
    el.style.setProperty("--near", near.toFixed(3))
  })
  el.addEventListener("pointerleave", () => {
    el.style.setProperty("--near", "0")
  })
}
