# LokAI — "Calm Authority" Master Rebuild (8 phases, guardrails encoded)

**Defaults taken where questions went unanswered (veto at approval):** ① matters.ts statute line gets the **lawful reword** (keeps `[VERIFY]`, no invented S.2(10)) — AGENTS.md Law 1; ② **Urdu stays visible** in select/sandbox/Case 5 (verify.mjs requires `'ur'` + all 23 codes; hiding it from data would fail the gate, and it's the RTL showcase) — I fix the "EN · EN" debug string and reorder lists instead; ③ FindingCard's Edit/Regenerate/Discard are **tucked into the trust well**, not deleted — AGENTS.md Law 4; ④ a **behavior-neutral `proof` toggle** (GST invoice / No invoice) is added to the gate; wiring it to a new scope-rule caution is deferred.

**Gate facts the plan relies on** (scripts/verify.mjs, read in full): arbitrary Tailwind classes like `text-[15px]`/`rounded-[20px]`/`leading-[1.65]` are **not** banned (only inline `fontSize:`/`fontFamily:`/`letterSpacing:`/`lineHeight:` and raw hex) — but I'll still use tokens (`--text-sm-plus` = 15px exists; I'll add `--text-reading` = 15px/1.65). The spec's new surface luminances move every checked WCAG pair **safer** in both themes. The gate hard-requires: `'ur'` + 23 languages in languages.ts, `[VERIFY]`/verified:false only audited in legal-content.ts, `simulatedTag` in ReasoningPill's expanded block, i18n keys `step1Sub/whatsappHint/verifyStamp/closeStep1/coverageNotice/noticeExplainer`, and the strings `FOLLOW_UPS`, `protectiveFooter`, `whenOptions`, `focusSelector` in ChatPage — the refactor preserves all of them. Classifier invariant cases in the gate are untouched.

---

## Phase 0 — Bottom geometry & reviewer tour (shell.tsx, SandboxDrawer.tsx)
- Footer wrapper: `pb-[calc(0.75rem+env(safe-area-inset-bottom))]` (TabBar is gone; the 4.9rem pads are phantom). `!footer` spacer → `h-[env(safe-area-inset-bottom)]`.
- Delete `ReviewerTour` from shell.tsx; re-home its 6 stops as a "Reviewer tour" section in SandboxDrawer's Inspector tab (it already has `setLang`/`navigate`; stop 05 keeps Urdu RTL).

## Phase 1 — Tonal surfaces (tokens.css, Card, Disclosure, Chip, ReasoningPill)
- tokens.css light: shell 96.8%, card 99.6%, sunken 94.2%, component 93.8%, line-subtle 93.5%, line-default 91.5%; dark: shell 15.5%, card 21.5%, sunken 13%, line-subtle 20%, line-default 22%. Update `--shadow-tiny` to the spec's ambient value. Radii: 2xl 14, 3xl 18, 4xl 22, 5xl 26.
- Card: `rounded-[20px] p-5 bg-card shadow-tiny` (paper branch keeps its border). Disclosure default: borderless `rounded-[20px] bg-card shadow-tiny`, content separated by spacing (`pt-2`, no border-t). Chip unselected: `bg-component hover:bg-component-hover` borderless. ReasoningPill: `min-h-9 bg-sunken`, border removed.
- Raw oklch only in tokens.css (gate-legal). Run gates — WCAG pairs re-verified automatically.

## Phase 2 — Message geometry (MessageBubble.tsx, tokens.css)
- Add `--text-reading: 0.9375rem / 1.65` token (+@theme alias) → semantic class, no arbitrary classes.
- User bubble: `max-w-[82%] rounded-[20px] px-4 py-3 text-sm-plus ltr:rounded-br-md rtl:rounded-bl-md`, tinted `bg-brand-subtle text-on-brand-subtle`, zero border (stale keeps warning-subtle). Voice header unchanged inside.
- Assistant wrapper: `text-reading` (editorial prose). System pill: `bg-component px-3.5 py-1.5`. No avatar row exists (already done).

## Phase 3 — Composer capsule (Composer.tsx)
- Wrapper `rounded-[22px] bg-card shadow-tiny` + `focus-within:ring-1 ring-brand-line-subtle focus-within:shadow-md`; add **mic button** (`IconMic`, size-11, navigates `/voice`) beside the paperclip; send-disabled stays `bg-sunken` (now reads as a well on the white capsule).

