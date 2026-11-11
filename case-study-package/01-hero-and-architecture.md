# LokAI 2.0 Case Study: Portfolio Architecture and Hero Specification

This document defines the web UX layout, hero section copy, interface components, and technical storytelling for the LokAI 2.0 portfolio case study. It establishes a high-trust, deterministic design pattern for consumer justice in India.

---

## 1. Reading Speeds and Content Hierarchy

To accommodate different hiring managers and design leads, the case study page uses three intentional reading layers:

1. **The 30-Second Hook (Hero + Dual-Voice Video):** Problem framing, economic deadlock (claims between ₹1,000 and ₹50,000), live prototype link, and a 90-second motion walkthrough with dual-voice audio (Designer narrator plus citizen voice notes).
2. **The 3-Minute Strategic Scan:** The 5 core design decisions from `lokai-v2` (2x2 Fact Gate circuit breaker, epistemic restraint in `FindingCard`, 4-rung escalation ladder with `StatutoryCounterCard`, bilingual Notice Interpreter, and the Downgrade Law with `StopScreen`), backed by exact screenshot proof.
3. **The Deep Technical Read (5 to 7 minutes):** Systems architecture, 5-script typography engine (including Urdu Nastaliq RTL and Tamil), code-governed WCAG contrast verification via `scripts/verify.mjs`, and the 3 traps caught during adversarial judicial audits.

---

## 2. Hero Section Specification

### Visual Layout and Composition
- **Substrate:** Warm off-white paper substrate (`#F7F6F2` / `--c-paper`) with subtle tactile surface texture. Single primary brand accent: Deep Botanical Green (`#1E5E3A` / `--brand-solid`). Saffron (`#E9852B` / `--c-spark`) is reserved strictly for the spark mark in the logo, never as generic UI decoration.
- **Top Bar:** Back link to portfolio index, reading estimate badge (`5 min read · 90s video`), live prototype link with active status dot.
- **Headline Structure:** Left-aligned editorial type stack balancing an authoritative serif headline with a crisp sans-serif technical body.
- **Right / Bottom Media Dock:** Dual-mode viewport hosting the 90-second motion walkthrough and the interactive Notice Interpreter specimen.

```
+------------------------------------------------------------------------------------------+
|  <- Back to Work          [Case Study · 5 min read]          [Launch Prototype (v2.0) ->] |
+------------------------------------------------------------------------------------------+
|                                                                                          |
|  METADATA: APPLIED AI · CIVIC INFRASTRUCTURE · DESIGN SYSTEMS · DISPUTE RESOLUTION       |
|                                                                                          |
|  Designing Against Hallucination: How I built a high-trust, deterministic                |
|  interaction spine for India's ₹1,000–₹50,000 consumer justice gap.                      |
|                                                                                          |
|  For a ₹8,999 defective mixer or a ₹35,000 withheld rental deposit, hiring a lawyer     |
|  costs more than the loss itself. When citizens turn to general-purpose LLMs, they get   |
|  8-paragraph essays, hallucinated sections of repealed penal codes, or aggressive       |
|  threats that escalate disputes. LokAI 2.0 replaces open-ended generation with a         |
|  deterministic, 4-stage dispute resolution layer: a 2x2 fact-check circuit breaker,     |
|  a 4-rung statutory ladder, and an automated downgrade law that knows when to stop.     |
|                                                                                          |
|  [ Play 90s Motion Reel ]       [ Read Core Decisions ]       [ View Code & Evidence ]   |
|                                                                                          |
|  --------------------------------------------------------------------------------------  |
|  TIMELINE: 3 Weeks Active Design & Code Sprints + 2 Adversarial Audit Passes             |
|  TYPOGRAPHY ENGINE: 5 Core Scripts Engineered (EN, HI, MR, TA, UR RTL) + 12 UI Locales   |
|  STATUTORY SCOPE: 4 High-Frequency Civil & Consumer Playbooks (CPA 2019, TPA 1882,       |
|                   ICA s. 72, Wage Claims)                                                |
|  --------------------------------------------------------------------------------------  |
+------------------------------------------------------------------------------------------+
```

