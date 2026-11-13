# Holo cards, stickers, and a pack unwrap

Reference for a birthday invitation that opens like a pack of trading cards. The monsters and the party facts are made up. Nothing here uses Pokémon names, marks, or card frames.

The studies are original implementations of techniques posted by [Jhey Tompkins](https://x.com/jh3yy) and the related foil work by [Simon Goellner](https://poke-holo.simey.me/). Open `demos/index.html` in a browser. Party lines in the demos (`Saturday, after dark`, `The backyard`, `A sweater`) are placeholders.

## Studies

| File | What to try |
| --- | --- |
| [demos/pack.html](demos/pack.html) | Open the wrapper. Cards fan. Click one to lift it. |
| [demos/holo-card.html](demos/holo-card.html) | Move over the card. Switch common / rare / secret. |
| [demos/sticker.html](demos/sticker.html) | Die-cut rim, specular light, foil wings, knockout label. |
| [demos/edges.html](demos/edges.html) | Angled inset rim, proximity border, blurred icon glow. |

Reusable pieces: `demos/foil.css` (the card) and `demos/pointer.js` (the pointer math).

## What to build next time

1. Start from `pack.html`. The open, fan, and lift is the invitation.
2. Replace the five placeholder facts with the real party details. One fact per card, the way the kicker is already split (`When`, `Where`, `Bring`, `Eat`, `You`).
3. Keep the holo on the picture, with the words above `.holo-fx`, so the facts stay readable.
4. Put one die-cut sticker on the wrapper, from `sticker.html`, as the seal.
5. Use the angled rim from `edges.html` on the card that is lifted.

CSS is enough for this sequence. GSAP is worth adding only if the open needs branching timing, a replay with sound, or a drawn tear. Jhey uses GSAP that way on the trading-card pen (intro glare, then activate).

## Pointer contract

`bindSurface(el)` writes `--px` and `--py` from `-1` to `1`. Zero is the center. Positive `--py` is below center.

```js
const px = ((clientX - box.left) / box.width) * 2 - 1
const py = ((clientY - box.top) / box.height) * 2 - 1
```

Tilt so the face turns toward the pointer:

```css
transform: rotateX(calc(var(--py) * 12deg)) rotateY(calc(var(--px) * -14deg));
```

`isolation: isolate` on `.holo` keeps `color-dodge` and `overlay` inside the card.

## Holo layers

Bottom to top, inside `.holo`:

1. **Art.** Mid-dark. Foil on a light illustration blows out to white.
2. **Foil.** A wide repeating rainbow, plus 1px scanlines. `mix-blend-mode: color-dodge`. `background-position` tracks `--px` / `--py`. A dot grid on top, `overlay`, is the grain.
3. **Bars.** A soft repeating gradient, translated by the pointer. This is the “sunpillar” streak.
4. **Refraction.** Two huge radial spectra anchored to opposite corners. Scale and translate them from `--px` / `--py`. `color-dodge`.
5. **Spotlight.** A radial highlight positioned at the pointer. `mix-blend-mode: overlay`.
6. **Type.** Above the effects.
7. **Edge.** An inset white shadow, masked by an angled gradient so only part of the rim lights up.

Rarity is one attribute:

- `common` hides foil, bars, and refraction. The spotlight stays.
- `rare` clips `.holo-fx` to the art window: `clip-path: inset(22% 8% 34% 8% round 12px)`.
- `secret` leaves the foil full-bleed and raises its opacity.

Card proportion is `63 / 88`, the ordinary trading-card ratio.

Jhey’s own description of the July 2025 card: masked layers, `mix-blend-mode`, pointer driving scale and translate of the colored gradients. The pen is [Parallax TechTrades](https://codepen.io/jh3y/pen/EaVNNxa). His layer names there are image, pattern (texture mask, `multiply`), watermark (pattern mask, `hard-light`), refraction (the two corner gradients), spotlight, and an intro glare stripe. `foil.css` keeps that stack and drops the CodePen texture URLs in favor of gradients, so the studies have no external assets.

Simon’s rarity sheets (rare holo, cosmos, rainbow) are the other half of the look: several backgrounds on one element, `background-blend-mode`, then `mix-blend-mode: color-dodge` against the print, with `--pointer-x` and `--pointer-y` as percentages. Those stylesheets are GPL-3.0. Read them for the idea, and keep using `foil.css` in this repo.

Useful blend modes, in the order worth trying: `color-dodge` for the rainbow, `soft-light` or `overlay` for streaks and the spotlight, `hard-light` for a pattern that should punch through, `multiply` for a grain or a printed texture.

## Sticker

Jhey’s recipe, from the February 2025 thread:

1. Dilate `SourceAlpha` with `feMorphology`.
2. `feFlood` the outline color.
3. `feComposite` the flood `in` the dilated alpha.
4. `feMerge` that outline under `SourceGraphic`.

The study also displaces the dilated alpha with `feTurbulence` so the rim wobbles, then adds `feSpecularLighting` / `fePointLight` and a drop shadow. Move the light with the pointer in CSS pixels inside the filtered element. The filter region is expanded (`x="-30%" y="-30%" width="160%" height="160%"`) or the rim clips. Do not put `display: none` on the `<svg>` that holds the filter.

The foil on the wings is a second copy of the shapes, `fill="url(#foil)"`, `mix-blend-mode: color-dodge`. The gradient center follows the pointer.

Knockout label, from his October 2026 note:

```css
.label {
  background: #111;
  color: #fff;
  mix-blend-mode: multiply;
}
```

White type drops out and shows whatever is behind the sticker. The label has to sit on the colorful surface, in the same group, with no `isolation` between them.

Pen: [SVG Filter Sticker Effects](https://codepen.io/jh3y/pen/OPJyVGb). He credits [Artur Bień’s stickers](https://expensive.toys/toys/stickers) for the earlier filter work.

## Edges and glow

**Angled rim.** A pseudo-element with an inset white `box-shadow`, masked by a `linear-gradient` at an angle. Rotate that angle from the pointer. `corner-shape: squircle` is a progressive extra (Chromium). Pen: [WbwyGBb](https://codepen.io/jh3y/pen/WbwyGBb).

**Proximity border.** `conic-gradient` masked down to the border ring (`mask-composite: exclude`, and `-webkit-mask-composite: xor`). The angle is `atan2` from the element center:

```js
let angle = Math.atan2(event.clientY - cy, event.clientX - cx) * 180 / Math.PI
if (angle < 0) angle += 360
el.style.setProperty("--angle", angle + 90)
```

Fade it with distance from the card. Post: [proximity glow border](https://x.com/jh3yy/status/1734369933558010226). Blur the ring, not the card.

**Icon glow.** Duplicate the mark, scale it up, `filter: blur(28px) saturate(5) brightness(1.3)`, and translate the copy from the pointer. He first built it with `feGaussianBlur`; the CSS filter is the later, simpler version. Pens and posts: [the glow](https://x.com/jh3yy/status/1992003440579662211), [CSS blur follow-up](https://x.com/jh3yy/status/2024146610398130486), [WbwZaNa](https://codepen.io/jh3y/pen/WbwZaNa).

## Pack

The wrapper is two halves of one metallic gradient, clipped at a perforated seam. `feTurbulence` plus `feDisplacementMap` crinkles the foil. A soft white streak loops across it while it is sealed.

On open:

- The top half translates up and rotates on X. The bottom half goes down.
- The shell fades and drops its pointer events.
- Each card waits `0.22s + index * 60ms`, then translates and rotates off `--i`.
- A later click sets `.is-up`, which replaces the fan transform with a lift. Click again to put it back.

`--fan: min(78px, 12vw)` keeps the fan on a phone. The secret card is the one in the middle.

While the pack is sealed, the pack itself tilts. After it opens, each card tilts on its own `--px` / `--py`, and the pack transform is cleared so the two rotations do not stack.

## Sources

Jhey Tompkins, [@jh3yy](https://x.com/jh3yy):

- [Holographic trading card breakdown](https://x.com/jh3yy/status/1949978087497638367) (28 Jul 2025). Pen: [EaVNNxa](https://codepen.io/jh3y/pen/EaVNNxa).
- [background-blend-mode parallax holo](https://x.com/jh3yy/status/1883518766337946010) (26 Jan 2025).
- [SVG sticker filters](https://x.com/jh3yy/status/1891223188010360852) (16 Feb 2025) and the pen link in that thread, [OPJyVGb](https://codepen.io/jh3y/pen/OPJyVGb).
- [Context-aware card glow](https://x.com/jh3yy/status/1992003440579662211) (21 Nov 2025), code in [WbwZaNa](https://codepen.io/jh3y/pen/WbwZaNa), CSS-filter note in [the follow-up](https://x.com/jh3yy/status/2024146610398130486).
- Shine border pen [WbwyGBb](https://codepen.io/jh3y/pen/WbwyGBb), posted with [this note](https://x.com/jh3yy/status/1994921151139918025).
- [Proximity glow border](https://x.com/jh3yy/status/1734369933558010226) (12 Dec 2023).
- [Knockout type with multiply](https://x.com/jh3yy/status/2108593170569175495) (9 Oct 2026).

Related:

- Simon Goellner, [Pokémon cards CSS](https://github.com/simeydotme/pokemon-cards-css) and the live demo [poke-holo.simey.me](https://poke-holo.simey.me/). GPL-3.0. A smaller tilt helper he published separately: [hover-tilt](https://github.com/simeydotme/hover-tilt).
- Robb Owen, [CSS blend-mode shaders](https://robbowen.digital/wrote-about/css-blend-mode-shaders/).
- Artur Bień, [expensive.toys/toys/stickers](https://expensive.toys/toys/stickers).

## Check on a phone

`mix-blend-mode`, `clip-path`, and CSS masks are fine in current Safari, Chrome, and Firefox. SVG lighting and displacement on HTML have been uneven in Safari, so look at the sticker rim and the crinkled wrapper there. `corner-shape: squircle` only changes the edge demos in Chromium. The studies listen to pointer events, so a finger drag tilts. They do not use device orientation.