## Phase 4 — One thought per beat (ChatPage.tsx, i18n.ts) — guardrails 1 + 3 encoded
- **Beat 1:** `startConsumerFlow`/`startDomainFlow` push the empathy stream, then mount `factcheck` on a 600 ms timer (StrictMode-safe value, no state read inside).
- **Beat 2:** `confirmFacts` (domain + generic paths) pushes **only** `{kind:'finding'}` — or only `{kind:'caution', decision}` on the informal/time-barred paths. Never auto-mounts ladder or closeout. ('resolved' chip keeps pushing closeout; continuity chips keep their direct ladder/counter pushes — they're user-initiated.)
- **Chronological gating (guardrail 1):** thread-bottom inline chips render only when `ladderMounted = items.some(i => i.kind === 'ladder')`:  • while finding/caution is latest and no ladder → **one primary chip** `tr('showPlanCta')` = "Show my 3-step action plan & WhatsApp draft →" → pushes `{kind:'ladder', variant: latestIsCaution ? 'free' : 'full'}` (the guardrail's 'caution' variant maps to the existing 'free');  • after ladder mounts → post-finding `testerOptions` render as **quiet inline Chips** (text only, no meta captions) incl. the save option; clarify prompts also render inline during `clarifying`.
- Footer `<TesterPrompts>` remains **only** for the empty scenario-launcher state (`items.length === 0`). The old closeout suppression (`if (testerOptions) return null`) is removed — closeout no longer co-mounts with anything.
- New i18n keys ×5 langs: `showPlanCta`. Gate-checked identifiers (`FOLLOW_UPS`, `protectiveFooter`, `whenOptions`, `focusSelector`) preserved.

## Phase 5a — FindingCard editorial layout
- Top row: `SectionRef` + `SpeakPill`. Serif headline. Prose `text-sm-plus`, labels `text-2xs→text-xs` (uppercase/tracking still en-only). Bottom well `rounded-2xl bg-sunken`: legal.source + `ConfidenceIndicator` + `VerificationBadge` + `ReasoningPill` + **tucked quiet CardActions** (text buttons, Law 4 intact). Stale badge stays.

## Phase 5b — Compact fact gate (FactCheckCard.tsx, matter-facts.ts, ChatPage.tsx) — guardrail 2
- Expanded: **2×2 tonal grid** (`grid-cols-2 gap-2`, cells `bg-sunken rounded-xl px-3 py-2`, tap = inline edit) for item / amount / seller / issue — with **A4b guard**: any cell whose value runs long (>24 chars or non-Latin) spans `col-span-2`. Below: **1-tap Proof chip row** (new optional `FactRecord.proof: 'gst'|'none'|''`; `factRows` gains the row; chips "GST invoice" / "No invoice") and the existing **1-tap When chips** — the live downgrade lever is untouched. Then the confirm button.
- Collapsed: quiet one-line `✓ Facts confirmed · item · amount [Edit]` (green box removed). `onConfirm` still passes the full values record; `issueRaw/askRaw` recovery logic untouched.

## Phase 5c — ActionLadder steps
- Replace the single divide-y container with **per-step tonal cards** (`rounded-2xl bg-sunken/70`, bare Disclosures inside). The 3-line draft clamp + "Read full draft" toggle + always-visible Copy already shipped — kept as-is.

## Phase 6 — Typography & exhibits (MessageBubble, FindingCard, CautionCard, FactCheckCard, ActionLadder, ChatPage hero, ExhibitPaper, CaseWorkspacePage)
- Prose `text-sm-plus`; helper/step/label text upgraded `text-2xs → text-xs` (2xs kept for timestamps/badges). Home hero → `gap-8 px-12 pb-16 pt-20`.
- ExhibitPaper: add the kind pill ("PDF · mock exhibit" — honest wording, never a fake "Verified").
- Delete `caseSampleNote` ("Prepared sample history…") from its 3 render sites (ChatPage continuity, CaseWorkspacePage ×2). Home `protoTag` stays (honesty marker).
- **Guardrail 4 — CaseWorkspace parity:** turns already render via MessageBubble (inherit Phase 2); continue-bar loses its border → `bg-card shadow-tiny`; sections/day rows already tonal.

## Phase 7 — Weightless header & sandbox (shell.tsx, SandboxDrawer.tsx)
- Header: drop the gradient band → slim `px-4 pb-2 pt-[calc(0.75rem+safe)]`; wrap `LanguageSelect` in a tonal pill (`rounded-full bg-component px-3 py-1`).
- Sandbox: tier pills render **full native names** (`.native`), kill the `EN · EN` quirk; replays tab maps raw `s.outcome` enums to human labels ("Refund journey", "Safety stop"…); reviewer tour lives here (Phase 0).

## Phase 8 — Data + golden path
- matters.ts:134 lawful reword: `'Defect-in-goods under the Consumer Protection Act, 2019 — strong statutory leverage [VERIFY].'` (default ① — flag if you want the S.2(10) injection instead).
- **Golden path walkthrough live in the browser** (home → chip → empathy → 2×2 gate → confirm → FindingCard alone → CTA chip → ladder → inline chips → resolved → closeout), fresh `qa/visual/` screenshots incl. dark + Hindi, report appendix updated.

## Execution & verification
`npm run gates` after **every** phase (one commit per phase, as the spec's execution strategy requires — 9 commits total), plus the live walkthrough as the final gate. Rollback is per-phase `git revert` if any phase lands wrong.