# Felix — Design System (as shipped, 2026-10-01, round 3: blueprint)

Derived from the built `index.html`, `felix.css` and `tokens.css`. Reference world: sequencehq.com (grid lines, colour, spacing, flat product-mock graphic style). Not copied from it: the serif typeface (Geist stays) and video (none). Graphics ship as static end states; subtle motion is the next round.

## 1. Ground and frame

- Page is white (`--page #FFFFFF`). No dark bands.
- Two outer rules run the full page height at `max(16px, 50% − 680px)` from each edge; the inner column (`.wrap`, 1080px) carries its own left/right rules. Horizontal `.rule` lines (1px `--line #EFEFEF`) separate sections. Rules are hidden under 1140px.
- Section padding 96px (72px under 960px). Inner gutter 40px (16px under 600px).
- Between the three path rows sits `.path-gap`: an empty 112px white band (64px under 960px) whose top and bottom hairlines span the full viewport, as in the reference's product-section breathing room.
- Graphic cells use dashed guides (`1px dashed --guide #D0D9E4`, `.guide-v`/`.guide-h`) and blue washes: `.wash--hero` (two radial blooms over a `#F1F4F8 → #FFFFFF` fall-off), `.wash--cell` (`#F1F4F8 → #E4E8EF` diagonal), `.wash--cool` (`#FFFFFF → #E3EAF6`).

## 2. Colour

| Token | Value | Use |
|---|---|---|
| `--ink` | #202120 | primary button, Felix's voice, strongest text |
| `--fg` | #505050 | headings, strong text, card titles |
| `--fg-2` | #666666 | body, leads, nav links (5.7:1 on white, 4.9:1 on `--surface`) |
| `--fg-3` | #717171 | captions, kickers' dot, mono scores (4.9:1 on white, 4.6:1 on `--surface`; darkened 2026-10-01 for WCAG AA at 11–12px) |
| `--line` / `--line-2` / `--line-3` | #EFEFEF / #E2E2E2 / #D5D5D5 | frame rules / card borders / scrollbar |
| `--guide` | #D0D9E4 | dashed blueprint guides, connector lines |
| `--wash-1..3` | #F1F4F8 / #E4E8EF / #D1D9E4 | washes behind mocks |
| `--cool`, `--cool-2`, `--cool-text` | #CBD8F0 / #E3EAF6 / #485972 | document bars, avatars, "1.8s" pill |
| `--surface` | #F7F7F7 | secondary button, checklist strip, scan cells |
| Resolve | #2E7317 text · #3CA357 dot · #EAF8EF tint | pills, lit outcome card, radar ring, KB hit |
| Ask | #6E3FD6 · #A565FF · #F1EAFF | pills, score bar lane, radar dot, "Next" pill |
| Escalate | #C6360F · #FF4D25 · #FFF0EB | pills, dispatch "not us" hops and badges |
| lime-400/500 | tokens.css | only the roadmap "Shipped" dot and the footer monogram |

`::selection` is Ask purple on white. Focus ring: white gap + Ask purple.

## 3. Type (Geist throughout; VT323 for Felix's words only)

| Role | Size / line | Weight · tracking | Colour |
|---|---|---|---|
| h1 `.h1` | 46 / 1.0, 40px below (40 ≤960, 34 ≤600) | 500 · −0.025em | `--fg` |
| h2 `.h2` | 40 / 1.0 (32, 28) | 500 · −0.025em | `--fg` |
| path h3 | 36 / 1.0, 24px above and below (30, 26) | 500 · −0.025em | `--fg` |
| h3 `.h3` | 20 / 1.3; feature and layer titles 13 / 19.5, 4px below | 500 · −0.015em (cells 0) | `--fg` |
| hero sub `.hero-sub` | 18 / 28, 32px below | 400 | `--fg-2` |
| lead `.lead` | 16 / 26 (section heads, path rows, credits) | 400 | `--fg-2` |
| body | 14 / 24 (feature and layer cells 12 / 19.5) | 400 | `--fg-2` |
| kicker `.kicker`, `.hero-kicker` | 16 / 16 with a 6px dot, 28px below (hero 16/20, 32px below; 14px ≤600) | 400 | `--fg` |
| caption `.small`, labels | 12 / 18 | 400 | `--fg-3` |
| mono | 11–12px Geist Mono | scores, versions, §-numbers | `--fg-3` |
| Felix's voice | VT323, 1.125em (16–17px in cards) | — | `--ink` |

Section heads are a two-column grid: kicker + h2 left, lead right (stacked under 960px), with 64px below the head (40px ≤600). The hero is centered. Sizes, leading and the kicker → heading → lead rhythm were measured from sequencehq.com at 1440 on 2026-10-01; weight stays Geist 500 where Sequence uses 300/400.

