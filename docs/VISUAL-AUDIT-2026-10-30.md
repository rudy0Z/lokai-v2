# LokAI — Deep Visual & Flow Audit vs the Kombai Archive (2026-10-30)

**References studied:** `references/kombai-chat/` (88 iOS chat mockups, 8 screens studied in depth across all 7 themes + full taxonomy), `New folder (2)` (80 Twitter/Dribbble app concepts, 4 studied), `New folder (5)` (10 flow videos, 1 studied — a 4-variant ultra-minimal companion-chat exploration), and fresh LokAI captures (`qa/visual/16-17` voice page, `qa/visual/10-15` yesterday's golden path — still the current build).

**Verdict: 7.5/10 against this reference bar — up from 6 yesterday, held back by three things: the voice orb (P0, genuinely bad), follow-up affordances that are still one notch louder than the references, and trust metadata that tells instead of shows.**

The kombai set is the closest thing to LokAI's design thesis that exists publicly — warm ivory/cream canvases, editorial serif moments, tonal cards, handoff-to-human flows, multilingual chat. It is not "inspiration"; it is a benchmark of the exact genre. Most of yesterday's Calm Authority decisions are validated by it. The gaps are specific and fixable.

---

## Part 1 — The voice orb teardown (P0)

What the screenshots show (`qa/visual/16-17`, both themes — VoiceCapturePage renders on the dark standout register either way):

1. **The core is a glossy 3D ball.** A hard white-green specular highlight top-left, a visible rim, inner shadow — it reads as a polished billiard ball / glass marble, not a calm gradient. This is the "2026 voice orb" gloss layer the parallel session added; it is the single most "weird" element on the page, and the user is right.
2. **Three competing circle systems** — the sphere, a thin orbit ring, and a broad radial halo. Together they read as a diagram of an atom, not a listening companion.
3. **On the light home** the same opaque dark ball sits in the middle of the ivory page like a hole punched in the canvas (visible in `qa/visual/06`).
4. **The scale is wrong for /voice** — 244px of dense black sphere between "Listening…" and the transcript card, doing no work.

**What the references do instead:**
- kombai #14 (Marisway, dark): presence is **two small glowing dots** floating in darkness. The assistant's "body" is abstract light, not a rendered object. Cheapest possible ink, maximum serenity.
- kombai #83 (Libration): the mic is a **tinted outline circle** — an affordance, not a sculpture.
- Our own composer (Phase 3) already has the right idea: mic as a plain icon button in a capsule. The orb is the only place left that pretends to be a 3D object.

**Re-spec (concrete):**
- Kill the specular gloss (`::before` gloss layer) and the hard rim entirely. The core becomes a **soft luminous disc**: the layered sage radial gradients only (`--orb-outer`/`--orb-mid` at full opacity), no `inset` white highlight, no box-shadow rim.
- Idle state: no ring, no second circle — one breathing gradient disc + mic glyph. Listening: add the expanding rings back (motion earns chrome), but rings only, single system.
- Consider the Marisway endgame for the dark home: the orb shrinks to a small glowing presence (two dots or a soft 24px glow) and the greeting carries the screen. The voice-first thesis survives; the black hole doesn't.
- VoiceCapturePage: drop the duplicate waveform (bars appear in the orb ring AND the transcript card) — one waveform, in the transcript where the words are.

---

## Part 2 — Flow-by-flow audit (LokAI vs the references)

### 2.1 Empty state / home
- **kombai #31 (Firncrest):** left-aligned hierarchy — avatar chip → bold *question* ("Where would you like to begin today?") → one example prompt in quotation marks → one whisper honesty line integrated above the composer. Nothing centered, nothing decorative.
- **LokAI now:** centered greeting + orb + chips + honesty tag. The voice-first orb is our thesis and worth defending, but two kombai lessons transfer directly: (a) the honesty line should sit **as a whisper near the composer**, not as a footer stamp; (b) our suggestion chips would be stronger if one of them read as a quoted example prompt rather than a category label.
- **kombai #14:** the dark empty state is nearly empty — presence dots + three short lines. Our dark home is already calm; after the orb re-spec it lands here naturally.

### 2.2 The fact gate (LokAI's confirmation moment)
- **kombai #82 (symptom check-in):** the structured confirmation is a **tonal card of directly-manipulable switches** with one commit button ("Send this list"), titled, with a close affordance. No label/value/edit-link table anywhere.
- **LokAI now (Phase 5b):** 2×2 tonal grid + 1-tap proof/when chips + one confirm. **Directionally aligned.** Remaining gap: kombai's rows are manipulable at a glance (a switch's state is visible without reading), while our tap-to-edit cells look like read-only text until tapped. Two cheap upgrades: (a) a chevron/pencil affordance on each cell so editability is visible; (b) render `proof`/`when` as small switch-adjacent chips inside the grid's 4th cell ("Proof & When" cell) instead of two separate chip rows below — fewer stacking rows, one glanceable block.

