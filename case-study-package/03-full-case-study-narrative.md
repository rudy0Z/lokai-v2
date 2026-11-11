# Designing Legal AI Against Hallucination: The LokAI 2.0 Case Study

**Role:** Principal Product Designer & Design Technologist  
**Scope:** Architecture, Interaction Design, Deterministic Engine, Multi-Script Design Systems  
**Timeline:** 3 Weeks Active Design & Code Sprints + 2 Adversarial Audit Passes  
**Stack:** React 19, TypeScript, Tailwind CSS, Motion, Headless WCAG Contrast Gates  

---

## 1. The Problem and Product Wedge: The ₹1,000–₹50,000 Deadlock

Most civil and consumer disputes in India do not collapse in a courtroom. They collapse in the living room within 48 hours of an unfair rejection.

Consider an everyday scenario: a citizen orders a kitchen mixer from an online marketplace for ₹8,999. When opened, the jar is cracked and the motor does not start. Customer support tells them the 48-hour return window has expired, denies replacement, and closes the ticket. Or consider a tenant in Bengaluru or Pune vacating a flat after serving a full month of notice, only to have the landlord withhold ₹35,000 from their deposit claiming arbitrary painting and cleaning deductions without producing a single GST invoice.

```
+-----------------------------------------------------------------------------------------+
|                              THE ECONOMIC DEADLOCK                                      |
|                                                                                         |
|  [ Claim Value: ₹8,999 – ₹35,000 ]                                                      |
|         │                                                                               |
|         ├──────> Option A: Hire an Advocate                                             |
|         │        Legal notice fee: ₹5,000 – ₹15,000.                                    |
|         │        Result: Legal fees exceed the loss. Claim abandoned.                   |
|         │                                                                               |
|         ├──────> Option B: Consult ChatGPT / Gemini                                     |
|         │        Result: 8-paragraph open-ended essay, hallucinated penal sections      |
|         │        (repealed IPC 420), fabricated win probabilities, zero memory.         |
|         │        Outcome: User sends an aggressive threat; seller stonewalls.           |
|         │                                                                               |
|         └──────> Option C: LokAI 2.0 Deterministic Dispute Layer                        |
|                  Result: 2x2 Fact Gate circuit breaker -> 4-rung statutory ladder       |
|                  -> 1-tap WhatsApp counter -> Self-authored RPAD demand notice.         |
+-----------------------------------------------------------------------------------------+
```

General-purpose large language models fail citizens in these moments for three structural reasons:
1. **Unconstrained Generation:** Chatbots treat consumer friction as a blank canvas. They produce 800-word academic essays citing irrelevant High Court precedents and repealed criminal statutes, turning an informal consumer dispute into an aggressive standoff.
2. **Fabricated Win Rates:** Models flatter users with fabricated probabilities ("You have an 85% chance of winning in consumer court"), creating dangerous expectations while ignoring statutory limitation windows and jurisdictional exclusions.
3. **Absence of Continuity:** Real dispute resolution unfolds over days. Chatbots drop context between sessions, requiring users to re-explain facts from scratch when sellers push back.

LokAI 2.0 was architected as a frugal, deterministic-first dispute layer. By routing inputs through structured state machines, verified statutory rules, and domain-specific playbooks, the interface eliminates open-ended generative drift and reduces LLM token consumption by over 90%.

---

## 2. Decision 1: The 2×2 Fact Gate as a Hallucination Circuit Breaker (`FactCheckCard.tsx`)

In traditional legal tech, intake follows one of two flawed extremes: an open chat prompt that invites unstructured rambles, or an intimidating 6-row bureaucratic form that causes immediate drop-off.

LokAI introduces an interaction pattern called the **2×2 Fact Gate**. When a user shares a grievance, the system does not stream generative legal advice immediately. Instead, it extracts four core parameters and halts the conversational stream with an editable confirmation card:
- **Item / Service:** The exact product or transaction under dispute.
- **Amount Paid:** The precise rupee figure at stake.
- **Purchase Window / Timeline:** Whether the purchase occurred within 30 days, 1 to 2 years, or more than 2 years.
- **Proof Held:** Whether the user holds a GST invoice, an unboxing photo, or only a UPI transaction ID.

