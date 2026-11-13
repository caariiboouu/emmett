# Emmett turns 7: party pack invite

A birthday invitation that opens like a pack of trading cards. Swipe across the top of the foil pack to tear it. Seven holo cards come out. Swipe or tap each card to see the next one. The last card is the secret rare. After the last card, all seven cards show in a binder, with the facts in plain words below.

Live address (after you publish): https://caariiboouu.github.io/emmett/

## Change the words

All card text is in [js/party.js](js/party.js). Change it there and the pack, the cards and the summary all change.

Open items:

- `party.rsvp`: Alenna by text or email. There is no reply-by date (`by` is empty), so the card shows none.
- The `gear` card is a guess. Change it to match the pool's party plan.
- Emmett's two moves on the last card.
- If the party facts change, also change [emmett-birthday.ics](emmett-birthday.ics). It needs CRLF line endings and UTC times (2 PM Central in December = 20:00 UTC).

## Add your own images

Prompts for Gemini, one per card, are in [art/PROMPTS.md](art/PROMPTS.md).

Put the file in `art/` and set `art: { img: "art/your-file.webp", focus: "50% 40%" }` on the card in `js/party.js`. The art window takes the height the words leave free, so the image is cropped differently on each card. `focus` is the point that stays in view. Square images work well.

| Card | Shape | Size |
| --- | --- | --- |
| Cards 1–6 (art window) | square or 4:3 | 800 × 800 or larger |
| Card 7, Emmett (full card) | 63:88 portrait | 1260 × 1760 |
| Link preview (`art/share.png`) | 1.91:1 | 1200 × 630 |

On card 7, keep the top 15% and the bottom 40% quiet. The name and the moves sit there. Use WebP or JPEG, under 400 KB each. A drawn creature has a see-through background, so the foil shows behind it. A photo has no see-through parts, so the foil goes on top at a lower strength.

## Run it on your computer

```bash
python3 -m http.server 8417 --bind 127.0.0.1
```

Then open http://localhost:8417/. The page uses JavaScript modules, so opening `index.html` as a file does not work.

## Publish

1. Make a GitHub repo named `emmett` under `caariiboouu`.
2. Push this folder to it.
3. In the repo settings, open Pages. Set the source to the `main` branch, root folder.
4. On a phone, open the live address. Check the tear, the swipe, "Add to calendar" and "Get directions".

The page has `noindex`, so search engines do not list it. Anyone with the link can still open it. The `research/` folder also publishes, at `/emmett/research/demos/`.

## Performance rules

The page must not drop frames on a phone. Keep these rules when you change it:

- Anything that moves per frame moves by `transform` or `opacity` only, on a layer with `will-change: transform`. Do not tie gradients, `background-position`, masks or filters to the pointer.
- SVG filters (`#crinkle`, `#bevel`, `#diecut`) sit on content that does not change, inside a layer that has `will-change`, so they render once.
- No `backdrop-filter` and no CSS `filter: blur()` on anything that moves or sits over something that moves.
- New layers are prepared ahead of time: the hidden deck draws at opacity 0.01, the next card gets its layers in an idle moment, and the binder lays out invisibly while a guest reads a card.

Check with Chrome DevTools at 4x CPU slowdown: no frame should go past 25 ms.

## How it works

| File | Job |
| --- | --- |
| `js/party.js` | Party facts and the seven cards |
| `js/art.js` | Drawn placeholder creatures and icons |
| `js/render.js` | Card markup, map and calendar links, countdown |
| `js/holo.js` | Foil motion. Idle sway runs as Web Animations on the GPU thread; a finger, the mouse or phone tilt switches to a small loop. Both write only `transform` |
| `js/main.js` | Tear, card stack, binder, close-up view, confetti |
| `css/card.css` | Card frame and foil layers (from `research/demos/foil.css`) |
| `css/pack.css` | Foil pack, zigzag seals, rip line |

Foil technique credits are in [research/README.md](research/README.md): Jhey Tompkins (@jh3yy) and Simon Goellner.

Phone tilt: Android uses it with no question. iPhone asks first, so the page shows a "Tilt to shine" button after the pack opens. Without tilt, a finger drag moves the foil.
