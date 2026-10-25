# How LokAI v2 looks next to ChatGPT and Gemini

**Date:** 2026-10-25 · Evidence: `docs/screenshots/` (captured in Chrome 156 at 420×900 during the runtime
test), vision-model QA verdicts per screen, and the token system in `src/styles/tokens.css`.

The brief for v2 was "an actual app like ChatGPT or Gemini." This is an honest read of where we land: what we
share with them, where we deliberately diverge, and where they still beat us.

---

## 1. What we share with both

- **The calm-neutral contract.** Near-white shell, neutral gray text hierarchy, ONE restrained accent
  (deep navy), semantic status colors used only for status. No gradients, no marketing chrome, generous
  whitespace. A first-time ChatGPT user would immediately know how to use our screen — same muscle memory.
- **The composer as the anchor.** Large rounded input docked at the bottom, circular send button that
  activates with content, attach affordance at the left, placeholder that speaks in the user's language.
- **Chat asymmetry.** User turns get soft end-aligned bubbles; assistant turns read as full-width document
  text with a small mark — the ChatGPT pattern (Gemini uses a similar asymmetry with its gem mark).
- **Streaming honesty.** Narrated beats ("Reading what you wrote… Checking the rules…") with animated dots
  while "thinking," skippable and reduced-motion aware.
- **Suggestion chips on the empty state.** Four wrapped pills naming the real entry points.

## 2. Where we deliberately diverge (this is the product)

| | ChatGPT / Gemini | LokAI v2 | Why |
|---|---|---|---|
| **Frame** | Full-viewport responsive app | 390px centered prototype frame, full-bleed on phones | Portfolio-embed reality; forces mobile-first discipline; honest about what it is |
| **Trust chrome** | None — answers are unbadgeged text | Every legal claim carries a verification badge (defaulting to "Prototype content, not yet verified"), a mono citation stamp, a 3-level plain-language confidence indicator, and a "What I checked" pill tagged *Simulated in prototype* | The product's entire bet is checkability. An answer here is an instrument, not a reply |
| **Typographic registers** | One sans family, occasionally serif for headlines (ChatGPT) or Material type (Gemini) | Sans for UI, **serif for findings** (the "law register" — reads like a document verdict), **mono for citations, amounts, order numbers** (stamps like a receipt) | Three registers = three kinds of truth: conversation, judgment, evidence |
| **Generative surfaces** | Markdown answers, maybe tool cards | Finding cards with three zones (what happened / what the law generally says / what it means for you), a risk-ordered action ladder, and a paper-stationery demand notice behind an explicit consent checkbox | Legal output must be reviewable and editable before anything leaves the user's hands |
| **Refusals** | Guardrails fire as inline refusals | A designed **protective stop screen** — calm, assistance-forward, with a DLSA routing panel and a "tell me more, this may be a consumer matter" re-entry — shipped in TWO treatments behind a toggle | Stopping is a product moment here, not an error state |
| **Script coverage** | Excellent Latin; Devanagari/Tamil/Urdu are afterthoughts | 5 languages incl. **Urdu RTL**, per-script type scales and leading, mixed-script baseline discipline | This app lives or dies in Indic scripts |
| **Motion** | Rich (Gemini especially — sparkles, gradients) | Quiet hairline-and-fade; consequence-scaled pacing (stops resolve fastest, explains take their time) | Trust product: motion explains process, never decorates |

## 3. Vision-QA verdicts on the actual screenshots

- **Home (01):** "Professional, ChatGPT-like calm, no flaws found… hairline borders, one restrained accent,
  airy spacing, no heavy chrome."
- **Finding card (04):** "The serif heading reads like a document verdict, not a chat message… the mono
  register visibly stamps the legal reference like a receipt… strong hierarchy, trust chrome visible."
  Minor nit: spacing under the streaming stage label.
- **Stop screen, inverted treatment (07):** "Calm and protective, not punitive… no alarm red, no lock icons,
  no shame framing; the DLSA card is assistance-forward; 'Tell me more' reads collaborative, not dismissive."

## 4. Where ChatGPT/Gemini still beat us (honest)

- **Density of polish in the long tail:** their hover/active/focus microstates, empty→populated transitions,
  and virtualized long threads are battle-tested at scale; ours are correct but first-pass.
- **Thread richness:** file previews, search-in-conversation, message actions menu, regeneration history.
  Our composer's attach is a mock tray by design (no file inputs allowed in this prototype).
- **Latency illusion:** real token streaming reads as thinking; our narrated beats are the honest
  approximation and read slightly more "staged" at explain-length.
- **Dark-theme maturity:** both themes pass AA here, but their dark palettes have had years of tuning; ours
  is one thoughtful pass.

## 5. One-line positioning

**ChatGPT/Gemini are general assistants that look trustworthy; LokAI v2 is a legal instrument that looks
usable** — same calm surface vocabulary, but every visual device (serif findings, mono stamps, verification
badges, the protective stop, the paper notice) exists to make the assistant's limits visible and its claims
checkable. That is the differentiator, and the screenshots show it holding up.
