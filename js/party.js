// All the words on the cards live in this file.
// Change a line here and the pack, the cards and the summary all change.

export const party = {
  kid: "Emmett",
  age: 7,

  // Central time, no daylight saving in December: 2 PM CST = 20:00 UTC.
  start: "2026-12-05T20:00:00Z",
  end: "2026-12-05T22:00:00Z",
  dateLabel: "Saturday, December 5",
  timeLabel: "2:00 – 4:00 PM",

  venue: "Goldfish Swim School",
  venueArea: "Tulsa Hills",
  street: "7514 South Olympia Avenue",
  city: "Tulsa, OK 74132",
  phoneLabel: "539.233.6295",
  phoneHref: "tel:+15392336295",

  // RSVP goes to Alena by text or email. "by" is the reply-by date: leave it "" for no date.
  rsvp: {
    name: "Alena",
    phone: "+14158906365",
    phoneLabel: "415.890.6365",
    email: "alenachubenko@gmail.com",
    by: "",
    message: "RSVP for Emmett's party: ",
  },
}

// Card art: each card can use a drawn creature (key in art.js) or an image file.
// To use an image, set img: "art/emmett.webp". See README.md for the sizes.
//
// Order is the order in the pack. The last card is the secret rare.
export const cards = [
  {
    id: "invite",
    name: "Splash Bash",
    type: "invite",
    typeLabel: "Invite card",
    stat: 70,
    rarity: "holo",
    art: { svg: "float7" },
    big: "Emmett is turning 7!",
    lines: ["You are invited to his birthday swim party."],
    moves: [{ icon: "wave", name: "Big splash", value: "Pool party" }],
    flavor: "Rare in the wild. Found only in this pack.",
  },
  {
    id: "when",
    name: "Clockshell",
    type: "when",
    typeLabel: "Party-day card",
    stat: 120,
    statNote: "120 minutes of fun",
    rarity: "holo",
    art: { svg: "turtle" },
    big: "Saturday, December 5",
    lines: ["2:00 – 4:00 PM"],
    moves: [
      { icon: "clock", name: "Countdown", value: "{countdown}" },
      { icon: "plus", name: "Add to calendar", href: "emmett-birthday.ics", value: "Save" },
    ],
    flavor: "Its shell ticks louder as the party gets closer.",
  },
  {
    id: "where",
    name: "Pinchpin",
    type: "where",
    typeLabel: "Tulsa Hills",
    stat: 30,
    rarity: "holo",
    art: { svg: "crab" },
    big: "Goldfish Swim School",
    lines: ["7514 South Olympia Avenue", "Tulsa, OK 74132"],
    moves: [
      { icon: "pin", name: "Get directions", href: "{maps}", value: "Go" },
      { icon: "phone", name: "Call the pool", href: "tel:+15392336295", value: "539.233.6295" },
    ],
    flavor: "Never gets lost. Always walks sideways.",
  },
  {
    id: "gear",
    name: "Packtopus",
    type: "gear",
    typeLabel: "Gear card",
    stat: 40,
    rarity: "reverse",
    art: { svg: "octopus" },
    // Editable guess: change the list to what the pool asks for.
    big: "Pack your splash kit",
    list: ["Swimsuit", "Towel", "Goggles, if you like them", "Dry clothes for after"],
    moves: [],
    flavor: "Eight arms. Zero forgotten towels.",
  },
  {
    id: "cake",
    name: "Frostfin",
    type: "cake",
    typeLabel: "Treat card",
    stat: 99,
    rarity: "reverse",
    art: { svg: "cupcake" },
    big: "Cupcakes after the swim",
    lines: ["We dry off, sing, and eat birthday cupcakes."],
    moves: [{ icon: "star", name: "Make a wish", value: "×7" }],
    flavor: "Swims fastest when someone says the word cupcake.",
  },
  {
    id: "rsvp",
    name: "Postal Pelican",
    type: "rsvp",
    typeLabel: "Reply card",
    stat: 50,
    rarity: "holo",
    art: { svg: "pelican" },
    big: "{rsvpBig}",
    lines: ["{rsvpLine}"],
    moves: [
      { icon: "phone", name: "Text Alena", href: "{rsvpSms}", value: "{rsvpPhone}" },
      { icon: "mail", name: "Email Alena", href: "{rsvpMail}", value: "Email" },
    ],
    flavor: "Carries every reply in its beak. Drops none.",
  },
  {
    id: "emmett",
    name: "Emmett",
    type: "star",
    typeLabel: "Birthday boy",
    stat: 777,
    level: 7,
    rarity: "secret",
    art: { svg: "splashking", full: true },
    big: "",
    lines: [],
    // TODO(Joel): give Emmett's card his real best moves.
    moves: [
      { icon: "wave", name: "Cannonball", text: "Makes the biggest splash in the pool.", value: "70" },
      { icon: "star", name: "Seven candles", text: "Blows out all seven in one breath.", value: "7" },
    ],
    flavor: "One of a kind. Just like him.",
  },
]
