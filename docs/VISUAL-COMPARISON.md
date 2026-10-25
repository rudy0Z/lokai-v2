# How LokAI v2 looks next to ChatGPT and Gemini

**Date:** 2026-10-26 · **Post-reskin edition** — the owner-approved mockup ("ivory garden") is now the pinned
design language; see `DESIGN.md`. Evidence: `docs/screenshots/20–34` (captured in Chrome at 420×900 during the
runtime test), vision QA on key screens, and the token system in `src/styles/tokens.css`.

## 1. What we share with both (the native-app contract)

- The calm chat anatomy: **docked composer** (never floating), full-width assistant answers, soft user
  bubbles, suggestion chips on an input-first empty state, visible streaming states, error + retry, and a
  single-column mobile frame with pinned navigation.
- Recent UI: **bottom tab bar** (Home/History/Saved/Profile) — the same information architecture as Gemini's
  app, with our tabs in the botanical palette.
- Narrated beats while "thinking" — honest placeholders, never fake percentage progress (a trust anti-pattern
  in the reference teardowns).

## 2. The mockup skin — where we now visibly differ from every generic AI app

| Axis | ChatGPT / Gemini | LokAI v2 |
|---|---|---|
| **Ground** | White / light gray | Warm **ivory** with cream cards — paper, not plastic |
| **Accent** | Teal-ish (ChatGPT) / blue-gradient (Gemini) | One **deep botanical green**; the orb is the only gradient in the product |
| **Voice** | Full-screen voice mode; waveform | **Voice-first home**: the sage orb IS the empty state; simulated listening → editable "Here's what I heard" review before anything sends |
| **Type** | One sans | Sans for UI + **serif display for human moments** (greeting, listening, card headings) + mono for citations/amounts — three registers, three kinds of truth |
| **Trust chrome** | Unbadged prose | Verification badge on every legal reference, 3-level plain-language confidence, "What I checked" pill tagged *Simulated in prototype*, [VERIFY] docket stamps |
| **Structure** | Prose answers | **Finding cards** (three zones), risk-ordered **action ladder** with numbered rows, editable key-point rows in the notice reader, paper-stationery demand notice behind explicit consent |
| **Refusals** | Inline refusals | A designed **protective stop screen** (deep green-ink inverted / light treatments), DLSA routing, re-entry |
| **Scripts** | Latin-first | 5 languages incl. **Urdu RTL**; per-script scales; the whole shell mirrors |

## 3. Screenshot evidence (vision QA)

- **Home (20):** serif headline over the orb hero, tiles for Add-a-notice / Type-instead, scenario chips,
  tab bar — "professional, calm, no flaws found"; the orb reads as the signature.
- **Listening (21):** timer + waveform + transcript card + stop pill + honest simulated tags.
- **Review & send (22):** "Here's what I heard" — editable serif transcript, detected-language select, mock
  add-details rows, one primary action. The A2.7 control law in visual form.
- **Golden path reskin (32):** citation stamp in mono, "Prototype content, not yet verified" badge, Clear
  confidence panel, three numbered ladder rows — the mockup's response screen with real trust chrome.
- **Urdu dark (28–31):** night-garden theme, full RTL mirroring including the tab bar, Nastaliq rendering.
- **Profile (26–27):** privacy surface with the Base-UI bottom-sheet delete-everything confirmation.

## 4. Where ChatGPT/Gemini still beat us (honest)

- Long-tail polish at scale: hover/active microstates, thread virtualization, in-thread search.
- Real streaming vs our narrated beats; real speech vs the simulated orb (mic is never touched here — by law,
  tagged everywhere).
- Years-tuned dark palettes; ours is one deliberate pass (though AA-verified in both themes).
- No generated illustrations yet (the mockup's monument garnish is deferred — no honest raster asset source in
  this build).

## 5. One-line positioning

ChatGPT and Gemini are general assistants on neutral plastic. LokAI v2 is a **legal instrument on paper** —
the same app anatomy everyone knows, dressed in ivory and botanical green, with every visual device pointed
at checkability: serif findings, mono docket stamps, verification badges, the protective stop, the paper
notice. Distinctiveness comes from the skin + the signatures, not from a different genre — which is exactly
what "feels like a real app, unmistakably ours" required.
