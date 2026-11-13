import { cards, cardMarkup, factsMarkup, countdownText } from "./render.js"
import { setLive, pointAt, pointFromEvent, enableGyro, gyroNeedsPermission, hasTouch } from "./holo.js"

const $ = (sel) => document.querySelector(sel)
const stage = $("#stage")
const pack = $("#pack")
const strip = $("#strip")
const statusEl = $("#status")
const openButton = $("#openButton")
const deckCards = $("#deckCards")
const deckCount = $("#deckCount")
const prevButton = $("#prevButton")
const nextButton = $("#nextButton")
const tiltButton = $("#tiltButton")
const binder = $("#binder")
const binderGrid = $("#binderGrid")
const lightbox = $("#lightbox")
const lightboxCard = $("#lightboxCard")
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches

const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms))

// ---------- Build the cards ----------

function buildDeck() {
  deckCards.innerHTML = cards.map((c, i) => `<div class="slot" data-index="${i}">${cardMarkup(c, i)}</div>`).join("")
  binderGrid.innerHTML = cards
    .map((c, i) => `<button class="binder-slot" type="button" data-index="${i}" aria-label="Look at ${c.name}">${cardMarkup(c, i)}</button>`)
    .join("")
  // Links in the binder cards are only for show. The tap opens the large card.
  binderGrid.querySelectorAll("a").forEach((a) => {
    a.tabIndex = -1
    a.addEventListener("click", (e) => e.preventDefault())
  })
  $("#facts").innerHTML = factsMarkup()
}

buildDeck()
const slots = [...deckCards.querySelectorAll(".slot")]

// Decode the card art while the pack is still sealed, so the reveal never waits on an image.
const warmImages = () => deckCards.querySelectorAll("img").forEach((img) => img.decode?.().catch(() => {}))
if ("requestIdleCallback" in window) requestIdleCallback(warmImages, { timeout: 1500 })
else setTimeout(warmImages, 500)
let index = 0

// Keep the countdown true if the page stays open past midnight.
setInterval(() => {
  document.querySelectorAll("[data-countdown] .move-value").forEach((el) => (el.textContent = countdownText()))
}, 60_000)

// ---------- The tear ----------

let tear = null // { id, x0, y0, dir, progress }

function setTear(progress, dir) {
  pack.style.setProperty("--tear", progress.toFixed(3))
  pack.style.setProperty("--dir", dir)
}

pack.addEventListener("pointerdown", (event) => {
  if (stage.dataset.phase !== "sealed") return
  pack.setPointerCapture(event.pointerId)
  tear = { id: event.pointerId, x0: event.clientX, y0: event.clientY, dir: 0, progress: 0, moved: false }
  pack.classList.add("is-tearing")
})

pack.addEventListener("pointermove", (event) => {
  if (stage.dataset.phase !== "sealed") return
  if (!tear || tear.id !== event.pointerId) {
    // Hover with a mouse: the sealed pack tilts toward the pointer.
    if (event.pointerType === "mouse") pointFromEvent(pack, event)
    return
  }
  const dx = event.clientX - tear.x0
  if (Math.abs(dx) > 6) tear.moved = true
  if (!tear.dir && Math.abs(dx) > 6) tear.dir = dx > 0 ? 1 : -1
  if (!tear.dir) return
  const width = pack.getBoundingClientRect().width
  tear.progress = Math.max(0, Math.min(1, (dx * tear.dir) / (width * 0.85)))
  setTear(tear.progress, tear.dir)
  if (tear.progress >= 1) finishTear()
})

function endTear(event) {
  if (!tear || tear.id !== event.pointerId) return
  pack.classList.remove("is-tearing")
  const { progress, moved } = tear
  tear = null
  if (stage.dataset.phase !== "sealed") return
  if (progress > 0.55) return finishTear()
  setTear(0, 1)
  if (!moved) nudge()
}