## 4. Components

- **Buttons** `.btn`: 40px pills, 14px/500, 18px side padding; primary near-black on white text; secondary `--surface` with `--line-2` border and a 14px arrow icon. `.btn--sm` 32px for the nav.
- **Pills** `.pill`: 22px, 12px/500, lane tints (`--resolve/--ask/--escalate`), `--cool` for timings, gray default. A 6px dot precedes lane pills.
- **Tiles** `.tile`: 36px white rounded squares (9px radius), hairline border, soft shadow, 16px line icon; `.tile--sm` 28px (22px inside the Felix card).
- **Icons**: Lucide, inlined as SVG (`viewBox 0 0 24 24`, `stroke="currentColor"`, `stroke-width 1.75`, round caps and joins, `aria-hidden`). Used: arrow-down, arrow-right, arrow-up-right, text, target, check, circle-help, message-square, repeat, shuffle, file-x, hash, split, waypoints, database, zap, scan-search. No emoji or hand-drawn glyphs in tiles.
- **Mock** `.mock`: white, 1px `--line-2`, 12px radius, `--shadow-card`. Used for Slack cards, the Felix agent card, outcome cards, thread cards, the scan card.
- **Bordered tables**: `.feature-table` (3 cols), `.stack-table` (5 cols with small arrow discs on the dividers), `.kb-domains` (2 cols), `.roadmap` (4 cols), `.hero-meta` (4 cols). All collapse to one or two columns under 960px.
- **Thread card** (path rows): channel bar, incoming message, "What Felix did" checklist on `--surface` with mono scores, Felix's reply in VT323, footer with status pill and a 150px score bar (escalate 65% / ask 20% / resolve 15% zones, dashed 0.65 tick, 2px black marker at the row's score).
- **Radar** (similarity): dotted concentric rings at 0.00 / 0.20 / 0.45 / 0.65 (the 0.65 ring solid green), dotted axes, the KB as a white chip at the centre, each message a lane-coloured dot with a halo at distance (1 − score) × 214px. The 0.65 and 0.45 bands are tinted (resolve / ask). Each dot has a thin leader line to a white chip ("quote" + mono score); the Ask tie is two purple dots joined by a dashed arc. Chips stay inside the 460 box so nothing clips at 390px.
- **Dispatch** (problem): 360×220 SVG (12.5px labels, 11px badges, chips with a drop shadow, 104px team tiles) on a washed cell with dashed centre guides; team tiles, a message chip, dashed orange hops with "not us" badges (before) or a single solid green hop through a Felix chip with green badges (after).
- **KB scan**: 8 domain rows (§1–§8) of section cells, best match §1.2 filled green, near matches 1.1 / 1.4 / 3.2 cool-tinted, empty slots dashed; head is a scan-search tile + query chip + "384-dim"; footer with the winning section and a Resolve pill.
- **Score bar** `.pt-bar` (thread cards): 8px `--wash-2` track, lane-coloured fill at score%, dashed ticks at 0.45 / 0.65 with mono labels, a 2px ink mark at the score, and a "0 · escalate · ask · resolve · 1" axis. The track is not zone-tinted; the fill colour carries the lane.
- **Nav**: fixed, 66px, white at 86% with blur, brand + version, five links, black pill CTA; shadow once scrolled. Body carries a 66px top padding.
- **Preloader curtain**: unchanged markup, CSS and timings (Slack "On it." typewriter).

## 4b. Figma source

The desktop design lives in the Figma file "Ppt" (key `pXsg4lNb0zwsFihN24tPVG`), Page 2, frame **Felix · Desktop 1440**. It is generated from the running page, not drawn by hand: every box is an auto-layout frame (hug/fill sizing, padding, gaps, spacers where CSS margins were uneven), text keeps its Geist / Geist Mono / VT323 ranges, washes are real gradient fills, and the hero connector, dispatch, radar and score-bar SVGs are imported as vectors. Known import gaps: `<text>` inside SVGs loses its mono face, `filter: drop-shadow` on SVG elements is dropped, and italics are not available for Geist Mono. Regenerate rather than edit by hand when the page changes.

## 5. Motion

None beyond the curtain, hover colour changes and the FAQ toggle. `felix-motion.js` sets the nav scrolled state and keeps one FAQ open at a time, and declares `window.__felixOnce = []` for the coming motion round (one-shot timelines register there so captures can settle them).

## 6. Responsive

Breakpoints at 1140 (outer rules off), 960 (single columns, hero graphic stacks: incoming → Felix → outcomes, connector stubs hidden, ghost cards hidden) and 600 (16px gutters, stacked buttons, one-column KB and roadmap).
