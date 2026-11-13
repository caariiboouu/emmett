# Emmett turns 7: party pack invite

A birthday invitation that opens like a pack of trading cards. Swipe across the top of the foil pack to tear it. Seven holo cards come out. Swipe or tap each card to see the next one. The last card is the secret rare. After the last card, all seven cards show in a binder, with the facts in plain words below.

Live address (after you publish): https://caariiboouu.github.io/emmett/

## Change the words

All card text is in [js/party.js](js/party.js). Change it there and the pack, the cards and the summary all change.

Open items:

- `party.rsvp`: Alena by text or email. There is no reply-by date (`by` is empty), so the card shows none.
- The `gear` card is a guess. Change it to match the pool's party plan.
- Emmett's two moves on the last card.
- If the party facts change, also change [emmett-birthday.ics](emmett-birthday.ics). It needs CRLF line endings and UTC times (2 PM Central in December = 20:00 UTC).

## Add your own images

Prompts for Gemini, one per card, are in [art/PROMPTS.md](art/PROMPTS.md).

Put the file in `art/` and set `art: { img: "art/your-file.webp", focus: "50% 40%" }` on the card in `js/party.js`. The art window takes the height the words leave free, so the image is cropped differently on each card. `focus` is the point that stays in view. Square images work well.

| Card | Shape | Size |
| --- | --- | --- |
| Cards 1–6 (art window) | 3:2 landscape | 1200 × 800 |
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

## How it works

| File | Job |
| --- | --- |
| `js/party.js` | Party facts and the seven cards |
| `js/art.js` | Drawn placeholder creatures and icons |
| `js/render.js` | Card markup, map and calendar links, countdown |
| `js/holo.js` | One loop that moves the foil: finger or mouse first, then phone tilt, then a slow drift |
| `js/main.js` | Tear, card stack, binder, close-up view, confetti |
| `css/card.css` | Card frame and foil layers (from `research/demos/foil.css`) |
| `css/pack.css` | Foil pack, zigzag seals, rip line |

Foil technique credits are in [research/README.md](research/README.md): Jhey Tompkins (@jh3yy) and Simon Goellner.

Phone tilt: Android uses it with no question. iPhone asks first, so the page shows a "Tilt to shine" button after the pack opens. Without tilt, a finger drag moves the foil.