### 2.3 The finding & trust metadata
- **kombai #83 (Libration):** process shown as a **completed checklist above the answer** ("✓ Looking up: …", "✓ Drafting a reply for you…") while streaming; sources shown as **"Sources: 4 of 17" + status dot + tappable chips** under the card.
- **LokAI now:** a spinner-style TypingIndicator during beats; a `[VERIFY]` badge + "Unverified — needs sign-off" pill in the trust well.
- **Gap and fix:** our `[VERIFY]` *tells*; kombai's pattern *shows and quantifies*. Render the verification line as **"Checked against 1 of 3 cited sources [VERIFY]"** with the source names as tappable chips (they already exist in legal-content). And let the beat engine's completed stages persist as a small checklist above the finding while it streams (the beats already have labels — show ✓ marks as they complete instead of one label at a time). This is the single biggest credibility upgrade available: it converts the trust system from badges into visible work.
- **kombai #58 (Rowanbell):** per-turn actions are **two tiny always-visible icons** (reply, react) — quieter than our text buttons. Worth adopting for the assistant turns: swap the hover-reveal text "Copy" row for a two-icon row (copy + regenerate) at 16px, always visible, tertiary color. Keep the full text buttons in the trust well for the law-4 controls.

### 2.4 The ladder / structured action plan
- **kombai #25 (Yovara/Zelvara):** structured answers as white tonal cards with **serif headings and reminder rows** — exactly our Phase 5/5c register. No gap; this is validation. One borrowing: kombai's structured cards end with a **single inline next-action row** (a reminder chip inside the card). Our ladder's Step 3 already has the notice button; consider one quiet "next step" line at the ladder's end ("When this is sent, come back and log it") — the closeout already does this job; just make the pointer explicit.

### 2.5 Handoff & safety (LokAI's DLSA moment)
- **kombai #79 (Wayzgoose):** the handoff is a **named banner** ("Talk to the Travel Desk") plus **narrative system events** in the thread: "Travel Desk bot left the conversation" → "Rasheeda (Host) joined the conversation", with per-turn timestamps and "Rate this chat".
- **LokAI now:** the HandoverCard is a document that appears. The emotional beat of "a human is taking over" is missing — we show the paperwork, not the person.
- **Fix:** keep the card, but precede it with one system line: "A legal-aid clerk at the District Legal Services Authority can take this from here — everything above travels with you [VERIFY]." The stop-screen already says "not the end of the road"; the narrative event makes it felt. The `system` MessageBubble role already exists for exactly this.

### 2.6 Multilingual & honesty-in-flow
- **kombai #76 (Quireline):** translated messages carry **"View original (Spanish)"** per message, receipt timestamps, and a mid-thread **honesty paragraph** ("Messages in this thread may be handled by automated assistants…").
- **LokAI:** Urdu/Hindi/Marathi/Tamil content is AI-drafted with `reviewedByNativeSpeaker: false` bookkeeping that the user never sees. The kombai pattern gives that bookkeeping a UI: on assistant turns in hi/mr/ta/ur, a quiet per-turn whisper — **"AI-drafted translation — tap for English original"** — which is both more honest than any badge and a portfolio-selling interaction (the tap flips the message to the English source). The mid-thread honesty paragraph pattern also fits the protective stop ("This conversation never leaves your device" — already our copy, currently only in the vault line).

### 2.7 Composer & inputs
- **kombai #1:** the composer is the **mode surface** — mode chips (Refine × / Explore ×) live inside the composer's top edge; the draft grows as a card. **kombai #87:** the minimal end-state (placeholder + + / mic / send). LokAI's Phase 3 capsule sits comfortably between these. One borrowable detail: our attach tray opens upward as a modal — kombai #63's uploads drawer attaches to the composer edge and keeps the thread visible. Minor; current tray is fine.
- **The video set (New folder 5):** the sharpest minimal pattern in all the references — follow-ups as **plain text rows with a ↳ prefix separated by hairlines** (quieter than any chip), assistant actions as a **5-icon row** (✓ 👍 👎 share ↻), a **mode dropdown** (Auto / Thinking / Fast with one-line descriptions), and a name-only greeting. This is where our inline chips could go one notch quieter in a future pass: chips → ↳ rows. Not P0 — the chips are already calm — but it's the direction the owner's own taste file points.