---

## 3. Hero Copy and Micro-Copy

### Eyebrow Pill
`CASE STUDY / APPLIED AI & CIVIL INFRASTRUCTURE`

### Main Headline
```html
<h1 class="hero-title">
  Designing Against Hallucination: How I built a high-trust, deterministic interaction spine for India's ₹1,000–₹50,000 consumer justice gap.
</h1>
```

### Subtitle and Problem Thesis
> For a ₹8,999 broken appliance or a ₹35,000 withheld rental deposit, formal advocacy is economically irrational: advocate consultation fees start higher than the loss. When stressed citizens bring these disputes to ChatGPT or Gemini, general-purpose LLMs hallucinate non-existent sections, recite repealed IPC clauses, or coach aggressive legal threats that destroy any chance of informal settlement. LokAI 2.0 implements a deterministic dispute resolution architecture: a 2x2 confirmation circuit breaker (`FactCheckCard.tsx`), four domain playbooks, Day-2 statutory counter-replies (`StatutoryCounterCard.tsx`), and code-enforced safe exits (`StopScreen.tsx`).

### Metadata Scope Strip
- **Timeline:** 3 Weeks Active Design & Code Sprints + 2 Adversarial Audit Passes
- **Typography Engine:** 5 Core Scripts Engineered (EN, HI, MR, TA, UR RTL) + 12 UI Locales
- **Statutory Scope:** 4 High-Frequency Civil & Consumer Playbooks (CPA 2019, TPA 1882, ICA s. 72, Wage Claims)
- **Architecture Stance:** Zero live tracking, zero automated document transmission. The citizen remains the sole legal author.

---

## 4. Dual Hero Media Switcher: Motion Reel vs. Interactive Specimen

Directly below the introductory thesis, recruiters can toggle between two media views:

### View A: The 90-Second Motion Walkthrough
- 16:9 cinematic bezel with timestamped chapter navigation.
- Dual-voice audio track: Designer narrator commentary paired with raw citizen voice notes and LokAI synthesized responses.
- Timeline chapter points:
  - `00:00` The ₹8,999 Dead-Zone and The ChatGPT Trap
  - `00:15` Beat 1: The 2x2 Fact Gate as a Hallucination Circuit Breaker
  - `00:32` Beat 2: The Notice Interpreter and Inter-State Linguistic Fear
  - `00:50` Beat 3: The 4-Rung Escalation Ladder and Day-2 Seller Pushback
  - `01:08` Beat 4: The Downgrade Law and Protective Hard-Stop
  - `01:20` Systems Close: 5-Script Optical Scaling and Automated Code Verification

### View B: Live Interactive Specimen (Notice Interpreter)
- Direct interactive mount of the Notice Interpreter route (`/#/notice?doc=bmc-property-tax`).
- Key interactions demonstrated:
  1. Interactive span selection across original Marathi municipal property tax documents.
  2. Tap-to-translate clause drawer mapping administrative Marathi to plain English and Devanagari Hindi.
  3. Limitation countdown banner: **Consumer Protection Act, 2019 — Section 69 (2-Year Limitation Window)** or statutory 15-day municipal objection window.
  4. Plain-language administrative categorization showing this is a routine assessment notice rather than a court summons.

---

## 5. Sticky Navigation Rail

As the user scrolls down, a persistent progress rail anchors the case study across four core sections:

1. **`01 / The ₹1,000–₹50,000 Deadlock`** — The economic gap between lawyer costs and claim value, and why general-purpose chatbots fail citizens.
2. **`02 / The Interaction Spine`** — The 2x2 Fact Gate (`FactCheckCard.tsx`), the 4-rung escalation ladder, and Day-2 counter-replies (`StatutoryCounterCard.tsx`).
3. **`03 / The Linguistic and Safety Moat`** — Clause-level translation in `NoticePage.tsx` and immediate triage into `StopScreen.tsx`.
4. **`04 / Systems & Adversarial Audit`** — Multi-script typography engine across 5 scripts, headless contrast gates, and the 3 traps caught in judicial self-auditing.
