// Drawn placeholder art. Each one fills a 3:2 art window (viewBox 300 x 200).
// A card with img: "art/....webp" in party.js uses the image instead.

const ink = "#0b2340"
const line = `stroke="${ink}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`

const water = (fill = "#6fe7f0", y = 160) =>
  `<path d="M-10 ${y} q25 -14 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V210 H-10z" fill="${fill}" opacity=".85" />`

const bubbles = (pts) =>
  pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width="2.5" opacity=".8" />`).join("")

const eye = (x, y, r = 7) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${ink}" /><circle cx="${x + r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.35}" fill="#fff" />`

export const art = {
  float7: `
    ${bubbles([[48, 50, 9], [70, 92, 5], [246, 40, 7], [262, 78, 4]])}
    <path d="M92 38 H212 L150 168 H108 L158 74 H92 Z" fill="#ff4f9a" ${line} />
    <path d="M102 50 H196" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".75" />
    <path d="M168 84 L132 152" stroke="#ffb3d4" stroke-width="7" stroke-linecap="round" opacity=".8" />
    ${water("#6fe7f0", 150)}
    <path d="M30 120 l6 -12 6 12 -12 -6 12 0z" fill="#ffd23f" />
    <path d="M244 118 l5 -10 5 10 -10 -5 10 0z" fill="#ffd23f" />`,

  turtle: `
    ${bubbles([[40, 46, 7], [262, 50, 9], [250, 92, 4]])}
    <ellipse cx="96" cy="150" rx="22" ry="12" fill="#7ed99a" ${line} transform="rotate(-20 96 150)" />
    <ellipse cx="204" cy="150" rx="22" ry="12" fill="#7ed99a" ${line} transform="rotate(20 204 150)" />
    <circle cx="70" cy="104" r="26" fill="#8fe0a0" ${line} />
    ${eye(62, 98)}
    <path d="M58 116 q8 6 16 0" fill="none" ${line} stroke-width="3.5" />
    <ellipse cx="160" cy="112" rx="70" ry="54" fill="#1fa596" ${line} />
    <circle cx="160" cy="108" r="38" fill="#fff" ${line} />
    ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
      .map((a) => {
        const r = (a * Math.PI) / 180
        return `<circle cx="${160 + Math.sin(r) * 30}" cy="${108 - Math.cos(r) * 30}" r="${a % 90 ? 2 : 3.5}" fill="${ink}" />`
      })
      .join("")}
    <path d="M160 108 L160 84 M160 108 L178 116" ${line} stroke-width="5" />
    <circle cx="160" cy="108" r="4" fill="#ff4f9a" />
    ${water("#6fe7f0", 172)}`,

  crab: `
    ${bubbles([[40, 120, 6], [258, 128, 8]])}
    <path d="M150 18 C126 18 116 38 116 54 C116 78 150 104 150 104 C150 104 184 78 184 54 C184 38 174 18 150 18 Z" fill="#ffd23f" ${line} />
    <circle cx="150" cy="52" r="12" fill="#fff" ${line} stroke-width="4" />
    <path d="M86 148 l-26 14 M92 160 l-22 22 M214 148 l26 14 M208 160 l22 22" ${line} />
    <path d="M96 128 q-30 -40 -14 -70" fill="none" ${line} />
    <path d="M204 128 q30 -40 14 -70" fill="none" ${line} />
    <path d="M70 50 a18 18 0 1 1 26 10 l-8 -10z" fill="#ff6b5a" ${line} />
    <path d="M230 50 a18 18 0 1 0 -26 10 l8 -10z" fill="#ff6b5a" ${line} />
    <ellipse cx="150" cy="142" rx="64" ry="38" fill="#ff6b5a" ${line} />
    <path d="M132 108 v-16 M168 108 v-16" ${line} />
    <circle cx="132" cy="88" r="11" fill="#fff" ${line} stroke-width="4" />
    <circle cx="168" cy="88" r="11" fill="#fff" ${line} stroke-width="4" />
    ${eye(134, 89, 5)}${eye(170, 89, 5)}
    <path d="M136 150 q14 12 28 0" fill="none" ${line} stroke-width="4" />`,

  octopus: `
    ${bubbles([[48, 40, 8], [256, 36, 6], [270, 70, 4]])}
    ${[
      "M112 120 q-30 30 -60 18",
      "M126 128 q-14 40 -44 48",
      "M150 132 q0 36 -16 56",
      "M174 128 q14 40 44 48",
      "M188 120 q30 30 60 18",
    ]
      .map((d) => `<path d="${d}" fill="none" stroke="${ink}" stroke-width="22" stroke-linecap="round" /><path d="${d}" fill="none" stroke="#a77bff" stroke-width="13" stroke-linecap="round" />`)
      .join("")}
    <path d="M100 104 C100 40 200 40 200 104 C200 126 100 126 100 104 Z" fill="#a77bff" ${line} />
    ${eye(132, 92)}${eye(168, 92)}
    <path d="M140 108 q10 8 20 0" fill="none" ${line} stroke-width="3.5" />
    <rect x="22" y="112" width="46" height="34" rx="6" fill="#ffd23f" ${line} transform="rotate(-12 45 129)" />
    <path d="M28 124 h36 M30 134 h34" stroke="#ff4f9a" stroke-width="4" transform="rotate(-12 45 129)" />
    <g transform="rotate(10 246 128)">
      <circle cx="232" cy="128" r="13" fill="#6fe7f0" ${line} stroke-width="4" />
      <circle cx="262" cy="128" r="13" fill="#6fe7f0" ${line} stroke-width="4" />
      <path d="M245 128 h4" ${line} stroke-width="4" />
    </g>`,

  cake: `
    ${bubbles([[44, 54, 7], [60, 90, 4], [258, 60, 8]])}
    <path d="M150 34 q-8 -10 0 -20 q8 10 0 20z" fill="#ffb02e" ${line} stroke-width="3" />
    <rect x="144" y="36" width="12" height="30" rx="3" fill="#6fe7f0" ${line} stroke-width="4" />
    <rect x="96" y="64" width="108" height="44" rx="10" fill="#ffd1e6" ${line} />
    <path d="M96 78 q9 12 18 0 t18 0 t18 0 t18 0 t18 0 t18 0" fill="none" stroke="#ff4f9a" stroke-width="6" stroke-linecap="round" />
    <rect x="76" y="104" width="148" height="54" rx="12" fill="#ff8fc2" ${line} />
    <path d="M76 122 q12 14 24 0 t24 0 t24 0 t24 0 t24 0 t24 0" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" />
    ${[[110, 94, "#ffd23f"], [176, 90, "#6fe7f0"], [96, 140, "#ffd23f"], [196, 142, "#6fe7f0"], [150, 146, "#7ce85a"]]
      .map(([x, y, c], i) => `<rect x="${x}" y="${y}" width="10" height="4" rx="2" fill="${c}" transform="rotate(${i * 37} ${x + 5} ${y + 2})" />`)
      .join("")}
    <path d="M224 128 l26 -18 v40 z" fill="#ff8fc2" ${line} />
    ${eye(124, 126, 6)}${eye(150, 126, 6)}
    ${water("#6fe7f0", 172)}`,

  pelican: `
    ${bubbles([[264, 44, 7], [40, 150, 6]])}
    <path d="M70 172 q10 -60 60 -78 q40 -14 70 14 q24 26 10 64 z" fill="#ffffff" ${line} />
    <path d="M128 136 q30 -6 52 14" fill="none" ${line} stroke-width="4" />
    <circle cx="120" cy="70" r="30" fill="#ffffff" ${line} />
    ${eye(124, 62, 6)}
    <path d="M144 70 L262 82 Q250 112 196 112 Q160 110 146 90 Z" fill="#ffb02e" ${line} />
    <rect x="190" y="88" width="56" height="38" rx="5" fill="#ffd23f" ${line} transform="rotate(8 218 107)" />
    <path d="M192 92 l26 18 26 -14" fill="none" ${line} stroke-width="3.5" transform="rotate(8 218 107)" />
    <path d="M214 112 l4 4 8 -9" fill="none" stroke="#ff4f9a" stroke-width="4" stroke-linecap="round" transform="rotate(8 218 107)" />
    ${water("#6fe7f0", 176)}`,

  // Full-bleed art for the secret rare. Portrait viewBox 0 0 300 420.
  splashking: `
    <defs>
      <radialGradient id="sk-sun" cx="50%" cy="38%" r="60%">
        <stop offset="0" stop-color="#ffe680" />
        <stop offset=".45" stop-color="#ff8fc2" stop-opacity=".55" />
        <stop offset="1" stop-color="#ff8fc2" stop-opacity="0" />
      </radialGradient>
    </defs>
    <circle cx="150" cy="150" r="120" fill="url(#sk-sun)" />
    ${Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2
      const x = 150 + Math.cos(a) * 260
      const y = 160 + Math.sin(a) * 260
      return `<path d="M150 160 L${x.toFixed(1)} ${y.toFixed(1)}" stroke="#fff" stroke-width="10" opacity=".14" />`
    }).join("")}
    <path d="M40 300 C60 230 90 250 96 200 C104 250 124 220 130 170 C140 220 160 220 170 168 C178 220 196 240 204 196 C212 250 240 236 262 300 Z" fill="#6fe7f0" ${line} />
    <path d="M70 290 C84 250 100 262 104 236 M196 236 C204 262 222 252 232 290" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8" />
    <circle cx="150" cy="150" r="58" fill="#ffd23f" ${line} />
    <circle cx="150" cy="150" r="44" fill="none" stroke="#fff" stroke-width="5" opacity=".7" />
    <text x="150" y="176" text-anchor="middle" font-family="Lilita One, sans-serif" font-size="78" fill="${ink}">7</text>
    ${bubbles([[60, 110, 10], [82, 70, 6], [236, 90, 12], [250, 140, 6], [44, 190, 5]])}
    ${water("#1fa5d6", 300)}
    ${water("#0b5fa5", 330)}
    <rect y="340" width="300" height="80" fill="#0b5fa5" />`,
}