pack.addEventListener("pointerup", endTear)
pack.addEventListener("pointercancel", endTear)
// The sealed pack is the live surface: it sways slowly, or follows the mouse.
setLive(pack)

// The bevel light on the 7 and the title is fixed: a moving light would re-run the SVG filter every frame.

async function nudge() {
  statusEl.textContent = "Put your finger on the pack and swipe across the top."
  pack.classList.remove("nudge")
  void pack.offsetWidth
  pack.classList.add("nudge")
}

async function finishTear() {
  if (stage.dataset.phase !== "sealed") return
  tear = null
  pack.classList.remove("is-tearing")
  setTear(1, pack.style.getPropertyValue("--dir") || 1)
  stage.dataset.phase = "torn"
  statusEl.textContent = "The pack is open."
  await wait(450)
  stage.dataset.phase = "dealing"
  await wait(900)
  stage.dataset.phase = "deck"
  statusEl.textContent = "Swipe a card away to see the next one."
  showCard(0)
  offerTilt()
}

openButton.addEventListener("click", () => {
  pack.style.setProperty("--dir", 1)
  finishTear()
})

// ---------- Phone tilt ----------

function offerTilt() {
  if (!hasTouch() || typeof DeviceOrientationEvent === "undefined") return
  if (gyroNeedsPermission()) {
    tiltButton.hidden = false
  } else {
    enableGyro()
  }
}

tiltButton.addEventListener("click", async () => {
  const ok = await enableGyro()
  tiltButton.textContent = ok ? "Tilt is on" : "Tilt is off"
  tiltButton.disabled = true
  setTimeout(() => (tiltButton.hidden = true), 1600)
})

// ---------- The stack of cards ----------

function layout() {
  slots.forEach((slot, i) => {
    const depth = i - index
    slot.classList.toggle("is-top", depth === 0)
    // The next card gets its GPU layers in an idle moment, not in the frame of the swipe.
    if (depth !== 1) slot.classList.remove("is-next")
    else if (!slot.classList.contains("is-next")) {
      const promote = () => slots[index + 1] === slot && slot.classList.add("is-next")
      if ("requestIdleCallback" in window) requestIdleCallback(promote, { timeout: 400 })
      else setTimeout(promote, 200)
    }
    slot.classList.toggle("is-gone", depth < 0)
    slot.classList.toggle("is-deep", depth > 3)
    slot.style.setProperty("--depth", Math.max(depth, 0))
    slot.style.zIndex = String(100 - Math.abs(depth))
    slot.setAttribute("aria-hidden", String(depth !== 0))
    slot.inert = depth !== 0
  })
  deckCount.textContent = `${Math.min(index + 1, cards.length)} of ${cards.length}`
  prevButton.disabled = index === 0
}

// Lay the binder out ahead of time, invisible, in an idle moment while a guest reads a card.
// Then the final screen opens without computing ~450 element styles in one frame.
let binderStaged = false
function stageBinder() {
  if (binderStaged || stage.dataset.phase !== "deck") return
  binderStaged = true
  binder.classList.add("is-staged")
  binder.hidden = false
}

function showCard(i) {
  index = i
  layout()
  if (!binderStaged) {
    if ("requestIdleCallback" in window) requestIdleCallback(stageBinder, { timeout: 2000 })
    else setTimeout(stageBinder, 800)
  }
  const top = slots[index]
  if (top) setLive(top.querySelector(".card"))
  if (cards[index]?.rarity === "secret") revealSecret(top)
}

async function revealSecret(slot) {
  slot.classList.add("is-secret-reveal")
  statusEl.textContent = "Secret rare! It's the birthday boy."
  burst(36)
  await wait(1400)
  slot.classList.remove("is-secret-reveal")
}