```
+-----------------------------------------------------------------------------------------+
| [Citizen Chat Bubble]                                                                   |
| "I ordered a Mixwell mixer from HomeKart for ₹8,999. It arrived with a cracked jar..."  |
+-----------------------------------------------------------------------------------------+
                                           │
                                           ▼
+-----------------------------------------------------------------------------------------+
| [FactCheckCard.tsx — Circuit Breaker]                                                   |
|                                                                                         |
|  ITEM               Mixwell Mixer (HomeKart)                [✎ Edit]                    |
|  AMOUNT             ₹8,999                                  [✎ Edit]                    |
|  BOUGHT             Within 30 days                          [✎ Edit]                    |
|  PROOF HELD         GST invoice + unboxing photo            [✎ Edit]                    |
|                                                                                         |
|  Usage Type:  (•) Personal Consumer    ( ) Commercial / B2B                             |
|                                                                                         |
|  [ Confirm Facts & View Statutory Standing ]                                            |
+-----------------------------------------------------------------------------------------+
```

### Human-to-AI Dialogue Contrast: The ChatGPT Trap vs. LokAI 2.0

| Phase | General-Purpose LLM (ChatGPT / Gemini) | LokAI 2.0 Interaction Spine |
|:---|:---|:---|
| **Human Prompt** | *"I ordered a Mixwell mixer from HomeKart for ₹8,999. It arrived with a cracked jar and dead motor, and support closed my ticket saying the 48-hour return window is over."* | *(Identical prompt)* |
| **AI Reaction** | **Unconstrained Generative Dump:**<br>Streams an 800-word essay. Quotes Section 420 of the Indian Penal Code (repealed by Bharatiya Nyaya Sanhita) and claims an *"85% probability of winning damages in court"*. Recommends sending a criminal legal notice within 24 hours. | **1-Sentence Statutory Reassurance:**<br>*"A 48-hour store rule cannot override your statutory right when a product arrives defective. Before I map out your standing, check if I caught these four facts accurately—tap any box to edit."* |
| **Intervention** | None. User is left with an aggressive, legally ungrounded letter draft that burns customer-support bridges. | **Circuit Breaker (`FactCheckCard.tsx`):**<br>Halts generation. Mounts 2×2 grid (Item, Amount, Bought, Proof) + S. 2(7) B2B Exclusion toggle + S. 69 Limitation check. No legal advice generated until facts are locked. |

### The S. 2(7) Exclusion and Limitation Filtering
The Fact Gate serves as a statutory filter. Under Section 2(7) of the Consumer Protection Act, 2019, commercial buyers are excluded from consumer forums. If the user toggles "Commercial / B2B", the system trips a safe exit rather than generating an invalid consumer complaint. Similarly, if the purchase timeline exceeds two years, the system highlights the two-year limitation bar under Section 69 of the Act, preventing users from wasting filing fees on time-barred claims.

Once confirmed, these signed facts flow verifiably into the downstream analysis. If the user updates an amount or date later in the thread, downstream finding cards are marked stale automatically, preserving bidirectional state integrity.

---

## 3. Decision 2: Replacing Performed Trust with Epistemic Restraint (`FindingCard.tsx` & `ConfidenceIndicator.tsx`)

Many AI products simulate authority through decorative confidence dials ("94% Confidence"). In a legal context, numerical confidence is fiction. It misleads citizens into confusing language-model certainty with judicial probability.

LokAI enforces strict epistemic restraint across its components:
1. **Three Plain-Language Levels:** Confidence is expressed strictly in plain words: `Clear`, `Likely`, or `Unsure`. Percentage metrics are banned.
2. **Programmatic Binding to Verified Claims:** In `src/app/data/legal-content.ts`, every statutory reference ships with `verified: false` and a visible `[VERIFY]` badge. The `resolveConfidence()` function prevents unverified claims from wearing a green "Clear" badge, defaulting them honestly to "Likely" or "Unsure".
3. **Quiet Bottom Provenance Well:** Rather than cluttering the primary legal analysis with disclaimers, citations and reasoning steps sit in a quiet bottom well (`Likely · [VERIFY] · Why`). Tapping the well reveals the statutory basis (e.g., Section 84 of the Consumer Protection Act, 2019) alongside a mandatory tag: *"Simulated in prototype."*
4. **Docked Primary Action:** The primary next step ("Show my action plan") is docked directly inside the finding card footer, ensuring the artifact carries its own clear continuation.

