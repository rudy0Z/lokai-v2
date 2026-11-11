# LokAI 2.0 Motion Design: 90-Second Dual-Voice Director's Script

**Format:** 16:9 4K Video (Embedded in Portfolio Hero and Shared as Product Reel)  
**Total Runtime:** 90 Seconds  
**Audio Architecture:** Dual-Voice Production. Primary voice is the Designer Narrator (calm, analytical, measured, paced at 135 words per minute). Secondary voices are real Citizen Audio Clips (stressed Indian consumers recorded in authentic environments) and LokAI In-App Audio (crisp, synthesized neutral AI voice).

---

## Technical Scene Breakdown

| Timecode | Visual Canvas & Component Shots | On-Screen Micro-Interactions | Audio: Citizen / LokAI Micro-Clips | Audio: Designer Narrator |
|:---|:---|:---|:---|:---|
| **00:00 - 00:15** | **The ₹8,999 Dead-Zone & The ChatGPT Trap**<br><br>Split screen: Generic LLM (left) vs LokAI 2.0 (right).<br>`src/app/pages/ChatPage.tsx` | Left: User inputs a broken mixer complaint. ChatGPT dumps an 800-word essay, quoting repealed IPC sections and an "88% probability of winning in court."<br><br>Right: LokAI pauses. A quiet waveform animates as it transcribes without rushing. | **Citizen Clip 1 (0:00 - 0:06):**<br>*"Listen, I ordered a Mixwell mixer from HomeKart for ₹8,999. When I opened the box, the jar was cracked and the motor wouldn't even start. Now their app says the 48-hour return window is over. Is my money just gone?"* | *"For a ₹8,999 appliance or a ₹35,000 withheld deposit, hiring a lawyer is financially impossible. When citizens take these disputes to ChatGPT, it hallucinates repealed laws and fabricates win percentages. LokAI is built on a different premise: deterministic restraint."* |
| **00:15 - 00:32** | **Beat 1: The 2×2 Fact Gate as a Circuit Breaker**<br><br>`src/app/components/cards/FactCheckCard.tsx`<br>`src/app/lib/matter-facts.ts` | The chat stream halts before generating any legal text. The 2×2 Fact Gate mounts: Item, Amount, Timeline, and Proof.<br><br>Cursor taps the edit affordance on "Amount" to tweak ₹8,999. The circuit breaker prevents advice until facts are signed. | **LokAI Voice (0:15 - 0:21):**<br>*"A 48-hour store rule cannot override your statutory right when a product arrives defective. Before I map out your standing, check if I caught these four facts accurately."* | *"Instead of writing generative essays, LokAI trips a circuit breaker: the 2×2 Fact Gate. It locks in item, price, purchase window, and proof before legal standing is evaluated. Correcting a fact updates the downstream record instantly, cutting hallucination and token burn."* |
| **00:32 - 00:50** | **Beat 2: The Notice Interpreter (Inter-State Linguistic Panic)**<br><br>`src/app/pages/NoticePage.tsx`<br>`src/app/components/notice/ScanDocument.tsx` | View transitions to an authentic scanned Marathi municipal notice (`bmc-property-tax`). Red stamp highlighted.<br><br>Cursor taps Clause 4 (`कलम १४९`). A bilingual drawer slides up, displaying plain English and Hindi translations alongside the 15-day objection clock. | **Citizen Clip 2 (0:32 - 0:38):**<br>*"My landlord in Pune slipped this Marathi notice under my door with a red stamp. I can't read Marathi. Are they going to evict my family?"*<br><br>**LokAI SpeakPill (0:38 - 0:43):**<br>*"Notice interpreted: Section 149, Municipal Corporation Act. Routine tax assessment inquiry, not an eviction order."* | *"Over 300 million Indians live outside their home linguistic state. An official notice in an unfamiliar script triggers immediate panic. LokAI's Notice Interpreter maps clauses line by line to plain words, exposing the statutory deadline, the true penalty, and whether court action is actually required."* |
| **00:50 - 01:08** | **Beat 3: The 4-Rung Escalation Ladder & Day-2 Pushback**<br><br>`src/app/components/cards/FindingCard.tsx`<br>`src/app/components/cards/ActionLadder.tsx`<br>`src/app/components/cards/StatutoryCounterCard.tsx` | `FindingCard.tsx` displays standing with its quiet bottom provenance well: `Likely · [VERIFY] · Why`.<br><br>User advances to `ActionLadder.tsx`:<br>1. Grievance Officer 48h clock<br>2. Parallel 1915 NCH docket<br>3. Self-authored RPAD Demand Letter on `DocumentPaper.tsx`<br>4. e-Jagriti filing.<br><br>When the seller counters with a ₹500 voucher, `StatutoryCounterCard.tsx` mounts with a 1-tap statutory reply under Section 84. | **Citizen Clip 3 (0:52 - 0:56):**<br>*"Support replied saying best they can do is a ₹500 voucher."*<br><br>**LokAI Voice (0:56 - 1:00):**<br>*"Store policy cannot override statutory liability. Here is your counter-reply citing Section 84."* | *"Legal claims are rarely resolved in one turn. LokAI orders action by cost and safety, from an informal WhatsApp escalation to a National Consumer Helpline docket. When sellers offer partial vouchers, LokAI generates a statutory counter-reply citing Section 84 of the Consumer Protection Act."* |
| **01:08 - 01:20** | **Beat 4: The Downgrade Law & Protective Hard-Stop**<br><br>`src/app/data/scope-rules.ts`<br>`src/app/components/stop/StopScreen.tsx`<br>`src/app/components/stop/ProtectiveCard.tsx` | User inputs: *"The seller called threatening to come to my home."*<br><br>The chat composer vanishes. The interface transitions to `StopScreen.tsx`. The screen mounts DLSA helpline `15100` and emergency hotlines `112` and `181`. | **Citizen Clip 4 (1:09 - 1:13):**<br>*"He just called saying he will send men to my house if I file anything."* | *"When physical safety is compromised, conversational chat is dangerous. Under our Downgrade Law, criminal intimidation triggers an immediate hard-stop. The chat composer collapses, and LokAI routes the citizen directly to District Legal Services Authorities for free, human legal aid."* |
| **01:20 - 01:30** | **Systems Close: 5-Script Optical Scaling & Frugal AI**<br><br>`src/app/pages/SpecimenPage.tsx`<br>`src/styles/tokens.css`<br>Terminal running `npm run gates` | Camera pans across `SpecimenPage.tsx`, showing Urdu Nastaliq RTL cascading without baseline clipping, next to Tamil and Devanagari.<br><br>Terminal executes `npm run gates`: all 19 legal entries verified, WCAG light and dark passing AA contrast.<br><br>Final frame: LokAI mark in botanical green with saffron spark. | *(Ambient sound: Crisp haptic keyboard taps followed by successful test suite chime)* | *"Engineered across five scripts, verified by automated contrast gates, and running entirely on deterministic local infrastructure. This is LokAI: legal design built for restraint, clarity, and genuine human protection."* |