async function next(dir = -1) {
  const slot = slots[index]
  if (!slot) return
  slot.style.setProperty("--fly", dir)
  slot.style.removeProperty("--dx")
  slot.style.removeProperty("--dy")
  slot.classList.remove("is-dragging")
  if (index === cards.length - 1) {
    slot.classList.add("is-flying")
    await wait(380)
    slot.classList.remove("is-flying")
    openBinder()
    return
  }
  showCard(index + 1)
}

function prev() {
  if (index === 0) return
  showCard(index - 1)
}

nextButton.addEventListener("click", () => next(-1))
prevButton.addEventListener("click", prev)

document.addEventListener("keydown", (event) => {
  if (!lightbox.hidden && event.key === "Escape") return closeLightbox()
  if (stage.dataset.phase !== "deck") return
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") event.preventDefault()
  if (event.key === "ArrowRight") next(-1)
  if (event.key === "ArrowLeft") prev()
})

// Drag the top card. A short press with no movement also moves on.
let drag = null

deckCards.addEventListener("pointerdown", (event) => {
  const slot = event.target.closest(".slot.is-top")
  if (!slot || stage.dataset.phase !== "deck") return
  if (event.target.closest("a, button")) return // let the links work
  slot.setPointerCapture(event.pointerId)
  drag = { slot, id: event.pointerId, x0: event.clientX, y0: event.clientY, t0: performance.now(), dx: 0, dy: 0 }
  slot.classList.add("is-dragging")
})

deckCards.addEventListener("pointermove", (event) => {
  const top = slots[index]
  if (!drag || drag.id !== event.pointerId) {
    if (event.pointerType === "mouse" && top && stage.dataset.phase === "deck") pointFromEvent(top, event)
    return
  }
  drag.dx = event.clientX - drag.x0
  drag.dy = event.clientY - drag.y0
  drag.slot.style.setProperty("--dx", drag.dx.toFixed(1))
  drag.slot.style.setProperty("--dy", (drag.dy * 0.4).toFixed(1))
  // The foil follows the throw: the card turns as you pull it.
  pointAt(drag.dx / 140, drag.dy / 180 - 0.1)
})

function endDrag(event) {
  if (!drag || drag.id !== event.pointerId) return
  const { slot, dx, dy, t0 } = drag
  drag = null
  slot.classList.remove("is-dragging")
  const speed = Math.abs(dx) / Math.max(1, performance.now() - t0)
  const far = Math.abs(dx) > Math.min(110, slot.offsetWidth * 0.3)
  if (event.type !== "pointercancel" && (far || (speed > 0.6 && Math.abs(dx) > 30))) {
    next(dx > 0 ? 1 : -1)
  } else if (event.type !== "pointercancel" && Math.hypot(dx, dy) < 6) {
    next(-1)
  } else {
    slot.style.removeProperty("--dx")
    slot.style.removeProperty("--dy")
  }
}

deckCards.addEventListener("pointerup", endDrag)
deckCards.addEventListener("pointercancel", endDrag)

// ---------- The binder (all cards, plus plain facts) ----------

async function openBinder() {
  stage.dataset.phase = "binder"
  binder.hidden = false
  binder.classList.remove("is-staged")
  statusEl.textContent = "You collected all 7 cards."
  setLive(null)
  window.scrollTo({ top: 0 })
  // Confetti one frame later, so it does not land in the same frame as the binder layout.
  requestAnimationFrame(() => burst(44))
}

binderGrid.addEventListener("click", (event) => {
  const slot = event.target.closest(".binder-slot")
  if (!slot) return
  openLightbox(Number(slot.dataset.index), slot)
})

binderGrid.addEventListener("pointermove", (event) => {
  if (event.pointerType !== "mouse") return
  const card = event.target.closest(".binder-slot")?.querySelector(".card")
  if (!card) return
  setLive(card)
  pointFromEvent(card, event)
})

let lastOpener = null

