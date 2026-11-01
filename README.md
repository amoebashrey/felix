# felix landing

A single-page, scrollable, informational landing site for Felix — Amber's internal Slack triage bot.

## Files

```
felix/
├── index.html              single-file site (inline <style> + page script)
├── felix-motion.js         page behaviour (nav scrolled state, FAQ accordion); motion hooks for the next round
├── tokens.css              shrey.lab design tokens — verbatim copy, do not edit
├── felix.css               sub-brand overrides (white page, gray ink, rules, guides, washes, path colours)
├── DESIGN.md               the shipped design system, derived from the build
├── PRODUCT.md              durable product context (who Felix is for, what it does)
├── assets/
│   ├── felix-mascot.png        original pixel mascot (opaque background)
│   ├── felix-mascot-cut.png    transparent cutout — the one the site uses
│   └── favicon.svg
└── README.md
```

## Running it

No build step. Serve the folder:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

### Dependencies

- Fonts from Google Fonts: Geist (display + body), Geist Mono (data), VT323 (Felix's voice).
- Icons: Lucide (https://lucide.dev), inlined as SVG at 1.75 stroke. To add one, copy the `<path>` body from `lucide-static` and wrap it in the same `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">` shell.
- No other dependencies in this round. Every graphic is HTML/CSS/SVG in its resting state; the animation round may bring GSAP back.

## What lives where

- **Brand tokens** (color, type, spacing, motion) → `tokens.css`. Inherited from shrey.lab. Do not edit.
- **Felix-specific overrides** (page/ink/line/guide/wash variables, path colours, mascot and Felix-voice classes) → `felix.css`.
- **Layout, components, section styles, graphics, preloader curtain** → inline in `index.html`. The graphics are plain markup: the hero pipeline (incoming Slack cards → Felix agent card → three outcome cards), dispatch before/after SVGs, thread cards with score bars, the similarity radar SVG, the stack table, the KB scan grid.
- **Behaviour** → `felix-motion.js` (nav state, FAQ accordion, `window.__felixOnce` hook for later motion, and the hero connector overlay: an SVG drawn from measured card rects, incoming → Felix → outcomes, hidden under 960px).
- **Graphic language** (2026-10-01, user-pinned, round 3): sequencehq.com supplies the visual world (full-height 1px rules, a 1080px column, dashed blueprint guides, blue washes, flat white product-mock cards, icon tiles in bordered tables, pill buttons and status pills); Felix supplies the subject. The standing correction still applies: every graphic must make sense for Felix (a Slack triage bot), not copy the reference's content. The typeface is not copied (Geist stays) and there is no video. Graphics shipped first as static end states; subtle animation is the next round.
- **Section gap** `.path-gap` (2026-10-01): an empty 112px white band between the path rows with full-viewport hairlines above and below (64px under 960px), matching the reference's spacing between product sections.
- **Figma** (2026-10-01): the desktop page is pushed to the "Ppt" Figma file (Page 2, frame "Felix · Desktop 1440") as a generated auto-layout build. It mirrors the DOM one-to-one, so regenerate it from the page instead of editing it by hand. See DESIGN.md §4b for the known import gaps.
- **Type scale** in Geist, measured from sequencehq.com (2026-10-01): kicker 16/16 (28 below), h1 46/1.0 (40 below), h2 40/1.0, path h3 36/1.0, cell titles 13/19.5, hero sub 18/28, lead 16/26, body 14/24, cell body 12/19.5, captions 12, mono 11–12 for scores. Section heads are kicker + h2 left, lead right, 64px above the content.

## Locked rules

- Lime appears in exactly two places: footer monogram + roadmap "Shipped" pulse dot. Nowhere else.
- VT323 (`.felix-voice` class) is reserved for Felix's spoken words only.
- Headlines are Geist 500 with tight tracking in #505050; no coloured emphasis spans.
- Green = Resolve, purple = Ask, orange-red = Escalate. Every triage graphic uses this coding.
- The page is light mode (white, no dark bands). Near-black is the only action colour.
- The preloader curtain ("On it.") and its timings are not to be changed.
- Copy was tightened in the light-mode round (2026-10-01) at the user's request: short headlines and leads; long text only where it carries proof (path rows, FAQ, roadmap, closing note). Product facts (threshold, KB counts, stack, roadmap items) are unchanged.

## Capturing the page headless

Captures are taken with the Dia browser's binary (`/Applications/Dia.app/Contents/MacOS/Dia --headless=new --remote-debugging-port=N --user-data-dir=<fresh dir>`); headless Dia opens no page, so create one with `PUT /json/new?about:blank`. Capture in 2000px tiles and hide `#felix-nav` after the first tile (the nav is fixed, so hiding it does not shift the flow). When the motion round lands, call `progress(1)` on every entry in `window.__felixOnce` before capturing.

## Before publish

The dispatch timings in the Problem section are labeled illustrative; replace them with measured numbers when you have them.
