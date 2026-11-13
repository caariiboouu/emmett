# Image prompts for Gemini

Use one Gemini chat for all seven images, so the style stays the same. Paste the **style block** first, then one **card prompt** at a time. Ask for the next card with "Same style, next one:" and the card prompt.

The prompts do not name any game or brand. A brand name makes image models copy that brand's characters, and the cards must be original monsters.

## Style block (paste this first)

```
You are illustrating an original set of collectible monster trading cards for a 7-year-old's swim party. Every image is one card's art window.

Style: bright, bold anime-style creature illustration, like the art on a premium holographic trading card. Clean confident ink outlines, cel shading with soft gradients, glossy highlights, big expressive eyes, chunky rounded shapes a child can draw from memory. One clear hero creature per image, in a dynamic action pose, with a sense of motion (splashes, sparkles, speed lines).

Setting: an indoor swimming pool world. Turquoise water, bubbles, light ripples, pool tiles, splash droplets. Colors: pool blues and aquas, with pool-noodle pink, sunny yellow and lime as accents.

Rules:
- The creature is fully original. Do not copy any existing game, show, or brand character.
- No text, letters, numbers, logos, borders, or card frames in the image. The card adds those.
- Keep the creature centered with space around it. The edges get cropped.
- Background: a simple pool scene, slightly darker than the creature, so the creature pops.
- Friendly and cute, never scary.

Say "ready" and wait for the first card.
```

## Card prompts

Cards 1–6 are **landscape 3:2** (ask for 1200 × 800 or larger). Card 7 is **portrait** (ask for 1260 × 1760, ratio 63:88).

**1. Splash Bash (invite), file `art/splash-bash.webp`**
```
Landscape 3:2. A bubbly little sea-creature mascot with a fin crest rides a giant shiny pink inflatable pool float in the shape of the number seven, bursting up out of the water in a huge celebratory splash. Confetti and bubbles fly everywhere. Party energy.
```
(This one may draw the 7. If it adds other text, ask again with "remove all text".)

**2. Clockshell (party day), file `art/clockshell.webp`**
```
Landscape 3:2. A cheerful sea turtle creature whose shell is a round teal alarm clock with a white clock face and two little bells on top. It swims fast through clear pool water, clock hands pointing near 2 o'clock, small bubbles trailing behind.
```

**3. Pinchpin (the place), file `art/pinchpin.webp`**
```
Landscape 3:2. A bold coral-red crab creature with eyes on stalks proudly holds a big yellow map-pin marker above its head with both claws, standing on the edge of a swimming pool with water splashing around it. Adventurous and confident.
```

**4. Packtopus (what to bring), file `art/packtopus.webp`**
```
Landscape 3:2. A purple octopus creature juggles swim gear with its eight arms: a swimsuit, a striped towel, swim goggles, a pool noodle, and a small beach bag. Mid-juggle, happy and busy, floating in sparkling pool water.
```

**5. Frostfin (cupcakes), file `art/frostfin.webp`**
```
Landscape 3:2. A fish creature made of a cupcake: pink cupcake-wrapper body, white frosting swirl on top with rainbow sprinkles, a single lit birthday candle like a crest, and a frosting tail fin. Two tiny cupcake fish friends swim beside it. It leaps out of the pool water happily.
```

**6. Postal Pelican (RSVP), file `art/postal-pelican.webp`**
```
Landscape 3:2. A white pelican creature in a little mail-carrier cap swoops low over a swimming pool, carrying a bright yellow envelope with a pink heart seal in its big orange beak. Wings spread wide, droplets flying.
```

**7. Emmett (the secret rare), file `art/emmett.webp`**
```
Portrait, 63:88 ratio (1260 x 1760). The secret rare card: full-art, the most epic image in the set. A 7-year-old boy hero mid-cannonball above a pool, knees tucked, huge joyful grin, an enormous crown-shaped splash erupting below him. Golden light rays and rainbow sparkles behind him, bubbles all around. Keep the top 15% and the bottom 40% calm and simple (sky and water), because text sits there. Put the boy in the middle band.
```
To make him look like Emmett, attach a photo and add: "Base the boy on the attached photo, in the same illustrated style."

## After you have the images

1. Save each one into `art/` with the file name above. Export as WebP or JPEG, under 400 KB.
2. In `js/party.js`, set the card's art, for example `art: { img: "art/clockshell.webp" }`. For Emmett, keep `full: true`: `art: { img: "art/emmett.webp", full: true }`.
3. Or send them to Claude, and Claude wires them in and checks how they look under the foil.
