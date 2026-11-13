import { party, cards } from "./party.js"
import { art, icons, typeIcon } from "./art.js"

const isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) && "ontouchend" in document
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || isApple

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c])

// iPhone Safari opens a linked .ics file in its "Add to Calendar" sheet.
// With a download attribute it saves the file to Downloads instead, so iOS gets a plain link.
const icsDownloadAttr = isIOS ? "" : ` download="emmett-birthday.ics"`

export function mapsHref() {
  const q = encodeURIComponent(`${party.venue} ${party.venueArea}`)
  const addr = encodeURIComponent(`${party.street}, ${party.city}`)
  return isIOS
    ? `https://maps.apple.com/?q=${q}&address=${addr}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${party.venue}, ${party.street}, ${party.city}`)}`
}

export function googleCalendarHref() {
  const fmt = (iso) => iso.replace(/[-:]/g, "").replace(/\.\d+/, "")
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: `${party.kid}'s 7th birthday swim party`,
    dates: `${fmt(party.start)}/${fmt(party.end)}`,
    location: `${party.venue} - ${party.venueArea}, ${party.street}, ${party.city}`,
    details: "Bring a swimsuit and a towel.",
  })
  return `https://calendar.google.com/calendar/render?${p}`
}

export function countdownText(now = new Date()) {
  const start = new Date(party.start)
  const end = new Date(party.end)
  if (now >= end) return "Thanks for coming!"
  if (now >= start) return "Happening now!"
  const day = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const days = Math.round((day(start) - day(now)) / 86400000)
  if (days <= 0) return "Today!"
  if (days === 1) return "Tomorrow!"
  return `${days} days to go`
}

export function rsvpReady() {
  const r = party.rsvp
  return Boolean(r.name && (r.phone || r.email))
}

export function rsvpSms() {
  const r = party.rsvp
  if (!r.phone) return ""
  const body = encodeURIComponent(r.message || `RSVP for ${party.kid}'s party: `)
  // iOS reads the body after "&"; Android and others after "?".
  return `sms:${r.phone}${isIOS ? "&" : "?"}body=${body}`
}

export function rsvpMail() {
  const r = party.rsvp
  if (!r.email) return ""
  const subject = encodeURIComponent(`RSVP: ${party.kid}'s 7th birthday party`)
  const body = encodeURIComponent(r.message || "")
  return `mailto:${r.email}?subject=${subject}&body=${body}`
}

function rsvpSentence() {
  const r = party.rsvp
  const how = [r.phone && "text", r.email && "email"].filter(Boolean).join(" or ")
  const verb = how.charAt(0).toUpperCase() + how.slice(1)
  return `${verb} ${r.name}${r.by ? ` by ${r.by}` : ""}.`
}

function fill(text) {
  const r = party.rsvp
  return String(text)
    .replace("{countdown}", countdownText())
    .replace("{maps}", mapsHref())
    .replace("{rsvpBig}", "Tell us you're coming")
    .replace("{rsvpLine}", rsvpReady() ? rsvpSentence() : "RSVP details coming soon.")
    .replace("{rsvpSms}", rsvpSms())
    .replace("{rsvpMail}", rsvpMail())
    .replace("{rsvpPhone}", r.phoneLabel || "Text")
}

const icon = (name) =>
  `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.star}</svg>`

function artMarkup(card) {
  if (card.art.img) {
    const focus = card.art.focus ? ` style="object-position: ${esc(card.art.focus)}"` : ""
    return `<img src="${esc(card.art.img)}" alt="" decoding="async"${focus} />`
  }
  const viewBox = card.art.full ? "0 0 300 420" : "0 0 300 200"
  return `<svg viewBox="${viewBox}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${art[card.art.svg] || ""}</svg>`
}

function moveMarkup(move, cardId) {
  const href = move.href ? fill(move.href) : ""
  if (move.href && !href) return "" // a link with no target (no RSVP yet) is left out
  const value = move.value ? `<span class="move-value">${esc(fill(move.value))}</span>` : ""
  const text = move.text ? `<span class="move-text">${esc(move.text)}</span>` : ""
  const inner = `${icon(move.icon)}<span class="move-name">${esc(move.name)}${text}</span>${value}`
  if (href) {
    const ext = /^https?:/.test(href) ? ` target="_blank" rel="noopener"` : ""
    const dl = href.endsWith(".ics") ? icsDownloadAttr : ""
    return `<li><a class="move move-link" href="${esc(href)}"${ext}${dl} data-move="${cardId}-${esc(move.name)}">${inner}</a></li>`
  }
  const live = move.value === "{countdown}" ? ` data-countdown` : ""
  return `<li><div class="move"${live}>${inner}</div></li>`
}

