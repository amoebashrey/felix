# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static single-file site: `index.html` with inline styles and script, `tokens.css` (shrey.lab brand tokens, verbatim, do not edit), `felix.css` (Felix sub-brand overrides). No build step. Open-source libraries are allowed via CDN (user-approved for motion graphics).

## Users

Primary: engineering leads and support/ops managers at small-to-mid product companies whose Slack support channel (#tech-problems) is drowning in repeat questions. They evaluate Felix from a link shared by its builder. Secondary: the support reps and engineers who would live with Felix daily.

## Product Purpose

Felix is a Slack triage bot. It reads incoming tech-problem messages from support reps, matches them against a curated 27-section knowledge base, and takes exactly one of three actions: Resolve (post the fix inline, cite the KB section, ask for a 👍/👎), Ask (one scoped clarifying question), or Escalate (route to the right engineering team with a one-line summary). Success: engineers stop answering the same twenty questions, escalations arrive with context, and support reps get answers in seconds.

## Positioning

Felix refuses to guess. It only resolves on a real KB match above a cosine-similarity threshold of 0.65; otherwise it asks one question or hands off cleanly. A generic AI bot hallucinates and routes to "whoever looks like an engineer"; Felix is disciplined, small, and inspectable.

## Operating Context

Lives inside Slack (Slack Bolt SDK). Pipeline: message → BGE-small embeddings (fastembed, 384-dim) → cosine match against the KB → Groq-hosted Llama 3.3 70B drafts the reply → every decision logged to Supabase. Python 3.11 + Flask on AWS. Feedback loop: 👍/👎 reactions; 👎 will seed draft KB entries.

## Capabilities and Constraints

- Three paths only: Resolve / Ask / Escalate. Threshold 0.65.
- KB: 27 curated sections across 8 domains (Calling & Dialer; SMS & Notifications; Leads Dashboard; Partner Dashboard; Authentication & Sessions; CRM & Integrations; Payments & Billing; Account & Permissions). Hand-authored from real resolution threads.
- Current version v1.9.2, in production. Roadmap v2.0–v2.2 (next 2 weeks), v2.3–v2.5 (next quarter), v3.0+ (exploring) as listed on the site.
- No pricing yet; CTA is "get in touch" by email / X.
- Copy facts (threshold, KB structure, stack, roadmap, contact) are fixed. Wording was shortened on 2026-10-01 at the user's request (short headlines and leads; long text only where it carries proof).
- Placeholders still open: Notion/repo/feedback links in credits and footer; bug-report contact channel in FAQ.

## Brand Commitments

- Name: felix (lowercase in UI). Mascot: pixel-art character in rust cap with an "F", wrench in hand (`assets/felix-mascot.png`, 1024px, off-white background; `assets/felix-mascot.svg` is a placeholder speech-bubble mark).
- Felix's spoken words are always set in VT323 (`.felix-voice`); reserved for Felix only.
- Sub-brand of shrey.lab: `tokens.css` is inherited verbatim. Since the Sequence round, near-black (#202120) is the only action colour and the three paths are green / purple / orange-red. Lime appears in exactly two places: footer monogram dot and the roadmap "Shipped" pulse dot.
- The page-load preloader (Slack-style "On it." typewriter curtain) is kept as-is in the redesign (user-pinned).
- User-pinned visual constraints for the redesign (2026-10-01, revised the same day to light mode after the first dark build leaned too far on unkey.com alone): light palette on warm paper, blending both references; a cleaner sans-serif for headings and body (replacing Bricolage Grotesque + Fraunces italic breaks); references are monumint.com (engraved hairline illustration, pinned scroll sections, isometric layered diagrams, hairline grid frames) and unkey.com (black grid-framed cells, dithered/halftone textures, mono data labels, bold accent squares, product UI inside framed cells, animated mini-visualizations).
- Graphics pin (later on 2026-10-01, superseding the monumint round): the visual world is sequencehq.com — its grid lines, colours, spacing and flat product-mock graphic style — but not its serif typeface (Geist stays) and no video. Graphics come first as static end states; subtle animation is a later round. Graphics must still make sense for Felix ("don't follow the reference blindly").

## Evidence on Hand

- Real product behavior and real Felix output examples (stylized) in the current `index.html`.
- Architecture diagram reference in `refs/architecture-diagram.html`; background texture `refs/working-together-bg.png`.
- No customer logos, testimonials, metrics, or pricing exist. Do not fabricate them.

## Product Principles

1. Show the mechanism: incoming message → score → one of three paths. Every graphic should dramatize that.
2. Discipline over cleverness: the page, like the bot, should feel small, legible, and honest.
3. Felix has a voice and a face; let them appear where Felix actually speaks, never as decoration.
4. Technical readers want proof: real thresholds, real KB structure, real stack.
5. Built by one person, in public; the tone is direct and human, not enterprise.