### 2.8 Dark mode
- kombai's dark chats (#14, #67, #75, #77) all tint their bubbles (teal on plum, jade on charcoal) rather than stacking grays; presence is abstract light. Our post-Phase-1 dark (card 21.5% on shell 15.5%, tinted bubbles) is aligned. The orb is the only dark-mode outlier. One more borrow: #73's composer input well is **near-black on near-black** with a gold accent send — our sunken send-button-on-capsule matches that logic already.

### 2.9 The scanner (NoticePage) — from New folder (2)
- The pharmacy concept shows a scanner state as a **gradient button with a live % ("Scanning… 31%")** under the document. Our Phase-6 re-scan replays beats silently. Add the % (or a 3-stage label: "Reading → Extracting → Decoding") to the scan bar — deterministic, honest, and it makes the 1.2s feel productive.
- The deep-green wallet concept ("Claude Fable 5.1") is essentially LokAI's brand register executed at consumer polish — centered typographic hero, four circular actions, warm dark green. It's the owner's taste target for the dark theme; our post-Phase-1 dark is close, the orb is what breaks it.

---

## Part 3 — What NOT to copy

- **Keyboard mockups** (kombai #1, #5, #23…) — prototype presentation, not product UI.
- **#79's full-bleed amber banner** — the handoff deserves a name, not a shout; a `system` line + our tonal card is the calm version.
- **#83's live-data gradient card** — beautiful for weather; LokAI's numbers (amounts, deadlines) live in the ladder's tonal register, and a gradient card would reintroduce the tint zoo we just killed.
- **The video set's mode dropdown** (Auto/Thinking/Fast) — LokAI's honesty register doesn't pretend to have model modes; the closest honest analog (draft variant strength) already exists as Regenerate.

---

## Part 4 — Prioritized actions

| # | Pri | Action | Files | Effort |
|---|-----|--------|-------|--------|
| 1 | **P0** | **Orb re-spec**: delete specular gloss + rim; soft luminous disc; rings only while listening; kill the duplicate waveform on /voice | `base.css` (orb layers), `VoiceCapturePage` | ~1h |
| 2 | **P1** | Trust shows work: completed beat-checklist above the streaming finding; verification as "Checked against n of m [VERIFY]" with tappable source chips | `ChatPage`, `FindingCard`, `TypingIndicator` | ~2h |
| 3 | **P1** | Handoff narrative: system line before HandoverCard ("A legal-aid clerk… can take this from here") | `ChatPage` protective/handover pushes | ~30m |
| 4 | **P1** | Assistant turns: two-icon always-visible action row (copy ↻) replacing the hover text row | `MessageBubble` | ~1h |
| 5 | **P2** | Gate cells show editability (chevron); fold proof+when chips into a "Proof & When" grid cell | `FactCheckCard` | ~1h |
| 6 | **P2** | AI-drafted translation whisper + tap-for-English-original on hi/mr/ta/ur turns | `MessageBubble`, localized-content | ~2h |
| 7 | **P2** | Scanner % / stage labels on re-scan | `NoticePage` | ~30m |
| 8 | **P3** | Follow-up chips → ↳ plain-text rows (the video set's pattern); dark-home presence-dots variant of the orb | `ChatPage`, `VoiceOrb` | ~2h |

## Scorecard vs the kombai bar

| Axis | Grade | Note |
|---|---|---|
| Tonal surfaces / canvas warmth | **9** | Post Phase 1, we are the kombai genre |
| Editorial typography | **8.5** | #58 proves serif body works; our headlines already do |
| Structured cards | **8** | 2×2 gate + ladder cards are genre-correct |
| Handoff & safety | **6.5** | Card is right; the *narrative event* is missing |
| Composer & inputs | **8** | Capsule + mic; mode chips unnecessary |
| Multilingual honesty | **5** | Bookkeeping exists but has no UI (kombai #76 pattern unexploited) |
| Presence / signature moment | **3** | The orb is the weakest element in the product |
| Empty state | **7.5** | Calm but less conversational than #31 |
| **Overall** | **7.5 → ~9 ceiling** | Orb fix + trust-shows-work closes most of the remaining gap |