```
+-----------------------------------------------------------------------------------------+
| [FindingCard.tsx]                                                                       |
|                                                                                         |
|  STATUTORY FINDING                                                                      |
|  Cracked on arrival is a statutory product defect                                       |
|                                                                                         |
|  What happened:                                                                         |
|  Your Mixwell mixer reached you damaged. That is an inherent defect in the goods.       |
|                                                                                         |
|  What the law says:                                                                     |
|  Goods that arrive damaged or non-functional count as a defect under the Consumer       |
|  Protection Act, 2019. Company store rules cannot waive statutory warranty liability.    |
|                                                                                         |
|  -------------------------------------------------------------------------------------  |
|  Confidence: Likely  ·  CPA 2019, Section 84 [VERIFY]  ·  Why? (Simulated in prototype) |
|                                                                                         |
|  [ Show My Action Plan -> ]                                                             |
+-----------------------------------------------------------------------------------------+
```

---

## 4. Decision 3: The Lowest-Risk-First Escalation Ladder & Air-Gapped Stationery (`ActionLadder.tsx` & `DemandNoticeReview.tsx`)

When an online dispute occurs, aggressive legal threats rarely work. Rushing to send a formal legal notice burns all bridges with customer support, and dragging an e-commerce platform straight to court over ₹8,999 guarantees months of delay.

LokAI structures remedies into a 4-rung escalation ladder ordered by cost, speed, and safety:

```
          [ Step 4: e-Jagriti Online Filing ]
          Self-filing on consumer portal under Section 35 (₹0 fee under ₹5 Lakh)
                         ▲
          [ Step 3: Formal RPAD Demand Letter ]
          Physical legal notice on paper stationery behind explicit consent
                         ▲
          [ Step 2: National Consumer Helpline ]
          Docket registration on 1915 or parallel regulatory complaint
                         ▲
          [ Step 1: Grievance Officer Escalation ]
          48-hour statutory acknowledgement clock under E-Commerce Rules 2020
```

### Navigating E-Commerce Rules 2020 and Day-2 Pushback
Under the Consumer Protection (E-Commerce) Rules 2020, marketplace platforms have 48 hours to acknowledge a grievance and one month for redressal. Step 1 equips the user with a polite, legally grounded WhatsApp/email message addressed to the platform's Resident Grievance Officer.

When sellers respond with standard deflections (e.g., offering a ₹500 store voucher or demanding that the user visit a third-party service center), LokAI does not re-run intake. It mounts `StatutoryCounterCard.tsx`, giving the citizen a 1-tap copyable counter-reply stating that under Section 84, statutory product liability cannot be substituted with store vouchers.

```
+-----------------------------------------------------------------------------------------+
| [StatutoryCounterCard.tsx]                                                              |
|                                                                                         |
|  STATUTORY COUNTER-REPLY (WhatsApp / Email)                                             |
|  Basis: Consumer Protection Act, 2019 · Section 84 [VERIFY]                             |
|                                                                                         |
|  "Under Section 84 of the Consumer Protection Act, 2019, goods that arrive defective    |
|   out of the box (Dead on Arrival) entitle the consumer to a full refund or             |
|   replacement. Store policy or 48-hour return windows cannot waive statutory            |
|   liability. Please arrange pickup and refund of ₹8,999 within 48 hours, failing        |
|   which I will register a docket with the National Consumer Helpline (1915)."          |
|                                                                                         |
|  [ Copy Counter-Reply ]                                                                 |
+-----------------------------------------------------------------------------------------+
```

### Air-Gapped Stationery: The Citizen as Sole Author
When informal negotiation fails and the user advances to Step 3, the demand notice renders on formal textured stationery (`DocumentPaper.tsx`) inside `DemandNoticeReview.tsx`. 

LokAI enforces strict air-gapping:
- The app contains zero export APIs, zero automated mailing integrations, and zero background dispatchers.
- The "Copy Notice Text" button is physically locked behind a mandatory verification checkbox: *"I have confirmed that the dates, amounts, and facts above are accurate."*
- The citizen copies the text and sends it themselves via Registered Post with Acknowledgement Due (RPAD) or personal email. The user remains the legal author.

---

## 5. Decision 4: The Bilingual Notice Interpreter & The Protective Hard-Stop (`NoticePage.tsx` & `StopScreen.tsx`)

