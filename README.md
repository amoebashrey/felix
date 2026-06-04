# felix landing

A single-page, scrollable, informational landing site for Felix — Amber's internal Slack triage bot.

## Files

```
felix/
├── index.html         single-file site (inline <style> + <script>)
├── tokens.css         shrey.lab design tokens — verbatim copy, do not edit
├── felix.css          sub-brand overrides (rust replaces lime as protagonist)
├── assets/
│   ├── felix-mascot.svg    placeholder pixel mascot — swap for PNG when ready
│   └── favicon.svg
└── README.md
```

## Running it

Open `index.html` in a browser. No build step, no dependencies, no server required.

```bash
open index.html
```

For a quick local server (useful for testing relative paths):

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Swapping the mascot PNG in

When the real Felix mascot PNG is ready, drop it at `assets/felix-mascot.png` and run:

```bash
sed -i '' 's|felix-mascot\.svg|felix-mascot.png|g' index.html
```

That's it — every reference flips at once.

## What lives where

- **Brand tokens** (color, type, spacing, motion) → `tokens.css`. Inherited from shrey.lab. Do not edit.
- **Felix-specific overrides** (rust accent, path colors, Felix voice class) → `felix.css`.
- **Everything else** (layout, components, all section styles, JS) → inline in `index.html`.

## Locked rules

- Lime appears in exactly two places: footer monogram + roadmap "Shipped" pulse dot. Nowhere else.
- VT323 (`.felix-voice` class) is reserved for Felix's spoken words only.
- One italic Instrument Serif break per section heading. Don't add more.
- Copy is verbatim from the approved brief. Don't paraphrase.

## Placeholders to fill in before publish

Search for `TODO:` in `index.html` — there are two link rows (credits section + footer) pointing at `#` that need real URLs (Notion workspace, internal repo, feedback channel). The FAQ's "How do I report a bug" question also has a `[Insert preferred contact channel…]` placeholder.