// Small line icons for the move rows and the type badge.
export const icons = {
  wave: `<path d="M3 14c3-3 5-3 8 0s5 3 8 0" /><path d="M3 19c3-3 5-3 8 0s5 3 8 0" /><path d="M7 10c2-4 6-6 10-4" />`,
  clock: `<circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" />`,
  plus: `<rect x="4" y="5" width="16" height="15" rx="3" /><path d="M4 10h16M9 3v4M15 3v4M12 13v5M9.5 15.5h5" />`,
  pin: `<path d="M12 21s-6-5.5-6-10a6 6 0 0 1 12 0c0 4.5-6 10-6 10z" /><circle cx="12" cy="11" r="2.2" />`,
  phone: `<path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" />`,
  star: `<path d="M12 3l2.6 5.6 6 .6-4.5 4 1.3 6L12 16.2 6.6 19.2l1.3-6-4.5-4 6-.6z" />`,
  mail: `<rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3.5 7l8.5 6.5L20.5 7" />`,
  bag: `<path d="M5 8h14l-1 12H6z" /><path d="M9 8a3 3 0 0 1 6 0" />`,
}

export const typeIcon = {
  invite: "wave",
  when: "clock",
  where: "pin",
  gear: "bag",
  cake: "star",
  rsvp: "mail",
  star: "star",
}