Two critical edge cases break conventional conversational apps: inter-state language shock and physical distress.

### Demystifying Municipal Notices Across Linguistic Borders
Over 300 million Indians live in states where administrative notices are issued in a regional language they cannot read. A Hindi or Tamil speaker living in Pune who receives a Marathi municipal property tax demand experiences immediate fear.

The **Notice Interpreter** (`NoticePage.tsx` and `ScanDocument.tsx`) implements a dual-pane clause reader:
- The user inspects the scanned regional document on the left.
- Tapping a highlighted span (e.g., `कलम १४९`, Mumbai Municipal Corporation Act) opens an synchronized clause card on the right.
- The interface translates the clause into plain English and Devanagari Hindi, displays the statutory 15-day objection window, and clarifies that this is an administrative assessment inquiry rather than an arrest warrant or court summons.

### The Downgrade Law and Protective Hard-Stops
When an input indicates physical violence, illegal landlord lockouts, or criminal threats, conversational chat is dangerous. Suggesting self-drafted notices to a tenant facing immediate physical eviction can lead to bodily harm.

Under our **Downgrade Law** (`scope-rules.ts`):
1. The conversational chat composer disappears immediately.
2. The UI mounts `StopScreen.tsx`, rendering an emergency triage interface.
3. The screen surfaces the national legal aid helpline (`15100`), emergency hotlines (`112` and `181`), and localized District Legal Services Authority (DLSA) contact panels for free, qualified legal representation.
4. If the user was simply describing past events, a secondary "Tell me more" doorway allows them to re-enter safely into a guarded caution flow.

---

## 6. The Climax: Adversarial Self-Audit (Stress-Testing Our Own Guardrails)

A high-trust interface cannot rely on optimistic assumptions. During our visual and judicial audit passes, we subjected LokAI to adversarial testing. We caught and fixed three critical vulnerabilities in our own codebase:

### Trap 1: The Landlord Regex Collision
In early builds, `scope-rules.ts` contained a broad regex pattern matching the word `landlord`. This inadvertently classified peaceful, post-handover tenancy deposit recovery (where keys were already returned) as a criminal eviction emergency, locking users out of tenancy playbooks.  
**The Fix:** We split tenancy rules into physical distress patterns (lockouts, illegal evictions) which trigger `StopScreen.tsx`, and civil security deposit disputes under Section 108(m) of the Transfer of Property Act, 1882, which route correctly into `domain-playbooks.ts`.

### Trap 2: The 1888 vs 1882 Act Citation Collision
During content review of `legal-content.ts`, we discovered a copy-paste error: a citation for the Transfer of Property Act was erroneously labeled as `1888` instead of `1882`. Because our design rules bind "Clear" confidence directly to verified status, this unverified entry was prevented from displaying a green badge in the interface.  
**The Fix:** We corrected the statutory year to 1882, updated the reference schema in `legal-content.ts`, and added an automated audit check ensuring all statutory claims retain explicit `[VERIFY]` markers.

### Trap 3: The Informal UPI Fraud-Withdrawal Hazard
In our informal seller dispute playbook (e.g., purchasing clothing from an Instagram seller without a GST bill), early drafts of the grievance message suggested warning the seller that a cyber-crime complaint would be filed and then withdrawn upon refund. In Indian law, offering to withdraw a criminal cyber-fraud report in exchange for money borders on compounding an offence or extortion.  
**The Fix:** We revised the template to focus strictly on civil demand under Section 72 of the Indian Contract Act (restitution of money paid by mistake or under misrepresentation), removing any unethical coercion language while keeping the citizen's standing legally sound.

---

## 7. Systems & Engineering Governance

To ensure the design system holds up across devices and scripts, LokAI is governed by automated verification gates:
- **5 Core Typographic Scales:** English, Hindi, Marathi, Tamil, and Urdu Nastaliq (RTL). Tamil and Devanagari avoid letter-spacing and fake italics; Urdu Nastaliq line heights are tuned to prevent descender clipping.
- **Automated Contrast Gates:** Run before every commit via `npm run gates`, `scripts/verify.mjs` checks every token pair across light and dark themes, enforcing WCAG AA contrast (minimum 4.5:1 for body copy).
- **Deterministic Offline Architecture:** LokAI uses zero live API connections, zero web trackers, and zero unverified third-party libraries. All matter history is preserved locally on the client device.