const fx = `<div class="holo-fx" aria-hidden="true"><div class="holo-foil"></div><div class="holo-bars"></div><div class="holo-refract holo-refract-a"></div><div class="holo-refract holo-refract-b"></div><div class="holo-spot"></div></div>`

export function cardMarkup(card, index) {
  const no = `${index + 1}/${cards.length}`
  const stars = { holo: "★★", reverse: "★", secret: "★★★" }[card.rarity] || "★"
  const rarityName = { holo: "Holo", reverse: "Reverse holo", secret: "Secret rare" }[card.rarity]
  const lines = (card.lines || []).map((l) => `<p class="fact">${esc(fill(l))}</p>`).join("")
  const list = card.list ? `<ul class="kit">${card.list.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : ""
  const big = card.big ? `<p class="fact-big">${esc(fill(card.big))}</p>` : ""
  const moves = (card.moves || []).map((m) => moveMarkup(m, card.id)).join("")
  const stat = card.level
    ? `<span class="card-stat"><small>Lv</small>${card.level}</span>`
    : `<span class="card-stat" ${card.statNote ? `title="${esc(card.statNote)}"` : ""}><small>SP</small>${card.stat}</span>`

  return `
  <article class="card" data-type="${card.type}" data-rarity="${card.rarity}" data-id="${card.id}" aria-label="Card ${index + 1} of ${cards.length}: ${esc(card.name)}">
    <div class="card-frame">
      <div class="card-face">
        <div class="card-art${card.art.full ? " is-full" : ""}${card.art.img ? " has-img" : ""}">${card.art.img ? artMarkup(card) + fx : fx + artMarkup(card)}</div>
        <header class="card-head">
          <h2 class="card-name">${esc(card.name)}</h2>
          ${stat}
          <span class="type-badge" title="${esc(card.typeLabel)}">${icon(typeIcon[card.type])}</span>
        </header>
        <p class="card-ribbon">${esc(card.typeLabel)}<span>No. ${no}</span></p>
        <div class="card-body">
          ${big}${lines}${list}
          ${moves ? `<ul class="moves">${moves}</ul>` : ""}
          <p class="flavor">${esc(card.flavor)}</p>
        </div>
        <footer class="card-foot">
          <span class="rarity" title="${rarityName}">${stars}</span>
          <span class="set">Splash Legends</span>
          <span class="number">${no}</span>
        </footer>
      </div>
      <div class="card-glare" aria-hidden="true"></div>
    </div>
  </article>`
}

export function factsMarkup() {
  const r = party.rsvp
  const rsvp = rsvpReady()
    ? `<p>${esc(rsvpSentence())}</p><p>${[
        r.phone && `<a href="${esc(rsvpSms())}">Text ${esc(r.phoneLabel || r.phone)}</a>`,
        r.email && `<a href="${esc(rsvpMail())}">${esc(r.email)}</a>`,
      ]
        .filter(Boolean)
        .join(" · ")}</p>`
    : `<p>RSVP details coming soon.</p>`
  return `
    <h2 class="facts-title">The party, in plain words</h2>
    <dl>
      <div><dt>Who</dt><dd><p>${esc(party.kid)} is turning ${party.age}.</p></dd></div>
      <div><dt>When</dt><dd><p>${esc(party.dateLabel)}, 2026</p><p>${esc(party.timeLabel)}</p>
        <p><a href="emmett-birthday.ics"${icsDownloadAttr}>Add to calendar</a> or <a href="${esc(googleCalendarHref())}" target="_blank" rel="noopener">Google Calendar</a></p></dd></div>
      <div><dt>Where</dt><dd><p>${esc(party.venue)} – ${esc(party.venueArea)}</p><p>${esc(party.street)}<br />${esc(party.city)}</p>
        <p><a href="${esc(mapsHref())}" target="_blank" rel="noopener">Get directions</a> · <a href="${party.phoneHref}">${esc(party.phoneLabel)}</a></p></dd></div>
      <div><dt>RSVP</dt><dd>${rsvp}</dd></div>
    </dl>`
}

export { cards, party }