---

## Audio Production Scripts for ElevenLabs

Use these exact text blocks when generating the voice assets.

### Track 1: Designer Narrator (ElevenLabs Profile: George or Rachel)
Pacing: Calm, authoritative, deliberate cadence.

```text
For a ₹8,999 appliance or a ₹35,000 withheld deposit, hiring a lawyer is financially impossible. When citizens take these disputes to ChatGPT, it hallucinates repealed laws and fabricates win percentages. LokAI is built on a different premise: deterministic restraint.

Instead of writing generative essays, LokAI trips a circuit breaker: the 2×2 Fact Gate. It locks in item, price, purchase window, and proof before legal standing is evaluated. Correcting a fact updates the downstream record instantly, cutting hallucination and token burn.

Over 300 million Indians live outside their home linguistic state. An official notice in an unfamiliar script triggers immediate panic. LokAI's Notice Interpreter maps clauses line by line to plain words, exposing the statutory deadline, the true penalty, and whether court action is actually required.

Legal claims are rarely resolved in one turn. LokAI orders action by cost and safety, from an informal WhatsApp escalation to a National Consumer Helpline docket. When sellers offer partial vouchers, LokAI generates a statutory counter-reply citing Section 84 of the Consumer Protection Act.

When physical safety is compromised, conversational chat is dangerous. Under our Downgrade Law, criminal intimidation triggers an immediate hard-stop. The chat composer collapses, and LokAI routes the citizen directly to District Legal Services Authorities for free, human legal aid.

Engineered across five scripts, verified by automated contrast gates, and running entirely on deterministic local infrastructure. This is LokAI: legal design built for restraint, clarity, and genuine human protection.
```

### Track 2: Citizen Audio Clips (Natural Indian English, slight hesitation)

**Clip 1 (Defective Mixer Complaint, 00:00):**
```text
Listen, I ordered a Mixwell mixer from HomeKart for ₹8,999. When I opened the box, the jar was cracked and the motor wouldn't even start. Now their app says the 48-hour return window is over and they closed my ticket. Can I actually do anything, or is my money gone?
```

**Clip 2 (Tenant Notice Anxiety, 00:32):**
```text
My landlord in Pune slipped this Marathi notice under my door with a red stamp. I can't read Marathi. Are they going to evict my family?
```

**Clip 3 (Seller Pushback, 00:52):**
```text
Support replied saying 48 hours passed. Best they can do is a ₹500 voucher, or I have to visit a service center myself.
```

**Clip 4 (Seller Intimidation, 01:09):**
```text
After I sent the message, the seller called my number and threatened to file a defamation case and send people to my address if I escalate this.
```

### Track 3: LokAI Synthesized Voice (Clean, crisp AI assistant)

**Clip 1 (Fact Gate Reassurance, 00:15):**
```text
A 48-hour store rule cannot override your statutory right when a product arrives defective. Before I map out your standing, check if I caught these four facts accurately—tap any box to edit.
```

**Clip 2: SpeakPill (Notice Readout, 00:38):**
```text
Notice interpreted: Section 149, Municipal Corporation Act. This is a property assessment inquiry regarding meter variance, not an eviction order. You have 15 days to file an administrative objection.
```

**Clip 3: Pushback Counter (00:56):**
```text
That is a standard deflection tactic. When a product arrives defective on delivery, you are not required to accept a partial voucher or visit a service center yourself. Here is the statutory counter-reply:
```

**Clip 4 (Resolution Confirmation):**
```text
That is the best possible outcome. Putting the exact statutory duty in writing gave their grievance desk a clear reason to settle early. I've marked this matter as Resolved in your folder.
```