function openLightbox(i, opener) {
  lastOpener = opener
  lightboxCard.innerHTML = cardMarkup(cards[i], i)
  lightbox.hidden = false
  document.body.classList.add("has-lightbox")
  const card = lightboxCard.querySelector(".card")
  setLive(card)
  $("#lightboxClose").focus()
}

function closeLightbox() {
  lightbox.hidden = true
  document.body.classList.remove("has-lightbox")
  setLive(null)
  lastOpener?.focus()
}

$("#lightboxClose").addEventListener("click", closeLightbox)
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox()
})

lightboxCard.addEventListener("pointermove", (event) => {
  const card = lightboxCard.querySelector(".card")
  if (card && !event.target.closest("a")) pointFromEvent(card, event)
})
lightboxCard.style.touchAction = "none"

$("#againButton").addEventListener("click", () => {
  binder.hidden = true
  binder.classList.remove("is-staged")
  binderStaged = false
  setTear(0, 1)
  index = 0
  layout()
  stage.dataset.phase = "sealed"
  setLive(pack)
  statusEl.textContent = "Swipe across the top of the pack to tear it open."
  window.scrollTo({ top: 0 })
})

// ---------- Confetti ----------

// Confetti on one canvas: one GPU layer and a few rectangles per frame,
// instead of dozens of animated elements added to the page.
const confetti = { canvas: null, ctx: null, bits: [], running: false, dpr: 1 }

function burst(count) {
  if (reduceMotion) return
  if (!confetti.canvas) {
    confetti.canvas = document.createElement("canvas")
    confetti.canvas.className = "confetti-canvas"
    confetti.canvas.setAttribute("aria-hidden", "true")
    document.body.append(confetti.canvas)
    confetti.ctx = confetti.canvas.getContext("2d")
  }
  const c = confetti.canvas
  confetti.dpr = Math.min(2, window.devicePixelRatio || 1)
  const w = innerWidth
  const h = innerHeight
  if (c.width !== Math.round(w * confetti.dpr) || c.height !== Math.round(h * confetti.dpr)) {
    c.width = Math.round(w * confetti.dpr)
    c.height = Math.round(h * confetti.dpr)
  }
  const colors = ["#c6ff1a", "#22e4ff", "#ff5a1f", "#ffc21a", "#ff2d87", "#ffffff"]
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6
    const speed = 0.9 + Math.random() * 0.9 // px per ms
    confetti.bits.push({
      x: w / 2,
      y: h * 0.58,
      vx: Math.cos(angle) * speed * 0.9,
      vy: Math.sin(angle) * speed,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.02,
      w: 7 + Math.random() * 4,
      h: 10 + Math.random() * 6,
      round: i % 3 === 0,
      color: colors[i % colors.length],
      life: 1300 + Math.random() * 700,
      age: 0,
    })
  }
  if (!confetti.running) {
    confetti.running = true
    let last = performance.now()
    const step = (now) => {
      const dt = Math.min(40, now - last)
      last = now
      const { ctx, dpr } = confetti
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, c.width, c.height)
      confetti.bits = confetti.bits.filter((b) => (b.age += dt) < b.life)
      for (const b of confetti.bits) {
        b.vy += 0.0016 * dt // gravity
        b.vx *= 0.995
        b.x += b.vx * dt
        b.y += b.vy * dt
        b.r += b.vr * dt
        ctx.globalAlpha = Math.min(1, 2.5 * (1 - b.age / b.life))
        ctx.fillStyle = b.color
        ctx.save()
        ctx.translate(b.x, b.y)
        ctx.rotate(b.r)
        if (b.round) {
          ctx.beginPath()
          ctx.arc(0, 0, b.w / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h * Math.abs(Math.cos(b.r * 2)) + 2)
        }
        ctx.restore()
      }
      if (confetti.bits.length) requestAnimationFrame(step)
      else {
        ctx.clearRect(0, 0, c.width, c.height)
        confetti.running = false
      }
    }
    requestAnimationFrame(step)
  }
}

layout()

